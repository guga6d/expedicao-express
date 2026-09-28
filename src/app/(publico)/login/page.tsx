import { FormularioLogin } from '@/components/auth/formulario-login';
import { redirecionarSeAutenticado } from '@/server/actions/auth-actions';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [chave: string]: string | string[] | undefined }>;
}) {
  await redirecionarSeAutenticado();
  const { saiu } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-6 px-4 py-12">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Use o e-mail e a senha cadastrados (RF01).
        </p>
      </header>
      {saiu === '1' ? (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
        >
          Você saiu do sistema. Sua sessão foi encerrada.
        </p>
      ) : null}
      <FormularioLogin />
    </main>
  );
}
