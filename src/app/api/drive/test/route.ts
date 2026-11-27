import { NextResponse } from 'next/server';
import { getDriveConfig, getDriveClient, isGoogleDriveConfigured } from '@/lib/googleDrive';

export async function GET() {
  const config = getDriveConfig();
  const isConfigured = isGoogleDriveConfigured();

  if (!isConfigured) {
    return NextResponse.json({
      status: config.rootFolderId ? 'folder_linked' : 'pending_configuration',
      targetEmail: config.targetSharedEmail,
      configured: false,
      folderId: config.rootFolderId,
      folderUrl: `https://drive.google.com/drive/folders/${config.rootFolderId}`,
      message: `Pasta oficial do Google Drive vinculada (${config.rootFolderId}) para ${config.targetSharedEmail}. Os documentos apontam diretamente para o repositório em nuvem.`,
      requiredEnvVars: [
        'GOOGLE_SERVICE_ACCOUNT_EMAIL',
        'GOOGLE_PRIVATE_KEY (chave RSA)',
        'GOOGLE_DRIVE_FOLDER_ID'
      ]
    });
  }

  try {
    const drive = getDriveClient();
    if (!drive) throw new Error('Não foi possível inicializar o cliente Google Drive');

    // Testar listagem da raiz ou da pasta compartilhada
    const res = await drive.files.list({
      pageSize: 5,
      fields: 'files(id, name, mimeType)'
    });

    return NextResponse.json({
      status: 'connected',
      targetEmail: config.targetSharedEmail,
      configured: true,
      serviceAccount: config.serviceAccountEmail,
      message: `Conexão com a Google Drive API ativa! Pastas e arquivos são compartilhados com ${config.targetSharedEmail}.`,
      accessibleFilesCount: res.data.files?.length || 0
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      targetEmail: config.targetSharedEmail,
      configured: true,
      message: `Falha na autenticação do Google Drive: ${error?.message || 'Chave privada inválida'}`
    }, { status: 500 });
  }
}
