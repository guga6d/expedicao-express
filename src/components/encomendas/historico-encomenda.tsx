import { BadgeStatus } from '@/components/ui/badge-status';
import type { DetalhesEncomenda } from '@/domain/encomenda';
import { formatarDataHora } from '@/domain/formatacao';

type Props = {
  historico: DetalhesEncomenda['historico'];
};

/** RF09 / RF18 — eventos de status, do mais recente para o mais antigo. */
export function HistoricoEncomenda({ historico }: Props) {
  if (historico.length === 0) {
    return (
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Nenhum evento registrado.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-4 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700">
      {[...historico].reverse().map((evento) => (
        <li key={evento.id} className="flex flex-col gap-1 text-sm">
          <span className="flex flex-wrap items-center gap-2">
            <BadgeStatus status={evento.status} />
            <time
              dateTime={evento.registradoEm || undefined}
              className="text-zinc-600 dark:text-zinc-400"
            >
              {formatarDataHora(evento.registradoEm)}
            </time>
          </span>
          {evento.usuarioNome ? (
            <span className="text-zinc-600 dark:text-zinc-400">
              Registrado por {evento.usuarioNome}
            </span>
          ) : null}
          {evento.motivo ? <span>Motivo: {evento.motivo}</span> : null}
        </li>
      ))}
    </ol>
  );
}
