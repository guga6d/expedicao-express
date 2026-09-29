import Link from 'next/link';

import { formatarTelefone, type Entregador } from '@/domain/entregador';

import { BadgeSituacaoEntregador } from './badge-situacao-entregador';

type Props = {
  entregadores: Entregador[];
};

/** RF04 — tabela no desktop, cartões no mobile. */
export function ListaEntregadores({ entregadores }: Props) {
  return (
    <>
      <ul className="flex flex-col gap-3 sm:hidden">
        {entregadores.map((e) => (
          <li key={e.id}>
            <Link
              href={`/entregadores/${e.id}`}
              className="flex flex-col gap-1.5 rounded-lg border border-zinc-200 px-4 py-3 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium">{e.nome}</span>
                <BadgeSituacaoEntregador situacao={e.situacao} />
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {formatarTelefone(e.telefone)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <table className="hidden w-full text-left text-sm sm:table">
        <caption className="sr-only">Entregadores cadastrados</caption>
        <thead className="border-b border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          <tr>
            <th scope="col" className="py-2 pr-4 font-medium">
              Nome
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              Telefone
            </th>
            <th scope="col" className="py-2 pr-4 font-medium">
              E-mail
            </th>
            <th scope="col" className="py-2 font-medium">
              Situação
            </th>
          </tr>
        </thead>
        <tbody>
          {entregadores.map((e) => (
            <tr
              key={e.id}
              className="border-b border-zinc-100 dark:border-zinc-800"
            >
              <td className="py-2.5 pr-4">
                <Link
                  href={`/entregadores/${e.id}`}
                  className="font-medium underline-offset-2 hover:underline"
                >
                  {e.nome}
                </Link>
              </td>
              <td className="py-2.5 pr-4">{formatarTelefone(e.telefone)}</td>
              <td className="py-2.5 pr-4">{e.email}</td>
              <td className="py-2.5">
                <BadgeSituacaoEntregador situacao={e.situacao} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
