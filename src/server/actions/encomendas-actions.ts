'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  CAMPOS_NOVA_ENCOMENDA,
  validarNovaEncomenda,
  type CampoNovaEncomenda,
  type ErrosNovaEncomenda,
} from '@/domain/encomenda';
import { exigirSessao } from '@/server/auth/sessao';
import {
  cadastrarEncomenda,
  editarEncomenda,
  EncomendaFinalizadaError,
  EncomendaNaoEncontradaError,
} from '@/server/services/encomendas-service';

export type ValoresFormularioEncomenda = Partial<
  Record<CampoNovaEncomenda, string>
>;

export type EstadoCadastroEncomenda =
  | { status: 'inicial' }
  | { status: 'sucesso'; mensagem: string; codigoRastreamento: string }
  | {
      status: 'erro';
      mensagem: string;
      erros: ErrosNovaEncomenda;
      valores: ValoresFormularioEncomenda;
    };

function lerValores(formData: FormData): ValoresFormularioEncomenda {
  const valores: ValoresFormularioEncomenda = {};
  for (const campo of CAMPOS_NOVA_ENCOMENDA) {
    const valor = formData.get(campo);
    valores[campo] = typeof valor === 'string' ? valor : '';
  }
  return valores;
}

/** RF06 — cadastro de encomenda (com geração do código de rastreamento, RF07). */
export async function cadastrarEncomendaAction(
  _estadoAnterior: EstadoCadastroEncomenda,
  formData: FormData,
): Promise<EstadoCadastroEncomenda> {
  const valores = lerValores(formData);

  let usuarioId: string;
  try {
    ({ id: usuarioId } = await exigirSessao('gestor'));
  } catch {
    return {
      status: 'erro',
      mensagem: 'Apenas gestores podem cadastrar encomendas.',
      erros: {},
      valores,
    };
  }

  const validacao = validarNovaEncomenda(valores);
  if (!validacao.ok) {
    return {
      status: 'erro',
      mensagem: 'Corrija os campos destacados.',
      erros: validacao.erros,
      valores,
    };
  }

  let codigoRastreamento: string;
  try {
    ({ codigoRastreamento } = await cadastrarEncomenda(
      validacao.dados,
      usuarioId,
    ));
  } catch {
    return {
      status: 'erro',
      mensagem: 'Não foi possível cadastrar a encomenda. Tente novamente.',
      erros: {},
      valores,
    };
  }

  revalidatePath('/encomendas');
  revalidatePath('/dashboard');
  return {
    status: 'sucesso',
    mensagem: `Encomenda para ${validacao.dados.destinatario.nome} cadastrada com status “Aguardando coleta”.`,
    codigoRastreamento,
  };
}

/**
 * RF10 — edição dos dados cadastrais. Em caso de sucesso redireciona para os
 * detalhes (`?editada=1`), então só devolve estado de erro.
 */
export async function editarEncomendaAction(
  _estadoAnterior: EstadoCadastroEncomenda,
  formData: FormData,
): Promise<EstadoCadastroEncomenda> {
  const valores = lerValores(formData);
  const idBruto = formData.get('encomendaId');
  const id = typeof idBruto === 'string' ? idBruto : '';

  try {
    await exigirSessao('gestor');
  } catch {
    return {
      status: 'erro',
      mensagem: 'Apenas gestores podem editar encomendas.',
      erros: {},
      valores,
    };
  }

  const validacao = validarNovaEncomenda(valores);
  if (!validacao.ok) {
    return {
      status: 'erro',
      mensagem: 'Corrija os campos destacados.',
      erros: validacao.erros,
      valores,
    };
  }

  try {
    await editarEncomenda(id, validacao.dados);
  } catch (erro) {
    const mensagem =
      erro instanceof EncomendaFinalizadaError
        ? 'Esta encomenda já foi entregue e não pode mais ser editada.'
        : erro instanceof EncomendaNaoEncontradaError
          ? 'Encomenda não encontrada.'
          : 'Não foi possível salvar as alterações. Tente novamente.';
    return { status: 'erro', mensagem, erros: {}, valores };
  }

  revalidatePath('/encomendas');
  revalidatePath(`/encomendas/${id}`);
  redirect(`/encomendas/${id}?editada=1`);
}
