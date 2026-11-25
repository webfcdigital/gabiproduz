'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, formatCurrency, STATUS_LABELS } from '../lib/utils';
import { Calendar as CalendarIcon, Clock, MapPin, Music, User, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface EventCalendarProps {
  onSelectEvent: (eventId: string) => void;
  onOpenDocuments: (eventId: string) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({ onSelectEvent, onOpenDocuments }) => {
  const { events, artists, contractors, venues } = useApp();

  // Mês de referência (Dezembro 2026 como base)
  const [currentMonth] = useState('Dezembro 2026');

  // Ordenar eventos por data
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      
      {/* Header do Calendário */}
      <div className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#B18A38] uppercase tracking-wider">Agenda Centralizada (PRD 4.2)</span>
          <h2 className="font-serif text-2xl font-bold text-[#48243F] flex items-center gap-2">
            <span>Calendário de Eventos & Holds</span>
          </h2>
          <p className="text-xs text-[#6E6877]">Grade de shows confirmados e reservas de datas de artistas</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-[#FAF7F2] border border-[#E5DDD3] rounded-lg p-1">
            <button className="p-1 text-[#6E6877] hover:text-[#48243F] rounded hover:bg-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#48243F] px-3">{currentMonth}</span>
            <button className="p-1 text-[#6E6877] hover:text-[#48243F] rounded hover:bg-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid de Dias de Dezembro / Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEvents.map(event => {
          const artist = artists.find(a => a.id === event.artistId);
          const contractor = contractors.find(c => c.id === event.contractorId);
          const venue = venues.find(v => v.id === event.venueId);
          const statusInfo = STATUS_LABELS[event.status] || STATUS_LABELS['prospeccao'];
          const day = event.date.split('-')[2];

          return (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event.id)}
              className="bg-white rounded-xl border border-[#E5DDD3] shadow-sm hover:border-[#B18A38] hover:shadow-md transition cursor-pointer p-5 flex flex-col justify-between"
            >
              <div>
                {/* Data e Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#48243F] to-[#2F1528] text-white flex flex-col items-center justify-center font-bold shadow-sm">
                      <span className="text-sm leading-none">{day}</span>
                      <span className="text-[9px] uppercase font-light text-[#B18A38]">Dez</span>
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-[#6E6877] block">{event.code}</span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5"
                        style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onOpenDocuments(event.id);
                    }}
                    className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#B18A38] text-[#6E6877] hover:text-white transition"
                    title="Ver documentos"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                {/* Título do Evento */}
                <h3 className="font-semibold text-base text-[#34313B] line-clamp-1">{event.title}</h3>

                {/* Detalhes de Palco */}
                <div className="mt-3 space-y-1.5 text-xs text-[#6E6877]">
                  <div className="flex items-center truncate">
                    <Music className="w-3.5 h-3.5 mr-1.5 text-[#B18A38] shrink-0" />
                    <span className="truncate">{artist?.artisticName || 'Atração Musical'}</span>
                  </div>
                  <div className="flex items-center truncate">
                    <User className="w-3.5 h-3.5 mr-1.5 text-[#B18A38] shrink-0" />
                    <span className="truncate">{contractor?.companyName || contractor?.name}</span>
                  </div>
                  <div className="flex items-center truncate">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#B18A38] shrink-0" />
                    <span className="truncate">{venue?.name} — {venue?.city}/{venue?.state}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-[#B18A38] shrink-0" />
                    <span>Montagem: {event.startTime} | Show: {event.showTime} às {event.endTime}</span>
                  </div>
                </div>
              </div>

              {/* Rodapé com Valores e Sinal */}
              <div className="mt-4 pt-3 border-t border-[#FAF7F2] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-[#6E6877] block">Honorários:</span>
                  <strong className="text-sm font-bold text-[#48243F]">{formatCurrency(event.totalFee)}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#6E6877] block">Sinal de 40%:</span>
                  <span className={`font-semibold ${event.signalPaid ? 'text-[#2E7D32]' : 'text-[#D32F2F]'}`}>
                    {event.signalPaid ? '✓ Confirmado' : 'Pendente'}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

