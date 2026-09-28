import 'server-only';

import type { DadosNovoEntregador } from '@/domain/entregador';
import { getAdminAuth } from '@/lib/firebase/admin';
import { salvarEntregadorComUsuario } from '@/server/repositories/entregadores-repository';

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
