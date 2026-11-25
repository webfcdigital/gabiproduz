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

export const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Gabriela Prieto',
    email: 'gabriela@gabrielaprieto.com.br',
    role: 'administrador',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-fin',
    name: 'Coordenação Financeira',
    email: 'financeiro@gabrielaprieto.com.br',
    role: 'financeiro',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-artist',
    name: 'Zé Muniz (Artista)',
    email: 'zemuniz@artista.com',
    role: 'artista',
    associatedArtistId: 'art-1',
    avatarUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-client',
    name: 'John Doe (Kiki Bar)',
    email: 'john@kikibar.com.br',
    role: 'contratante',
    associatedContractorId: 'cont-1',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialArtists: Artist[] = [
  {
    id: 'art-1',
    name: 'José Muniz Filho',
    artisticName: 'Zé Muniz',
    genre: 'MPB / Pop Acústico',
    bio: 'Cantor, compositor e instrumentista com repertório versátil para eventos corporativos e shows intimistas.',
    photoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
    email: 'contato@zemuniz.com.br',
    phone: '(11) 98111-2233',
    baseFee: 2500,
    bankInfo: {
      pixKey: 'ze.muniz@pix.me',
      pixType: 'E-mail',
      bankName: 'Nubank (260)',
      agency: '0001',
      account: '1234567-8'
    },
    riderNotes: '2 microfones voz Shure SM58, 2 DIs para violão/guitarra, 2 retornos de chão (wedges).',
    active: true
  },
  {
    id: 'art-2',
    name: 'Banda Kiki Groove',
    artisticName: 'Kiki Groove Band',
    genre: 'Dança de Salão / Samba-Rock / Forró',
    bio: 'Quarteto especializado em animar pistas de dança e happy hours com arranjos vibrantes.',
    photoUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80',
    email: 'banda@kikigroove.com',
    phone: '(11) 97222-4455',
    baseFee: 3200,
    bankInfo: {
      pixKey: '12.345.678/0001-90',
      pixType: 'CNPJ',
      bankName: 'Itaú (341)',
      agency: '1234',
      account: '98765-4'
    },
    riderNotes: 'Microfonação para bateria, amplificador de baixo 100W, 3 vias de voz, 1 linha de teclado estéreo.',
    active: true
  },
  {
    id: 'art-3',
    name: 'Projeto Costela Autoral',
    artisticName: 'Costela Autoral',
    genre: 'Rock Brasileiro / Indie',
    bio: 'Projeto independente com identidade marcante e composições autorais enérgicas.',
    photoUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
    email: 'costela@autoral.art.br',
    phone: '(11) 99333-8877',
    baseFee: 4000,
    bankInfo: {
      pixKey: 'costela@autoral.art.br',
      pixType: 'E-mail',
      bankName: 'Banco Inter (077)',
      agency: '0001',
      account: '554433-2'
    },
    riderNotes: '2 amplificadores de guitarra (Fender/Marshall), 1 amp de baixo Ampeg, bateria completa sem pratos.',
    active: true
  }
];

export const initialContractors: Contractor[] = [
  {
    id: 'cont-1',
    name: 'John Doe',
    companyName: 'Kiki Bar e Danças Ltda',
    document: '28.910.443/0001-12',
    type: 'PJ',
    email: 'contato@kikibar.com.br',
    phone: '(11) 98765-4321',
    address: 'Rua das Danças, 450, Centro',
    city: 'Jundiaí',
    state: 'SP',
    notes: 'Cliente com demanda frequente de happy hours dançantes às terças e quintas-feiras.'
  },
  {
    id: 'cont-2',
    name: 'Marina Albuquerque',
    companyName: 'Hotel Terras Raras Empreendimentos',
    document: '14.882.331/0001-05',
    type: 'PJ',
    email: 'eventos@hotelterrasraras.com.br',
    phone: '(11) 4702-8800',
    address: 'Rodovia Raposo Tavares, km 26',
    city: 'Cotia',
    state: 'SP',
    notes: 'Eventos corporativos de alto padrão com jantar e atrações musicais sofisticadas.'
  },
  {
    id: 'cont-3',
    name: 'Carlos Mendes',
    companyName: 'Alfa Tech Inovação S/A',
    document: '05.334.120/0001-88',
    type: 'PJ',
    email: 'carlos.mendes@alfatech.com.br',
    phone: '(11) 3099-1200',
    address: 'Av. Brigadeiro Faria Lima, 2800',
    city: 'São Paulo',
    state: 'SP',
    notes: 'Confraternização anual de encerramento da diretoria e colaboradores.'
  }
];

export const initialVenues: Venue[] = [
  {
    id: 'ven-1',
    name: 'Kiki Bar e Danças',
    address: 'Rua das Danças, 450, Centro',
    city: 'Jundiaí',
    state: 'SP',
    capacity: 250,
    ceilingHeight: '3,80m',
    voltage: 'Ambos',
    soundCurfew: '00:00',
    contactName: 'John Doe',
    contactPhone: '(11) 98765-4321',
    technicalNotes: 'Palco em frente à pista de dança de madeira. Doca de carga lateral de fácil acesso.'
  },
  {
    id: 'ven-2',
    name: 'Hotel Terras Raras — Salão Nobre',
    address: 'Rodovia Raposo Tavares, km 26',
    city: 'Cotia',
    state: 'SP',
    capacity: 400,
    ceilingHeight: '4,50m',
    voltage: '220V',
    soundCurfew: '23:00',
    contactName: 'Gerência de Eventos',
    contactPhone: '(11) 4702-8800',
    technicalNotes: 'Tratamento acústico de alto padrão. Exige credenciamento com 48h de antecedência.'
  },
  {
    id: 'ven-3',
    name: 'Espaço Rooftop Faria Lima',
    address: 'Av. Brigadeiro Faria Lima, 2800, 18º Andar',
    city: 'São Paulo',
    state: 'SP',
    capacity: 180,
    ceilingHeight: '3,20m',
    voltage: '110V',
    soundCurfew: '22:00',
    contactName: 'Portaria Técnica',
    contactPhone: '(11) 3099-1250',
    technicalNotes: 'Acesso por elevador de serviço com agendamento rígido de horário.'
  }
];

export const initialEvents: EventItem[] = [
  {
    id: 'evt-1',
    code: 'EVT-2026-001',
    title: 'Happy Hour Kiki Danças',
    status: 'pre_producao',
    date: '2026-12-01',
    startTime: '17:00',
    soundcheckTime: '17:30',
    showTime: '18:20',
    endTime: '20:00',
    artistId: 'art-2',
    contractorId: 'cont-1',
    venueId: 'ven-1',
    preProductionPackage: 'intermediario',
    preProductionHoursLimit: 9,
    preProductionFee: 600,
    presencialFee: 650,
    kmDistance: 120, // 60km ida + 60km volta
    kmFee: 180, // 120 * 1.50
    additionalServicesFee: 0,
    totalFee: 1430,
    signalFee: 572, // 40%
    signalPaid: true,
    balanceFee: 858, // 60%
    balancePaid: false,
    googleDriveFolderId: 'drive-folder-kiki-001',
    googleDriveFolderUrl: 'https://drive.google.com/drive/folders/1A2B3C_KikiDancas_2026',
    driveSyncStatus: 'synced',
    notes: 'Evento com foco em pontualidade estrita na passagem de som (17h30 às 18h00).'
  },
  {
    id: 'evt-2',
    code: 'EVT-2026-002',
    title: 'Show Zé Muniz — Hotel Terras Raras',
    status: 'contrato_assinado',
    date: '2026-12-10',
    startTime: '15:00',
    soundcheckTime: '17:00',
    showTime: '20:30',
    endTime: '22:30',
    artistId: 'art-1',
    contractorId: 'cont-2',
    venueId: 'ven-2',
    preProductionPackage: 'completo',
    preProductionHoursLimit: 14,
    preProductionFee: 900,
    presencialFee: 700,
    kmDistance: 40,
    kmFee: 60,
    additionalServicesFee: 300, // Captação audiovisual
    totalFee: 1960,
    signalFee: 784,
    signalPaid: true,
    balanceFee: 1176,
    balancePaid: false,
    googleDriveFolderId: 'drive-folder-terrasraras-002',
    googleDriveFolderUrl: 'https://drive.google.com/drive/folders/2B3C4D_TerrasRaras_2026',
    driveSyncStatus: 'synced',
    notes: 'Visita técnica realizada em 13/11. Captação de imagens verticais de bastidores contratada.'
  },
  {
    id: 'evt-3',
    code: 'EVT-2026-003',
    title: 'Confraternização de Fim de Ano Alfa Tech',
    status: 'orcamento',
    date: '2026-12-18',
    startTime: '18:00',
    soundcheckTime: '18:30',
    showTime: '20:00',
    endTime: '23:00',
    artistId: 'art-3',
    contractorId: 'cont-3',
    venueId: 'ven-3',
    preProductionPackage: 'intermediario',
    preProductionHoursLimit: 9,
    preProductionFee: 600,
    presencialFee: 700,
    kmDistance: 25,
    kmFee: 37.5,
    additionalServicesFee: 0,
    totalFee: 1337.5,
    signalFee: 535,
    signalPaid: false,
    balanceFee: 802.5,
    balancePaid: false,
    googleDriveFolderId: 'drive-folder-alfatech-003',
    googleDriveFolderUrl: 'https://drive.google.com/drive/folders/3C4D5E_AlfaTech_2026',
    driveSyncStatus: 'pending',
    notes: 'Aguardando validação da diretoria da Alfa Tech para assinatura de contrato.'
  }
];

export const initialDocuments: EventDocument[] = [
  // Documentos do Evento Kiki
  {
    id: 'doc-1',
    eventId: 'evt-1',
    type: 'orcamento',
    title: 'Orçamento Detalhado — Happy Hour Kiki Danças',
    content: `# ORÇAMENTO DETALHADO — GABRIELA PRIETO PRODUÇÃO EXECUTIVA
**Projeto:** Happy Hour Kiki Danças
**Data do Evento:** 01/12/2026 | Local: Jundiaí/SP
**Contratante:** Kiki Bar e Danças (John Doe)

---

### COMPOSIÇÃO DOS CUSTOS DO EVENTO

1. **Pré-Produção Executiva (Pacote Intermediário - até 9h):** R$ 600,00
   * Briefing detalhado e contato com técnicos;
   * Elaboração de cronograma minuto a minuto;
   * Gestão de lista de acessos e logística de palco.

2. **Produção Presencial in loco (Jundiaí/SP):** R$ 650,00
   * Acompanhamento presencial das 16:30 às 20:45;
   * Coordenação de montagem rápida (17h) e passagem de som (17h30);
   * Fiscalização do show das 18h20 às 20h00 e desmontagem.

3. **Deslocamento Intermunicipal com Veículo Próprio:** R$ 180,00
   * 120 km total (SP <-> Jundiaí) x tarifa oficial de R$ 1,50/km.

---
**VALOR TOTAL DOS HONORÁRIOS & LOGÍSTICA:** R$ 1.430,00
* Sinal de Reserva de Data (40%): R$ 572,00 (QUITADO)
* Saldo Final (60%): R$ 858,00 (a pagar até 30/11/2026)

*Despesas de pedágios (Anhanguera/Bandeirantes ~R$ 26,00) faturadas pós-evento mediante comprovantes fiscais.*`,
    googleDocId: 'gdoc-kiki-orc-01',
    googleDocUrl: 'https://docs.google.com/document/d/1Kiki_Orcamento_Detail_2026',
    updatedAt: '2026-11-20T14:30:00Z',
    status: 'assinado'
  },
  {
    id: 'doc-2',
    eventId: 'evt-1',
    type: 'proposta',
    title: 'Proposta Comercial — Happy Hour Kiki Danças',
    content: `# PROPOSTA COMERCIAL & ORÇAMENTO DE PRODUÇÃO EXECUTIVA
**GABRIELA PRIETO | PRODUÇÃO EXECUTIVA MUSICAL**
*Ideias que acontecem.*

**Proposta Nº:** PROP-2026-002-KIKI
**Cliente:** Kiki Bar e Danças | **Contato:** John Doe
**Evento:** Happy Hour Kiki Danças (01/12/2026)

---

### ESCOPO GERAL
* **Pré-produção intermediária:** alinhamentos, cronograma, rider técnico.
* **Coordenação presencial:** montagem pontual 17h, passagem de som 17h30, show 18h20-20h00.
* **Deslocamento:** 120 km a R$ 1,50/km (R$ 180,00).

**Condições Financeiras:**
* Total: R$ 1.430,00
* Entrada de 40%: R$ 572,00
* Saldo de 60%: R$ 858,00 em 30/11/2026.`,
    googleDocId: 'gdoc-kiki-prop-02',
    googleDocUrl: 'https://docs.google.com/document/d/2Kiki_Proposta_Comercial_2026',
    updatedAt: '2026-11-20T14:32:00Z',
    status: 'assinado'
  },
  {
    id: 'doc-3',
    eventId: 'evt-1',
    type: 'contrato',
    title: 'Contrato de Prestação de Serviços — Kiki Bar',
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE PRODUÇÃO EXECUTIVA
**CONTRATADA:** Gabriela Prieto Produções
**CONTRATANTE:** Kiki Bar e Danças Ltda (John Doe)

---

### CLÁUSULAS PRINCIPAIS:
1. **Objeto:** Produção Executiva do evento Happy Hour Kiki Danças em 01/12/2026.
2. **Proteção de Escopo (Spec 1):** Pacote de pré-produção com franquia de até 9h. Horas excedentes tarifadas a R$ 70,00/h.
3. **Deslocamento e Reembolsos (Spec 2):** R$ 1,50/km rodado + 100% de pedágios reembolsados em 3 dias úteis.
4. **Reserva de Data (Spec 3):** Confirmação condicionada ao sinal de 40% (R$ 572,00).

Assinado digitalmente pelas partes.`,
    googleDocId: 'gdoc-kiki-cont-03',
    googleDocUrl: 'https://docs.google.com/document/d/3Kiki_Contrato_Servicos_2026',
    updatedAt: '2026-11-21T10:00:00Z',
    status: 'assinado'
  },
  {
    id: 'doc-4',
    eventId: 'evt-1',
    type: 'ficha_cadastral',
    title: 'Ficha Cadastral do Evento — Kiki Bar',
    content: `# FICHA CADASTRAL TÉCNICA E OPERACIONAL DO EVENTO

* **Nome do Evento:** Happy Hour Kiki Danças
* **Data:** 01/12/2026
* **Atração:** Kiki Groove Band (4 músicos)
* **Local:** Kiki Bar e Danças (Rua das Danças, 450 - Jundiaí/SP)
* **Responsável do Local:** John Doe - (11) 98765-4321
* **Horários:**
  - Chegada da Produção: 16:30
  - Montagem de Palco: 17:00
  - Passagem de Som: 17:30
  - Início do Show: 18:20
  - Término: 20:00
* **Equipamentos e Elétrica:**
  - Voltagem confirmada: 110V/220V disponíveis
  - Vagas de estacionamento reservadas: 3 vagas`,
    googleDocId: 'gdoc-kiki-ficha-04',
    googleDocUrl: 'https://docs.google.com/document/d/4Kiki_Ficha_Cadastral_2026',
    updatedAt: '2026-11-21T10:15:00Z',
    status: 'assinado'
  }
];

export const initialTimeline: TimelineItem[] = [
  { id: 'time-1', eventId: 'evt-1', time: '15:00', title: 'Partida de São Paulo', responsible: 'Gabriela Prieto', notes: 'Zerar hodômetro do veículo para contagem de km.', completed: false },
  { id: 'time-2', eventId: 'evt-1', time: '16:15', title: 'Chegada ao Kiki Bar (Jundiaí)', responsible: 'Gabriela Prieto', notes: 'Vistoriar salão, tomadas do palco e camarim.', completed: false },
  { id: 'time-3', eventId: 'evt-1', time: '16:30', title: 'Recepção dos Músicos & Doca', responsible: 'Gabriela / Equipe Bar', notes: 'Alocar veículos nas 3 vagas reservadas.', completed: false },
  { id: 'time-4', eventId: 'evt-1', time: '17:00', title: 'Início da Montagem de Palco', responsible: 'Técnica & Músicos', notes: 'Bateria, amplificadores e pedestais.', completed: false },
  { id: 'time-5', eventId: 'evt-1', time: '17:30', title: 'Passagem de Som (Soundcheck)', responsible: 'Gabriela / Técnico Som', notes: 'Janela estrita das 17h30 às 18h00.', completed: false },
  { id: 'time-6', eventId: 'evt-1', time: '18:00', title: 'Abertura da Casa / Happy Hour', responsible: 'Kiki Bar', notes: 'Entrada de público e som ambiente suave.', completed: false },
  { id: 'time-7', eventId: 'evt-1', time: '18:15', title: 'Chamada de Palco (Alerta 5 min)', responsible: 'Gabriela Prieto', notes: 'Banda pronta na lateral do palco.', completed: false },
  { id: 'time-8', eventId: 'evt-1', time: '18:20', title: 'INÍCIO DO SHOW AO VIVO', responsible: 'Kiki Groove Band', notes: 'Início pontual com faixa animada.', completed: false },
  { id: 'time-9', eventId: 'evt-1', time: '20:00', title: 'Término do Show & Transição', responsible: 'Gabriela / DJ da Casa', notes: 'Som mecânico imediato para manter a pista.', completed: false },
  { id: 'time-10', eventId: 'evt-1', time: '20:05', title: 'Guarda de Instrumentos & Desmontagem', responsible: 'Músicos / Roadies', notes: 'Retirada ágil e discreta de ferragens.', completed: false },
  { id: 'time-11', eventId: 'evt-1', time: '20:45', title: 'Liberação do Espaço & Retorno a SP', responsible: 'Gabriela Prieto', notes: 'Conferência de tickets de pedágio.', completed: false }
];

export const initialChecklist: ChecklistItem[] = [
  { id: 'chk-1', eventId: 'evt-1', phase: 'D-30', task: 'Proposta Comercial assinada e aprovada por John Doe', responsible: 'Gabriela Prieto', deadline: '2026-11-20', completed: true },
  { id: 'chk-2', eventId: 'evt-1', phase: 'D-30', task: 'Confirmação do Sinal de 40% (R$ 572,00) na conta', responsible: 'Financeiro', deadline: '2026-11-20', completed: true },
  { id: 'chk-3', eventId: 'evt-1', phase: 'D-14', task: 'Coleta de Rider Técnico e Mapa de Palco da banda', responsible: 'Gabriela Prieto', deadline: '2026-11-24', completed: true },
  { id: 'chk-4', eventId: 'evt-1', phase: 'D-14', task: 'Envio de lista com RG/CPF dos músicos para portaria', responsible: 'Gabriela Prieto', deadline: '2026-11-26', completed: true },
  { id: 'chk-5', eventId: 'evt-1', phase: 'D-2', task: 'Reunião de repasse final do cronograma minuto a minuto com John Doe', responsible: 'Gabriela Prieto', deadline: '2026-11-29', completed: false },
  { id: 'chk-6', eventId: 'evt-1', phase: 'D-2', task: 'Cobrança do Saldo Remanescente (60% - R$ 858,00)', responsible: 'Financeiro', deadline: '2026-11-30', completed: false },
  { id: 'chk-7', eventId: 'evt-1', phase: 'D-Day', task: 'Kit da produtora pronto (gaffer preta, crachás, powerbanks, prancheta)', responsible: 'Gabriela Prieto', deadline: '2026-12-01', completed: false },
  { id: 'chk-8', eventId: 'evt-1', phase: 'D-Day', task: 'Conferência de água natural e camarim dos músicos', responsible: 'Gabriela Prieto', deadline: '2026-12-01', completed: false },
  { id: 'chk-9', eventId: 'evt-1', phase: 'Pos', task: 'Envio do Relatório de Despesas de Deslocamento e Pedágios para reembolso', responsible: 'Gabriela Prieto', deadline: '2026-12-03', completed: false }
];

export const initialTimeLogs: TimeLog[] = [
  { id: 'tl-1', eventId: 'evt-1', date: '2026-11-18', activityType: 'Briefing', description: 'Análise de dados do Kiki Bar e definição dos pacotes comerciais', hours: 1.5, hourlyRate: 70, isExceeded: false, loggedBy: 'Gabriela Prieto' },
  { id: 'tl-2', eventId: 'evt-1', date: '2026-11-19', activityType: 'Reunião', description: 'Reunião online com John Doe para alinhamento de horários e escopo', hours: 1.0, hourlyRate: 70, isExceeded: false, loggedBy: 'Gabriela Prieto' },
  { id: 'tl-3', eventId: 'evt-1', date: '2026-11-21', activityType: 'Logística/Fornecedor', description: 'Alinhamento do rider com a Kiki Groove Band e conferência de tomadas', hours: 1.5, hourlyRate: 70, isExceeded: false, loggedBy: 'Gabriela Prieto' },
  { id: 'tl-4', eventId: 'evt-1', date: '2026-11-23', activityType: 'Cronograma', description: 'Construção da esteira operacional e cronograma minuto a minuto', hours: 1.5, hourlyRate: 70, isExceeded: false, loggedBy: 'Gabriela Prieto' },
  { id: 'tl-5', eventId: 'evt-1', date: '2026-11-24', activityType: 'Acessos/Staff', description: 'Organização de lista de credenciamento e vagas de van', hours: 1.0, hourlyRate: 70, isExceeded: false, loggedBy: 'Gabriela Prieto' }
];

export const initialTransactions: FinancialTransaction[] = [
  {
    id: 'tx-1',
    eventId: 'evt-1',
    type: 'receita',
    description: 'Sinal de Reserva de Data (40%) — Kiki Bar',
    amount: 572,
    dueDate: '2026-11-20',
    paymentDate: '2026-11-20',
    status: 'pago',
    category: 'Honorários de Produção',
    recipientOrPayer: 'Kiki Bar e Danças'
  },
  {
    id: 'tx-2',
    eventId: 'evt-1',
    type: 'receita',
    description: 'Saldo Final (60%) — Kiki Bar',
    amount: 858,
    dueDate: '2026-11-30',
    status: 'pendente',
    category: 'Honorários de Produção',
    recipientOrPayer: 'Kiki Bar e Danças'
  },
  {
    id: 'tx-3',
    eventId: 'evt-1',
    type: 'repasse_artista',
    description: 'Cachê Artístico — Kiki Groove Band (Show 01/12)',
    amount: 3200,
    dueDate: '2026-12-01',
    status: 'pendente',
    category: 'Repasse a Artistas',
    recipientOrPayer: 'Banda Kiki Groove'
  },
  {
    id: 'tx-4',
    eventId: 'evt-1',
    type: 'reembolso_km',
    description: 'Reembolso de Pedágios (Anhanguera/Bandeirantes)',
    amount: 26,
    dueDate: '2026-12-04',
    status: 'pendente',
    category: 'Despesas Reembolsáveis',
    recipientOrPayer: 'Gabriela Prieto'
  },
  {
    id: 'tx-5',
    eventId: 'evt-2',
    type: 'receita',
    description: 'Sinal de Reserva (40%) — Hotel Terras Raras',
    amount: 784,
    dueDate: '2026-11-15',
    paymentDate: '2026-11-15',
    status: 'pago',
    category: 'Honorários de Produção',
    recipientOrPayer: 'Hotel Terras Raras'
  }
];

