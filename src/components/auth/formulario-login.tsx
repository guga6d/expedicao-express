'use client';

import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { getClientAuth } from '@/lib/firebase/client';
import { criarSessaoAction } from '@/server/actions/auth-actions';

function mensagemErroLogin(erro: unknown): string {
  if (erro instanceof FirebaseError) {
    switch (erro.code) {
      case 'auth/invalid-email':
        return 'E-mail inválido.';
      case 'auth/user-disabled':
        return 'Esta conta foi desativada.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Aguarde um momento e tente de novo.';
      default:
        return 'Não foi possível entrar. Tente novamente.';
    }
  }
  if (erro instanceof Error) return erro.message;
  return 'Não foi possível entrar. Tente novamente.';
}

export function FormularioLogin() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function aoEnviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setEnviando(true);

    const form = event.currentTarget;
    const dados = new FormData(form);
    const email = String(dados.get('email') ?? '').trim();
    const senha = String(dados.get('senha') ?? '');

    try {
      const credencial = await signInWithEmailAndPassword(
        getClientAuth(),
        email,
        senha,
      );
      const idToken = await credencial.user.getIdToken();
      const resultado = await criarSessaoAction(idToken);

      if (!resultado.ok) {
        setErro(resultado.erro);
        return;
      }

      router.replace(resultado.destino);
      router.refresh();
    } catch (e) {
      setErro(mensagemErroLogin(e));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={aoEnviar} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={enviando}
          aria-describedby={erro ? 'login-erro' : undefined}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="senha" className="text-sm font-medium">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          disabled={enviando}
          aria-describedby={erro ? 'login-erro' : undefined}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
        />
      </div>

      {erro ? (
        <p
          id="login-erro"
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          {erro}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={enviando}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
