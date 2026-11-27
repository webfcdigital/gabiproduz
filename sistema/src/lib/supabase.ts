import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verifica se as credenciais do Supabase estão configuradas
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

// Cliente público do Supabase para consultas client-side
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Cliente administrativo para rotas de backend (se service role key estiver presente)
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;
  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false }
  });
}

export interface DbStatusResponse {
  connected: boolean;
  provider: 'supabase' | 'local_fallback';
  message: string;
  hasTables?: boolean;
}

export async function checkDatabaseHealth(): Promise<DbStatusResponse> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      connected: false,
      provider: 'local_fallback',
      message: 'Operando em modo LocalStorage resiliente. Para conectar ao Supabase (PostgreSQL grátis), adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    };
  }

  try {
    const { error } = await supabase.from('events').select('id').limit(1);
    if (error && error.code === '42P01') {
      return {
        connected: true,
        provider: 'supabase',
        hasTables: false,
        message: 'Conectado ao Supabase com sucesso! As tabelas ainda não foram criadas. Execute o script supabase_schema.sql no SQL Editor do Supabase.'
      };
    }
    if (error) {
      return {
        connected: false,
        provider: 'local_fallback',
        message: `Erro na consulta ao Supabase: ${error.message}`
      };
    }
    return {
      connected: true,
      provider: 'supabase',
      hasTables: true,
      message: 'Banco de dados Supabase PostgreSQL online e sincronizado com sucesso.'
    };
  } catch (err: any) {
    return {
      connected: false,
      provider: 'local_fallback',
      message: `Falha ao conectar: ${err?.message || 'Erro desconhecido'}`
    };
  }
}
