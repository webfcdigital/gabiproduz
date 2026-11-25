export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '-';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}

export function calculateKmCost(distanceKm: number): number {
  return distanceKm * 1.5;
}

export const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  prospeccao: { label: 'Prospecção', color: '#6E6877', bg: '#F2EADF' },
  orcamento: { label: 'Orçamento', color: '#B18A38', bg: 'rgba(177, 138, 56, 0.15)' },
  contrato_assinado: { label: 'Contrato Assinado', color: '#2E7D32', bg: '#E8F5E9' },
  pre_producao: { label: 'Pré-Produção', color: '#48243F', bg: '#E2D7E0' },
  realizado: { label: 'Realizado', color: '#1565C0', bg: '#E3F2FD' },
  encerrado: { label: 'Encerrado', color: '#374151', bg: '#F3F4F6' }
};

export const ROLE_LABELS: Record<string, { label: string; badgeBg: string; textColor: string }> = {
  administrador: { label: 'Administrador (Full)', badgeBg: '#48243F', textColor: '#FFFFFF' },
  financeiro: { label: 'Financeiro', badgeBg: '#B18A38', textColor: '#FFFFFF' },
  artista: { label: 'Portal do Artista', badgeBg: '#1E3A8A', textColor: '#FFFFFF' },
  contratante: { label: 'Portal do Contratante', badgeBg: '#065F46', textColor: '#FFFFFF' }
};

