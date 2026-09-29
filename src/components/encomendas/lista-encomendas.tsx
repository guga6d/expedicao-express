import Link from 'next/link';

import { BadgeStatus } from '@/components/ui/badge-status';
import type { ItemListaEncomenda } from '@/domain/encomenda';
import { formatarDataHora as formatarData } from '@/domain/formatacao';

function Entregador({ nome }: { nome?: string }) {
  return nome ? (
    <>{nome}</>
  ) : (
    <span className="text-zinc-600 dark:text-zinc-400">Não atribuído</span>
  );
}

type Props = {
  encomendas: ItemListaEncomenda[];
};

/** RF08 — tabela no desktop, cartões no mobile. */
export function ListaEncomendas({ encomendas }: Props) {
  return (
    <>
      <ul className="flex flex-col gap-3 md:hidden">
        {encomendas.map((e) => (
          <li key={e.id}>
            <Link
              href={`/encomendas/${e.id}`}
              className="flex flex-col gap-1.5 rounded-lg border border-zinc-200 px-4 py-3 text-sm hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-mono font-medium tracking-wider">
                  {e.codigoRastreamento}
                </span>
                <BadgeStatus status={e.statusAtual} />
              </span>
              <span>
                Para{' '}
                <strong className="font-medium">{e.destinatario.nome}</strong>{' '}
                — {e.enderecoEntrega.cidade}/{e.enderecoEntrega.uf}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                Entregador: <Entregador nome={e.entregadorNome} /> · Cadastrada
                em {formatarData(e.criadaEm)}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Encomendas cadastradas</caption>
          <thead className="border-b border-zinc-200 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            <tr>
              <th scope="col" className="py-2 pr-4 font-medium">
                Código
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Destinatário
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Destino
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Entregador
              </th>
              <th scope="col" className="py-2 pr-4 font-medium">
                Status
              </th>
              <th scope="col" className="py-2 font-medium">
                Cadastrada em
              </th>
            </tr>
          </thead>
          <tbody>
            {encomendas.map((e) => (
              <tr
                key={e.id}
                className="border-b border-zinc-100 dark:border-zinc-800"
              >
                <td className="py-2.5 pr-4 font-mono tracking-wider">
                  <Link
                    href={`/encomendas/${e.id}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    {e.codigoRastreamento}
                  </Link>
                </td>
                <td className="py-2.5 pr-4">{e.destinatario.nome}</td>
                <td className="py-2.5 pr-4">
                  {e.enderecoEntrega.cidade}/{e.enderecoEntrega.uf}
                </td>
                <td className="py-2.5 pr-4">
                  <Entregador nome={e.entregadorNome} />
                </td>
                <td className="py-2.5 pr-4">
                  <BadgeStatus status={e.statusAtual} />
                </td>
                <td className="py-2.5 whitespace-nowrap">
                  {formatarData(e.criadaEm)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
