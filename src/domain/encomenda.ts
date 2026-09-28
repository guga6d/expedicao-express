export const STATUS_ENCOMENDA = [
  'AGUARDANDO_COLETA',
  'COLETADA',
  'EM_ROTA',
  'ENTREGUE',
  'NAO_ENTREGUE',
] as const;

export type StatusEncomenda = (typeof STATUS_ENCOMENDA)[number];

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

export function motivoObrigatorio(status: StatusEncomenda): boolean {
  return status === 'NAO_ENTREGUE';
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

export interface Encomenda {
  id: string;
  codigoRastreamento: string;
  remetenteNome: string;
  destinatarioNome: string;
  enderecoColeta: Endereco;
  enderecoEntrega: Endereco;
  statusAtual: StatusEncomenda;
  entregadorId?: string;
  motivoNaoEntrega?: string;
  criadaEm: string;
  atualizadaEm: string;
}

export interface EventoHistorico {
  id: string;
  status: StatusEncomenda;
  registradoEm: string;
  usuarioId: string;
  motivo?: string;
}

export interface Comprovante {
  nomeRecebedor: string;
  registradoEm: string;
  evidenciaUrl?: string;
}
