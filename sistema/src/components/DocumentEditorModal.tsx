'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventDocument } from '../types';
import { FileText, Save, CheckCircle2, ExternalLink, Printer, X, Sparkles, FolderSync, Download } from 'lucide-react';
import { GABIPRODUZ_FOLDER_URL } from '../lib/driveConstants';

interface DocumentEditorModalProps {
  eventId: string;
  onClose: () => void;
}

export const DocumentEditorModal: React.FC<DocumentEditorModalProps> = ({ eventId, onClose }) => {
  const { getEventDocuments, updateDocumentContent, updateDocumentStatus, events, syncEventWithGoogleDrive } = useApp();
  const event = events.find(e => e.id === eventId);
  const eventDocs = getEventDocuments(eventId);

  const [selectedDocId, setSelectedDocId] = useState<string>(eventDocs[0]?.id || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draftContent, setDraftContent] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const activeDoc = eventDocs.find(d => d.id === selectedDocId) || eventDocs[0];

  const handleSelectDoc = (doc: EventDocument) => {
    setSelectedDocId(doc.id);
    setIsEditing(false);
    setDraftContent(doc.content);
  };

  const handleStartEdit = () => {
    setDraftContent(activeDoc?.content || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (activeDoc) {
      updateDocumentContent(activeDoc.id, draftContent);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleSyncDrive = async () => {
    setIsSyncing(true);
    await syncEventWithGoogleDrive(eventId);
    setIsSyncing(false);
  };

  const handleDownloadDoc = () => {
    if (!activeDoc) return;
    const blob = new Blob([activeDoc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.code || 'EVT'}_${activeDoc.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5DDD3] w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Topbar do Modal */}
        <div className="bg-gradient-to-r from-[#48243F] to-[#2F1528] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#B18A38]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#B18A38] text-white">
              <FolderSync className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-lg font-bold">Documentos do Evento & Google Drive</h3>
                <span className="text-[10px] bg-[#B18A38] px-2 py-0.5 rounded font-mono font-semibold">
                  {event.code}
                </span>
              </div>
              <p className="text-xs text-[#E2D7E0]">{event.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={GABIPRODUZ_FOLDER_URL}
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition hidden sm:flex"
              title="Abrir Pasta Oficial GabiProduz no Google Drive (17OB8wMYr2niZs63iNPNb1l4XQjxTDRlV)"
            >
              <span>Pasta GabiProduz</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleSyncDrive}
              disabled={isSyncing}
              className="bg-[#B18A38] hover:bg-[#CBA24B] text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition shadow-sm"
            >
              <FolderSync className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Sincronizando...' : 'Gravar no Drive'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo do Editor: Barra Lateral de Documentos + Painel de Edição */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Seletor dos 4 Artefatos Padrões */}
          <div className="w-72 bg-[#FAF7F2] border-r border-[#E5DDD3] p-4 flex flex-col justify-between shrink-0">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E6877] block mb-2">
                Artefatos Automáticos (PRD 4.4)
              </span>
              {eventDocs.map(doc => {
                const isSelected = doc.id === activeDoc?.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => handleSelectDoc(doc)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-start space-x-2.5 ${
                      isSelected
                        ? 'bg-white border-[#B18A38] shadow-sm text-[#48243F]'
                        : 'border-transparent hover:bg-white/60 text-[#6E6877]'
                    }`}
                  >
                    <FileText className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-[#B18A38]' : 'text-gray-400'}`} />
                    <div className="overflow-hidden">
                      <h5 className="text-xs font-semibold truncate capitalize">{doc.type.replace('_', ' ')}</h5>
                      <p className="text-[11px] text-[#6E6877] truncate">{doc.title}</p>
                      <span className={`inline-block text-[9px] uppercase font-bold mt-1 px-1.5 py-0.2 rounded ${
                        doc.status === 'assinado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Link da Pasta do Evento no Google Drive */}
            <div className="p-3 bg-white border border-[#E5DDD3] rounded-xl text-xs space-y-2">
              <div className="flex items-center space-x-1.5 text-[#48243F] font-semibold">
                <ExternalLink className="w-3.5 h-3.5 text-[#B18A38]" />
                <span>Pasta no Google Drive</span>
              </div>
              <p className="text-[11px] text-[#6E6877] break-all leading-tight">
                {event.googleDriveFolderUrl}
              </p>
              <a
                href={event.googleDriveFolderUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#B18A38] hover:underline font-semibold block"
              >
                Abrir pasta no Drive &rarr;
              </a>
            </div>
          </div>

          {/* Área Principal de Visualização e Edição */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            
            {/* Barra de Ações do Documento Selecionado */}
            <div className="p-3.5 bg-white border-b border-[#E5DDD3] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#34313B]">{activeDoc?.title}</h4>
                <p className="text-[11px] text-[#6E6877]">
                  Última sincronização: {new Date(activeDoc?.updatedAt || '').toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                {saveSuccess && (
                  <span className="text-xs text-green-600 font-semibold flex items-center mr-2">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Salvo e Sincronizado!
                  </span>
                )}

                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-xs px-3 py-1.5 border border-[#E5DDD3] rounded-lg text-[#6E6877] hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Salvar Alterações</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleStartEdit}
                      className="bg-[#48243F] hover:bg-[#5E3253] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                    >
                      Editar Documento
                    </button>
                    <button
                      onClick={handleDownloadDoc}
                      className="p-1.5 border border-[#E5DDD3] rounded-lg text-[#6E6877] hover:bg-gray-50 flex items-center space-x-1"
                      title="Baixar Arquivo Markdown (.md) para o Google Drive"
                    >
                      <Download className="w-4 h-4 text-[#B18A38]" />
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 border border-[#E5DDD3] rounded-lg text-[#6E6877] hover:bg-gray-50"
                      title="Imprimir / Salvar em PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Conteúdo do Documento */}
            <div className="flex-1 p-6 overflow-y-auto font-sans text-sm text-[#34313B]">
              {isEditing ? (
                <textarea
                  value={draftContent}
                  onChange={e => setDraftContent(e.target.value)}
                  className="w-full h-full p-4 border border-[#B18A38] rounded-xl font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#B18A38]/30 resize-none"
                  placeholder="Escreva ou edite o documento..."
                />
              ) : (
                <div className="max-w-3xl mx-auto bg-[#FAF7F2] p-8 rounded-xl border border-[#E5DDD3] shadow-sm prose prose-sm">
                  <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-[#34313B] leading-relaxed">
                    {activeDoc?.content}
                  </pre>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

