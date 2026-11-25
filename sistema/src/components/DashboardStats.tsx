'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, STATUS_LABELS } from '../lib/utils';
import { Calendar, DollarSign, Clock, FileCheck2, ArrowUpRight, TrendingUp, Music, User } from 'lucide-react';

interface DashboardStatsProps {
  onSelectEvent: (eventId: string) => void;
  onOpenDocuments: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ onSelectEvent, onOpenDocuments }) => {
  const { events, timeLogs, transactions, currentUser, artists, contractors } = useApp();

  // Filtragem de dados caso o usuário seja artista ou contratante
  let filteredEvents = events;
  if (currentUser.role === 'artista' && currentUser.associatedArtistId) {
    filteredEvents = events.filter(e => e.artistId === currentUser.associatedArtistId);
  } else if (currentUser.role === 'contratante' && currentUser.associatedContractorId) {
    filteredEvents = events.filter(e => e.contractorId === currentUser.associatedContractorId);
  }

  // Cálculos de métricas
  const totalEvents = filteredEvents.length;
  const activeEvents = filteredEvents.filter(e => e.status !== 'encerrado' && e.status !== 'realizado').length;
  
  const totalRevenue = transactions
    .filter(t => t.type === 'receita')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPaidRevenue = transactions
    .filter(t => t.type === 'receita' && t.status === 'pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalHoursLogged = timeLogs.reduce((acc, tl) => acc + tl.hours, 0);

  return (
    <div className="space-y-6">
      
      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Eventos */}
        <div className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase tracking-wider">Eventos Ativos</span>
            <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#48243F]">
              <Calendar className="w-5 h-5 text-[#B18A38]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#48243F]">{activeEvents}</span>
            <span className="text-xs text-[#6E6877]">de {totalEvents} cadastrados</span>
          </div>
          <div className="mt-3 text-xs text-[#2E7D32] flex items-center font-medium">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>Operação e pré-produção ativas</span>
          </div>
        </div>

        {/* Card 2: Faturamento Total */}
        <div className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase tracking-wider">
              {currentUser.role === 'artista' ? 'Cachês Artísticos' : 'Receita em Produção'}
            </span>
            <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#B18A38]">
              <DollarSign className="w-5 h-5 text-[#48243F]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#48243F]">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="mt-3 text-xs text-[#6E6877] flex items-center justify-between">
            <span>Quitado:</span>
            <strong className="text-[#2E7D32] font-semibold">{formatCurrency(totalPaidRevenue)}</strong>
          </div>
        </div>

        {/* Card 3: Horas de Pré-Produção */}
        <div className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase tracking-wider">Horas Pré-Produção</span>
            <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#48243F]">
              <Clock className="w-5 h-5 text-[#B18A38]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#48243F]">{totalHoursLogged.toFixed(1)}h</span>
            <span className="text-xs text-[#6E6877]">rastreadas</span>
          </div>
          <div className="mt-3 text-xs text-[#B18A38] flex items-center font-medium">
            <span>Tarifa extra: R$ 70,00/h se exceder</span>
          </div>
        </div>

        {/* Card 4: Documentos & Google Drive */}
        <div className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase tracking-wider">Google Drive Sync</span>
            <div className="p-2.5 rounded-lg bg-[#FAF7F2] text-[#2E7D32]">
              <FileCheck2 className="w-5 h-5 text-[#2E7D32]" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xl font-bold text-[#2E7D32]">100% Sincronizado</span>
          </div>
          <div className="mt-3 text-xs text-[#6E6877] flex items-center justify-between">
            <span>4 docs por evento</span>
            <button
              onClick={onOpenDocuments}
              className="text-[#48243F] hover:text-[#B18A38] font-semibold underline flex items-center"
            >
              Ver docs <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Lista de Próximos Eventos em Destaque */}
      <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#48243F]">Próximos Eventos em Destaque</h3>
            <p className="text-xs text-[#6E6877]">Acompanhamento da esteira operacional e prazos</p>
          </div>
        </div>

        <div className="divide-y divide-[#E5DDD3]">
          {filteredEvents.map(event => {
            const artist = artists.find(a => a.id === event.artistId);
            const contractor = contractors.find(c => c.id === event.contractorId);
            const statusInfo = STATUS_LABELS[event.status] || STATUS_LABELS['prospeccao'];

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF7F2] px-3 rounded-lg cursor-pointer transition"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#48243F] text-white flex flex-col items-center justify-center font-bold text-xs shrink-0">
                    <span>{event.date.split('-')[2]}</span>
                    <span className="text-[9px] uppercase font-light">Dez</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm text-[#34313B]">{event.title}</h4>
                      <span className="text-xs text-[#6E6877] font-mono">({event.code})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#6E6877]">
                      <span className="flex items-center">
                        <Music className="w-3.5 h-3.5 mr-1 text-[#B18A38]" />
                        {artist?.artisticName || 'Atração'}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1 text-[#B18A38]" />
                        {contractor?.companyName || contractor?.name || 'Cliente'}
                      </span>
                      <span>Montagem: {event.startTime} | Show: {event.showTime} às {event.endTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 justify-end">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                  >
                    {statusInfo.label}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#48243F]">{formatCurrency(event.totalFee)}</div>
                    <div className="text-[11px] text-[#6E6877]">
                      Sinal: {event.signalPaid ? <span className="text-[#2E7D32] font-semibold">Pago</span> : <span className="text-[#D32F2F] font-semibold">Pendente</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

