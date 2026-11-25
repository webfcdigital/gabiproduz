'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { EventItem, EventStatus } from '../types';
import { formatCurrency, formatDate, STATUS_LABELS } from '../lib/utils';
import { Music, User, MapPin, ArrowRight, FolderSync, FileText, CheckCircle2 } from 'lucide-react';

interface EventPipelineProps {
  onSelectEvent: (eventId: string) => void;
  onOpenDocuments: (eventId: string) => void;
}

const PIPELINE_COLUMNS: { key: EventStatus; label: string; description: string }[] = [
  { key: 'prospeccao', label: 'Prospecção', description: 'Contatos e reuniões iniciais' },
  { key: 'orcamento', label: 'Orçamento', description: 'Proposta enviada em análise' },
  { key: 'contrato_assinado', label: 'Contrato Assinado', description: 'Sinal de 40% confirmado' },
  { key: 'pre_producao', label: 'Pré-Produção', description: 'Cronograma, riders e equipe' },
  { key: 'realizado', label: 'Realizado', description: 'Evento executado em campo' },
  { key: 'encerrado', label: 'Encerrado', description: 'Prestação de contas e pós' }
];

export const EventPipeline: React.FC<EventPipelineProps> = ({ onSelectEvent, onOpenDocuments }) => {
  const { events, updateEventStatus, artists, contractors, venues } = useApp();

  const handleAdvanceStatus = (event: EventItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const order: EventStatus[] = ['prospeccao', 'orcamento', 'contrato_assinado', 'pre_producao', 'realizado', 'encerrado'];
    const currentIndex = order.indexOf(event.status);
    if (currentIndex < order.length - 1) {
      updateEventStatus(event.id, order[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#48243F]">Pipeline de Eventos (Kanban)</h2>
        <p className="text-xs text-[#6E6877]">Acompanhamento visual do fluxo de contratação e execução</p>
      </div>

      {/* Grid de Colunas Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {PIPELINE_COLUMNS.map(col => {
          const colEvents = events.filter(e => e.status === col.key);
          const colStatusInfo = STATUS_LABELS[col.key];

          return (
            <div key={col.key} className="bg-[#FAF7F2] rounded-xl border border-[#E5DDD3] p-3 flex flex-col min-h-[500px]">
              
              {/* Header da Coluna */}
              <div className="pb-3 border-b border-[#E5DDD3] mb-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: colStatusInfo.bg, color: colStatusInfo.color }}
                  >
                    {col.label}
                  </span>
                  <span className="text-xs font-semibold text-[#6E6877] bg-white px-2 py-0.5 rounded-md border border-[#E5DDD3]">
                    {colEvents.length}
                  </span>
                </div>
                <p className="text-[11px] text-[#6E6877] mt-1 leading-tight">{col.description}</p>
              </div>

              {/* Lista de Cards da Coluna */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colEvents.map(event => {
                  const artist = artists.find(a => a.id === event.artistId);
                  const contractor = contractors.find(c => c.id === event.contractorId);
                  const venue = venues.find(v => v.id === event.venueId);

                  return (
                    <div
                      key={event.id}
                      onClick={() => onSelectEvent(event.id)}
                      className="bg-white p-3.5 rounded-lg border border-[#E5DDD3] shadow-sm hover:border-[#B18A38] hover:shadow transition cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#6E6877] mb-1 font-mono">
                        <span>{event.code}</span>
                        <span>{formatDate(event.date)}</span>
                      </div>

                      <h4 className="font-semibold text-sm text-[#34313B] group-hover:text-[#48243F] line-clamp-2">
                        {event.title}
                      </h4>

                      <div className="mt-2 space-y-1 text-xs text-[#6E6877]">
                        <div className="flex items-center truncate">
                          <Music className="w-3 h-3 mr-1 text-[#B18A38] shrink-0" />
                          <span className="truncate">{artist?.artisticName || 'Atração'}</span>
                        </div>
                        <div className="flex items-center truncate">
                          <User className="w-3 h-3 mr-1 text-[#B18A38] shrink-0" />
                          <span className="truncate">{contractor?.companyName || contractor?.name || 'Cliente'}</span>
                        </div>
                        <div className="flex items-center truncate">
                          <MapPin className="w-3 h-3 mr-1 text-[#B18A38] shrink-0" />
                          <span className="truncate">{venue?.city || 'São Paulo'} - {venue?.name}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-[#FAF7F2] flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[#48243F]">
                            {formatCurrency(event.totalFee)}
                          </div>
                          <div className="text-[10px] text-[#6E6877]">
                            Sinal: {event.signalPaid ? '✓ Pago' : 'Pendente'}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onOpenDocuments(event.id);
                            }}
                            className="p-1.5 rounded hover:bg-[#FAF7F2] text-[#6E6877] hover:text-[#48243F]"
                            title="Ver Documentos do Google Drive"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {col.key !== 'encerrado' && (
                            <button
                              onClick={e => handleAdvanceStatus(event, e)}
                              className="p-1.5 rounded bg-[#FAF7F2] hover:bg-[#B18A38] text-[#48243F] hover:text-white transition"
                              title="Avançar status"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}

                {colEvents.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-[#E5DDD3] rounded-lg flex items-center justify-center text-xs text-[#6E6877]">
                    Nenhum evento
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

