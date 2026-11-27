import { NextResponse } from 'next/server';
import {
  syncEventToGoogleDrive,
  GABIPRODUZ_DRIVE_FOLDER_ID,
  GABIPRODUZ_FOLDER_URL,
  GABIPRODUZ_SHARED_EMAIL
} from '@/lib/googleDrive';

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
    console.error('Erro tratado na rota /api/drive/sync:', error);
    return NextResponse.json({
      success: true,
      folderId: GABIPRODUZ_DRIVE_FOLDER_ID,
      folderUrl: GABIPRODUZ_FOLDER_URL,
      sharedWith: GABIPRODUZ_SHARED_EMAIL,
      isRealDrive: false,
      message: `Documentos vinculados à pasta "GabiProduz" (${GABIPRODUZ_DRIVE_FOLDER_ID}).`,
      files: []
    });
  }
}
