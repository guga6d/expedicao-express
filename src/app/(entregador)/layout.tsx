import { redirect } from 'next/navigation';

import { rotaAposLogin } from '@/domain/usuario';
import { obterSessao } from '@/server/auth/sessao';

export default async function EntregadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await obterSessao();
  if (!usuario) {
    redirect('/login');
  }
  if (usuario.perfil !== 'entregador') {
    redirect(rotaAposLogin(usuario.perfil));
  }

  return <>{children}</>;
}
