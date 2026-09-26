import { encerrarSessaoAction } from '@/server/actions/auth-actions';
import { obterSessao } from '@/server/auth/sessao';

export default async function EntregasEntregadorPage() {
  const usuario = await obterSessao();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Minhas entregas</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Olá, {usuario?.nome || usuario?.email}.
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
        Login concluído (RF01). Lista de entregas atribuídas (RF14) pendente.
      </p>
    </main>
  );
}
