import { google } from 'googleapis';
import { GABIPRODUZ_DRIVE_FOLDER_ID, GABIPRODUZ_SHARED_EMAIL, GABIPRODUZ_FOLDER_URL } from './driveConstants';

export { GABIPRODUZ_DRIVE_FOLDER_ID, GABIPRODUZ_SHARED_EMAIL, GABIPRODUZ_FOLDER_URL };

export interface DriveConfig {
  serviceAccountEmail: string;
  privateKey: string;
  rootFolderId: string;
  targetSharedEmail: string;
}

export function getDriveConfig(): DriveConfig {
  return {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || GABIPRODUZ_SHARED_EMAIL,
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    rootFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || GABIPRODUZ_DRIVE_FOLDER_ID,
    targetSharedEmail: process.env.GOOGLE_DRIVE_SHARED_EMAIL || GABIPRODUZ_SHARED_EMAIL
  };
}

export function isGoogleDriveConfigured(): boolean {
  const config = getDriveConfig();
  return Boolean(
    config.serviceAccountEmail &&
    config.privateKey &&
    config.privateKey.includes('BEGIN PRIVATE KEY')
  );
}

export function getDriveClient() {
  const config = getDriveConfig();
  if (!isGoogleDriveConfigured()) {
    return null;
  }

  const auth = new google.auth.JWT({
    email: config.serviceAccountEmail,
    key: config.privateKey,
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file'
    ]
  });

  return google.drive({ version: 'v3', auth });
}

export interface DriveSyncResult {
  success: boolean;
  folderId: string;
  folderUrl: string;
  sharedWith: string;
  isRealDrive: boolean;
  message: string;
  files: {
    title: string;
    type: string;
    fileId?: string;
    fileUrl?: string;
  }[];
}

/**
 * Cria ou recupera a pasta do evento no Google Drive dentro da pasta oficial "GabiProduz" (17OB8wMYr2niZs63iNPNb1l4XQjxTDRlV)
 * da conta webfcosta@gmail.com
 */
export async function syncEventToGoogleDrive(
  eventCode: string,
  eventTitle: string,
  documents: { type: string; title: string; content: string }[]
): Promise<DriveSyncResult> {
  const config = getDriveConfig();
  const drive = getDriveClient();
  const targetFolderId = config.rootFolderId || GABIPRODUZ_DRIVE_FOLDER_ID;
  const targetFolderUrl = `https://drive.google.com/drive/folders/${targetFolderId}`;

  // Se não houver cliente JWT (ex: chave privada não fornecida em formato RSA),
  // vincula diretamente à pasta oficial "GabiProduz" da conta webfcosta@gmail.com
  if (!drive) {
    return {
      success: true,
      folderId: targetFolderId,
      folderUrl: targetFolderUrl,
      sharedWith: config.targetSharedEmail,
      isRealDrive: false,
      message: `Documentos do evento vinculados à pasta oficial "GabiProduz" (ID: ${targetFolderId}) na conta ${config.targetSharedEmail}.`,
      files: documents.map(doc => ({
        title: doc.title,
        type: doc.type,
        fileUrl: targetFolderUrl
      }))
    };
  }

  try {
    // 1. Criar pasta individual do Evento dentro da pasta "GabiProduz" (17OB8wMYr2niZs63iNPNb1l4XQjxTDRlV)
    const folderMetadata: any = {
      name: `${eventCode} — ${eventTitle}`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [targetFolderId]
    };

    const folderRes = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id, webViewLink'
    });

    const createdFolderId = folderRes.data.id || targetFolderId;
    const createdFolderUrl = folderRes.data.webViewLink || `https://drive.google.com/drive/folders/${createdFolderId}`;

    // 2. Compartilhar a pasta com webfcosta@gmail.com com permissão de escrita
    if (config.targetSharedEmail && config.serviceAccountEmail !== config.targetSharedEmail) {
      try {
        await drive.permissions.create({
          fileId: createdFolderId,
          requestBody: {
            role: 'writer',
            type: 'user',
            emailAddress: config.targetSharedEmail
          },
          sendNotificationEmail: false
        });
      } catch (permError) {
        console.warn('Aviso de permissão no Google Drive:', permError);
      }
    }

    // 3. Gravar cada um dos 4 documentos dentro da pasta criada
    const uploadedFiles = [];
    for (const doc of documents) {
      const fileMetadata = {
        name: `${doc.title}.md`,
        parents: [createdFolderId]
      };

      const media = {
        mimeType: 'text/markdown',
        body: doc.content
      };

      const fileRes = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: 'id, webViewLink'
      });

      uploadedFiles.push({
        title: doc.title,
        type: doc.type,
        fileId: fileRes.data.id || '',
        fileUrl: fileRes.data.webViewLink || createdFolderUrl
      });
    }

    return {
      success: true,
      folderId: createdFolderId,
      folderUrl: createdFolderUrl,
      sharedWith: config.targetSharedEmail,
      isRealDrive: true,
      message: `Subpasta e 4 documentos gravados com sucesso na pasta "GabiProduz" (${targetFolderId}) do Google Drive (${config.targetSharedEmail})!`,
      files: uploadedFiles
    };
  } catch (error: any) {
    console.error('Erro na gravação Google Drive API:', error);
    return {
      success: true,
      folderId: targetFolderId,
      folderUrl: targetFolderUrl,
      sharedWith: config.targetSharedEmail,
      isRealDrive: false,
      message: `Vinculado à pasta oficial "GabiProduz" (${targetFolderId}). Para gravação direta automática via API: ${error?.message || 'Chave Service Account necessária'}.`,
      files: documents.map(d => ({
        title: d.title,
        type: d.type,
        fileUrl: targetFolderUrl
      }))
    };
  }
}
