-- ==============================================================================
-- SCHEMA OFICIAL DE BANCO DE DADOS — GABIPRODUZ
-- Compatível com PostgreSQL / Supabase / Neon (Hospedagem 100% Gratuita)
-- ==============================================================================

-- 1. Tabela de Usuários (RBAC)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('administrador', 'financeiro', 'artista', 'contratante')),
  avatar_url TEXT,
  associated_artist_id TEXT,
  associated_contractor_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Artistas
CREATE TABLE IF NOT EXISTS artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  artistic_name TEXT NOT NULL,
  genre TEXT,
  bio TEXT,
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  base_fee NUMERIC(10,2) DEFAULT 0.00,
  pix_key TEXT,
  pix_type TEXT,
  bank_name TEXT,
  bank_agency TEXT,
  bank_account TEXT,
  rider_notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Contratantes
CREATE TABLE IF NOT EXISTS contractors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company_name TEXT,
  document TEXT, -- CPF ou CNPJ
  type TEXT DEFAULT 'PJ' CHECK (type IN ('PF', 'PJ')),
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Espaços de Eventos
CREATE TABLE IF NOT EXISTS venues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  capacity INTEGER,
  ceiling_height TEXT,
  voltage TEXT DEFAULT 'Ambos' CHECK (voltage IN ('110V', '220V', 'Ambos')),
  sound_curfew TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  technical_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Eventos
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'prospeccao' CHECK (status IN ('prospeccao', 'orcamento', 'contrato_assinado', 'pre_producao', 'realizado', 'encerrado')),
  date DATE NOT NULL,
  start_time TEXT,
  soundcheck_time TEXT,
  show_time TEXT,
  end_time TEXT,
  artist_id TEXT REFERENCES artists(id) ON DELETE SET NULL,
  contractor_id TEXT REFERENCES contractors(id) ON DELETE SET NULL,
  venue_id TEXT REFERENCES venues(id) ON DELETE SET NULL,
  pre_production_package TEXT DEFAULT 'intermediario',
  pre_production_hours_limit INTEGER DEFAULT 9,
  pre_production_fee NUMERIC(10,2) DEFAULT 0.00,
  presencial_fee NUMERIC(10,2) DEFAULT 0.00,
  km_distance NUMERIC(8,2) DEFAULT 0.00,
  km_fee NUMERIC(10,2) DEFAULT 0.00,
  additional_services_fee NUMERIC(10,2) DEFAULT 0.00,
  total_fee NUMERIC(10,2) DEFAULT 0.00,
  signal_fee NUMERIC(10,2) DEFAULT 0.00,
  signal_paid BOOLEAN DEFAULT FALSE,
  balance_fee NUMERIC(10,2) DEFAULT 0.00,
  balance_paid BOOLEAN DEFAULT FALSE,
  google_drive_folder_id TEXT,
  google_drive_folder_url TEXT,
  drive_sync_status TEXT DEFAULT 'pending' CHECK (drive_sync_status IN ('synced', 'pending', 'syncing')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Documentos do Evento (Google Drive)
CREATE TABLE IF NOT EXISTS event_documents (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('orcamento', 'proposta', 'contrato', 'ficha_cadastral')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  google_doc_id TEXT,
  google_doc_url TEXT,
  status TEXT DEFAULT 'gerado' CHECK (status IN ('rascunho', 'gerado', 'enviado', 'assinado')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Linha do Tempo / Cronograma
CREATE TABLE IF NOT EXISTS timeline_items (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  responsible TEXT,
  notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de Checklists de Pré-Produção
CREATE TABLE IF NOT EXISTS checklist_items (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  phase TEXT NOT NULL CHECK (phase IN ('D-30', 'D-14', 'D-2', 'D-Day', 'Pos')),
  task TEXT NOT NULL,
  responsible TEXT,
  deadline DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabela de Controle de Horas
CREATE TABLE IF NOT EXISTS time_logs (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT,
  hours NUMERIC(5,2) NOT NULL,
  hourly_rate NUMERIC(10,2) DEFAULT 70.00,
  is_exceeded BOOLEAN DEFAULT FALSE,
  logged_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabela de Transações Financeiras
CREATE TABLE IF NOT EXISTS financial_transactions (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES events(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa_producao', 'repasse_artista', 'reembolso_km')),
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  payment_date DATE,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'atrasado')),
  category TEXT,
  recipient_or_payer TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação de Índices para Performance Rápida
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_event_docs_event_id ON event_documents(event_id);
CREATE INDEX IF NOT EXISTS idx_timeline_event_id ON timeline_items(event_id);
CREATE INDEX IF NOT EXISTS idx_checklist_event_id ON checklist_items(event_id);
CREATE INDEX IF NOT EXISTS idx_timelogs_event_id ON time_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_fin_tx_event_id ON financial_transactions(event_id);
