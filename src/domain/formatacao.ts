const FORMATO_DATA_HORA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

/** ISO → "28/09/2026, 22:44" no fuso de Brasília; "—" se vazio. */
export function formatarDataHora(iso: string): string {
  return iso ? FORMATO_DATA_HORA.format(new Date(iso)) : '—';
}
