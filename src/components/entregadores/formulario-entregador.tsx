'use client';

import { useActionState } from 'react';

import {
  SITUACAO_ENTREGADOR_ROTULO,
  SITUACOES_ENTREGADOR,
  TAMANHO_MINIMO_SENHA,
  type CampoNovoEntregador,
} from '@/domain/entregador';
import {
  cadastrarEntregadorAction,
  type EstadoCadastroEntregador,
} from '@/server/actions/entregadores-actions';

const ESTADO_INICIAL: EstadoCadastroEntregador = { status: 'inicial' };

const CLASSE_CAMPO =
  'rounded-lg border px-3 py-2 text-sm dark:bg-zinc-950 aria-[invalid=true]:border-red-500 border-zinc-300 dark:border-zinc-600';

function MensagemErro({ id, mensagem }: { id: string; mensagem?: string }) {
  if (!mensagem) return null;
  return (
    <p id={id} className="text-sm text-red-700 dark:text-red-300">
      {mensagem}
    </p>
  );
}

/** RF03 — cadastro de entregador + conta de login. */
export function FormularioEntregador() {
  const [estado, acao, enviando] = useActionState(
    cadastrarEntregadorAction,
    ESTADO_INICIAL,
  );

  const erros = estado.status === 'erro' ? estado.erros : {};
  const valores = estado.status === 'erro' ? estado.valores : undefined;

  function atributosCampo(campo: CampoNovoEntregador) {
    const idErro = `${campo}-erro`;
    return {
      id: campo,
      name: campo,
      disabled: enviando,
      'aria-invalid': erros[campo] ? true : undefined,
      'aria-describedby': erros[campo] ? idErro : undefined,
    };
  }

  return (
    <form action={acao} className="flex flex-col gap-4" noValidate>
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

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-sm font-semibold">Dados do entregador</legend>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nome" className="text-sm font-medium">
            Nome completo
          </label>
          <input
            {...atributosCampo('nome')}
            type="text"
            autoComplete="name"
            required
            defaultValue={valores?.nome}
            className={CLASSE_CAMPO}
          />
          <MensagemErro id="nome-erro" mensagem={erros.nome} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="telefone" className="text-sm font-medium">
            Telefone (com DDD)
          </label>
          <input
            {...atributosCampo('telefone')}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(11) 91234-5678"
            required
            defaultValue={valores?.telefone}
            className={CLASSE_CAMPO}
          />
          <MensagemErro id="telefone-erro" mensagem={erros.telefone} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="situacao" className="text-sm font-medium">
            Situação
          </label>
          <select
            {...atributosCampo('situacao')}
            required
            defaultValue={valores?.situacao || 'DISPONIVEL'}
            className={CLASSE_CAMPO}
          >
            {SITUACOES_ENTREGADOR.map((situacao) => (
              <option key={situacao} value={situacao}>
                {SITUACAO_ENTREGADOR_ROTULO[situacao]}
              </option>
            ))}
          </select>
          <MensagemErro id="situacao-erro" mensagem={erros.situacao} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-sm font-semibold">Acesso ao sistema</legend>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail de login
          </label>
          <input
            {...atributosCampo('email')}
            type="email"
            autoComplete="off"
            required
            defaultValue={valores?.email}
            className={CLASSE_CAMPO}
          />
          <MensagemErro id="email-erro" mensagem={erros.email} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="senhaInicial" className="text-sm font-medium">
            Senha inicial
          </label>
          <input
            {...atributosCampo('senhaInicial')}
            type="password"
            autoComplete="new-password"
            required
            minLength={TAMANHO_MINIMO_SENHA}
            aria-describedby={
              erros.senhaInicial ? 'senhaInicial-erro' : 'senhaInicial-dica'
            }
            className={CLASSE_CAMPO}
          />
          <p
            id="senhaInicial-dica"
            className="text-xs text-zinc-600 dark:text-zinc-400"
          >
            Mínimo de {TAMANHO_MINIMO_SENHA} caracteres. Informe ao entregador
            por um canal seguro.
          </p>
          <MensagemErro id="senhaInicial-erro" mensagem={erros.senhaInicial} />
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={enviando}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {enviando ? 'Cadastrando…' : 'Cadastrar entregador'}
      </button>
    </form>
  );
}
