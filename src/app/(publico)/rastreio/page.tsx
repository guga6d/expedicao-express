import { redirect } from 'next/navigation';

async function consultarRastreio(formData: FormData) {
  'use server';
  const codigo = String(formData.get('codigo') ?? '').trim();
  if (!codigo) return;
  redirect(`/rastreio/${encodeURIComponent(codigo)}`);
}

export default function RastreioPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 py-12">
      <h1 className="text-2xl font-semibold">Rastrear encomenda</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Consulta pública sem login (RF23–RF26). Informe o código de
        rastreamento.
      </p>
      <form action={consultarRastreio} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="codigo">
          Código de rastreamento
        </label>
        <input
          id="codigo"
          name="codigo"
          type="text"
          required
          placeholder="Ex.: EE123456BR"
          className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-950"
        />
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          Consultar
        </button>
      </form>
    </main>
  );
}
