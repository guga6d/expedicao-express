export type PerfilUsuario = 'gestor' | 'entregador';

export interface Usuario {
  id: string;
  perfil: PerfilUsuario;
  nome: string;
  email: string;
}

export function isPerfilUsuario(valor: unknown): valor is PerfilUsuario {
  return valor === 'gestor' || valor === 'entregador';
}

/** Destino após login bem-sucedido (RF01 / RNF11). */
export function rotaAposLogin(perfil: PerfilUsuario): string {
  return perfil === 'gestor' ? '/dashboard' : '/entregas';
}
