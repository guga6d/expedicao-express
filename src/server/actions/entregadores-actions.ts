'use server';

import { revalidatePath } from 'next/cache';

import {
  isSituacaoEntregador,
  SITUACAO_ENTREGADOR_ROTULO,
  validarNovoEntregador,
  type ErrosNovoEntregador,
} from '@/domain/entregador';
import { exigirSessao } from '@/server/auth/sessao';
import {
  cadastrarEntregador,
  definirSituacaoEntregador,
  EmailJaCadastradoError,
  EntregadorNaoEncontradoError,
} from '@/server/services/entregadores-service';

export interface ValoresFormularioEntregador {
  nome: string;
  telefone: string;
  email: string;
  situacao: string;
}

export type EstadoCadastroEntregador =
  | { status: 'inicial' }
  | { status: 'sucesso'; mensagem: string }
  | {
      status: 'erro';
      mensagem: string;
      erros: ErrosNovoEntregador;
      valores: ValoresFormularioEntregador;
    };

function texto(formData: FormData, campo: string): string {
  const valor = formData.get(campo);
  return typeof valor === 'string' ? valor : '';
}

/** RF03 — cadastro de entregador com criação da conta de login. */
export async function cadastrarEntregadorAction(
  _estadoAnterior: EstadoCadastroEntregador,
  formData: FormData,
): Promise<EstadoCadastroEntregador> {
  const valores: ValoresFormularioEntregador = {
    nome: texto(formData, 'nome'),
    telefone: texto(formData, 'telefone'),
    email: texto(formData, 'email'),
    situacao: texto(formData, 'situacao'),
  };

  try {
    await exigirSessao('gestor');
  } catch {
    return {
      status: 'erro',
      mensagem: 'Apenas gestores podem cadastrar entregadores.',
      erros: {},
      valores,
    };
  }

  const validacao = validarNovoEntregador({
    ...valores,
    senhaInicial: texto(formData, 'senhaInicial'),
  });
  if (!validacao.ok) {
    return {
      status: 'erro',
      mensagem: 'Corrija os campos destacados.',
      erros: validacao.erros,
      valores,
    };
  }

  try {
    await cadastrarEntregador(validacao.dados);
  } catch (erro) {
    if (erro instanceof EmailJaCadastradoError) {
      return {
        status: 'erro',
        mensagem: 'Corrija os campos destacados.',
        erros: { email: 'Já existe uma conta com este e-mail.' },
        valores,
      };
    }
    return {
      status: 'erro',
      mensagem: 'Não foi possível cadastrar o entregador. Tente novamente.',
      erros: {},
      valores,
    };
  }

  revalidatePath('/entregadores');
  return {
    status: 'sucesso',
    mensagem: `Entregador ${validacao.dados.nome} cadastrado. Ele já pode entrar com ${validacao.dados.email} e a senha inicial informada.`,
  };
}

export type EstadoSituacaoEntregador =
  | { status: 'inicial' }
  | { status: 'sucesso'; mensagem: string }
  | { status: 'erro'; mensagem: string };

/** RF05 — define a situação do entregador. */
export async function definirSituacaoEntregadorAction(
  _estadoAnterior: EstadoSituacaoEntregador,
  formData: FormData,
): Promise<EstadoSituacaoEntregador> {
  try {
    await exigirSessao('gestor');
  } catch {
    return {
      status: 'erro',
      mensagem: 'Apenas gestores podem alterar a situação de entregadores.',
    };
  }

  const id = texto(formData, 'entregadorId');
  const situacao = texto(formData, 'situacao');
  if (!id || !isSituacaoEntregador(situacao)) {
    return { status: 'erro', mensagem: 'Selecione uma situação válida.' };
  }

  let nome: string;
  try {
    ({ nome } = await definirSituacaoEntregador(id, situacao));
  } catch (erro) {
    if (erro instanceof EntregadorNaoEncontradoError) {
      return { status: 'erro', mensagem: 'Entregador não encontrado.' };
    }
    return {
      status: 'erro',
      mensagem: 'Não foi possível alterar a situação. Tente novamente.',
    };
  }

  revalidatePath('/entregadores');
  revalidatePath(`/entregadores/${id}`);
  return {
    status: 'sucesso',
    mensagem: `Situação de ${nome} definida como “${SITUACAO_ENTREGADOR_ROTULO[situacao]}”.`,
  };
}
