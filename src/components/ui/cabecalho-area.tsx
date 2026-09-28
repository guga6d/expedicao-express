import { BotaoSair } from '@/components/auth/botao-sair';
import type { Usuario } from '@/domain/usuario';

const ROTULO_PERFIL: Record<Usuario['perfil'], string> = {
  gestor: 'Gestor',
  entregador: 'Entregador',
};

export function CabecalhoArea({ usuario }: { usuario: Usuario }) {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Expedição Express</p>
          <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
            {usuario.nome || usuario.email} · {ROTULO_PERFIL[usuario.perfil]}
          </p>
        </div>
        <BotaoSair />
      </div>
    </header>
  );
}
