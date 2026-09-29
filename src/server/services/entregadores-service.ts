import 'server-only';

import {
  filtrarEntregadores,
  ordenarEntregadoresPorNome,
  type DadosNovoEntregador,
  type Entregador,
  type SituacaoEntregador,
} from '@/domain/entregador';
import { getAdminAuth } from '@/lib/firebase/admin';
import {
  atualizarSituacaoEntregador,
  buscarEntregadorPorId,
  listarEntregadores,
  salvarEntregadorComUsuario,
} from '@/server/repositories/entregadores-repository';

export class EntregadorNaoEncontradoError extends Error {
  constructor() {
    super('Entregador não encontrado.');
    this.name = 'EntregadorNaoEncontradoError';
  }
}

/** RF05 — define a situação do entregador (disponível, em rota, indisponível). */
export async function definirSituacaoEntregador(
  id: string,
  situacao: SituacaoEntregador,
): Promise<Entregador> {
  const entregador = await buscarEntregadorPorId(id);
  if (!entregador) throw new EntregadorNaoEncontradoError();
  if (entregador.situacao === situacao) return entregador;

  await atualizarSituacaoEntregador(id, situacao);
  return { ...entregador, situacao };
}

/** RF04 — relação de entregadores, opcionalmente filtrada por um termo. */
export async function consultarEntregadores(
  termo = '',
): Promise<{ entregadores: Entregador[]; total: number }> {
  const todos = await listarEntregadores();
  return {
    entregadores: ordenarEntregadoresPorNome(filtrarEntregadores(todos, termo)),
    total: todos.length,
  };
}

/** RF04 — informações de um entregador. */
export async function obterEntregador(id: string): Promise<Entregador | null> {
  return buscarEntregadorPorId(id);
}

export class EmailJaCadastradoError extends Error {
  constructor() {
    super('E-mail já cadastrado.');
    this.name = 'EmailJaCadastradoError';
  }
}

function codigoErroFirebase(erro: unknown): string | undefined {
  if (typeof erro === 'object' && erro !== null && 'code' in erro) {
    const { code } = erro as { code: unknown };
    return typeof code === 'string' ? code : undefined;
  }
  return undefined;
}

/**
 * RF03 — cria a conta de login (Firebase Auth) e o cadastro do entregador.
 * Se a gravação no Firestore falhar, a conta criada é removida para não
 * deixar login órfão sem perfil.
 */
export async function cadastrarEntregador(
  dados: DadosNovoEntregador,
): Promise<{ id: string }> {
  const auth = getAdminAuth();

  let uid: string;
  try {
    const conta = await auth.createUser({
      email: dados.email,
      password: dados.senhaInicial,
      displayName: dados.nome,
    });
    uid = conta.uid;
  } catch (erro) {
    if (codigoErroFirebase(erro) === 'auth/email-already-exists') {
      throw new EmailJaCadastradoError();
    }
    throw erro;
  }

  try {
    await salvarEntregadorComUsuario({
      uid,
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email,
      situacao: dados.situacao,
    });
  } catch (erro) {
    await auth.deleteUser(uid).catch(() => undefined);
    throw erro;
  }

  return { id: uid };
}
