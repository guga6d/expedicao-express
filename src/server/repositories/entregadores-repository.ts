import 'server-only';

import { FieldValue, type DocumentSnapshot } from 'firebase-admin/firestore';

import {
  isSituacaoEntregador,
  type Entregador,
  type SituacaoEntregador,
} from '@/domain/entregador';
import { getAdminDb } from '@/lib/firebase/admin';

import { paraIso, paraTexto } from './conversores';

function paraEntregador(snap: DocumentSnapshot): Entregador | null {
  const data = snap.data();
  if (!data || !isSituacaoEntregador(data.situacao)) return null;

  return {
    id: snap.id,
    nome: paraTexto(data.nome),
    telefone: paraTexto(data.telefone),
    email: paraTexto(data.email),
    situacao: data.situacao,
    criadoEm: paraIso(data.criadoEm),
  };
}

export async function buscarEntregadoresPorIds(
  ids: readonly string[],
): Promise<Entregador[]> {
  if (ids.length === 0) return [];
  const db = getAdminDb();
  const snaps = await db.getAll(
    ...ids.map((id) => db.collection('entregadores').doc(id)),
  );
  return snaps
    .filter((s) => s.exists)
    .map(paraEntregador)
    .filter((e): e is Entregador => e !== null);
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
