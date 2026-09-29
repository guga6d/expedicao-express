import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FormularioEncomenda } from '@/components/encomendas/formulario-encomenda';
import {
  podeEditarEncomenda,
  valoresFormularioDeEncomenda,
} from '@/domain/encomenda';
import { exigirSessaoNaPagina } from '@/server/auth/sessao';
import { obterEncomenda } from '@/server/services/encomendas-service';

type Props = {
  params: Promise<{ id: string }>;
};

/** RF10 — edição dos dados de uma encomenda não finalizada. */
export default async function EditarEncomendaPage({ params }: Props) {
  await exigirSessaoNaPagina('gestor');

  const { id } = await params;
  const encomenda = await obterEncomenda(id);
  if (!encomenda) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="space-y-1">
        <Link href={`/encomendas/${id}`} className="text-sm underline">
          ← Voltar aos detalhes
        </Link>
        <h1 className="text-2xl font-semibold">Editar encomenda</h1>
      </header>

      {podeEditarEncomenda(encomenda.statusAtual) ? (
        <FormularioEncomenda
          modo="edicao"
          encomendaId={encomenda.id}
          codigoRastreamento={encomenda.codigoRastreamento}
          valoresIniciais={valoresFormularioDeEncomenda(encomenda)}
        />
      ) : (
        <p
          role="alert"
          className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-900"
        >
          Esta encomenda já foi entregue e não pode mais ser editada.
        </p>
      )}
    </main>
  );
}
