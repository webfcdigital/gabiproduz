import { NextResponse } from 'next/server';
import { checkDatabaseHealth, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const health = await checkDatabaseHealth();
  return NextResponse.json({
    ...health,
    isConfigured: isSupabaseConfigured,
    setupGuide: {
      provider: 'Supabase (PostgreSQL Gratuito)',
      url: 'https://supabase.com',
      schemaFile: 'supabase_schema.sql',
      steps: [
        '1. Crie uma conta gratuita em supabase.com e crie um novo projeto',
        '2. No menu SQL Editor do Supabase, cole e execute o conteúdo do arquivo supabase_schema.sql',
        '3. Copie o Project URL e a anon/public key nas Configurações da API',
        '4. Adicione NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nas variáveis de ambiente da Vercel'
      ]
    }
  });
}
