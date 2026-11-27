import { NextResponse } from 'next/server';
import {
  getDriveConfig,
  getDriveClient,
  isGoogleDriveConfigured,
  GABIPRODUZ_DRIVE_FOLDER_ID,
  GABIPRODUZ_SHARED_EMAIL,
  GABIPRODUZ_FOLDER_URL
} from '@/lib/googleDrive';

export async function GET() {
  const config = getDriveConfig();
  const isConfigured = isGoogleDriveConfigured();
  const folderId = config.rootFolderId || GABIPRODUZ_DRIVE_FOLDER_ID;
  const targetEmail = config.targetSharedEmail || GABIPRODUZ_SHARED_EMAIL;
  const folderUrl = `https://drive.google.com/drive/folders/${folderId}`;

  if (!isConfigured) {
    return NextResponse.json({
      status: 'folder_linked',
      folderName: 'GabiProduz',
      folderId,
      folderUrl,
      targetEmail,
      configured: false,
      message: `Pasta oficial "GabiProduz" (ID: ${folderId}) vinculada no Google Drive da conta ${targetEmail}. Todos os artefatos gerados são organizados neste diretório.`,
      authTip: 'Para upload totalmente autônomo sem intervenção via Service Account, utilize uma chave RSA (BEGIN PRIVATE KEY).'
    });
  }

  try {
    const drive = getDriveClient();
    if (!drive) throw new Error('Cliente Google Drive não pôde ser instanciado');

    const res = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType, webViewLink'
    });

    return NextResponse.json({
      status: 'connected',
      folderName: res.data.name || 'GabiProduz',
      folderId: res.data.id || folderId,
      folderUrl: res.data.webViewLink || folderUrl,
      targetEmail,
      configured: true,
      serviceAccount: config.serviceAccountEmail,
      message: `Conexão ativa com o Google Drive! Arquivos são gravados diretamente na pasta "${res.data.name || 'GabiProduz'}" (${folderId}).`
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'folder_linked',
      folderName: 'GabiProduz',
      folderId,
      folderUrl,
      targetEmail,
      configured: false,
      message: `Pasta oficial "GabiProduz" vinculada (${folderId}) para ${targetEmail}. (API: ${error?.message || 'Chave Service Account necessária'}).`
    });
  }
}
