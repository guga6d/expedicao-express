'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { rotaAposLogin } from '@/domain/usuario';
import {
  criarCookieSessao,
  encerrarSessao,
  obterSessao,
} from '@/server/auth/sessao';

export type ResultadoLogin =
  | { ok: true; destino: string }
  | { ok: false; erro: string };

export async function criarSessaoAction(
  idToken: string,
): Promise<ResultadoLogin> {
  try {
    const usuario = await criarCookieSessao(idToken);
    return { ok: true, destino: rotaAposLogin(usuario.perfil) };
  } catch (e) {
    const mensagem =
      e instanceof Error ? e.message : 'Não foi possível criar a sessão.';
    if (mensagem.includes('perfil')) {
      return {
        ok: false,
        erro:
          'Conta sem perfil cadastrado. Peça ao administrador para criar seu usuário em Firestore.',
      };
    }
    return { ok: false, erro: 'Sessão inválida. Tente entrar novamente.' };
  }
}

/** RF02 — logout: invalida a sessão no servidor e volta ao login. */
export async function encerrarSessaoAction(): Promise<void> {
  await encerrarSessao();
  revalidatePath('/', 'layout');
  redirect('/login?saiu=1');
}

export async function redirecionarSeAutenticado(): Promise<void> {
  const usuario = await obterSessao();
  if (usuario) {
    redirect(rotaAposLogin(usuario.perfil));
  }
}
