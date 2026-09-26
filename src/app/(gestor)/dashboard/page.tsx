import Link from 'next/link';

import { encerrarSessaoAction } from '@/server/actions/auth-actions';
import { obterSessao } from '@/server/auth/sessao';

export default async function DashboardPage() {
  const usuario = await obterSessao();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-12">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Painel</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Olá, {usuario?.nome || usuario?.email}. Área do gestor.
          </p>
        </div>
        <form action={encerrarSessaoAction}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-900"
          >
            Sair
          </button>
        </form>
      </header>

      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Login concluído (RF01). Indicadores do dashboard (RF32–RF35) ainda
        pendentes.{' '}
        <Link href="/" className="underline">
          Voltar à home
        </Link>
      </p>
    </main>
  );
}
