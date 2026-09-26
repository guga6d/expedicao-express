export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Expedição Express
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Gestão de encomendas, entregadores, rotas e rastreamento.
        </p>
      </header>

      <nav aria-label="Atalhos" className="grid gap-3 sm:grid-cols-3">
        <a
          href="/login"
          className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Entrar (RF01)
        </a>
        <a
          href="/rastreio"
          className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Rastrear encomenda (RF26)
        </a>
        <a
          href="/dashboard"
          className="rounded-lg border border-zinc-200 px-4 py-3 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Painel do gestor (RF32)
        </a>
      </nav>
    </main>
  );
}
