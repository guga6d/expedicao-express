import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold">Painel</h1>

      <nav aria-label="Ações do gestor" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/encomendas"
          className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Encomendas
        </Link>
        <Link
          href="/entregadores"
          className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Entregadores
        </Link>
        <Link
          href="/entregadores/novo"
          className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Cadastrar entregador
        </Link>
        <Link
          href="/encomendas/nova"
          className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Cadastrar encomenda
        </Link>
      </nav>

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
