type Props = {
  params: Promise<{ codigo: string }>;
};

export default async function RastreioCodigoPage({ params }: Props) {
  const { codigo } = await params;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Rastreamento</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Código: <strong>{codigo}</strong>
      </p>
      <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm dark:border-zinc-600">
        Implementação pendente (RF23–RF25). Use a skill{' '}
        <code>implementar-requisito</code>.
      </p>
    </main>
  );
}
