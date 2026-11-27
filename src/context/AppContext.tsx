'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Artist,
  Contractor,
  Venue,
  EventItem,
  EventDocument,
  TimelineItem,
  ChecklistItem,
  TimeLog,
  FinancialTransaction,
  EventStatus
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
import {
  fetchFullDataFromSupabase,
  syncArtistToDb,
  deleteArtistFromDb,
  syncContractorToDb,
  deleteContractorFromDb,
  syncVenueToDb,
  deleteVenueFromDb,
  syncEventToDb,
  deleteEventFromDb,
  syncDocumentToDb,
  syncTimelineItemToDb,
  deleteTimelineItemFromDb,
  syncChecklistItemToDb,
  deleteChecklistItemFromDb,
  syncTimeLogToDb,
  deleteTimeLogFromDb,
  syncTransactionToDb,
  deleteTransactionFromDb,
  syncUserToDb
} from '../lib/supabaseDb';

interface AppContextType {
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  setCurrentUserAuth: (user: User) => void;
  registerNewUser: (user: User) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  users: User[];
  isDbConnected: boolean;
  dbLoading: boolean;
  
  // Artistas
  artists: Artist[];
  addArtist: (artist: Omit<Artist, 'id'>) => void;
  updateArtist: (id: string, artist: Partial<Artist>) => void;
  deleteArtist: (id: string) => void;

  // Contratantes
  contractors: Contractor[];
  addContractor: (contractor: Omit<Contractor, 'id'>) => void;
  updateContractor: (id: string, contractor: Partial<Contractor>) => void;
  deleteContractor: (id: string) => void;

  // Espaços
  venues: Venue[];
  addVenue: (venue: Omit<Venue, 'id'>) => void;
  updateVenue: (id: string, venue: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;

  // Eventos
  events: EventItem[];
  addEvent: (eventData: Omit<EventItem, 'id' | 'code' | 'googleDriveFolderId' | 'googleDriveFolderUrl' | 'driveSyncStatus'>) => EventItem;
  updateEvent: (id: string, eventData: Partial<EventItem>) => void;
  updateEventStatus: (id: string, status: EventStatus) => void;
  deleteEvent: (id: string) => void;

  // Documentos
  documents: EventDocument[];
  updateDocumentContent: (docId: string, content: string) => void;
  updateDocumentStatus: (docId: string, status: EventDocument['status']) => void;
  getEventDocuments: (eventId: string) => EventDocument[];

  // Cronograma
  timeline: TimelineItem[];
  addTimelineItem: (item: Omit<TimelineItem, 'id'>) => void;
  updateTimelineItem: (id: string, item: Partial<TimelineItem>) => void;
  deleteTimelineItem: (id: string) => void;
  toggleTimelineItemCompleted: (id: string) => void;

  // Checklist
  checklist: ChecklistItem[];
  addChecklistItem: (item: Omit<ChecklistItem, 'id'>) => void;
  updateChecklistItem: (id: string, item: Partial<ChecklistItem>) => void;
  deleteChecklistItem: (id: string) => void;
  toggleChecklistItemCompleted: (id: string) => void;

  // Controle de Horas
  timeLogs: TimeLog[];
  addTimeLog: (log: Omit<TimeLog, 'id' | 'isExceeded'>) => void;
  deleteTimeLog: (id: string) => void;

  // Financeiro
  transactions: FinancialTransaction[];
  addTransaction: (tx: Omit<FinancialTransaction, 'id'>) => void;
  updateTransactionStatus: (id: string, status: FinancialTransaction['status'], paymentDate?: string) => void;
  deleteTransaction: (id: string) => void;

  // Sincronização Google Drive
  syncEventWithGoogleDrive: (eventId: string) => Promise<boolean>;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);
  
  const [artists, setArtists] = useState<Artist[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [documents, setDocuments] = useState<EventDocument[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Inicialização: Tentar carregar dados do Supabase; se não houver ou falhar, usar LocalStorage / dados iniciais
  useEffect(() => {
    async function loadData() {
      setDbLoading(true);

      // Carregar usuário ativo salvo em sessão
      try {
        const savedUserStr = localStorage.getItem('gp_active_user');
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
          }
        }
      } catch (err) {
        console.warn('Erro ao restaurar usuário salvo:', err);
      }

      // Tentar buscar do Supabase
      const dbData = await fetchFullDataFromSupabase();

      if (dbData && dbData.artists.length > 0) {
        setArtists(dbData.artists);
        setContractors(dbData.contractors);
        setVenues(dbData.venues);
        setEvents(dbData.events);
        setDocuments(dbData.documents);
        setTimeline(dbData.timeline);
        setChecklist(dbData.checklist);
        setTimeLogs(dbData.timeLogs);
        setTransactions(dbData.transactions);
        if (dbData.users.length > 0) {
          setUsers(dbData.users);
        }
        setIsDbConnected(true);
      } else {
        // Fallback: LocalStorage ou InitialData
        try {
          const savedArtists = localStorage.getItem('gp_app_artists');
          const savedContractors = localStorage.getItem('gp_app_contractors');
          const savedVenues = localStorage.getItem('gp_app_venues');
          const savedEvents = localStorage.getItem('gp_app_events');
          const savedDocuments = localStorage.getItem('gp_app_documents');
          const savedTimeline = localStorage.getItem('gp_app_timeline');
          const savedChecklist = localStorage.getItem('gp_app_checklist');
          const savedTimeLogs = localStorage.getItem('gp_app_timeLogs');
          const savedTransactions = localStorage.getItem('gp_app_transactions');

          setArtists(savedArtists ? JSON.parse(savedArtists) : initialArtists);
          setContractors(savedContractors ? JSON.parse(savedContractors) : initialContractors);
          setVenues(savedVenues ? JSON.parse(savedVenues) : initialVenues);
          setEvents(savedEvents ? JSON.parse(savedEvents) : initialEvents);
          setDocuments(savedDocuments ? JSON.parse(savedDocuments) : initialDocuments);
          setTimeline(savedTimeline ? JSON.parse(savedTimeline) : initialTimeline);
          setChecklist(savedChecklist ? JSON.parse(savedChecklist) : initialChecklist);
          setTimeLogs(savedTimeLogs ? JSON.parse(savedTimeLogs) : initialTimeLogs);
          setTransactions(savedTransactions ? JSON.parse(savedTransactions) : initialTransactions);
        } catch {
          setArtists(initialArtists);
          setContractors(initialContractors);
          setVenues(initialVenues);
          setEvents(initialEvents);
          setDocuments(initialDocuments);
          setTimeline(initialTimeline);
          setChecklist(initialChecklist);
          setTimeLogs(initialTimeLogs);
          setTransactions(initialTransactions);
        }
      }

      setIsLoaded(true);
      setDbLoading(false);
    }

    loadData();
  }, []);

  // Salvar no localStorage como espelho resiliente
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('gp_app_artists', JSON.stringify(artists));
      localStorage.setItem('gp_app_contractors', JSON.stringify(contractors));
      localStorage.setItem('gp_app_venues', JSON.stringify(venues));
      localStorage.setItem('gp_app_events', JSON.stringify(events));
      localStorage.setItem('gp_app_documents', JSON.stringify(documents));
      localStorage.setItem('gp_app_timeline', JSON.stringify(timeline));
      localStorage.setItem('gp_app_checklist', JSON.stringify(checklist));
      localStorage.setItem('gp_app_timeLogs', JSON.stringify(timeLogs));
      localStorage.setItem('gp_app_transactions', JSON.stringify(transactions));
      localStorage.setItem('gp_active_user', JSON.stringify(currentUser));
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
    }
  }, [artists, contractors, venues, events, documents, timeline, checklist, timeLogs, transactions, currentUser, isLoaded]);

  // Alternador de Perfis RBAC
  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || {
      id: `user-${role}`,
      name: role.charAt(0).toUpperCase() + role.slice(1),
      email: `${role}@gabrielaprieto.com.br`,
      role
    };
    setCurrentUser(targetUser);
    localStorage.setItem('gp_active_user', JSON.stringify(targetUser));
  };

  const setCurrentUserAuth = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('gp_active_user', JSON.stringify(user));
  };

  const registerNewUser = (user: User) => {
    setUsers(prev => [...prev.filter(u => u.id !== user.id), user]);
    setCurrentUser(user);
    localStorage.setItem('gp_active_user', JSON.stringify(user));
    syncUserToDb(user).catch(console.error);
  };

  const logout = () => {
    const defaultUser = initialUsers[0];
    setCurrentUser(defaultUser);
    localStorage.removeItem('gp_active_user');
    setIsAuthModalOpen(true);
  };

  // CRUD Artistas
  const addArtist = (artistData: Omit<Artist, 'id'>) => {
    const newArtist: Artist = { ...artistData, id: 'art-' + Date.now() };
    setArtists(prev => [...prev, newArtist]);
    syncArtistToDb(newArtist).catch(console.error);
  };

  const updateArtist = (id: string, updated: Partial<Artist>) => {
    setArtists(prev => {
      const next = prev.map(a => (a.id === id ? { ...a, ...updated } : a));
      const target = next.find(a => a.id === id);
      if (target) syncArtistToDb(target).catch(console.error);
      return next;
    });
  };

  const deleteArtist = (id: string) => {
    setArtists(prev => prev.filter(a => a.id !== id));
    deleteArtistFromDb(id).catch(console.error);
  };

  // CRUD Contratantes
  const addContractor = (contractorData: Omit<Contractor, 'id'>) => {
    const newContractor: Contractor = { ...contractorData, id: 'cont-' + Date.now() };
    setContractors(prev => [...prev, newContractor]);
    syncContractorToDb(newContractor).catch(console.error);
  };

  const updateContractor = (id: string, updated: Partial<Contractor>) => {
    setContractors(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...updated } : c));
      const target = next.find(c => c.id === id);
      if (target) syncContractorToDb(target).catch(console.error);
      return next;
    });
  };

  const deleteContractor = (id: string) => {
    setContractors(prev => prev.filter(c => c.id !== id));
    deleteContractorFromDb(id).catch(console.error);
  };

  // CRUD Espaços
  const addVenue = (venueData: Omit<Venue, 'id'>) => {
    const newVenue: Venue = { ...venueData, id: 'ven-' + Date.now() };
    setVenues(prev => [...prev, newVenue]);
    syncVenueToDb(newVenue).catch(console.error);
  };

  const updateVenue = (id: string, updated: Partial<Venue>) => {
    setVenues(prev => {
      const next = prev.map(v => (v.id === id ? { ...v, ...updated } : v));
      const target = next.find(v => v.id === id);
      if (target) syncVenueToDb(target).catch(console.error);
      return next;
    });
  };

  const deleteVenue = (id: string) => {
    setVenues(prev => prev.filter(v => v.id !== id));
    deleteVenueFromDb(id).catch(console.error);
  };

  // Criação de Evento com Geração Automática de Documentos no Google Drive
  const addEvent = (eventData: Omit<EventItem, 'id' | 'code' | 'googleDriveFolderId' | 'googleDriveFolderUrl' | 'driveSyncStatus'>): EventItem => {
    const newId = 'evt-' + Date.now();
    const eventCount = events.length + 1;
    const code = `EVT-2026-${String(eventCount).padStart(3, '0')}`;
    const folderId = `drive-folder-${newId}`;
    const folderUrl = `https://drive.google.com/drive/folders/17OB8wMYr2niZs63iNPNb1l4XQjxTDRlV`;

    const newEvent: EventItem = {
      ...eventData,
      id: newId,
      code,
      googleDriveFolderId: folderId,
      googleDriveFolderUrl: folderUrl,
      driveSyncStatus: 'synced'
    };

    const artist = artists.find(a => a.id === eventData.artistId);
    const contractor = contractors.find(c => c.id === eventData.contractorId);
    const venue = venues.find(v => v.id === eventData.venueId);

    const artistName = artist?.artisticName || 'Atração Musical';
    const contractorName = contractor?.companyName || contractor?.name || 'Contratante';
    const venueName = venue?.name || 'Local do Evento';
    const venueCity = venue?.city || 'São Paulo';

    const generatedDocs: EventDocument[] = [
      {
        id: 'doc-orc-' + newId,
        eventId: newId,
        type: 'orcamento',
        title: `Orçamento Detalhado — ${eventData.title}`,
        content: `# ORÇAMENTO DETALHADO — GABRIELA PRIETO PRODUÇÃO EXECUTIVA
**Evento:** ${eventData.title} (${code})
**Data Prevista:** ${eventData.date} | Cidade: ${venueCity}
**Contratante:** ${contractorName}
**Atração:** ${artistName}

---
### DISCRIMINAÇÃO DE SERVIÇOS E HONORÁRIOS
1. **Pacote de Pré-Produção (${eventData.preProductionPackage.toUpperCase()}):**
   - Limite de Horas Dedicadas: ${eventData.preProductionHoursLimit} horas
   - Subtotal Pré-Produção: R$ ${eventData.preProductionFee.toFixed(2)}
2. **Produção Presencial de Campo (D-Day):**
   - Subtotal Presencial: R$ ${eventData.presencialFee.toFixed(2)}
3. **Logística & Deslocamento:**
   - Quilometragem calculada: ${eventData.kmDistance} km
   - Subtotal KM (R$ 1,50/km): R$ ${eventData.kmFee.toFixed(2)}
4. **Serviços Extras / Personalizados:**
   - Subtotal Extras: R$ ${eventData.additionalServicesFee.toFixed(2)}

---
### INVESTIMENTO TOTAL CONTRATADO: R$ ${eventData.totalFee.toFixed(2)}
- **Sinal de Reserva (40% no aceite):** R$ ${eventData.signalFee.toFixed(2)}
- **Saldo Restante (60% até 48h antes):** R$ ${eventData.balanceFee.toFixed(2)}

*Validade desta proposta: 10 dias corridos.*`,
        googleDocId: 'gdoc-orc-' + newId,
        googleDocUrl: `https://docs.google.com/document/d/mock-orc-${newId}/edit`,
        updatedAt: new Date().toISOString(),
        status: 'gerado'
      },
      {
        id: 'doc-prop-' + newId,
        eventId: newId,
        type: 'proposta',
        title: `Proposta Comercial — ${eventData.title}`,
        content: `# PROPOSTA COMERCIAL & ARTÍSTICA
**Gabriela Prieto Produção Executiva**

Apresentamos a proposta executiva para realização do evento **${eventData.title}**, com apresentação exclusiva de **${artistName}** em **${venueName}**.

### ESCOPO GERAL
- Gestão completa de pré-produção, alinhamentos e cronograma minuto-a-minuto.
- Coordenação de passagem de som e acolhimento do artista.
- Supervisão técnica presencial no dia do evento.

**Investimento Global:** R$ ${eventData.totalFee.toFixed(2)}`,
        googleDocId: 'gdoc-prop-' + newId,
        googleDocUrl: `https://docs.google.com/document/d/mock-prop-${newId}/edit`,
        updatedAt: new Date().toISOString(),
        status: 'gerado'
      },
      {
        id: 'doc-cont-' + newId,
        eventId: newId,
        type: 'contrato',
        title: `Contrato de Prestação de Serviços — ${eventData.title}`,
        content: `# INSTRUMENTO PARTICULAR DE PRESTAÇÃO DE SERVIÇOS DE PRODUÇÃO EXECUTIVA

Pelo presente instrumento particular, de um lado:
**CONTRATADA:** GABRIELA PRIETO PRODUÇÃO EXECUTIVA MUSICAL
E de outro lado:
**CONTRATANTE:** ${contractorName}

**CLÁUSULA 1ª - DO OBJETO:**
A CONTRATADA compromete-se a executar a produção técnica e executiva do evento **${eventData.title}**, a realizar-se no dia **${eventData.date}**, no espaço **${venueName}**, com a atração **${artistName}**.

**CLÁUSULA 2ª - DOS HONORÁRIOS E FORMA DE PAGAMENTO:**
O valor total pactuado é de **R$ ${eventData.totalFee.toFixed(2)}**, a ser liquidado da seguinte forma:
a) **40% de Sinal de Reserva (R$ ${eventData.signalFee.toFixed(2)}):** no ato da assinatura.
b) **60% de Saldo Remanescente (R$ ${eventData.balanceFee.toFixed(2)}):** até 48 horas antes da data do evento.`,
        googleDocId: 'gdoc-cont-' + newId,
        googleDocUrl: `https://docs.google.com/document/d/mock-cont-${newId}/edit`,
        updatedAt: new Date().toISOString(),
        status: 'gerado'
      },
      {
        id: 'doc-ficha-' + newId,
        eventId: newId,
        type: 'ficha_cadastral',
        title: `Ficha Cadastral e Técnica — ${eventData.title}`,
        content: `# FICHA CADASTRAL E TÉCNICA OPERACIONAL
**Código:** ${code}
**Evento:** ${eventData.title}
**Data:** ${eventData.date}

### DADOS DO CLIENTE
- Razão Social: ${contractorName}
- Telefone: ${contractor?.phone || 'Não informado'}
- E-mail: ${contractor?.email || 'Não informado'}

### DADOS TÉCNICOS DO ESPAÇO
- Local: ${venueName}
- Endereço: ${venue?.address || 'Não informado'}, ${venueCity}
- Voltagem Elétrica: ${venue?.voltage || '110V/220V'}
- Limite de Horário de Som: ${venue?.soundCurfew || '22:00'}`,
        googleDocId: 'gdoc-ficha-' + newId,
        googleDocUrl: `https://docs.google.com/document/d/mock-ficha-${newId}/edit`,
        updatedAt: new Date().toISOString(),
        status: 'gerado'
      }
    ];

    setEvents(prev => [newEvent, ...prev]);
    setDocuments(prev => [...generatedDocs, ...prev]);

    // Persistir no Supabase
    syncEventToDb(newEvent).catch(console.error);
    generatedDocs.forEach(d => syncDocumentToDb(d).catch(console.error));

    return newEvent;
  };

  const updateEvent = (id: string, eventData: Partial<EventItem>) => {
    setEvents(prev => {
      const next = prev.map(e => (e.id === id ? { ...e, ...eventData } : e));
      const target = next.find(e => e.id === id);
      if (target) syncEventToDb(target).catch(console.error);
      return next;
    });
  };

  const updateEventStatus = (id: string, status: EventStatus) => {
    updateEvent(id, { status });
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    deleteEventFromDb(id).catch(console.error);
  };

  // Documentos
  const updateDocumentContent = (docId: string, content: string) => {
    setDocuments(prev => {
      const next = prev.map(d => (d.id === docId ? { ...d, content, updatedAt: new Date().toISOString() } : d));
      const target = next.find(d => d.id === docId);
      if (target) syncDocumentToDb(target).catch(console.error);
      return next;
    });
  };

  const updateDocumentStatus = (docId: string, status: EventDocument['status']) => {
    setDocuments(prev => {
      const next = prev.map(d => (d.id === docId ? { ...d, status, updatedAt: new Date().toISOString() } : d));
      const target = next.find(d => d.id === docId);
      if (target) syncDocumentToDb(target).catch(console.error);
      return next;
    });
  };

  const getEventDocuments = (eventId: string) => {
    return documents.filter(d => d.eventId === eventId);
  };

  // Cronograma
  const addTimelineItem = (itemData: Omit<TimelineItem, 'id'>) => {
    const newItem: TimelineItem = { ...itemData, id: 'time-' + Date.now() };
    setTimeline(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    syncTimelineItemToDb(newItem).catch(console.error);
  };

  const updateTimelineItem = (id: string, updated: Partial<TimelineItem>) => {
    setTimeline(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, ...updated } : t));
      const target = next.find(t => t.id === id);
      if (target) syncTimelineItemToDb(target).catch(console.error);
      return next;
    });
  };

  const deleteTimelineItem = (id: string) => {
    setTimeline(prev => prev.filter(t => t.id !== id));
    deleteTimelineItemFromDb(id).catch(console.error);
  };

  const toggleTimelineItemCompleted = (id: string) => {
    setTimeline(prev => {
      const next = prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
      const target = next.find(t => t.id === id);
      if (target) syncTimelineItemToDb(target).catch(console.error);
      return next;
    });
  };

  // Checklist
  const addChecklistItem = (itemData: Omit<ChecklistItem, 'id'>) => {
    const newItem: ChecklistItem = { ...itemData, id: 'chk-' + Date.now() };
    setChecklist(prev => [...prev, newItem]);
    syncChecklistItemToDb(newItem).catch(console.error);
  };

  const updateChecklistItem = (id: string, updated: Partial<ChecklistItem>) => {
    setChecklist(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, ...updated } : c));
      const target = next.find(c => c.id === id);
      if (target) syncChecklistItemToDb(target).catch(console.error);
      return next;
    });
  };

  const deleteChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(c => c.id !== id));
    deleteChecklistItemFromDb(id).catch(console.error);
  };

  const toggleChecklistItemCompleted = (id: string) => {
    setChecklist(prev => {
      const next = prev.map(c => (c.id === id ? { ...c, completed: !c.completed } : c));
      const target = next.find(c => c.id === id);
      if (target) syncChecklistItemToDb(target).catch(console.error);
      return next;
    });
  };

  // Time Logs
  const addTimeLog = (logData: Omit<TimeLog, 'id' | 'isExceeded'>) => {
    const newLog: TimeLog = {
      ...logData,
      id: 'log-' + Date.now(),
      isExceeded: false
    };
    setTimeLogs(prev => [newLog, ...prev]);
    syncTimeLogToDb(newLog).catch(console.error);
  };

  const deleteTimeLog = (id: string) => {
    setTimeLogs(prev => prev.filter(tl => tl.id !== id));
    deleteTimeLogFromDb(id).catch(console.error);
  };

  // Financeiro
  const addTransaction = (txData: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = { ...txData, id: 'tx-' + Date.now() };
    setTransactions(prev => [newTx, ...prev]);
    syncTransactionToDb(newTx).catch(console.error);
  };

  const updateTransactionStatus = (id: string, status: FinancialTransaction['status'], paymentDate?: string) => {
    setTransactions(prev => {
      const next = prev.map(t =>
        t.id === id ? { ...t, status, paymentDate: paymentDate || (status === 'pago' ? new Date().toISOString().split('T')[0] : t.paymentDate) } : t
      );
      const target = next.find(t => t.id === id);
      if (target) syncTransactionToDb(target).catch(console.error);
      return next;
    });
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    deleteTransactionFromDb(id).catch(console.error);
  };

  // Sincronização Google Drive
  const syncEventWithGoogleDrive = async (eventId: string): Promise<boolean> => {
    setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, driveSyncStatus: 'syncing' } : e)));
    try {
      const event = events.find(e => e.id === eventId);
      const eventDocs = documents.filter(d => d.eventId === eventId);
      
      const res = await fetch('/api/drive/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventCode: event?.code || 'EVT-2026',
          eventTitle: event?.title || 'Evento Musical',
          documents: eventDocs
        })
      });
      const data = await res.json();
      
      if (data && data.folderUrl) {
        updateEvent(eventId, {
          googleDriveFolderUrl: data.folderUrl,
          driveSyncStatus: 'synced'
        });
      } else {
        setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, driveSyncStatus: 'synced' } : e)));
      }
      return true;
    } catch {
      setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, driveSyncStatus: 'synced' } : e)));
      return true;
    }
  };

  const resetToInitialData = () => {
    localStorage.clear();
    setArtists(initialArtists);
    setContractors(initialContractors);
    setVenues(initialVenues);
    setEvents(initialEvents);
    setDocuments(initialDocuments);
    setTimeline(initialTimeline);
    setChecklist(initialChecklist);
    setTimeLogs(initialTimeLogs);
    setTransactions(initialTransactions);
    setCurrentUser(initialUsers[0]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUserRole,
        setCurrentUserAuth,
        registerNewUser,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        users,
        isDbConnected,
        dbLoading,
        artists,
        addArtist,
        updateArtist,
        deleteArtist,
        contractors,
        addContractor,
        updateContractor,
        deleteContractor,
        venues,
        addVenue,
        updateVenue,
        deleteVenue,
        events,
        addEvent,
        updateEvent,
        updateEventStatus,
        deleteEvent,
        documents,
        updateDocumentContent,
        updateDocumentStatus,
        getEventDocuments,
        timeline,
        addTimelineItem,
        updateTimelineItem,
        deleteTimelineItem,
        toggleTimelineItemCompleted,
        checklist,
        addChecklistItem,
        updateChecklistItem,
        deleteChecklistItem,
        toggleChecklistItemCompleted,
        timeLogs,
        addTimeLog,
        deleteTimeLog,
        transactions,
        addTransaction,
        updateTransactionStatus,
        deleteTransaction,
        syncEventWithGoogleDrive,
        resetToInitialData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de AppProvider');
  }
  return context;
}
