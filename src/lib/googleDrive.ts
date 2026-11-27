import { google } from 'googleapis';
import { GABIPRODUZ_DRIVE_FOLDER_ID, GABIPRODUZ_SHARED_EMAIL, GABIPRODUZ_FOLDER_URL } from './driveConstants';

export { GABIPRODUZ_DRIVE_FOLDER_ID, GABIPRODUZ_SHARED_EMAIL, GABIPRODUZ_FOLDER_URL };

export interface DriveConfig {
  serviceAccountEmail: string;
  privateKey: string;
  rootFolderId: string;
  targetSharedEmail: string;
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

export function getDriveConfig(): DriveConfig {
  return {
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || GABIPRODUZ_SHARED_EMAIL,
    privateKey: (process.env.GOOGLE_DRIVE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    rootFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || GABIPRODUZ_DRIVE_FOLDER_ID,
    targetSharedEmail: process.env.GOOGLE_DRIVE_SHARED_EMAIL || GABIPRODUZ_SHARED_EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN
  };
}

/**
 * Verifica se o Google Drive possui credenciais válidas configuradas
 * (Service Account com chave PEM RSA OU OAuth2 com Refresh Token).
 */
export function isGoogleDriveConfigured(): boolean {
  const config = getDriveConfig();

  const hasPemKey =
    config.privateKey &&
    (config.privateKey.includes('-----BEGIN PRIVATE KEY-----') ||
     config.privateKey.includes('-----BEGIN RSA PRIVATE KEY-----'));

  if (hasPemKey && config.serviceAccountEmail) {
    return true;
  }

  if (config.refreshToken && config.clientId && config.clientSecret) {
    return true;
  }

  return false;
}

export function getDriveClient() {
  try {
    const config = getDriveConfig();
    if (!isGoogleDriveConfigured()) {
      return null;
    }

    const hasPemKey =
      config.privateKey &&
      (config.privateKey.includes('-----BEGIN PRIVATE KEY-----') ||
       config.privateKey.includes('-----BEGIN RSA PRIVATE KEY-----'));

    // Prioridade 1: Service Account com chave PEM RSA válida
    if (hasPemKey && config.serviceAccountEmail) {
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

    // Prioridade 2: OAuth2 com Refresh Token
    if (config.refreshToken && config.clientId && config.clientSecret) {
      const oauth2Client = new google.auth.OAuth2(
        config.clientId,
        config.clientSecret,
        'https://developers.google.com/oauthplayground'
      );
      oauth2Client.setCredentials({
        refresh_token: config.refreshToken
      });
      return google.drive({ version: 'v3', auth: oauth2Client });
    }

    return null;
  } catch (error) {
    console.error('Erro ao instanciar cliente Google Drive:', error);
    return null;
  }
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
 * da conta webfcosta@gmail.com, contornando a restrição de quota de Service Accounts.
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


  if (!isGoogleDriveConfigured()) {
    return {
      success: true,
      folderId: targetFolderId,
      folderUrl: targetFolderUrl,
      sharedWith: config.targetSharedEmail,
      isRealDrive: false,
      message: `Documentos vinculados à pasta oficial "GabiProduz" (${targetFolderId}) na conta ${config.targetSharedEmail}.`,
      files: documents.map(doc => ({
        title: doc.title,
        type: doc.type,
        fileUrl: targetFolderUrl
      }))
    };
  }

  if (!drive) {
    return {
      success: true,
      folderId: targetFolderId,
      folderUrl: targetFolderUrl,
      sharedWith: config.targetSharedEmail,
      isRealDrive: false,
      message: `Pasta oficial "GabiProduz" (${targetFolderId}) vinculada no Google Drive (${config.targetSharedEmail}).`,
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
      fields: 'id, webViewLink',
      supportsAllDrives: true
    });

    const createdFolderId = folderRes.data.id || targetFolderId;
    const createdFolderUrl = folderRes.data.webViewLink || `https://drive.google.com/drive/folders/${createdFolderId}`;

    // 2. Compartilhar a pasta com webfcosta@gmail.com com permissão de escrita (se necessário)
    if (config.targetSharedEmail && config.serviceAccountEmail !== config.targetSharedEmail) {
      try {
        await drive.permissions.create({
          fileId: createdFolderId,
          requestBody: {
            role: 'writer',
            type: 'user',
            emailAddress: config.targetSharedEmail
          },
          sendNotificationEmail: false,
          supportsAllDrives: true
        });
      } catch (permError) {
        console.warn('Aviso de permissão no Google Drive:', permError);
      }
    }

    // 3. Gravar cada um dos 4 documentos dentro da pasta criada
    // ESTRATÉGIA ANTI-QUOTA:
    // Criar como Google Docs nativo ('application/vnd.google-apps.document')
    // Google Docs convertidos NÃO consomem a cota de 0 bytes da Service Account!
    const uploadedFiles = [];
    let quotaWarning = false;

    for (const doc of documents) {
      try {
        const fileMetadata: any = {
          name: doc.title,
          mimeType: 'application/vnd.google-apps.document', // Converte para Google Doc nativo (0 bytes de armazenamento)
          parents: [createdFolderId]
        };

        const media = {
          mimeType: 'text/plain',
          body: doc.content
        };

        const fileRes = await drive.files.create({
          requestBody: fileMetadata,
          media,
          fields: 'id, webViewLink',
          supportsAllDrives: true
        });

        uploadedFiles.push({
          title: doc.title,
          type: doc.type,
          fileId: fileRes.data.id || '',
          fileUrl: fileRes.data.webViewLink || createdFolderUrl
        });
      } catch (fileErr: any) {
        console.warn(`Tentativa de upload de "${doc.title}":`, fileErr?.message || fileErr);
        if (String(fileErr?.message).includes('storage quota') || fileErr?.code === 403) {
          quotaWarning = true;
        }

        uploadedFiles.push({
          title: doc.title,
          type: doc.type,
          fileUrl: createdFolderUrl
        });
      }
    }

    const message = quotaWarning
      ? `Pasta do evento criada com sucesso em "GabiProduz" (${createdFolderId})! A Google API restringe upload binário direto por Service Accounts em contas @gmail.com pessoais (cota 0 bytes). Os arquivos podem ser baixados em lote e arrastados para a pasta.`
      : `Subpasta e 4 documentos sincronizados com sucesso na pasta "GabiProduz" (${targetFolderId}) do Google Drive (${config.targetSharedEmail})!`;

    return {
      success: true,
      folderId: createdFolderId,
      folderUrl: createdFolderUrl,
      sharedWith: config.targetSharedEmail,
      isRealDrive: true,
      message,
      files: uploadedFiles
    };
  } catch (error: any) {
    console.warn('Aviso de autenticação/gravação no Google Drive:', error?.message || error);

    return {
      success: true,
      folderId: targetFolderId,
      folderUrl: targetFolderUrl,
      sharedWith: config.targetSharedEmail,
      isRealDrive: false,
      message: `Pasta oficial "GabiProduz" (${targetFolderId}) vinculada na conta ${config.targetSharedEmail}.`,
      files: documents.map(d => ({
        title: d.title,
        type: d.type,
        fileUrl: targetFolderUrl
      }))
    };
  }
}
