import 'server-only';

import { cookies } from 'next/headers';

import type { PerfilUsuario, Usuario } from '@/domain/usuario';
import { getAdminAuth } from '@/lib/firebase/admin';
import { buscarUsuarioPorId } from '@/server/repositories/usuarios-repository';

export const COOKIE_SESSAO = 'ee_sessao';

/** 5 dias em ms (Firebase session cookie: máx. 14 dias). */
const DURACAO_SESSAO_MS = 60 * 60 * 24 * 5 * 1000;

export async function criarCookieSessao(idToken: string): Promise<Usuario> {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(idToken);

  const usuario = await buscarUsuarioPorId(decoded.uid);
  if (!usuario) {
    throw new Error(
      'Usuário autenticado sem perfil em Firestore. Crie o documento usuarios/{uid}.',
    );
  }

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: DURACAO_SESSAO_MS,
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_SESSAO, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DURACAO_SESSAO_MS / 1000,
  });

  return usuario;
}

export async function obterSessao(): Promise<Usuario | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_SESSAO)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    );
    return buscarUsuarioPorId(decoded.uid);
  } catch {
    return null;
  }
}

export async function exigirSessao(
  perfil?: PerfilUsuario,
): Promise<Usuario> {
  const usuario = await obterSessao();
  if (!usuario) {
    throw new Error('Nao autenticado');
  }
  if (perfil && usuario.perfil !== perfil) {
    throw new Error('Perfil sem permissao');
  }
  return usuario;
}

/**
 * Revoga os refresh tokens do usuário (encerra todas as sessões dele, pois
 * `verifySessionCookie` checa revogação) e remove o cookie local — RF02 / RNF14.
 * Falhas na revogação não impedem a remoção do cookie.
 */
export async function encerrarSessao(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_SESSAO)?.value;

  if (sessionCookie) {
    try {
      const auth = getAdminAuth();
      const decoded = await auth.verifySessionCookie(sessionCookie);
      await auth.revokeRefreshTokens(decoded.sub);
    } catch {
      // cookie já inválido/expirado: basta removê-lo
    }
  }

  cookieStore.delete(COOKIE_SESSAO);
}
