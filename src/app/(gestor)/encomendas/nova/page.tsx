import Link from 'next/link';

import { FormularioEncomenda } from '@/components/encomendas/formulario-encomenda';

export default function NovaEncomendaPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="space-y-1">
        <Link href="/encomendas" className="text-sm underline">
          ← Voltar às encomendas
        </Link>
        <h1 className="text-2xl font-semibold">Nova encomenda</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Cadastra a encomenda com status “Aguardando coleta”.
        </p>
      </header>
      <FormularioEncomenda modo="cadastro" />
    </main>
  );
}
