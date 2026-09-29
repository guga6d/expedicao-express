import 'server-only';

import { FieldValue, type DocumentSnapshot } from 'firebase-admin/firestore';

import {
  isStatusEncomenda,
  podeEditarEncomenda,
  STATUS_INICIAL_ENCOMENDA,
  type Contato,
  type DadosNovaEncomenda,
  type Encomenda,
  type Endereco,
  type EventoHistorico,
} from '@/domain/encomenda';
import { getAdminDb } from '@/lib/firebase/admin';

import { paraIso, paraTexto } from './conversores';

function registro(valor: unknown): Record<string, unknown> {
  return typeof valor === 'object' && valor !== null
    ? (valor as Record<string, unknown>)
    : {};
}

function paraContato(valor: unknown): Contato {
  const c = registro(valor);
  return { nome: paraTexto(c.nome), telefone: paraTexto(c.telefone) };
}

function paraEndereco(valor: unknown): Endereco {
  const e = registro(valor);
  const complemento = paraTexto(e.complemento);
  return {
    logradouro: paraTexto(e.logradouro),
    numero: paraTexto(e.numero),
    ...(complemento ? { complemento } : {}),
    bairro: paraTexto(e.bairro),
    cidade: paraTexto(e.cidade),
    uf: paraTexto(e.uf),
    cep: paraTexto(e.cep),
  };
}

function paraEncomenda(snap: DocumentSnapshot): Encomenda | null {
  const data = snap.data();
  if (!data || !isStatusEncomenda(data.statusAtual)) return null;

  const descricao = paraTexto(data.descricao);
  const entregadorId = paraTexto(data.entregadorId);
  const motivoNaoEntrega = paraTexto(data.motivoNaoEntrega);
  return {
    id: snap.id,
    codigoRastreamento: paraTexto(data.codigoRastreamento),
    ...(descricao ? { descricao } : {}),
    remetente: paraContato(data.remetente),
    destinatario: paraContato(data.destinatario),
    enderecoColeta: paraEndereco(data.enderecoColeta),
    enderecoEntrega: paraEndereco(data.enderecoEntrega),
    statusAtual: data.statusAtual,
    ...(entregadorId ? { entregadorId } : {}),
    ...(motivoNaoEntrega ? { motivoNaoEntrega } : {}),
    criadaEm: paraIso(data.criadaEm),
    atualizadaEm: paraIso(data.atualizadaEm),
  };
}

export class EncomendaNaoEncontradaError extends Error {
  constructor() {
    super('Encomenda não encontrada.');
    this.name = 'EncomendaNaoEncontradaError';
  }
}

export class EncomendaFinalizadaError extends Error {
  constructor() {
    super('Encomenda finalizada não pode ser editada.');
    this.name = 'EncomendaFinalizadaError';
  }
}

/**
 * RF10 — substitui os dados cadastrais. Roda em transação para que a checagem
 * de "não finalizada" valha no instante da gravação. Não altera status,
 * código de rastreamento nem entregador.
 */
export async function atualizarDadosEncomenda(
  id: string,
  dados: DadosNovaEncomenda,
): Promise<void> {
  const db = getAdminDb();
  const ref = db.collection('encomendas').doc(id);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const status = snap.data()?.statusAtual;
    if (!snap.exists || !isStatusEncomenda(status)) {
      throw new EncomendaNaoEncontradaError();
    }
    if (!podeEditarEncomenda(status)) throw new EncomendaFinalizadaError();

    tx.update(ref, {
      descricao: dados.descricao ?? FieldValue.delete(),
      remetente: dados.remetente,
      destinatario: dados.destinatario,
      enderecoColeta: dados.enderecoColeta,
      enderecoEntrega: dados.enderecoEntrega,
      atualizadaEm: FieldValue.serverTimestamp(),
    });
  });
}

export async function buscarEncomendaPorId(
  id: string,
): Promise<Encomenda | null> {
  const snap = await getAdminDb().collection('encomendas').doc(id).get();
  if (!snap.exists) return null;
  return paraEncomenda(snap);
}

/** Ordem cronológica (mais antigo primeiro). */
export async function listarHistoricoEncomenda(
  encomendaId: string,
): Promise<EventoHistorico[]> {
  const snap = await getAdminDb()
    .collection('encomendas')
    .doc(encomendaId)
    .collection('historico')
    .orderBy('registradoEm', 'asc')
    .get();

  return snap.docs.flatMap((doc): EventoHistorico[] => {
    const data = doc.data();
    if (!isStatusEncomenda(data.status)) return [];
    const motivo = paraTexto(data.motivo);
    return [
      {
        id: doc.id,
        status: data.status,
        registradoEm: paraIso(data.registradoEm),
        usuarioId: paraTexto(data.usuarioId),
        ...(motivo ? { motivo } : {}),
      },
    ];
  });
}

/** Mais recentes primeiro (índice de campo único, criado automaticamente). */
export async function listarEncomendas(): Promise<Encomenda[]> {
  const snap = await getAdminDb()
    .collection('encomendas')
    .orderBy('criadaEm', 'desc')
    .get();
  return snap.docs
    .map(paraEncomenda)
    .filter((e): e is Encomenda => e !== null);
}

export class CodigoRastreamentoEmUsoError extends Error {
  constructor() {
    super('Código de rastreamento já utilizado.');
    this.name = 'CodigoRastreamentoEmUsoError';
  }
}

/** gRPC ALREADY_EXISTS — `create()` em documento que já existe. */
const CODIGO_JA_EXISTE = 6;

function codigoErro(erro: unknown): unknown {
  return typeof erro === 'object' && erro !== null && 'code' in erro
    ? (erro as { code: unknown }).code
    : undefined;
}

/**
 * Numa única escrita atômica: cria `encomendas/{id}`, reserva
 * `codigosRastreamento/{codigo}` (falha se o código já existir — RNF17) e
 * registra o primeiro evento em `encomendas/{id}/historico` (RF18).
 */
export async function salvarNovaEncomenda(registro: {
  codigoRastreamento: string;
  dados: DadosNovaEncomenda;
  usuarioId: string;
}): Promise<{ id: string }> {
  const db = getAdminDb();
  const agora = FieldValue.serverTimestamp();
  const encomendaRef = db.collection('encomendas').doc();
  const batch = db.batch();

  batch.create(
    db.collection('codigosRastreamento').doc(registro.codigoRastreamento),
    { encomendaId: encomendaRef.id, criadoEm: agora },
  );

  batch.create(encomendaRef, {
    ...registro.dados,
    codigoRastreamento: registro.codigoRastreamento,
    statusAtual: STATUS_INICIAL_ENCOMENDA,
    criadaPor: registro.usuarioId,
    criadaEm: agora,
    atualizadaEm: agora,
  });

  batch.create(encomendaRef.collection('historico').doc(), {
    status: STATUS_INICIAL_ENCOMENDA,
    usuarioId: registro.usuarioId,
    registradoEm: agora,
  });

  try {
    await batch.commit();
  } catch (erro) {
    if (codigoErro(erro) === CODIGO_JA_EXISTE) {
      throw new CodigoRastreamentoEmUsoError();
    }
    throw erro;
  }

  return { id: encomendaRef.id };
}
