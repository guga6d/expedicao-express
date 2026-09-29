import Link from 'next/link';

import { ListaEntregadores } from '@/components/entregadores/lista-entregadores';
import { exigirSessaoNaPagina } from '@/server/auth/sessao';
import { consultarEntregadores } from '@/server/services/entregadores-service';

type Props = {
  searchParams: Promise<{ busca?: string | string[] }>;
};

/** RF04 — relação de entregadores cadastrados. */
export default async function EntregadoresPage({ searchParams }: Props) {
  await exigirSessaoNaPagina('gestor');

  const { busca: buscaParam } = await searchParams;
  const busca = (Array.isArray(buscaParam) ? buscaParam[0] : buscaParam) ?? '';
  const { entregadores, total } = await consultarEntregadores(busca);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <Link href="/dashboard" className="text-sm underline">
            ← Voltar ao painel
          </Link>
          <h1 className="text-2xl font-semibold">Entregadores</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {total === 1
              ? '1 entregador cadastrado.'
              : `${total} entregadores cadastrados.`}
          </p>
        </div>
        <Link
          href="/entregadores/novo"
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Cadastrar entregador
        </Link>
      </header>

      {total > 0 ? (
        <form role="search" className="flex flex-wrap items-end gap-2">
          <div className="flex min-w-60 flex-1 flex-col gap-1.5">
            <label htmlFor="busca" className="text-sm font-medium">
              Buscar por nome, telefone ou e-mail
            </label>
            <input
              id="busca"
              name="busca"
              type="search"
              defaultValue={busca}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-900"
          >
            Buscar
          </button>
          {busca ? (
            <Link href="/entregadores" className="px-2 py-2 text-sm underline">
              Limpar busca
            </Link>
          ) : null}
        </form>
      ) : null}

      {total === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-600">
          Nenhum entregador cadastrado ainda.{' '}
          <Link href="/entregadores/novo" className="underline">
            Cadastre o primeiro
          </Link>
          .
        </p>
      ) : entregadores.length === 0 ? (
        <p role="status" className="text-sm text-zinc-600 dark:text-zinc-400">
          Nenhum entregador encontrado para “{busca}”.
        </p>
      ) : (
        <ListaEntregadores entregadores={entregadores} />
      )}
    </main>
  );
}
