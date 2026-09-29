import 'server-only';

import {
  FieldValue,
  Timestamp,
  type DocumentSnapshot,
} from 'firebase-admin/firestore';

import {
  isSituacaoEntregador,
  type Entregador,
  type SituacaoEntregador,
} from '@/domain/entregador';
import { getAdminDb } from '@/lib/firebase/admin';

function paraEntregador(snap: DocumentSnapshot): Entregador | null {
  const data = snap.data();
  if (!data || !isSituacaoEntregador(data.situacao)) return null;

  return {
    id: snap.id,
    nome: typeof data.nome === 'string' ? data.nome : '',
    telefone: typeof data.telefone === 'string' ? data.telefone : '',
    email: typeof data.email === 'string' ? data.email : '',
    situacao: data.situacao,
    criadoEm:
      data.criadoEm instanceof Timestamp
        ? data.criadoEm.toDate().toISOString()
        : '',
  };
}

export async function atualizarSituacaoEntregador(
  id: string,
  situacao: SituacaoEntregador,
): Promise<void> {
  await getAdminDb().collection('entregadores').doc(id).update({
    situacao,
    atualizadoEm: FieldValue.serverTimestamp(),
  });
}

export async function listarEntregadores(): Promise<Entregador[]> {
  const snap = await getAdminDb().collection('entregadores').get();
  return snap.docs
    .map(paraEntregador)
    .filter((e): e is Entregador => e !== null);
}

export async function buscarEntregadorPorId(
  id: string,
): Promise<Entregador | null> {
  const snap = await getAdminDb().collection('entregadores').doc(id).get();
  if (!snap.exists) return null;
  return paraEntregador(snap);
}

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
