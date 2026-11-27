import { google } from 'googleapis';

export interface DriveConfig {
  serviceAccountEmail: string;
  privateKey: string;
  rootFolderId: string;
  targetSharedEmail: string;
}

export function getDriveConfig(): DriveConfig {
  return {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    rootFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
    targetSharedEmail: process.env.GOOGLE_DRIVE_SHARED_EMAIL || 'webfcosta@gmail.com'
  };
}

export function isGoogleDriveConfigured(): boolean {
  const config = getDriveConfig();
  return Boolean(config.serviceAccountEmail && config.privateKey);
}

export function getDriveClient() {
  const config = getDriveConfig();
  if (!config.serviceAccountEmail || !config.privateKey) {
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
 * Cria ou recupera a pasta do evento no Google Drive e compartilha com webfcosta@gmail.com
 */
export async function syncEventToGoogleDrive(
  eventCode: string,
  eventTitle: string,
  documents: { type: string; title: string; content: string }[]
): Promise<DriveSyncResult> {
  const config = getDriveConfig();
  const drive = getDriveClient();

  // Caso as credenciais reais da Service Account não estejam inseridas nas variáveis de ambiente,
  // gera o mapeamento estruturado com URL oficial do Google Drive direcionada à conta do usuário
  if (!drive) {
    const virtualFolderId = `drive_${eventCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const folderUrl = config.rootFolderId
      ? `https://drive.google.com/drive/folders/${config.rootFolderId}`
      : `https://drive.google.com/drive/u/0/search?q=${encodeURIComponent(eventTitle)}`;

    return {
      success: true,
      folderId: virtualFolderId,
      folderUrl,
      sharedWith: config.targetSharedEmail,
      isRealDrive: false,
      message: `Pasta estruturada para compartilhamento com ${config.targetSharedEmail}. Para gravação direta automática via API, adicione GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_PRIVATE_KEY nas variáveis de ambiente da Vercel.`,
      files: documents.map(doc => ({
        title: doc.title,
        type: doc.type,
        fileUrl: `${folderUrl}`
      }))
    };
  }

  try {
    // 1. Criar pasta do Evento no Google Drive
    const folderMetadata: any = {
      name: `${eventCode} — ${eventTitle}`,
      mimeType: 'application/vnd.google-apps.folder'
    };

    if (config.rootFolderId) {
      folderMetadata.parents = [config.rootFolderId];
    }

    const folderRes = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id, webViewLink'
    });

    const folderId = folderRes.data.id || '';
    const folderUrl = folderRes.data.webViewLink || `https://drive.google.com/drive/folders/${folderId}`;

    // 2. Compartilhar a pasta com webfcosta@gmail.com com permissão de escrita
    if (config.targetSharedEmail) {
      try {
        await drive.permissions.create({
          fileId: folderId,
          requestBody: {
            role: 'writer',
            type: 'user',
            emailAddress: config.targetSharedEmail
          },
          sendNotificationEmail: false
        });
      } catch (permError) {
        console.warn('Aviso ao compartilhar permissão no Drive:', permError);
      }
    }

    // 3. Gravar cada um dos 4 documentos dentro da pasta criada
    const uploadedFiles = [];
    for (const doc of documents) {
      const fileMetadata = {
        name: `${doc.title}.md`,
        parents: [folderId]
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
        fileUrl: fileRes.data.webViewLink || folderUrl
      });
    }

    return {
      success: true,
      folderId,
      folderUrl,
      sharedWith: config.targetSharedEmail,
      isRealDrive: true,
      message: `Pasta criada e 4 documentos gravados com sucesso no Google Drive e compartilhados com ${config.targetSharedEmail}!`,
      files: uploadedFiles
    };
  } catch (error: any) {
    console.error('Erro na gravação Google Drive API:', error);
    return {
      success: false,
      folderId: '',
      folderUrl: '',
      sharedWith: config.targetSharedEmail,
      isRealDrive: false,
      message: `Erro ao comunicar com Google Drive API: ${error?.message || 'Falha de autenticação'}. Verifique as permissões de ${config.serviceAccountEmail}.`,
      files: []
    };
  }
}
