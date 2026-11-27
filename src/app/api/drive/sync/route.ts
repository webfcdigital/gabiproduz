import { NextResponse } from 'next/server';
import { syncEventToGoogleDrive } from '@/lib/googleDrive';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventCode, eventTitle, documents } = body;

    if (!eventCode || !eventTitle) {
      return NextResponse.json(
        { error: 'Parâmetros eventCode e eventTitle são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await syncEventToGoogleDrive(
      eventCode,
      eventTitle,
      documents || []
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erro ao sincronizar com Google Drive' },
      { status: 500 }
    );
  }
}
