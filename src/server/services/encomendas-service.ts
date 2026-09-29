import 'server-only';

import { randomBytes } from 'node:crypto';

import {
  gerarCodigoRastreamento,
  TAMANHO_ALEATORIO_CODIGO,
  type DadosNovaEncomenda,
  type DetalhesEncomenda,
  type Encomenda,
  type ItemListaEncomenda,
} from '@/domain/encomenda';
import {
  atualizarDadosEncomenda,
  buscarEncomendaPorId,
  CodigoRastreamentoEmUsoError,
  listarEncomendas,
  listarHistoricoEncomenda,
  salvarNovaEncomenda,
} from '@/server/repositories/encomendas-repository';
import {
  buscarEntregadorPorId,
  buscarEntregadoresPorIds,
} from '@/server/repositories/entregadores-repository';
import { buscarUsuarioPorId } from '@/server/repositories/usuarios-repository';

export {
  EncomendaFinalizadaError,
  EncomendaNaoEncontradaError,
} from '@/server/repositories/encomendas-repository';

export async function obterEncomenda(id: string): Promise<Encomenda | null> {
  return buscarEncomendaPorId(id);
}

/** RF10 — edita os dados cadastrais de uma encomenda não finalizada. */
export async function editarEncomenda(
  id: string,
  dados: DadosNovaEncomenda,
): Promise<void> {
  await atualizarDadosEncomenda(id, dados);
}

/** RF09 — detalhes da encomenda com entregador responsável e histórico. */
export async function obterDetalhesEncomenda(
  id: string,
): Promise<DetalhesEncomenda | null> {
  const [encomenda, historico] = await Promise.all([
    buscarEncomendaPorId(id),
    listarHistoricoEncomenda(id),
  ]);
  if (!encomenda) return null;

  const idsUsuarios = [
    ...new Set(historico.map((ev) => ev.usuarioId).filter(Boolean)),
  ];
  const [entregador, usuarios] = await Promise.all([
    encomenda.entregadorId
      ? buscarEntregadorPorId(encomenda.entregadorId)
      : Promise.resolve(null),
    Promise.all(idsUsuarios.map((uid) => buscarUsuarioPorId(uid))),
  ]);
  const nomePorUsuario = new Map(
    usuarios.flatMap((u) => (u ? [[u.id, u.nome] as const] : [])),
  );

  return {
    encomenda,
    ...(entregador
      ? {
          entregador: {
            id: entregador.id,
            nome: entregador.nome,
            telefone: entregador.telefone,
          },
        }
      : {}),
    historico: historico.map((ev) => {
      const usuarioNome = nomePorUsuario.get(ev.usuarioId);
      return usuarioNome ? { ...ev, usuarioNome } : ev;
    }),
  };
}

/** RF08 — encomendas cadastradas (mais recentes primeiro) com o entregador responsável. */
export async function consultarEncomendas(): Promise<ItemListaEncomenda[]> {
  const encomendas = await listarEncomendas();

  const idsEntregadores = [
    ...new Set(encomendas.flatMap((e) => (e.entregadorId ? [e.entregadorId] : []))),
  ];
  const entregadores = await buscarEntregadoresPorIds(idsEntregadores);
  const nomePorId = new Map(entregadores.map((e) => [e.id, e.nome]));

  return encomendas.map((e) => {
    const entregadorNome = e.entregadorId ? nomePorId.get(e.entregadorId) : undefined;
    return entregadorNome ? { ...e, entregadorNome } : e;
  });
}

/** Colisão é improvável (32^10 combinações); o limite só evita laço infinito. */
const TENTATIVAS_CODIGO = 5;

/**
 * RF06 / RF07 — cadastra a encomenda com um código de rastreamento único,
 * gerado aqui e reservado atomicamente no repositório.
 */
export async function cadastrarEncomenda(
  dados: DadosNovaEncomenda,
  usuarioId: string,
): Promise<{ id: string; codigoRastreamento: string }> {
  for (let tentativa = 1; tentativa <= TENTATIVAS_CODIGO; tentativa++) {
    const codigoRastreamento = gerarCodigoRastreamento(
      randomBytes(TAMANHO_ALEATORIO_CODIGO),
    );
    try {
      const { id } = await salvarNovaEncomenda({
        codigoRastreamento,
        dados,
        usuarioId,
      });
      return { id, codigoRastreamento };
    } catch (erro) {
      if (!(erro instanceof CodigoRastreamentoEmUsoError)) throw erro;
    }
  }
  throw new Error('Não foi possível gerar um código de rastreamento único.');
}
