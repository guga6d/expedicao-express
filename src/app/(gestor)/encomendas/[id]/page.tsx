import Link from 'next/link';
import { notFound } from 'next/navigation';

import { HistoricoEncomenda } from '@/components/encomendas/historico-encomenda';
import { BadgeStatus } from '@/components/ui/badge-status';
import {
  formatarEndereco,
  podeEditarEncomenda,
  type Contato,
  type Endereco,
} from '@/domain/encomenda';
import { formatarTelefone } from '@/domain/entregador';
import { formatarDataHora } from '@/domain/formatacao';
import { exigirSessaoNaPagina } from '@/server/auth/sessao';
import { obterDetalhesEncomenda } from '@/server/services/encomendas-service';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ editada?: string | string[] }>;
};

const CLASSE_SECAO =
  'flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700';

function BlocoPessoa({
  idTitulo,
  titulo,
  contato,
  rotuloEndereco,
  endereco,
}: {
  idTitulo: string;
  titulo: string;
  contato: Contato;
  rotuloEndereco: string;
  endereco: Endereco;
}) {
  return (
    <section aria-labelledby={idTitulo} className={CLASSE_SECAO}>
      <h2 id={idTitulo} className="text-base font-semibold">
        {titulo}
      </h2>
      <dl className="grid gap-2 text-sm">
        <div>
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">Nome</dt>
          <dd>{contato.nome}</dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">
            Telefone
          </dt>
          <dd>
            <a href={`tel:+55${contato.telefone}`} className="underline">
              {formatarTelefone(contato.telefone)}
            </a>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-zinc-600 dark:text-zinc-400">
            {rotuloEndereco}
          </dt>
          <dd>{formatarEndereco(endereco)}</dd>
        </div>
      </dl>
    </section>
  );
}

/** RF09 — detalhes da encomenda. */
export default async function EncomendaPage({ params, searchParams }: Props) {
  await exigirSessaoNaPagina('gestor');

  const { id } = await params;
  const { editada } = await searchParams;
  const detalhes = await obterDetalhesEncomenda(id);
  if (!detalhes) notFound();

  const { encomenda, entregador, historico } = detalhes;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-8">
      {editada === '1' ? (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
        >
          Alterações salvas.
        </p>
      ) : null}

      <header className="space-y-2">
        <Link href="/encomendas" className="text-sm underline">
          ← Voltar às encomendas
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">
            Encomenda{' '}
            <span className="font-mono tracking-wider">
              {encomenda.codigoRastreamento}
            </span>
          </h1>
          {podeEditarEncomenda(encomenda.statusAtual) ? (
            <Link
              href={`/encomendas/${encomenda.id}/editar`}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-900"
            >
              Editar dados
            </Link>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <BadgeStatus status={encomenda.statusAtual} />
          <span>Cadastrada em {formatarDataHora(encomenda.criadaEm)}</span>
          <span>Atualizada em {formatarDataHora(encomenda.atualizadaEm)}</span>
        </div>
        {encomenda.descricao ? (
          <p className="text-sm">
            <span className="font-medium">Conteúdo:</span> {encomenda.descricao}
          </p>
        ) : null}
        {encomenda.motivoNaoEntrega ? (
          <p className="text-sm">
            <span className="font-medium">Motivo da não entrega:</span>{' '}
            {encomenda.motivoNaoEntrega}
          </p>
        ) : null}
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <BlocoPessoa
          idTitulo="titulo-remetente"
          titulo="Remetente"
          contato={encomenda.remetente}
          rotuloEndereco="Endereço de coleta"
          endereco={encomenda.enderecoColeta}
        />
        <BlocoPessoa
          idTitulo="titulo-destinatario"
          titulo="Destinatário"
          contato={encomenda.destinatario}
          rotuloEndereco="Endereço de entrega"
          endereco={encomenda.enderecoEntrega}
        />
      </div>

      <section aria-labelledby="titulo-entregador" className={CLASSE_SECAO}>
        <h2 id="titulo-entregador" className="text-base font-semibold">
          Entregador responsável
        </h2>
        {entregador ? (
          <p className="text-sm">
            <Link
              href={`/entregadores/${entregador.id}`}
              className="font-medium underline"
            >
              {entregador.nome}
            </Link>{' '}
            ·{' '}
            <a href={`tel:+55${entregador.telefone}`} className="underline">
              {formatarTelefone(entregador.telefone)}
            </a>
          </p>
        ) : (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Nenhum entregador atribuído.
          </p>
        )}
      </section>

      <section aria-labelledby="titulo-historico" className={CLASSE_SECAO}>
        <h2 id="titulo-historico" className="text-base font-semibold">
          Histórico
        </h2>
        <HistoricoEncomenda historico={historico} />
      </section>
    </main>
  );
}
