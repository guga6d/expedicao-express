import 'server-only';

import { FieldValue } from 'firebase-admin/firestore';

import type { SituacaoEntregador } from '@/domain/entregador';
import { getAdminDb } from '@/lib/firebase/admin';

export interface NovoRegistroEntregador {
  uid: string;
  nome: string;
  telefone: string;
  email: string;
  situacao: SituacaoEntregador;
}

/**
 * Grava `entregadores/{uid}` e `usuarios/{uid}` (perfil entregador) numa
 * única escrita atômica.
 */
export async function salvarEntregadorComUsuario(
  registro: NovoRegistroEntregador,
): Promise<void> {
  const db = getAdminDb();
  const agora = FieldValue.serverTimestamp();
  const batch = db.batch();

  batch.create(db.collection('entregadores').doc(registro.uid), {
    nome: registro.nome,
    telefone: registro.telefone,
    email: registro.email,
    situacao: registro.situacao,
    criadoEm: agora,
    atualizadoEm: agora,
  });

  batch.create(db.collection('usuarios').doc(registro.uid), {
    perfil: 'entregador',
    nome: registro.nome,
    email: registro.email,
    criadoEm: agora,
  });

  await batch.commit();
}
