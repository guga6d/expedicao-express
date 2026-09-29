import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BadgeSituacaoEntregador } from '@/components/entregadores/badge-situacao-entregador';
import { FormularioSituacaoEntregador } from '@/components/entregadores/formulario-situacao-entregador';
import { formatarTelefone } from '@/domain/entregador';
import { exigirSessaoNaPagina } from '@/server/auth/sessao';
import { obterEntregador } from '@/server/services/entregadores-service';

type Props = {
  params: Promise<{ id: string }>;
};

const FORMATO_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

/** RF04 — informações de um entregador. */
export default async function EntregadorPage({ params }: Props) {
  await exigirSessaoNaPagina('gestor');

  const { id } = await params;
  const entregador = await obterEntregador(id);
  if (!entregador) notFound();

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <header className="space-y-2">
        <Link href="/entregadores" className="text-sm underline">
          ← Voltar aos entregadores
        </Link>
        <h1 className="text-2xl font-semibold">{entregador.nome}</h1>
        <BadgeSituacaoEntregador situacao={entregador.situacao} />
      </header>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
        <dt className="font-medium text-zinc-600 dark:text-zinc-400">
          Telefone
        </dt>
        <dd>
          <a href={`tel:+55${entregador.telefone}`} className="underline">
            {formatarTelefone(entregador.telefone)}
          </a>
        </dd>

        <dt className="font-medium text-zinc-600 dark:text-zinc-400">
          E-mail de login
        </dt>
        <dd className="break-all">{entregador.email}</dd>

        <dt className="font-medium text-zinc-600 dark:text-zinc-400">
          Cadastrado em
        </dt>
        <dd>
          {entregador.criadoEm
            ? FORMATO_DATA.format(new Date(entregador.criadoEm))
            : '—'}
        </dd>
      </dl>

      <section
        aria-labelledby="titulo-situacao"
        className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
      >
        <h2 id="titulo-situacao" className="text-base font-semibold">
          Alterar situação
        </h2>
        <FormularioSituacaoEntregador
          entregadorId={entregador.id}
          situacaoAtual={entregador.situacao}
        />
      </section>
    </main>
  );
}
