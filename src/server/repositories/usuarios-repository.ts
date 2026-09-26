import 'server-only';

import type { Usuario } from '@/domain/usuario';
import { isPerfilUsuario } from '@/domain/usuario';
import { getAdminDb } from '@/lib/firebase/admin';

export async function buscarUsuarioPorId(
  id: string,
): Promise<Usuario | null> {
  const snap = await getAdminDb().collection('usuarios').doc(id).get();
  if (!snap.exists) return null;

  const data = snap.data();
  if (!data || !isPerfilUsuario(data.perfil)) return null;

  return {
    id: snap.id,
    perfil: data.perfil,
    nome: typeof data.nome === 'string' ? data.nome : '',
    email: typeof data.email === 'string' ? data.email : '',
  };
}
