'use client';

import { useActionState } from 'react';

import {
  SITUACAO_ENTREGADOR_ROTULO,
  SITUACOES_ENTREGADOR,
  type SituacaoEntregador,
} from '@/domain/entregador';
import {
  definirSituacaoEntregadorAction,
  type EstadoSituacaoEntregador,
} from '@/server/actions/entregadores-actions';

const ESTADO_INICIAL: EstadoSituacaoEntregador = { status: 'inicial' };

type Props = {
  entregadorId: string;
  situacaoAtual: SituacaoEntregador;
};

/** RF05 — definição da situação do entregador. */
export function FormularioSituacaoEntregador({
  entregadorId,
  situacaoAtual,
}: Props) {
  const [estado, acao, enviando] = useActionState(
    definirSituacaoEntregadorAction,
    ESTADO_INICIAL,
  );

  return (
    <form action={acao} className="flex flex-col gap-3">
      <input type="hidden" name="entregadorId" value={entregadorId} />

      {estado.status === 'sucesso' ? (
        <p
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
        >
          {estado.mensagem}
        </p>
      ) : null}
      {estado.status === 'erro' ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          {estado.mensagem}
        </p>
      ) : null}

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-48 flex-1 flex-col gap-1.5">
          <label htmlFor="situacao" className="text-sm font-medium">
            Situação
          </label>
          <select
            key={situacaoAtual}
            id="situacao"
            name="situacao"
            defaultValue={situacaoAtual}
            disabled={enviando}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950"
          >
            {SITUACOES_ENTREGADOR.map((situacao) => (
              <option key={situacao} value={situacao}>
                {SITUACAO_ENTREGADOR_ROTULO[situacao]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={enviando}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {enviando ? 'Salvando…' : 'Salvar situação'}
        </button>
      </div>
    </form>
  );
}
