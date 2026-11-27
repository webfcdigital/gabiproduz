'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FolderSync,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FolderCheck,
  Download,
  Mail,
  FolderOpen
} from 'lucide-react';
import { GABIPRODUZ_DRIVE_FOLDER_ID, GABIPRODUZ_SHARED_EMAIL, GABIPRODUZ_FOLDER_URL } from '../lib/driveConstants';

export const GoogleDriveManager: React.FC = () => {
  const { events, documents, syncEventWithGoogleDrive } = useApp();

  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const targetEmail = GABIPRODUZ_SHARED_EMAIL;
  const folderId = GABIPRODUZ_DRIVE_FOLDER_ID;
  const folderUrl = GABIPRODUZ_FOLDER_URL;

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
      setSyncFeedback(data?.message || `Sincronização processada para a pasta "GabiProduz" (${folderId}) da conta ${targetEmail}!`);
    } catch (err: any) {
      setSyncFeedback(`Erro: ${err?.message}`);
    } finally {
      setSyncingId(null);
    }
  };

  // Função para baixar todos os 4 documentos do evento como arquivos .md
  const handleDownloadAllDocs = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const eventDocs = documents.filter(d => d.eventId === eventId);

    eventDocs.forEach(doc => {
      const blob = new Blob([doc.content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${event?.code || 'EVT'}_${doc.type}_${doc.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    setSyncFeedback(`Download dos 4 arquivos do evento "${event?.title}" concluído! Salve-os diretamente na pasta GabiProduz do Drive.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Oficial GabiProduz */}
      <div className="bg-gradient-to-r from-[#48243F] via-[#3B1C33] to-[#2F1528] text-white p-6 rounded-2xl border-b-4 border-[#B18A38] shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-widest text-[#B18A38] font-bold">
              Automação Documental em Nuvem (PRD 4.4)
            </span>
            <span className="text-[10px] bg-green-500/20 text-green-300 border border-green-500/40 px-2 py-0.5 rounded-full font-bold">
              Pasta: GabiProduz
            </span>
          </div>

          <h2 className="font-serif text-2xl font-bold mt-1">
            Google Drive — Pasta GabiProduz
          </h2>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#E2D7E0] mt-2">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#B18A38]" />
              Conta: <strong>{targetEmail}</strong>
            </span>
            <span className="hidden sm:inline text-white/40">•</span>
            <span className="flex items-center gap-1.5 font-mono">
              <FolderCheck className="w-3.5 h-3.5 text-[#B18A38]" />
              ID: <strong>{folderId}</strong>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={folderUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-[#B18A38] hover:bg-[#CBA24B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Abrir Pasta GabiProduz no Drive</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
          </a>

          <button
            onClick={handleTestConnection}
            disabled={testing}
            className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2.5 rounded-xl transition flex items-center space-x-1.5"
            title="Verificar status da pasta e permissões"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testando...' : 'Verificar Pasta'}</span>
          </button>
        </div>
      </div>

      {/* Resultado do Teste de Conexão */}
      {testResult && (
        <div className="p-5 rounded-xl border text-xs bg-[#FAF7F2] border-[#E5DDD3] text-[#34313B]">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-sm font-bold block mb-1 text-[#48243F]">
                Pasta "{testResult.folderName || 'GabiProduz'}" Vinculada com Sucesso!
              </strong>
              <p className="leading-relaxed text-[#6E6877]">{testResult.message}</p>
              
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a
                  href={testResult.folderUrl || folderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#48243F] hover:bg-[#5E3253] text-white px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 transition text-xs"
                >
                  <span>Acessar Pasta no Google Drive ({folderId})</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Toast */}
      {syncFeedback && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-900 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Grid de Pastas e Sincronização por Evento */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5DDD3] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-base font-bold text-[#48243F]">
              Gerenciamento de Documentos por Evento
            </h3>
            <p className="text-xs text-[#6E6877]">
              Orçamento, Proposta Comercial, Contrato e Ficha Cadastral direcionados à pasta <strong>GabiProduz</strong>
            </p>
          </div>

          <a
            href={folderUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#B18A38] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>Ver Pasta Raiz no Drive</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {events.map(ev => {
            const evDocs = documents.filter(d => d.eventId === ev.id);
            const isSyncing = syncingId === ev.id;

            return (
              <div
                key={ev.id}
                className="p-5 bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl flex flex-col justify-between space-y-4 hover:border-[#B18A38] transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#6E6877]">{ev.code}</span>
                    <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FolderSync className="w-3 h-3 text-green-600" />
                      <span>GabiProduz</span>
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-[#34313B] mt-2 line-clamp-1">{ev.title}</h4>
                  <p className="text-xs text-[#6E6877] mt-0.5">4 artefatos prontos para gravação</p>

                  <div className="mt-3 p-2.5 bg-white rounded-lg border border-[#E5DDD3] text-[11px] text-[#6E6877] space-y-1">
                    {evDocs.map(d => (
                      <div key={d.id} className="flex justify-between items-center truncate">
                        <span className="truncate">• {d.title}</span>
                        <span className="text-[9px] uppercase font-bold text-green-700 bg-green-50 px-1 py-0.5 rounded">
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5DDD3] flex flex-col sm:flex-row items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleSyncEvent(ev.id)}
                      disabled={isSyncing}
                      className="bg-[#48243F] hover:bg-[#5E3253] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center justify-center space-x-1.5 transition flex-1 sm:flex-initial"
                      title="Sincronizar via API Google Drive"
                    >
                      <FolderSync className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Gravando...' : 'Gravar no Drive'}</span>
                    </button>

                    <button
                      onClick={() => handleDownloadAllDocs(ev.id)}
                      className="p-1.5 border border-[#E5DDD3] bg-white hover:bg-gray-50 rounded-lg text-[#6E6877] hover:text-[#48243F] transition"
                      title="Baixar os 4 arquivos (.md) para arrastar até a pasta do Drive"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <a
                    href={folderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#B18A38] hover:underline font-semibold flex items-center space-x-1 self-end sm:self-center"
                  >
                    <span>Pasta no Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
