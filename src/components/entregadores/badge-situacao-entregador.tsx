import {
  SITUACAO_ENTREGADOR_ROTULO,
  type SituacaoEntregador,
} from '@/domain/entregador';

const ICONE: Record<SituacaoEntregador, string> = {
  DISPONIVEL: '✓',
  EM_ROTA: '►',
  INDISPONIVEL: '✕',
};

type Props = {
  situacao: SituacaoEntregador;
};

/** Badge com ícone + texto — nunca só cor (RNF23). */
export function BadgeSituacaoEntregador({ situacao }: Props) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
      <span aria-hidden="true">{ICONE[situacao]}</span>
      <span>{SITUACAO_ENTREGADOR_ROTULO[situacao]}</span>
    </span>
  );
}
