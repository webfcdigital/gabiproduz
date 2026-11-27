'use client';

import React, { useState } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DashboardStats } from '../components/DashboardStats';
import { EventPipeline } from '../components/EventPipeline';
import { EventCalendar } from '../components/EventCalendar';
import { PreProductionPanel } from '../components/PreProductionPanel';
import { FinancialManager } from '../components/FinancialManager';
import { FinancialPortal } from '../components/FinancialPortal';
import { ContractorPortal } from '../components/ContractorPortal';
import { ArtistPortal } from '../components/ArtistPortal';
import { GoogleDriveManager } from '../components/GoogleDriveManager';
import { CrmManager } from '../components/CrmManager';
import { DocumentEditorModal } from '../components/DocumentEditorModal';
import { NewEventModal } from '../components/NewEventModal';
import { FileText, FolderSync, ExternalLink } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedEventIdForDocs, setSelectedEventIdForDocs] = useState<string | null>(null);
  const [selectedEventIdForPreProd, setSelectedEventIdForPreProd] = useState<string | undefined>(undefined);
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState<boolean>(false);

  const { events, documents, currentUser, artists, contractors } = useApp();

  const handleSelectEvent = (eventId: string) => {
    setSelectedEventIdForPreProd(eventId);
    setActiveTab('pre-production');
  };

  const handleOpenDocuments = (eventId?: string) => {
    const idToOpen = eventId || events[0]?.id;
    if (idToOpen) {
      setSelectedEventIdForDocs(idToOpen);
    }
  };

  const handleEventCreated = (newEventId: string) => {
    setIsNewEventModalOpen(false);
    setSelectedEventIdForDocs(newEventId);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col font-sans">
      
      {/* Barra de Navegação Superior */}
      <Navbar onOpenNewEvent={() => setIsNewEventModalOpen(true)} />

      {/* Estrutura Principal: Sidebar + Conteúdo */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar com Menus RBAC */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Área de Conteúdo */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          
          {/* Se perfil for Contratante: Exibe Portal do Contratante */}
          {currentUser.role === 'contratante' ? (
            <ContractorPortal onOpenDocument={handleOpenDocuments} />
          ) : currentUser.role === 'artista' ? (
            /* Se perfil for Artista: Exibe Portal do Artista */
            <ArtistPortal />
          ) : (
            /* Administrador e Financeiro */
            <>
              {/* Aba: Dashboard Geral */}
              {activeTab === 'dashboard' && (
                currentUser.role === 'financeiro' ? (
                  <FinancialPortal />
                ) : (
                  <DashboardStats
                    onSelectEvent={handleSelectEvent}
                    onOpenDocuments={() => handleOpenDocuments()}
                  />
                )
              )}

              {/* Aba: Pipeline de Eventos (Kanban) */}
              {activeTab === 'pipeline' && (
                <EventPipeline
                  onSelectEvent={handleSelectEvent}
                  onOpenDocuments={handleOpenDocuments}
                />
              )}

              {/* Aba: Calendário & Agenda */}
              {activeTab === 'calendar' && (
                <EventCalendar
                  onSelectEvent={handleSelectEvent}
                  onOpenDocuments={handleOpenDocuments}
                />
              )}

              {/* Aba: Operação & Pré-Produção */}
              {activeTab === 'pre-production' && (
                <PreProductionPanel
                  selectedEventId={selectedEventIdForPreProd}
                  onSelectEvent={id => setSelectedEventIdForPreProd(id)}
                />
              )}

              {/* Aba: Documentos & Google Drive */}
              {activeTab === 'documents' && (
                <div className="space-y-8">
                  {/* Gerenciador Oficial Google Drive com webfcosta@gmail.com */}
                  <GoogleDriveManager />

                  <div className="border-t border-[#E5DDD3] pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                      <div>
                        <span className="text-xs font-semibold text-[#B18A38] uppercase tracking-wider">
                          Pastas Sincronizadas por Evento
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#48243F]">
                          Repositório Documental em Nuvem
                        </h3>
                      </div>
                    </div>

                    {/* Grid de Pastas por Evento */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {events.map(event => {
                        const eventDocs = documents.filter(d => d.eventId === event.id);
                        const artist = artists.find(a => a.id === event.artistId);
                        const contractor = contractors.find(c => c.id === event.contractorId);

                        return (
                          <div
                            key={event.id}
                            className="bg-white rounded-xl border border-[#E5DDD3] shadow-sm hover:border-[#B18A38] hover:shadow-md transition p-5 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-2">
                                  <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#48243F]">
                                    <FolderSync className="w-5 h-5 text-[#B18A38]" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-mono font-bold text-[#6E6877] block">{event.code}</span>
                                    <span className="text-[10px] text-green-700 bg-green-100 font-semibold px-2 py-0.5 rounded-full inline-block">
                                      ✓ Drive Sincronizado
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <h3 className="font-semibold text-base text-[#34313B] line-clamp-1">{event.title}</h3>
                              <p className="text-xs text-[#6E6877] mt-1">
                                Cliente: <strong>{contractor?.companyName || contractor?.name}</strong> | Atração: <strong>{artist?.artisticName}</strong>
                              </p>

                              {/* Lista dos 4 Documentos */}
                              <div className="mt-4 pt-3 border-t border-[#FAF7F2] space-y-2">
                                <span className="text-[11px] font-bold text-[#6E6877] uppercase block">
                                  Documentos Gerados ({eventDocs.length}):
                                </span>
                                {eventDocs.map(doc => (
                                  <div
                                    key={doc.id}
                                    onClick={() => setSelectedEventIdForDocs(event.id)}
                                    className="p-2 rounded-lg bg-[#FAF7F2] hover:bg-white border border-[#E5DDD3] flex items-center justify-between text-xs cursor-pointer transition"
                                  >
                                    <div className="flex items-center space-x-2 truncate">
                                      <FileText className="w-3.5 h-3.5 text-[#B18A38] shrink-0" />
                                      <span className="font-medium text-[#34313B] truncate">{doc.title}</span>
                                    </div>
                                    <span className="text-[9px] uppercase font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded shrink-0">
                                      {doc.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-[#FAF7F2] flex items-center justify-between">
                              <button
                                onClick={() => setSelectedEventIdForDocs(event.id)}
                                className="text-xs font-semibold text-[#48243F] hover:text-[#B18A38] flex items-center"
                              >
                                <span>Abrir Editor no Painel</span>
                              </button>

                              <a
                                href={event.googleDriveFolderUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-[#B18A38] hover:underline font-semibold flex items-center space-x-1"
                              >
                                <span>Ver no Drive</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Aba: Gestão Financeira */}
              {activeTab === 'financial' && (
                currentUser.role === 'financeiro' ? (
                  <FinancialPortal />
                ) : (
                  <div className="space-y-6">
                    <FinancialPortal />
                    <div className="border-t border-[#E5DDD3] pt-6">
                      <FinancialManager />
                    </div>
                  </div>
                )
              )}

              {/* Aba: Cadastros Base & CRM */}
              {activeTab === 'crm' && <CrmManager />}
            </>
          )}

        </main>
      </div>

      {/* Modais Globais */}
      {selectedEventIdForDocs && (
        <DocumentEditorModal
          eventId={selectedEventIdForDocs}
          onClose={() => setSelectedEventIdForDocs(null)}
        />
      )}

      {isNewEventModalOpen && (
        <NewEventModal
          onClose={() => setIsNewEventModalOpen(false)}
          onEventCreated={handleEventCreated}
        />
      )}

    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
