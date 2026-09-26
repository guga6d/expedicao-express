import type { StatusEncomenda } from '@/domain/encomenda';
import { STATUS_ENCOMENDA_ROTULO } from '@/domain/encomenda';

const ICONE: Record<StatusEncomenda, string> = {
  AGUARDANDO_COLETA: '○',
  COLETADA: '◐',
  EM_ROTA: '►',
  ENTREGUE: '✓',
  NAO_ENTREGUE: '!',
};

type Props = {
  status: StatusEncomenda;
};

/** Badge com ícone + texto — nunca só cor (RNF05 / RNF23). */
export function BadgeStatus({ status }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
      <span aria-hidden="true">{ICONE[status]}</span>
      <span>{STATUS_ENCOMENDA_ROTULO[status]}</span>
    </span>
  );
}
