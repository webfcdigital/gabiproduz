import { supabase, isSupabaseConfigured } from './supabase';
import {
  Artist,
  Contractor,
  Venue,
  EventItem,
  EventDocument,
  TimelineItem,
  ChecklistItem,
  TimeLog,
  FinancialTransaction,
  User
} from '../types';
import {
  initialUsers,
  initialArtists,
  initialContractors,
  initialVenues,
  initialEvents,
  initialDocuments,
  initialTimeline,
  initialChecklist,
  initialTimeLogs,
  initialTransactions
} from '../data/initialData';

// ==========================================
// MAPPERS: TypeScript Models <-> Postgres Tables
// ==========================================

export function mapUserFromDb(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatarUrl: row.avatar_url,
    associatedArtistId: row.associated_artist_id,
    associatedContractorId: row.associated_contractor_id
  };
}

export function mapUserToDb(user: User): any {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar_url: user.avatarUrl,
    associated_artist_id: user.associatedArtistId || null,
    associated_contractor_id: user.associatedContractorId || null
  };
}

export function mapArtistFromDb(row: any): Artist {
  return {
    id: row.id,
    name: row.name,
    artisticName: row.artistic_name,
    genre: row.genre || '',
    bio: row.bio || '',
    photoUrl: row.photo_url || '',
    email: row.email || '',
    phone: row.phone || '',
    baseFee: Number(row.base_fee) || 0,
    bankInfo: {
      pixKey: row.pix_key || '',
      pixType: row.pix_type || 'Aleatória',
      bankName: row.bank_name || '',
      agency: row.bank_agency || '',
      account: row.bank_account || ''
    },
    riderNotes: row.rider_notes || '',
    active: row.active ?? true
  };
}

export function mapArtistToDb(a: Artist): any {
  return {
    id: a.id,
    name: a.name,
    artistic_name: a.artisticName,
    genre: a.genre,
    bio: a.bio,
    photo_url: a.photoUrl,
    email: a.email,
    phone: a.phone,
    base_fee: a.baseFee,
    pix_key: a.bankInfo?.pixKey,
    pix_type: a.bankInfo?.pixType,
    bank_name: a.bankInfo?.bankName,
    bank_agency: a.bankInfo?.agency,
    bank_account: a.bankInfo?.account,
    rider_notes: a.riderNotes,
    active: a.active
  };
}

export function mapContractorFromDb(row: any): Contractor {
  return {
    id: row.id,
    name: row.name,
    companyName: row.company_name || row.name,
    document: row.document || '',
    type: row.type || 'PJ',
    email: row.email || '',
    phone: row.phone || '',
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    notes: row.notes || ''
  };
}

export function mapContractorToDb(c: Contractor): any {
  return {
    id: c.id,
    name: c.name,
    company_name: c.companyName,
    document: c.document,
    type: c.type,
    email: c.email,
    phone: c.phone,
    address: c.address,
    city: c.city,
    state: c.state,
    notes: c.notes || ''
  };
}

export function mapVenueFromDb(row: any): Venue {
  return {
    id: row.id,
    name: row.name,
    address: row.address || '',
    city: row.city || '',
    state: row.state || '',
    capacity: row.capacity || 0,
    ceilingHeight: row.ceiling_height || '',
    voltage: row.voltage || 'Ambos',
    soundCurfew: row.sound_curfew || '',
    contactName: row.contact_name || '',
    contactPhone: row.contact_phone || '',
    technicalNotes: row.technical_notes || ''
  };
}

export function mapVenueToDb(v: Venue): any {
  return {
    id: v.id,
    name: v.name,
    address: v.address,
    city: v.city,
    state: v.state,
    capacity: v.capacity,
    ceiling_height: v.ceilingHeight,
    voltage: v.voltage,
    sound_curfew: v.soundCurfew,
    contact_name: v.contactName,
    contact_phone: v.contactPhone,
    technical_notes: v.technicalNotes
  };
}

export function mapEventFromDb(row: any): EventItem {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    status: row.status,
    date: row.date,
    startTime: row.start_time || '',
    soundcheckTime: row.soundcheck_time || '',
    showTime: row.show_time || '',
    endTime: row.end_time || '',
    artistId: row.artist_id || '',
    contractorId: row.contractor_id || '',
    venueId: row.venue_id || '',
    preProductionPackage: row.pre_production_package || 'intermediario',
    preProductionHoursLimit: row.pre_production_hours_limit || 9,
    preProductionFee: Number(row.pre_production_fee) || 0,
    presencialFee: Number(row.presencial_fee) || 0,
    kmDistance: Number(row.km_distance) || 0,
    kmFee: Number(row.km_fee) || 0,
    additionalServicesFee: Number(row.additional_services_fee) || 0,
    totalFee: Number(row.total_fee) || 0,
    signalFee: Number(row.signal_fee) || 0,
    signalPaid: Boolean(row.signal_paid),
    balanceFee: Number(row.balance_fee) || 0,
    balancePaid: Boolean(row.balance_paid),
    googleDriveFolderId: row.google_drive_folder_id || '',
    googleDriveFolderUrl: row.google_drive_folder_url || '',
    driveSyncStatus: row.drive_sync_status || 'pending',
    notes: row.notes || ''
  };
}

export function mapEventToDb(e: EventItem): any {
  return {
    id: e.id,
    code: e.code,
    title: e.title,
    status: e.status,
    date: e.date,
    start_time: e.startTime,
    soundcheck_time: e.soundcheckTime,
    show_time: e.showTime,
    end_time: e.endTime,
    artist_id: e.artistId || null,
    contractor_id: e.contractorId || null,
    venue_id: e.venueId || null,
    pre_production_package: e.preProductionPackage,
    pre_production_hours_limit: e.preProductionHoursLimit,
    pre_production_fee: e.preProductionFee,
    presencial_fee: e.presencialFee,
    km_distance: e.kmDistance,
    km_fee: e.kmFee,
    additional_services_fee: e.additionalServicesFee,
    total_fee: e.totalFee,
    signal_fee: e.signalFee,
    signal_paid: e.signalPaid,
    balance_fee: e.balanceFee,
    balance_paid: e.balancePaid,
    google_drive_folder_id: e.googleDriveFolderId,
    google_drive_folder_url: e.googleDriveFolderUrl,
    drive_sync_status: e.driveSyncStatus,
    notes: e.notes || ''
  };
}

export function mapDocumentFromDb(row: any): EventDocument {
  return {
    id: row.id,
    eventId: row.event_id,
    type: row.type,
    title: row.title,
    content: row.content,
    googleDocId: row.google_doc_id || '',
    googleDocUrl: row.google_doc_url || '',
    status: row.status || 'gerado',
    updatedAt: row.updated_at || new Date().toISOString()
  };
}

export function mapDocumentToDb(d: EventDocument): any {
  return {
    id: d.id,
    event_id: d.eventId,
    type: d.type,
    title: d.title,
    content: d.content,
    google_doc_id: d.googleDocId,
    google_doc_url: d.googleDocUrl,
    status: d.status,
    updated_at: d.updatedAt
  };
}

export function mapTimelineFromDb(row: any): TimelineItem {
  return {
    id: row.id,
    eventId: row.event_id,
    time: row.time,
    title: row.title,
    responsible: row.responsible || '',
    notes: row.notes || '',
    completed: Boolean(row.completed)
  };
}

export function mapTimelineToDb(t: TimelineItem): any {
  return {
    id: t.id,
    event_id: t.eventId,
    time: t.time,
    title: t.title,
    responsible: t.responsible,
    notes: t.notes || '',
    completed: t.completed
  };
}

export function mapChecklistFromDb(row: any): ChecklistItem {
  return {
    id: row.id,
    eventId: row.event_id,
    phase: row.phase,
    task: row.task,
    responsible: row.responsible || '',
    deadline: row.deadline || '',
    completed: Boolean(row.completed)
  };
}

export function mapChecklistToDb(c: ChecklistItem): any {
  return {
    id: c.id,
    event_id: c.eventId,
    phase: c.phase,
    task: c.task,
    responsible: c.responsible,
    deadline: c.deadline || null,
    completed: c.completed
  };
}

export function mapTimeLogFromDb(row: any): TimeLog {
  return {
    id: row.id,
    eventId: row.event_id,
    date: row.date,
    activityType: row.activity_type,
    description: row.description || '',
    hours: Number(row.hours),
    hourlyRate: Number(row.hourly_rate) || 70,
    isExceeded: Boolean(row.is_exceeded),
    loggedBy: row.logged_by || 'Produtor'
  };
}

export function mapTimeLogToDb(l: TimeLog): any {
  return {
    id: l.id,
    event_id: l.eventId,
    date: l.date,
    activity_type: l.activityType,
    description: l.description,
    hours: l.hours,
    hourly_rate: l.hourlyRate,
    is_exceeded: l.isExceeded,
    logged_by: l.loggedBy
  };
}

export function mapTransactionFromDb(row: any): FinancialTransaction {
  return {
    id: row.id,
    eventId: row.event_id || undefined,
    type: row.type,
    description: row.description,
    amount: Number(row.amount),
    dueDate: row.due_date,
    paymentDate: row.payment_date || undefined,
    status: row.status,
    category: row.category || 'geral',
    recipientOrPayer: row.recipient_or_payer || '',
    receiptUrl: row.receipt_url || undefined
  };
}

export function mapTransactionToDb(t: FinancialTransaction): any {
  return {
    id: t.id,
    event_id: t.eventId || null,
    type: t.type,
    description: t.description,
    amount: t.amount,
    due_date: t.dueDate,
    payment_date: t.paymentDate || null,
    status: t.status,
    category: t.category,
    recipient_or_payer: t.recipientOrPayer,
    receipt_url: t.receiptUrl || null
  };
}

// ==========================================
// SEEDING AUTOMÁTICO SE A BASE ESTIVER VAZIA
// ==========================================

export async function seedSupabaseIfEmpty(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { data: existingUsers } = await supabase.from('users').select('id').limit(1);
    if (existingUsers && existingUsers.length > 0) {
      return true; // Já possui dados cadastrados
    }

    console.log('Populando dados iniciais no Supabase PostgreSQL...');

    // 1. Users
    await supabase.from('users').upsert(initialUsers.map(mapUserToDb));
    // 2. Artists
    await supabase.from('artists').upsert(initialArtists.map(mapArtistToDb));
    // 3. Contractors
    await supabase.from('contractors').upsert(initialContractors.map(mapContractorToDb));
    // 4. Venues
    await supabase.from('venues').upsert(initialVenues.map(mapVenueToDb));
    // 5. Events
    await supabase.from('events').upsert(initialEvents.map(mapEventToDb));
    // 6. Documents
    await supabase.from('event_documents').upsert(initialDocuments.map(mapDocumentToDb));
    // 7. Timeline
    await supabase.from('timeline_items').upsert(initialTimeline.map(mapTimelineToDb));
    // 8. Checklist
    await supabase.from('checklist_items').upsert(initialChecklist.map(mapChecklistToDb));
    // 9. TimeLogs
    await supabase.from('time_logs').upsert(initialTimeLogs.map(mapTimeLogToDb));
    // 10. Financial Transactions
    await supabase.from('financial_transactions').upsert(initialTransactions.map(mapTransactionToDb));

    console.log('Base Supabase populada com sucesso!');
    return true;
  } catch (err) {
    console.warn('Falha no seed inicial do Supabase:', err);
    return false;
  }
}

// ==========================================
// CARREGAMENTO COMPLETO DE DADOS DO BANCO
// ==========================================

export async function fetchFullDataFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    await seedSupabaseIfEmpty();

    const [
      { data: u },
      { data: a },
      { data: c },
      { data: v },
      { data: e },
      { data: d },
      { data: tl },
      { data: cl },
      { data: lg },
      { data: tx }
    ] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('artists').select('*').order('name'),
      supabase.from('contractors').select('*').order('name'),
      supabase.from('venues').select('*').order('name'),
      supabase.from('events').select('*').order('date', { ascending: false }),
      supabase.from('event_documents').select('*'),
      supabase.from('timeline_items').select('*').order('time'),
      supabase.from('checklist_items').select('*'),
      supabase.from('time_logs').select('*').order('date', { ascending: false }),
      supabase.from('financial_transactions').select('*').order('due_date', { ascending: false })
    ]);

    return {
      users: (u || []).map(mapUserFromDb),
      artists: (a || []).map(mapArtistFromDb),
      contractors: (c || []).map(mapContractorFromDb),
      venues: (v || []).map(mapVenueFromDb),
      events: (e || []).map(mapEventFromDb),
      documents: (d || []).map(mapDocumentFromDb),
      timeline: (tl || []).map(mapTimelineFromDb),
      checklist: (cl || []).map(mapChecklistFromDb),
      timeLogs: (lg || []).map(mapTimeLogFromDb),
      transactions: (tx || []).map(mapTransactionFromDb)
    };
  } catch (err) {
    console.warn('Erro ao carregar do Supabase:', err);
    return null;
  }
}

// ==========================================
// OPERAÇÕES DE MUTAÇÃO EM TEMPO REAL NO SUPABASE
// ==========================================

export async function syncArtistToDb(artist: Artist) {
  if (!supabase) return;
  await supabase.from('artists').upsert(mapArtistToDb(artist));
}

export async function deleteArtistFromDb(id: string) {
  if (!supabase) return;
  await supabase.from('artists').delete().eq('id', id);
}

export async function syncContractorToDb(contractor: Contractor) {
  if (!supabase) return;
  await supabase.from('contractors').upsert(mapContractorToDb(contractor));
}

export async function deleteContractorFromDb(id: string) {
  if (!supabase) return;
  await supabase.from('contractors').delete().eq('id', id);
}

export async function syncVenueToDb(venue: Venue) {
  if (!supabase) return;
  await supabase.from('venues').upsert(mapVenueToDb(venue));
}

export async function deleteVenueFromDb(id: string) {
  if (!supabase) return;
  await supabase.from('venues').delete().eq('id', id);
}

export async function syncEventToDb(event: EventItem) {
  if (!supabase) return;
  await supabase.from('events').upsert(mapEventToDb(event));
}

export async function deleteEventFromDb(id: string) {
  if (!supabase) return;
  await supabase.from('events').delete().eq('id', id);
}

export async function syncDocumentToDb(doc: EventDocument) {
  if (!supabase) return;
  await supabase.from('event_documents').upsert(mapDocumentToDb(doc));
}

export async function syncTimelineItemToDb(item: TimelineItem) {
  if (!supabase) return;
  await supabase.from('timeline_items').upsert(mapTimelineToDb(item));
}

export async function deleteTimelineItemFromDb(id: string) {
  if (!supabase) return;
  await supabase.from('timeline_items').delete().eq('id', id);
}

export async function syncChecklistItemToDb(item: ChecklistItem) {
  if (!supabase) return;
  await supabase.from('checklist_items').upsert(mapChecklistToDb(item));
}

export async function deleteChecklistItemFromDb(id: string) {
  if (!supabase) return;
  await supabase.from('checklist_items').delete().eq('id', id);
}

export async function syncTimeLogToDb(log: TimeLog) {
  if (!supabase) return;
  await supabase.from('time_logs').upsert(mapTimeLogToDb(log));
}

export async function deleteTimeLogFromDb(id: string) {
  if (!supabase) return;
  await supabase.from('time_logs').delete().eq('id', id);
}

export async function syncTransactionToDb(tx: FinancialTransaction) {
  if (!supabase) return;
  await supabase.from('financial_transactions').upsert(mapTransactionToDb(tx));
}

export async function deleteTransactionFromDb(id: string) {
  if (!supabase) return;
  await supabase.from('financial_transactions').delete().eq('id', id);
}

export async function syncUserToDb(user: User) {
  if (!supabase) return;
  await supabase.from('users').upsert(mapUserToDb(user));
}
