export const SITUACOES_ENTREGADOR = [
  'DISPONIVEL',
  'EM_ROTA',
  'INDISPONIVEL',
] as const;

export type SituacaoEntregador = (typeof SITUACOES_ENTREGADOR)[number];

export const SITUACAO_ENTREGADOR_ROTULO: Record<SituacaoEntregador, string> = {
  DISPONIVEL: 'Disponível',
  EM_ROTA: 'Em rota',
  INDISPONIVEL: 'Indisponível',
};

export function isSituacaoEntregador(valor: unknown): valor is SituacaoEntregador {
  return (
    typeof valor === 'string' &&
    (SITUACOES_ENTREGADOR as readonly string[]).includes(valor)
  );
}

/** O id é o uid da conta Firebase Auth do entregador (mesmo id em `usuarios`). */
export interface Entregador {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  situacao: SituacaoEntregador;
  criadoEm: string;
}

export interface DadosNovoEntregador {
  nome: string;
  telefone: string;
  email: string;
  situacao: SituacaoEntregador;
  senhaInicial: string;
}

export type CampoNovoEntregador = keyof DadosNovoEntregador;

export type ErrosNovoEntregador = Partial<Record<CampoNovoEntregador, string>>;

export type ResultadoValidacaoEntregador =
  | { ok: true; dados: DadosNovoEntregador }
  | { ok: false; erros: ErrosNovoEntregador };

/** Mínimo exigido pelo Firebase Auth. */
export const TAMANHO_MINIMO_SENHA = 6;

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Mantém só dígitos; aceita DDD + número (10 ou 11 dígitos). */
export function normalizarTelefone(telefone: string): string {
  return telefone.replace(/\D/g, '');
}

export function formatarTelefone(telefone: string): string {
  const d = normalizarTelefone(telefone);
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return telefone;
}

/** RF03 — valida os dados básicos do cadastro de entregador. */
export function validarNovoEntregador(entrada: {
  nome: unknown;
  telefone: unknown;
  email: unknown;
  situacao: unknown;
  senhaInicial: unknown;
}): ResultadoValidacaoEntregador {
  const erros: ErrosNovoEntregador = {};

  const nome = typeof entrada.nome === 'string' ? entrada.nome.trim() : '';
  if (nome.length < 3) {
    erros.nome = 'Informe o nome completo (mínimo 3 caracteres).';
  }

  const telefone =
    typeof entrada.telefone === 'string' ? normalizarTelefone(entrada.telefone) : '';
  if (telefone.length !== 10 && telefone.length !== 11) {
    erros.telefone = 'Informe um telefone com DDD, ex.: (11) 91234-5678.';
  }

  const email =
    typeof entrada.email === 'string' ? entrada.email.trim().toLowerCase() : '';
  if (!REGEX_EMAIL.test(email)) {
    erros.email = 'Informe um e-mail válido.';
  }

  if (!isSituacaoEntregador(entrada.situacao)) {
    erros.situacao = 'Selecione a situação do entregador.';
  }

  const senhaInicial =
    typeof entrada.senhaInicial === 'string' ? entrada.senhaInicial : '';
  if (senhaInicial.length < TAMANHO_MINIMO_SENHA) {
    erros.senhaInicial = `A senha inicial deve ter pelo menos ${TAMANHO_MINIMO_SENHA} caracteres.`;
  }

  if (Object.keys(erros).length > 0 || !isSituacaoEntregador(entrada.situacao)) {
    return { ok: false, erros };
  }

  return {
    ok: true,
    dados: { nome, telefone, email, situacao: entrada.situacao, senhaInicial },
  };
}
