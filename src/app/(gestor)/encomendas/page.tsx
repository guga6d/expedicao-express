import Link from 'next/link';

import { ListaEncomendas } from '@/components/encomendas/lista-encomendas';
import { exigirSessaoNaPagina } from '@/server/auth/sessao';
import { consultarEncomendas } from '@/server/services/encomendas-service';

/** RF08 — relação de encomendas cadastradas. */
export default async function EncomendasPage() {
  await exigirSessaoNaPagina('gestor');

  const encomendas = await consultarEncomendas();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-sm underline">
            ← Voltar ao painel
          </Link>
          <h1 className="text-2xl font-semibold">Encomendas</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {encomendas.length === 1
              ? '1 encomenda cadastrada.'
              : `${encomendas.length} encomendas cadastradas.`}
          </p>
        </div>
        <Link
          href="/encomendas/nova"
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Cadastrar encomenda
        </Link>
      </header>

      {encomendas.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-600">
          Nenhuma encomenda cadastrada ainda.{' '}
          <Link href="/encomendas/nova" className="underline">
            Cadastre a primeira
          </Link>
          .
        </p>
      ) : (
        <ListaEncomendas encomendas={encomendas} />
      )}
    </main>
  );
}
