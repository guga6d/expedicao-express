import 'server-only';

import { Timestamp } from 'firebase-admin/firestore';

export function paraTexto(valor: unknown): string {
  return typeof valor === 'string' ? valor : '';
}

/** Timestamp do Firestore → ISO; string vazia se ausente (ex.: serverTimestamp pendente). */
export function paraIso(valor: unknown): string {
  return valor instanceof Timestamp ? valor.toDate().toISOString() : '';
}
