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

interface AppContextType {
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  users: User[];
  
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
  const [users] = useState<User[]>(initialUsers);
  
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

  // Carregar dados salvos no localStorage ou usar dados iniciais
  useEffect(() => {
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
    setIsLoaded(true);
  }, []);

  // Salvar no localStorage sempre que houver alteração
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
    } catch (e) {
      console.error('Erro ao salvar no localStorage', e);
    }
  }, [artists, contractors, venues, events, documents, timeline, checklist, timeLogs, transactions, isLoaded]);

  // Alternador de Perfis RBAC
  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(targetUser);
  };

  // CRUD Artistas
  const addArtist = (artistData: Omit<Artist, 'id'>) => {
    const newArtist: Artist = { ...artistData, id: 'art-' + Date.now() };
    setArtists(prev => [...prev, newArtist]);
  };
  const updateArtist = (id: string, updated: Partial<Artist>) => {
    setArtists(prev => prev.map(a => (a.id === id ? { ...a, ...updated } : a)));
  };
  const deleteArtist = (id: string) => {
    setArtists(prev => prev.filter(a => a.id !== id));
  };

  // CRUD Contratantes
  const addContractor = (contractorData: Omit<Contractor, 'id'>) => {
    const newContractor: Contractor = { ...contractorData, id: 'cont-' + Date.now() };
    setContractors(prev => [...prev, newContractor]);
  };
  const updateContractor = (id: string, updated: Partial<Contractor>) => {
    setContractors(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };
  const deleteContractor = (id: string) => {
    setContractors(prev => prev.filter(c => c.id !== id));
  };

  // CRUD Espaços
  const addVenue = (venueData: Omit<Venue, 'id'>) => {
    const newVenue: Venue = { ...venueData, id: 'ven-' + Date.now() };
    setVenues(prev => [...prev, newVenue]);
  };
  const updateVenue = (id: string, updated: Partial<Venue>) => {
    setVenues(prev => prev.map(v => (v.id === id ? { ...v, ...updated } : v)));
  };
  const deleteVenue = (id: string) => {
    setVenues(prev => prev.filter(v => v.id !== id));
  };

  // Criação de Evento com Geração Automática de Documentos no Google Drive
  const addEvent = (eventData: Omit<EventItem, 'id' | 'code' | 'googleDriveFolderId' | 'googleDriveFolderUrl' | 'driveSyncStatus'>): EventItem => {
    const newId = 'evt-' + Date.now();
    const eventCount = events.length + 1;
    const code = `EVT-2026-${String(eventCount).padStart(3, '0')}`;
    const folderId = `drive-folder-${newId}`;
    const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

    const newEvent: EventItem = {
      ...eventData,
      id: newId,
      code,
      googleDriveFolderId: folderId,
      googleDriveFolderUrl: folderUrl,
      driveSyncStatus: 'synced'
    };

    // Buscar dados associados para popular os documentos automaticamente
    const artist = artists.find(a => a.id === eventData.artistId);
    const contractor = contractors.find(c => c.id === eventData.contractorId);
    const venue = venues.find(v => v.id === eventData.venueId);

    const artistName = artist?.artisticName || 'Atração Musical';
    const contractorName = contractor?.companyName || contractor?.name || 'Contratante';
    const venueName = venue?.name || 'Local do Evento';
    const venueCity = venue?.city || 'São Paulo';

    // Gerar os 4 artefatos padrões do PRD
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

### COMPOSIÇÃO DE CUSTOS E HONORÁRIOS:
* **Pré-Produção Executiva:** R$ ${eventData.preProductionFee.toFixed(2)} (Limite: ${eventData.preProductionHoursLimit}h)
* **Produção Presencial in loco:** R$ ${eventData.presencialFee.toFixed(2)}
* **Deslocamento com Veículo Próprio:** ${eventData.kmDistance} km x R$ 1,50/km = R$ ${eventData.kmFee.toFixed(2)}
* **Serviços Adicionais:** R$ ${eventData.additionalServicesFee.toFixed(2)}

**INVESTIMENTO TOTAL:** R$ ${eventData.totalFee.toFixed(2)}
* Sinal de Reserva de Data (40%): R$ ${eventData.signalFee.toFixed(2)} (Garante a agenda)
* Saldo Final (60%): R$ ${eventData.balanceFee.toFixed(2)} (Quitado em até 24h antes do evento)`,
        googleDocId: `gdoc-orc-${newId}`,
        googleDocUrl: `https://docs.google.com/document/d/orc-${newId}`,
        updatedAt: new Date().toISOString(),
        status: 'gerado'
      },
      {
        id: 'doc-prop-' + newId,
        eventId: newId,
        type: 'proposta',
        title: `Proposta Comercial — ${eventData.title}`,
        content: `# PROPOSTA COMERCIAL & ESCOPO OPERACIONAL
**GABRIELA PRIETO | PRODUÇÃO EXECUTIVA MUSICAL**
*Ideias que acontecem.*

**Proposta Ref:** ${code}
**Cliente:** ${contractorName}
**Projeto:** ${eventData.title}

---

### ESCOPO DOS SERVIÇOS
* **Pré-Produção (${eventData.preProductionPackage.toUpperCase()}):** Alinhamentos técnicos, canalização de palco e cronograma minuto a minuto.
* **Coordenação Presencial:** Acompanhamento de montagem (${eventData.startTime}), passagem de som (${eventData.soundcheckTime}) e apresentação (${eventData.showTime} às ${eventData.endTime}).
* **Condições Comerciais:** Total de R$ ${eventData.totalFee.toFixed(2)} com 40% de sinal de reserva.`,
        googleDocId: `gdoc-prop-${newId}`,
        googleDocUrl: `https://docs.google.com/document/d/prop-${newId}`,
        updatedAt: new Date().toISOString(),
        status: 'gerado'
      },
      {
        id: 'doc-cont-' + newId,
        eventId: newId,
        type: 'contrato',
        title: `Contrato de Prestação de Serviços — ${eventData.title}`,
        content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PRODUÇÃO EXECUTIVA
**CONTRATADA:** Gabriela Prieto Produções
**CONTRATANTE:** ${contractorName}

---

1. **Objeto:** Produção Executiva do evento ${eventData.title} em ${eventData.date}.
2. **Proteção de Escopo (Spec 1):** Franquia de até ${eventData.preProductionHoursLimit}h de pré-produção. Horas excedentes cobradas a R$ 70,00/h.
3. **Deslocamento (Spec 2):** R$ 1,50/km rodado + 100% de pedágios e estacionamentos mediante comprovante fiscal.
4. **Reserva de Data (Spec 3):** Confirmação condicionada ao pagamento do sinal de 40% (R$ ${eventData.signalFee.toFixed(2)}).`,
        googleDocId: `gdoc-cont-${newId}`,
        googleDocUrl: `https://docs.google.com/document/d/cont-${newId}`,
        updatedAt: new Date().toISOString(),
        status: 'gerado'
      },
      {
        id: 'doc-ficha-' + newId,
        eventId: newId,
        type: 'ficha_cadastral',
        title: `Ficha Cadastral Técnica — ${eventData.title}`,
        content: `# FICHA CADASTRAL TÉCNICA E OPERACIONAL
**Código:** ${code}
**Título do Evento:** ${eventData.title}
**Data:** ${eventData.date}

* **Espaço:** ${venueName}
* **Endereço:** ${venue?.address || ''}, ${venueCity}
* **Contratante:** ${contractorName} | Telefone: ${contractor?.phone || ''}
* **Atração Musical:** ${artistName}
* **Horários:** Montagem ${eventData.startTime} | Passagem de Som ${eventData.soundcheckTime} | Show ${eventData.showTime} | Fim ${eventData.endTime}`,
        googleDocId: `gdoc-ficha-${newId}`,
        googleDocUrl: `https://docs.google.com/document/d/ficha-${newId}`,
        updatedAt: new Date().toISOString(),
        status: 'gerado'
      }
    ];

    // Gerar Checklist Padrão
    const defaultChecklists: ChecklistItem[] = [
      { id: 'chk-1-' + newId, eventId: newId, phase: 'D-30', task: 'Assinatura da Proposta e Confirmação de Sinal (40%)', responsible: 'Financeiro', deadline: eventData.date, completed: false },
      { id: 'chk-2-' + newId, eventId: newId, phase: 'D-14', task: 'Coleta e validação de Rider Técnico com o Artista', responsible: 'Gabriela Prieto', deadline: eventData.date, completed: false },
      { id: 'chk-3-' + newId, eventId: newId, phase: 'D-2', task: 'Validação de horários com Espaço e Banda', responsible: 'Gabriela Prieto', deadline: eventData.date, completed: false },
      { id: 'chk-4-' + newId, eventId: newId, phase: 'D-Day', task: 'Acompanhar montagem, passagem de som e show in loco', responsible: 'Gabriela Prieto', deadline: eventData.date, completed: false },
      { id: 'chk-5-' + newId, eventId: newId, phase: 'Pos', task: 'Envio de prestação de contas de deslocamento', responsible: 'Gabriela Prieto', deadline: eventData.date, completed: false }
    ];

    // Gerar Lançamentos Financeiros do Evento
    const newTransactions: FinancialTransaction[] = [
      {
        id: 'tx-sinal-' + newId,
        eventId: newId,
        type: 'receita',
        description: `Sinal de Reserva de Data (40%) — ${eventData.title}`,
        amount: eventData.signalFee,
        dueDate: eventData.date,
        status: eventData.signalPaid ? 'pago' : 'pendente',
        category: 'Honorários de Produção',
        recipientOrPayer: contractorName
      },
      {
        id: 'tx-saldo-' + newId,
        eventId: newId,
        type: 'receita',
        description: `Saldo Remanescente (60%) — ${eventData.title}`,
        amount: eventData.balanceFee,
        dueDate: eventData.date,
        status: eventData.balancePaid ? 'pago' : 'pendente',
        category: 'Honorários de Produção',
        recipientOrPayer: contractorName
      }
    ];

    setEvents(prev => [newEvent, ...prev]);
    setDocuments(prev => [...generatedDocs, ...prev]);
    setChecklist(prev => [...prev, ...defaultChecklists]);
    setTransactions(prev => [...prev, ...newTransactions]);

    return newEvent;
  };

  const updateEvent = (id: string, updated: Partial<EventItem>) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updated } : e)));
  };

  const updateEventStatus = (id: string, status: EventStatus) => {
    setEvents(prev => prev.map(e => (e.id === id ? { ...e, status } : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setDocuments(prev => prev.filter(d => d.eventId !== id));
    setTimeline(prev => prev.filter(t => t.eventId !== id));
    setChecklist(prev => prev.filter(c => c.eventId !== id));
    setTimeLogs(prev => prev.filter(tl => tl.eventId !== id));
    setTransactions(prev => prev.filter(tx => tx.eventId !== id));
  };

  // Documentos
  const updateDocumentContent = (docId: string, content: string) => {
    setDocuments(prev =>
      prev.map(d => (d.id === docId ? { ...d, content, updatedAt: new Date().toISOString() } : d))
    );
  };

  const updateDocumentStatus = (docId: string, status: EventDocument['status']) => {
    setDocuments(prev => prev.map(d => (d.id === docId ? { ...d, status, updatedAt: new Date().toISOString() } : d)));
  };

  const getEventDocuments = (eventId: string) => {
    return documents.filter(d => d.eventId === eventId);
  };

  // Cronograma
  const addTimelineItem = (itemData: Omit<TimelineItem, 'id'>) => {
    const newItem: TimelineItem = { ...itemData, id: 'time-' + Date.now() };
    setTimeline(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
  };
  const updateTimelineItem = (id: string, itemData: Partial<TimelineItem>) => {
    setTimeline(prev => prev.map(t => (t.id === id ? { ...t, ...itemData } : t)));
  };
  const deleteTimelineItem = (id: string) => {
    setTimeline(prev => prev.filter(t => t.id !== id));
  };
  const toggleTimelineItemCompleted = (id: string) => {
    setTimeline(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Checklist
  const addChecklistItem = (itemData: Omit<ChecklistItem, 'id'>) => {
    const newItem: ChecklistItem = { ...itemData, id: 'chk-' + Date.now() };
    setChecklist(prev => [...prev, newItem]);
  };
  const updateChecklistItem = (id: string, itemData: Partial<ChecklistItem>) => {
    setChecklist(prev => prev.map(c => (c.id === id ? { ...c, ...itemData } : c)));
  };
  const deleteChecklistItem = (id: string) => {
    setChecklist(prev => prev.filter(c => c.id !== id));
  };
  const toggleChecklistItemCompleted = (id: string) => {
    setChecklist(prev => prev.map(c => (c.id === id ? { ...c, completed: !c.completed } : c)));
  };

  // Controle de Horas
  const addTimeLog = (logData: Omit<TimeLog, 'id' | 'isExceeded'>) => {
    const event = events.find(e => e.id === logData.eventId);
    const existingLogs = timeLogs.filter(tl => tl.eventId === logData.eventId);
    const totalCurrentHours = existingLogs.reduce((acc, l) => acc + l.hours, 0);
    const limit = event?.preProductionHoursLimit || 9;
    const isExceeded = totalCurrentHours + logData.hours > limit;

    const newLog: TimeLog = {
      ...logData,
      id: 'tl-' + Date.now(),
      isExceeded
    };
    setTimeLogs(prev => [newLog, ...prev]);
  };

  const deleteTimeLog = (id: string) => {
    setTimeLogs(prev => prev.filter(tl => tl.id !== id));
  };

  // Financeiro
  const addTransaction = (txData: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = { ...txData, id: 'tx-' + Date.now() };
    setTransactions(prev => [newTx, ...prev]);
  };
  const updateTransactionStatus = (id: string, status: FinancialTransaction['status'], paymentDate?: string) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, status, paymentDate: paymentDate || (status === 'pago' ? new Date().toISOString().split('T')[0] : t.paymentDate) } : t))
    );
  };
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Sincronização Google Drive
  const syncEventWithGoogleDrive = async (eventId: string): Promise<boolean> => {
    setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, driveSyncStatus: 'syncing' } : e)));
    // Simulação da chamada assíncrona da API do Google Drive
    await new Promise(res => setTimeout(res, 1200));
    setEvents(prev => prev.map(e => (e.id === eventId ? { ...e, driveSyncStatus: 'synced' } : e)));
    return true;
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
        users,
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

