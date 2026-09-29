'use client';

import Link from 'next/link';
import { useActionState } from 'react';

import {
  TAMANHO_MAXIMO_DESCRICAO,
  UFS,
  type CampoNovaEncomenda,
  type ErrosNovaEncomenda,
  type PrefixoEndereco,
} from '@/domain/encomenda';
import {
  cadastrarEncomendaAction,
  editarEncomendaAction,
  type EstadoCadastroEncomenda,
  type ValoresFormularioEncomenda,
} from '@/server/actions/encomendas-actions';

const ESTADO_INICIAL: EstadoCadastroEncomenda = { status: 'inicial' };

const CLASSE_CAMPO =
  'rounded-lg border px-3 py-2 text-sm dark:bg-zinc-950 aria-[invalid=true]:border-red-500 border-zinc-300 dark:border-zinc-600';

type ContextoCampos = {
  erros: ErrosNovaEncomenda;
  valores?: ValoresFormularioEncomenda;
  enviando: boolean;
};

type PropsCampo = ContextoCampos & {
  campo: CampoNovaEncomenda;
  rotulo: string;
  opcional?: boolean;
  className?: string;
  children?: (atributos: AtributosCampo) => React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'>;

type AtributosCampo = {
  id: string;
  name: string;
  disabled: boolean;
  defaultValue?: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
  className: string;
};

function Campo({
  campo,
  rotulo,
  opcional,
  className,
  erros,
  valores,
  enviando,
  children,
  ...inputProps
}: PropsCampo) {
  const erro = erros[campo];
  const idErro = `${campo}-erro`;
  const atributos: AtributosCampo = {
    id: campo,
    name: campo,
    disabled: enviando,
    defaultValue: valores?.[campo],
    'aria-invalid': erro ? true : undefined,
    'aria-describedby': erro ? idErro : undefined,
    className: CLASSE_CAMPO,
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <label htmlFor={campo} className="text-sm font-medium">
        {rotulo}
        {opcional ? (
          <span className="font-normal text-zinc-600 dark:text-zinc-400">
            {' '}
            (opcional)
          </span>
        ) : null}
      </label>
      {children ? (
        children(atributos)
      ) : (
        <input {...atributos} required={!opcional} {...inputProps} />
      )}
      {erro ? (
        <p id={idErro} className="text-sm text-red-700 dark:text-red-300">
          {erro}
        </p>
      ) : null}
    </div>
  );
}

function CamposContato({
  papel,
  titulo,
  ...ctx
}: ContextoCampos & { papel: 'remetente' | 'destinatario'; titulo: string }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="mb-2 text-sm font-semibold">{titulo}</legend>
      <Campo
        {...ctx}
        campo={`${papel}Nome`}
        rotulo="Nome"
        type="text"
        autoComplete="off"
      />
      <Campo
        {...ctx}
        campo={`${papel}Telefone`}
        rotulo="Telefone (com DDD)"
        type="tel"
        inputMode="tel"
        autoComplete="off"
        placeholder="(11) 91234-5678"
      />
    </fieldset>
  );
}

function CamposEndereco({
  prefixo,
  titulo,
  ...ctx
}: ContextoCampos & { prefixo: PrefixoEndereco; titulo: string }) {
  return (
    <fieldset className="grid gap-4 sm:grid-cols-6">
      <legend className="mb-2 text-sm font-semibold">{titulo}</legend>
      <Campo
        {...ctx}
        campo={`${prefixo}Cep`}
        rotulo="CEP"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="00000-000"
        className="sm:col-span-2"
      />
      <Campo
        {...ctx}
        campo={`${prefixo}Logradouro`}
        rotulo="Rua / avenida"
        type="text"
        autoComplete="off"
        className="sm:col-span-4"
      />
      <Campo
        {...ctx}
        campo={`${prefixo}Numero`}
        rotulo="Número"
        type="text"
        autoComplete="off"
        className="sm:col-span-2"
      />
      <Campo
        {...ctx}
        campo={`${prefixo}Complemento`}
        rotulo="Complemento"
        opcional
        type="text"
        autoComplete="off"
        className="sm:col-span-4"
      />
      <Campo
        {...ctx}
        campo={`${prefixo}Bairro`}
        rotulo="Bairro"
        type="text"
        autoComplete="off"
        className="sm:col-span-2"
      />
      <Campo
        {...ctx}
        campo={`${prefixo}Cidade`}
        rotulo="Cidade"
        type="text"
        autoComplete="off"
        className="sm:col-span-3"
      />
      <Campo
        {...ctx}
        campo={`${prefixo}Uf`}
        rotulo="UF"
        className="sm:col-span-1"
      >
        {(atributos) => (
          <select {...atributos} required defaultValue={atributos.defaultValue ?? ''}>
            <option value="" disabled>
              —
            </option>
            {UFS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        )}
      </Campo>
    </fieldset>
  );
}

type PropsFormulario =
  | { modo: 'cadastro' }
  | {
      modo: 'edicao';
      encomendaId: string;
      codigoRastreamento: string;
      valoresIniciais: ValoresFormularioEncomenda;
    };

/** RF06 — cadastro de encomenda; RF10 — edição dos mesmos dados. */
export function FormularioEncomenda(props: PropsFormulario) {
  const [estado, acao, enviando] = useActionState(
    props.modo === 'edicao' ? editarEncomendaAction : cadastrarEncomendaAction,
    ESTADO_INICIAL,
  );

  const ctx: ContextoCampos = {
    erros: estado.status === 'erro' ? estado.erros : {},
    valores:
      estado.status === 'erro'
        ? estado.valores
        : props.modo === 'edicao'
          ? props.valoresIniciais
          : undefined,
    enviando,
  };

  const rotuloBotao =
    props.modo === 'edicao'
      ? enviando
        ? 'Salvando…'
        : 'Salvar alterações'
      : enviando
        ? 'Cadastrando…'
        : 'Cadastrar encomenda';

  return (
    <form action={acao} className="flex flex-col gap-8" noValidate>
      {props.modo === 'edicao' ? (
        <input type="hidden" name="encomendaId" value={props.encomendaId} />
      ) : null}
      {estado.status === 'sucesso' ? (
        <div
          role="status"
          className="flex flex-col gap-1 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
        >
          <p>{estado.mensagem}</p>
          <p>
            Código de rastreamento:{' '}
            <strong className="font-mono text-base tracking-wider">
              {estado.codigoRastreamento}
            </strong>{' '}
            (
            <Link
              href={`/rastreio/${estado.codigoRastreamento}`}
              className="underline"
            >
              ver página de rastreio
            </Link>
            )
          </p>
        </div>
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
        <legend className="mb-2 text-sm font-semibold">Identificação</legend>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {props.modo === 'edicao' ? (
            <>
              Código de rastreamento:{' '}
              <strong className="font-mono tracking-wider">
                {props.codigoRastreamento}
              </strong>{' '}
              (não pode ser alterado).
            </>
          ) : (
            'O código de rastreamento é gerado automaticamente ao salvar.'
          )}
        </p>
        <Campo
          {...ctx}
          campo="descricao"
          rotulo="Descrição do conteúdo"
          opcional
          type="text"
          maxLength={TAMANHO_MAXIMO_DESCRICAO}
          placeholder="Ex.: caixa média, documentos"
        />
      </fieldset>

      <CamposContato {...ctx} papel="remetente" titulo="Remetente" />
      <CamposEndereco {...ctx} prefixo="coleta" titulo="Endereço de coleta" />
      <CamposContato {...ctx} papel="destinatario" titulo="Destinatário" />
      <CamposEndereco {...ctx} prefixo="entrega" titulo="Endereço de entrega" />

      <button
        type="submit"
        disabled={enviando}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {rotuloBotao}
      </button>
    </form>
  );
}
