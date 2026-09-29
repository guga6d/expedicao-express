import Link from 'next/link';

import { FormularioEntregador } from '@/components/entregadores/formulario-entregador';

export default function NovoEntregadorPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 px-4 py-8">
      <header className="space-y-1">
        <Link href="/entregadores" className="text-sm underline">
          ← Voltar aos entregadores
        </Link>
        <h1 className="text-2xl font-semibold">Novo entregador</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Cadastra o entregador e cria a conta de login dele.
        </p>
      </header>
      <FormularioEntregador />
    </main>
  );
}
