import { formatarTelefone, normalizarTelefone } from './entregador';

export const STATUS_ENCOMENDA = [
  'AGUARDANDO_COLETA',
  'COLETADA',
  'EM_ROTA',
  'ENTREGUE',
  'NAO_ENTREGUE',
] as const;

export type StatusEncomenda = (typeof STATUS_ENCOMENDA)[number];

export function isStatusEncomenda(valor: unknown): valor is StatusEncomenda {
  return (
    typeof valor === 'string' &&
    (STATUS_ENCOMENDA as readonly string[]).includes(valor)
  );
}

export const STATUS_ENCOMENDA_ROTULO: Record<StatusEncomenda, string> = {
  AGUARDANDO_COLETA: 'Aguardando coleta',
  COLETADA: 'Coletada',
  EM_ROTA: 'Em rota de entrega',
  ENTREGUE: 'Entregue',
  NAO_ENTREGUE: 'Entrega não realizada',
};

/** Transições válidas (RF15 / RF16). */
export const TRANSICOES_STATUS: Record<StatusEncomenda, readonly StatusEncomenda[]> = {
  AGUARDANDO_COLETA: ['COLETADA'],
  COLETADA: ['EM_ROTA'],
  EM_ROTA: ['ENTREGUE', 'NAO_ENTREGUE'],
  NAO_ENTREGUE: ['EM_ROTA'],
  ENTREGUE: [],
};

export function podeTransicionar(
  de: StatusEncomenda,
  para: StatusEncomenda,
): boolean {
  return TRANSICOES_STATUS[de].includes(para);
}

export function encomendaFinalizada(status: StatusEncomenda): boolean {
  return status === 'ENTREGUE';
}

/** RF10 — dados só podem ser alterados enquanto a encomenda não foi finalizada. */
export function podeEditarEncomenda(status: StatusEncomenda): boolean {
  return !encomendaFinalizada(status);
}

export function motivoObrigatorio(status: StatusEncomenda): boolean {
  return status === 'NAO_ENTREGUE';
}

export const STATUS_INICIAL_ENCOMENDA: StatusEncomenda = 'AGUARDANDO_COLETA';

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface Contato {
  nome: string;
  telefone: string;
}

export interface Encomenda {
  id: string;
  codigoRastreamento: string;
  descricao?: string;
  remetente: Contato;
  destinatario: Contato;
  enderecoColeta: Endereco;
  enderecoEntrega: Endereco;
  statusAtual: StatusEncomenda;
  entregadorId?: string;
  motivoNaoEntrega?: string;
  criadaEm: string;
  atualizadaEm: string;
}

/** RF08 — encomenda com o nome do entregador responsável já resolvido. */
export interface ItemListaEncomenda extends Encomenda {
  entregadorNome?: string;
}

export interface EventoHistorico {
  id: string;
  status: StatusEncomenda;
  registradoEm: string;
  usuarioId: string;
  motivo?: string;
}

/** RF09 — encomenda com entregador responsável e histórico (RF18). */
export interface DetalhesEncomenda {
  encomenda: Encomenda;
  entregador?: { id: string; nome: string; telefone: string };
  historico: (EventoHistorico & { usuarioNome?: string })[];
}

export interface Comprovante {
  nomeRecebedor: string;
  registradoEm: string;
  evidenciaUrl?: string;
}

/* ---------- RF07 — código de rastreamento ---------- */

/** Sem 0/O, 1/I para evitar confusão ao ditar ou digitar o código. */
const ALFABETO_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const PREFIXO_CODIGO = 'EE';
export const TAMANHO_ALEATORIO_CODIGO = 10;

const REGEX_CODIGO = new RegExp(
  `^${PREFIXO_CODIGO}[${ALFABETO_CODIGO}]{${TAMANHO_ALEATORIO_CODIGO}}$`,
);

/**
 * Monta o código a partir de bytes aleatórios (o chamador fornece a fonte,
 * ex.: `crypto.randomBytes`). O alfabeto tem 32 símbolos, então `byte % 32`
 * não introduz viés.
 */
export function gerarCodigoRastreamento(bytes: Uint8Array): string {
  if (bytes.length < TAMANHO_ALEATORIO_CODIGO) {
    throw new Error(
      `São necessários ${TAMANHO_ALEATORIO_CODIGO} bytes para gerar o código.`,
    );
  }
  let sufixo = '';
  for (let i = 0; i < TAMANHO_ALEATORIO_CODIGO; i++) {
    sufixo += ALFABETO_CODIGO[bytes[i] % ALFABETO_CODIGO.length];
  }
  return PREFIXO_CODIGO + sufixo;
}

export function normalizarCodigoRastreamento(codigo: string): string {
  return codigo.replace(/[\s-]/g, '').toUpperCase();
}

export function isCodigoRastreamento(codigo: string): boolean {
  return REGEX_CODIGO.test(codigo);
}

/* ---------- RF06 — cadastro de encomenda ---------- */

export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE',
  'TO',
] as const;

export const TAMANHO_MAXIMO_DESCRICAO = 200;

export type PrefixoEndereco = 'coleta' | 'entrega';

type CampoEndereco =
  | 'Cep'
  | 'Logradouro'
  | 'Numero'
  | 'Complemento'
  | 'Bairro'
  | 'Cidade'
  | 'Uf';

/** Nomes planos dos campos do formulário (também usados como chave de erro). */
export const CAMPOS_NOVA_ENCOMENDA = [
  'descricao',
  'remetenteNome',
  'remetenteTelefone',
  'destinatarioNome',
  'destinatarioTelefone',
  ...(['coleta', 'entrega'] as const).flatMap(
    (prefixo) =>
      [
        `${prefixo}Cep`,
        `${prefixo}Logradouro`,
        `${prefixo}Numero`,
        `${prefixo}Complemento`,
        `${prefixo}Bairro`,
        `${prefixo}Cidade`,
        `${prefixo}Uf`,
      ] as const,
  ),
] as const;

export type CampoNovaEncomenda =
  | (typeof CAMPOS_NOVA_ENCOMENDA)[number]
  | `${PrefixoEndereco}${CampoEndereco}`;

export type EntradaNovaEncomenda = Partial<Record<CampoNovaEncomenda, unknown>>;

export type ErrosNovaEncomenda = Partial<Record<CampoNovaEncomenda, string>>;

export interface DadosNovaEncomenda {
  descricao?: string;
  remetente: Contato;
  destinatario: Contato;
  enderecoColeta: Endereco;
  enderecoEntrega: Endereco;
}

export type ResultadoValidacaoEncomenda =
  | { ok: true; dados: DadosNovaEncomenda }
  | { ok: false; erros: ErrosNovaEncomenda };

export function normalizarCep(cep: string): string {
  return cep.replace(/\D/g, '');
}

export function formatarCep(cep: string): string {
  const d = normalizarCep(cep);
  return d.length === 8 ? `${d.slice(0, 5)}-${d.slice(5)}` : cep;
}

export function formatarEndereco(e: Endereco): string {
  const complemento = e.complemento ? `, ${e.complemento}` : '';
  return `${e.logradouro}, ${e.numero}${complemento} — ${e.bairro}, ${e.cidade}/${e.uf} — CEP ${formatarCep(e.cep)}`;
}

function textoLimpo(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : '';
}

function validarContato(
  entrada: EntradaNovaEncomenda,
  papel: 'remetente' | 'destinatario',
  erros: ErrosNovaEncomenda,
): Contato {
  const nome = textoLimpo(entrada[`${papel}Nome`]);
  if (nome.length < 3) {
    erros[`${papel}Nome`] = 'Informe o nome (mínimo 3 caracteres).';
  }

  const telefone = normalizarTelefone(textoLimpo(entrada[`${papel}Telefone`]));
  if (telefone.length !== 10 && telefone.length !== 11) {
    erros[`${papel}Telefone`] =
      'Informe um telefone com DDD, ex.: (11) 91234-5678.';
  }

  return { nome, telefone };
}

function validarEndereco(
  entrada: EntradaNovaEncomenda,
  prefixo: PrefixoEndereco,
  erros: ErrosNovaEncomenda,
): Endereco {
  const campo = (nome: CampoEndereco) => textoLimpo(entrada[`${prefixo}${nome}`]);

  const cep = normalizarCep(campo('Cep'));
  if (cep.length !== 8) erros[`${prefixo}Cep`] = 'Informe um CEP com 8 dígitos.';

  const logradouro = campo('Logradouro');
  if (!logradouro) erros[`${prefixo}Logradouro`] = 'Informe a rua/avenida.';

  const numero = campo('Numero');
  if (!numero) erros[`${prefixo}Numero`] = 'Informe o número (ou “s/n”).';

  const bairro = campo('Bairro');
  if (!bairro) erros[`${prefixo}Bairro`] = 'Informe o bairro.';

  const cidade = campo('Cidade');
  if (!cidade) erros[`${prefixo}Cidade`] = 'Informe a cidade.';

  const uf = campo('Uf').toUpperCase();
  if (!(UFS as readonly string[]).includes(uf)) {
    erros[`${prefixo}Uf`] = 'Selecione a UF.';
  }

  const complemento = campo('Complemento');
  return {
    cep,
    logradouro,
    numero,
    ...(complemento ? { complemento } : {}),
    bairro,
    cidade,
    uf,
  };
}

/** RF10 — preenche o formulário de edição a partir da encomenda salva. */
export function valoresFormularioDeEncomenda(
  e: Encomenda,
): Record<CampoNovaEncomenda, string> {
  const endereco = (prefixo: PrefixoEndereco, end: Endereco) =>
    ({
      [`${prefixo}Cep`]: formatarCep(end.cep),
      [`${prefixo}Logradouro`]: end.logradouro,
      [`${prefixo}Numero`]: end.numero,
      [`${prefixo}Complemento`]: end.complemento ?? '',
      [`${prefixo}Bairro`]: end.bairro,
      [`${prefixo}Cidade`]: end.cidade,
      [`${prefixo}Uf`]: end.uf,
    }) as Record<`${PrefixoEndereco}${CampoEndereco}`, string>;

  return {
    descricao: e.descricao ?? '',
    remetenteNome: e.remetente.nome,
    remetenteTelefone: formatarTelefone(e.remetente.telefone),
    destinatarioNome: e.destinatario.nome,
    destinatarioTelefone: formatarTelefone(e.destinatario.telefone),
    ...endereco('coleta', e.enderecoColeta),
    ...endereco('entrega', e.enderecoEntrega),
  };
}

/** RF06 — valida identificação, remetente, destinatário e endereços. */
export function validarNovaEncomenda(
  entrada: EntradaNovaEncomenda,
): ResultadoValidacaoEncomenda {
  const erros: ErrosNovaEncomenda = {};

  const descricao = textoLimpo(entrada.descricao);
  if (descricao.length > TAMANHO_MAXIMO_DESCRICAO) {
    erros.descricao = `Use no máximo ${TAMANHO_MAXIMO_DESCRICAO} caracteres.`;
  }

  const remetente = validarContato(entrada, 'remetente', erros);
  const destinatario = validarContato(entrada, 'destinatario', erros);
  const enderecoColeta = validarEndereco(entrada, 'coleta', erros);
  const enderecoEntrega = validarEndereco(entrada, 'entrega', erros);

  if (Object.keys(erros).length > 0) return { ok: false, erros };

  return {
    ok: true,
    dados: {
      ...(descricao ? { descricao } : {}),
      remetente,
      destinatario,
      enderecoColeta,
      enderecoEntrega,
    },
  };
}

