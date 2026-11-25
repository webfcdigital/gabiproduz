export type UserRole = 'administrador' | 'financeiro' | 'artista' | 'contratante';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  associatedArtistId?: string;
  associatedContractorId?: string;
}

export interface Artist {
  id: string;
  name: string;
  artisticName: string;
  genre: string;
  bio: string;
  photoUrl: string;
  email: string;
  phone: string;
  baseFee: number;
  bankInfo: {
    pixKey: string;
    pixType: 'CPF' | 'CNPJ' | 'E-mail' | 'Telefone' | 'Aleatória';
    bankName: string;
    agency: string;
    account: string;
  };
  riderNotes: string;
  active: boolean;
}

export interface Contractor {
  id: string;
  name: string;
  companyName: string;
  document: string; // CPF ou CNPJ
  type: 'PF' | 'PJ';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes?: string;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  ceilingHeight: string;
  voltage: '110V' | '220V' | 'Ambos';
  soundCurfew: string; // Ex: '22:00'
  contactName: string;
  contactPhone: string;
  technicalNotes: string;
}

export type EventStatus =
  | 'prospeccao'
  | 'orcamento'
  | 'contrato_assinado'
  | 'pre_producao'
  | 'realizado'
  | 'encerrado';

export type PreProductionPackage = 'essencial' | 'intermediario' | 'completo' | 'personalizado';

export interface EventDocument {
  id: string;
  eventId: string;
  type: 'orcamento' | 'proposta' | 'contrato' | 'ficha_cadastral';
  title: string;
  content: string;
  googleDocId: string;
  googleDocUrl: string;
  updatedAt: string;
  status: 'rascunho' | 'gerado' | 'enviado' | 'assinado';
}

export interface TimelineItem {
  id: string;
  eventId: string;
  time: string;
  title: string;
  responsible: string;
  notes?: string;
  completed: boolean;
}

export type ChecklistPhase = 'D-30' | 'D-14' | 'D-2' | 'D-Day' | 'Pos';

export interface ChecklistItem {
  id: string;
  eventId: string;
  phase: ChecklistPhase;
  task: string;
  responsible: string;
  deadline: string;
  completed: boolean;
}

export interface TimeLog {
  id: string;
  eventId: string;
  date: string;
  activityType: 'Reunião' | 'Briefing' | 'Cronograma' | 'Logística/Fornecedor' | 'Acessos/Staff' | 'Outros';
  description: string;
  hours: number;
  hourlyRate: number;
  isExceeded: boolean;
  loggedBy: string;
}

export type TransactionType = 'receita' | 'despesa_producao' | 'repasse_artista' | 'reembolso_km';
export type TransactionStatus = 'pendente' | 'pago' | 'atrasado';

export interface FinancialTransaction {
  id: string;
  eventId?: string;
  type: TransactionType;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: TransactionStatus;
  category: string;
  recipientOrPayer: string;
  receiptUrl?: string;
}

export interface EventItem {
  id: string;
  code: string;
  title: string;
  status: EventStatus;
  date: string;
  startTime: string;
  soundcheckTime: string;
  showTime: string;
  endTime: string;
  artistId: string;
  contractorId: string;
  venueId: string;
  
  // Comercial e Finanças
  preProductionPackage: PreProductionPackage;
  preProductionHoursLimit: number;
  preProductionFee: number;
  presencialFee: number;
  kmDistance: number;
  kmFee: number;
  additionalServicesFee: number;
  totalFee: number;
  signalFee: number;
  signalPaid: boolean;
  balanceFee: number;
  balancePaid: boolean;

  // Integração Google Drive API
  googleDriveFolderId: string;
  googleDriveFolderUrl: string;
  driveSyncStatus: 'synced' | 'pending' | 'syncing';
  
  notes?: string;
}

