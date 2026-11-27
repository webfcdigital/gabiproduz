'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FolderSync, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, Key, ShieldCheck, Mail } from 'lucide-react';

export const GoogleDriveManager: React.FC = () => {
  const { events, documents, syncEventWithGoogleDrive } = useApp();

  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const targetEmail = 'webfcosta@gmail.com';

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/drive/test');
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err?.message || 'Falha na requisição de teste'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncEvent = async (eventId: string) => {
    setSyncingId(eventId);
    setSyncFeedback(null);
    const event = events.find(e => e.id === eventId);
    const eventDocs = documents.filter(d => d.eventId === eventId);

    try {
      const res = await fetch('/api/drive/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventCode: event?.code,
          eventTitle: event?.title,
          documents: eventDocs
        })
      });

      const data = await res.json();
      await syncEventWithGoogleDrive(eventId);
      setSyncFeedback(`Sincronização concluída com sucesso! Pasta compartilhada com ${targetEmail}.`);
    } catch (err: any) {
      setSyncFeedback(`Erro: ${err?.message}`);
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#48243F] to-[#2F1528] text-white p-6 rounded-2xl border-b-4 border-[#B18A38] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B18A38] font-bold">Automação de Arquivos (PRD 4.4)</span>
          <h2 className="font-serif text-2xl font-bold mt-1">Integração Oficial Google Drive API</h2>
          <p className="text-xs text-[#E2D7E0] mt-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#B18A38]" />
            <span>Conta e Pasta Compartilhada: <strong>{targetEmail}</strong></span>
          </p>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={testing}
          className="bg-[#B18A38] hover:bg-[#CBA24B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testando Conexão...' : 'Testar Conexão Google Drive'}</span>
        </button>
      </div>

      {/* Resultado do Teste de Conexão */}
      {testResult && (
        <div className={`p-5 rounded-xl border text-xs ${
          testResult.status === 'connected'
            ? 'bg-green-50 border-green-200 text-green-900'
            : testResult.status === 'pending_configuration'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <div className="flex items-start space-x-3">
            {testResult.status === 'connected' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <strong className="text-sm font-bold block mb-1">
                {testResult.status === 'connected'
                  ? 'Google Drive Conectado & Autenticado com Sucesso!'
                  : 'Status da Conta de Compartilhamento'}
              </strong>
              <p className="leading-relaxed">{testResult.message}</p>
              
              {testResult.targetEmail && (
                <div className="mt-2.5 p-2 bg-white/70 rounded-lg border border-current/20 inline-block">
                  <span>Destinatário das Pastas de Eventos: <strong>{testResult.targetEmail}</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {syncFeedback && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Grid de Pastas e Sincronização por Evento */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5DDD3] shadow-sm space-y-4">
        <div>
          <h3 className="font-serif text-base font-bold text-[#48243F]">
            Gravação de Pastas & Artefatos no Google Drive
          </h3>
          <p className="text-xs text-[#6E6877]">
            Cada evento possui uma pasta individual com os 4 documentos gerados (Orçamento, Proposta, Contrato e Ficha Cadastral)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map(ev => {
            const evDocs = documents.filter(d => d.eventId === ev.id);
            const isSyncing = syncingId === ev.id;

            return (
              <div
                key={ev.id}
                className="p-5 bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#6E6877]">{ev.code}</span>
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FolderSync className="w-3 h-3 text-green-600" />
                      <span>{targetEmail.split('@')[0]}</span>
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-[#34313B] mt-2">{ev.title}</h4>
                  <p className="text-xs text-[#6E6877] mt-1">4 artefatos prontos para gravação</p>

                  <div className="mt-3 p-2.5 bg-white rounded-lg border border-[#E5DDD3] text-[11px] text-[#6E6877] space-y-1">
                    {evDocs.map(d => (
                      <div key={d.id} className="flex justify-between items-center truncate">
                        <span className="truncate">• {d.title}</span>
                        <span className="text-[9px] uppercase font-bold text-green-700">{d.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5DDD3] flex items-center justify-between">
                  <button
                    onClick={() => handleSyncEvent(ev.id)}
                    disabled={isSyncing}
                    className="bg-[#48243F] hover:bg-[#5E3253] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition"
                  >
                    <FolderSync className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Gravando...' : 'Gravar no Drive'}</span>
                  </button>

                  <a
                    href={ev.googleDriveFolderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#B18A38] hover:underline font-semibold flex items-center space-x-1"
                  >
                    <span>Abrir Pasta</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guia Passo a Passo de Credenciais */}
      <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E5DDD3] text-xs space-y-3">
        <div className="flex items-center space-x-2 text-[#48243F] font-bold text-sm">
          <Key className="w-4 h-4 text-[#B18A38]" />
          <span>Configuração da Conta Compartilhada ({targetEmail})</span>
        </div>
        <p className="text-[#6E6877] leading-relaxed">
          Para que o sistema grave arquivos de forma 100% autônoma no Google Drive da sua conta Google:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-[#34313B]">
          <li>Crie uma pasta no seu Google Drive com sua conta <strong>{targetEmail}</strong> (ex: "GabiProduz — Eventos").</li>
          <li>Compartilhe a pasta com a Service Account do Google Cloud fornecendo acesso de <strong>Editor</strong>.</li>
          <li>No painel da Vercel (ou em <code>.env.local</code>), insira as variáveis:
            <ul className="list-disc pl-5 mt-1 font-mono text-[11px] text-[#48243F]">
              <li>GOOGLE_SERVICE_ACCOUNT_EMAIL</li>
              <li>GOOGLE_PRIVATE_KEY</li>
              <li>GOOGLE_DRIVE_FOLDER_ID (ID da sua pasta compartilhada)</li>
              <li>GOOGLE_DRIVE_SHARED_EMAIL=webfcosta@gmail.com</li>
            </ul>
          </li>
        </ol>
      </div>

    </div>
  );
};
