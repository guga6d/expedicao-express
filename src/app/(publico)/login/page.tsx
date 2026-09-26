import { FormularioLogin } from '@/components/auth/formulario-login';
import { redirecionarSeAutenticado } from '@/server/actions/auth-actions';

export default async function LoginPage() {
  await redirecionarSeAutenticado();

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-6 px-4 py-12">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Use o e-mail e a senha cadastrados (RF01).
        </p>
      </header>
      <FormularioLogin />
    </main>
  );
}
