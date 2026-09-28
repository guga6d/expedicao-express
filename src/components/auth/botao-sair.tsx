'use client';

import { signOut } from 'firebase/auth';
import { useFormStatus } from 'react-dom';

import { getClientAuth } from '@/lib/firebase/client';
import { encerrarSessaoAction } from '@/server/actions/auth-actions';

async function sair(): Promise<void> {
  try {
    await signOut(getClientAuth());
  } catch {
    // a sessão do servidor é a que protege as rotas; seguimos com o logout
  }
  await encerrarSessaoAction();
}

function BotaoSubmeter() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:hover:bg-zinc-900"
    >
      {pending ? 'Saindo…' : 'Sair'}
    </button>
  );
}

/** RF02 — encerra a sessão (Firebase client + cookie do servidor). */
export function BotaoSair() {
  return (
    <form action={sair}>
      <BotaoSubmeter />
    </form>
  );
}
