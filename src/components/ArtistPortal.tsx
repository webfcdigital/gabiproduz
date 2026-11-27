'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Music, Calendar, Clock, DollarSign, FileText, CheckCircle2, Save, Send } from 'lucide-react';

export const ArtistPortal: React.FC = () => {
  const { currentUser, artists, events, timeline, updateArtist, timeLogs, addTimeLog } = useApp();

  // Artista associado ou primeiro artista cadastrado
  const artist = artists.find(a => a.id === currentUser.associatedArtistId) || artists[0];
  const artistEvents = events.filter(e => e.artistId === artist?.id);
  const activeEvent = artistEvents[0] || events[0];

  const [activeTab, setActiveTab] = useState<'shows' | 'rider' | 'extrato' | 'horas'>('shows');

  // Estado para edição rápida de Rider
  const [riderText, setRiderText] = useState(artist?.riderNotes || '');
  const [pixKey, setPixKey] = useState(artist?.bankInfo.pixKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Apontamento de horas do artista
  const [logDesc, setLogDesc] = useState('');
  const [logHours, setLogHours] = useState('2.0');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  if (!artist) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#E5DDD3] text-center">
        <h3 className="font-serif text-lg font-bold text-[#48243F]">Portal do Artista</h3>
        <p className="text-sm text-[#6E6877] mt-2">Nenhum perfil de artista vinculado.</p>
      </div>
    );
  }

  const eventTimeline = timeline.filter(t => t.eventId === activeEvent?.id);
  const artistTimeLogs = timeLogs.filter(tl => tl.eventId === activeEvent?.id);

  const handleSaveRider = () => {
    updateArtist(artist.id, {
      riderNotes: riderText,
      bankInfo: {
        ...artist.bankInfo,
        pixKey
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddArtistTimeLog = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(logHours);
    if (!logDesc || isNaN(h) || h <= 0) return;

    addTimeLog({
      eventId: activeEvent.id,
      date: logDate,
      activityType: 'Outros',
      description: `[Artista] ${logDesc}`,
      hours: h,
      hourlyRate: 70,
      loggedBy: artist.artisticName
    });
    setLogDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho do Artista */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#172554] text-white p-6 rounded-2xl border-b-4 border-[#B18A38] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-[#B18A38] text-white flex items-center justify-center font-bold text-xl shadow-inner shrink-0">
            {artist.artisticName.charAt(0)}
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B18A38] font-bold">Portal do Artista & Banda</span>
            <h2 className="font-serif text-2xl font-bold mt-0.5">{artist.artisticName}</h2>
            <p className="text-xs text-blue-200">{artist.genre} • Cachê Base de Referência: {formatCurrency(artist.baseFee)}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 text-right">
          <span className="text-[11px] text-blue-200 uppercase font-medium">Próximo Show:</span>
          <strong className="text-sm text-white block">{activeEvent?.title}</strong>
          <span className="text-xs text-[#B18A38] font-bold">{formatDate(activeEvent?.date)}</span>
        </div>
      </div>

      {/* Abas do Artista */}
      <div className="flex border-b border-[#E5DDD3] space-x-2 bg-white px-4 pt-2 rounded-t-xl border-t border-x">
        <button
          onClick={() => setActiveTab('shows')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeTab === 'shows' ? 'bg-[#1E3A8A] text-white' : 'text-[#6E6877] hover:bg-[#FAF7F2]'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#B18A38]" />
          <span>Minha Agenda ({artistEvents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rider')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeTab === 'rider' ? 'bg-[#1E3A8A] text-white' : 'text-[#6E6877] hover:bg-[#FAF7F2]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#B18A38]" />
          <span>Rider Técnico & Mapa de Palco</span>
        </button>

        <button
          onClick={() => setActiveTab('extrato')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeTab === 'extrato' ? 'bg-[#1E3A8A] text-white' : 'text-[#6E6877] hover:bg-[#FAF7F2]'
          }`}
        >
          <DollarSign className="w-4 h-4 text-[#B18A38]" />
          <span>Extrato de Cachês & PIX</span>
        </button>

        <button
          onClick={() => setActiveTab('horas')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeTab === 'horas' ? 'bg-[#1E3A8A] text-white' : 'text-[#6E6877] hover:bg-[#FAF7F2]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#B18A38]" />
          <span>Horas de Ensaio & Preparação</span>
        </button>
      </div>

      {/* ABA: AGENDA & CRONOGRAMA */}
      {activeTab === 'shows' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-6">
          <div>
            <h3 className="font-serif text-base font-bold text-[#48243F]">Shows e Apresentações Confirmadas</h3>
            <p className="text-xs text-[#6E6877]">Grade horária com horários de montagem, passagem de som e início do espetáculo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artistEvents.map(ev => (
              <div key={ev.id} className="p-5 bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#B18A38] bg-white px-2 py-0.5 rounded border border-[#E5DDD3]">
                    {ev.code}
                  </span>
                  <span className="text-xs font-bold text-[#2E7D32] bg-green-50 px-2.5 py-0.5 rounded">
                    Confirmado
                  </span>
                </div>

                <h4 className="font-semibold text-base text-[#34313B]">{ev.title}</h4>

                <div className="text-xs text-[#6E6877] space-y-1.5 bg-white p-3 rounded-lg border border-[#E5DDD3]">
                  <p><strong>Data:</strong> {formatDate(ev.date)}</p>
                  <p><strong>Chegada dos Músicos / Doca:</strong> {ev.startTime}</p>
                  <p><strong>Passagem de Som (Soundcheck):</strong> {ev.soundcheckTime}</p>
                  <p><strong>Início do Show:</strong> <span className="font-bold text-[#1E3A8A]">{ev.showTime} às {ev.endTime}</span></p>
                </div>
              </div>
            ))}
          </div>

          {/* Cronograma Minuto a Minuto do Show Ativo */}
          <div className="mt-6 pt-4 border-t border-[#E5DDD3]">
            <h4 className="font-serif text-sm font-bold text-[#48243F] mb-3">Cronograma do Dia D — {activeEvent?.title}</h4>
            <div className="space-y-2">
              {eventTimeline.map(item => (
                <div key={item.id} className="p-3 bg-[#FAF7F2] border border-[#E5DDD3] rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-[#B18A38] bg-white px-2 py-0.5 rounded border border-[#E5DDD3]">
                      {item.time}
                    </span>
                    <span className="font-medium text-[#34313B]">{item.title}</span>
                  </div>
                  <span className="text-[#6E6877] text-[11px]">{item.responsible}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA: RIDER TÉCNICO */}
      {activeTab === 'rider' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-[#48243F]">Rider Técnico & Mapa de Palco</h3>
              <p className="text-xs text-[#6E6877]">Mantenha suas exigências técnicas de som e microfonação atualizadas para a equipe de produção</p>
            </div>

            <button
              onClick={handleSaveRider}
              className="bg-[#1E3A8A] hover:bg-[#172554] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Rider técnico e dados bancários atualizados com sucesso no sistema!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#6E6877] mb-1.5">
              Especificações Técnicas de Palco (Inputs, Microfones, Amplificadores, Retornos):
            </label>
            <textarea
              value={riderText}
              onChange={e => setRiderText(e.target.value)}
              rows={6}
              className="w-full p-4 border border-[#E5DDD3] rounded-xl text-xs font-mono leading-relaxed bg-[#FAF7F2] focus:bg-white focus:ring-2 focus:ring-[#B18A38]"
              placeholder="Descreva canais de som, microfones de voz, direct boxes, retornos in-ear ou de chão..."
            />
          </div>
        </div>
      )}

      {/* ABA: EXTRATO DE CACHÊS */}
      {activeTab === 'extrato' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-6">
          <div>
            <h3 className="font-serif text-base font-bold text-[#48243F]">Extrato de Cachês & Dados Bancários</h3>
            <p className="text-xs text-[#6E6877]">Acompanhe repasses realizados e a receber pela produtora</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl">
              <span className="text-[11px] font-bold text-[#6E6877] uppercase block">Cachê Base Acordado</span>
              <p className="text-2xl font-bold text-[#1E3A8A] mt-1">{formatCurrency(artist.baseFee)}</p>
              <p className="text-[11px] text-[#6E6877] mt-0.5">Por apresentação padrão</p>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl">
              <span className="text-[11px] font-bold text-[#6E6877] uppercase block">Próximo Repasse</span>
              <p className="text-2xl font-bold text-[#B18A38] mt-1">{formatCurrency(artist.baseFee)}</p>
              <p className="text-[11px] text-[#2E7D32] mt-0.5 font-semibold">Agendado para o dia do show</p>
            </div>

            <div className="p-4 bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl">
              <span className="text-[11px] font-bold text-[#6E6877] uppercase block">Chave PIX Cadastrada</span>
              <p className="text-sm font-mono font-bold text-[#34313B] mt-1 truncate">{artist.bankInfo.pixKey}</p>
              <p className="text-[11px] text-[#6E6877] mt-0.5">{artist.bankInfo.bankName}</p>
            </div>
          </div>
        </div>
      )}

      {/* ABA: HORAS DO ARTISTA */}
      {activeTab === 'horas' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-6">
          <div>
            <h3 className="font-serif text-base font-bold text-[#48243F]">Apontamento de Horas e Ensaios</h3>
            <p className="text-xs text-[#6E6877]">Envie registros de horas dedicadas a ensaios e reuniões para controle de produtividade</p>
          </div>

          <form onSubmit={handleAddArtistTimeLog} className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DDD3] grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-[#6E6877] mb-1">Data</label>
              <input
                type="date"
                value={logDate}
                onChange={e => setLogDate(e.target.value)}
                className="w-full p-2 border border-[#E5DDD3] rounded-lg bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#6E6877] mb-1">Horas Dedicadas</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={logHours}
                onChange={e => setLogHours(e.target.value)}
                className="w-full p-2 border border-[#E5DDD3] rounded-lg bg-white"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#6E6877] mb-1">Atividade Realizada</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={logDesc}
                  onChange={e => setLogDesc(e.target.value)}
                  placeholder="Ex: Ensaio de passagem de repertório dançante"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg bg-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#1E3A8A] hover:bg-[#172554] text-white px-3 py-2 rounded-lg font-semibold shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-2">
            {artistTimeLogs.map(l => (
              <div key={l.id} className="p-3 bg-[#FAF7F2] border border-[#E5DDD3] rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-[#34313B]">{l.description}</span>
                  <div className="text-[11px] text-[#6E6877] mt-0.5">
                    Data: {formatDate(l.date)} • Apontado por: {l.loggedBy}
                  </div>
                </div>
                <strong className="text-[#1E3A8A] font-bold">{l.hours.toFixed(1)}h</strong>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
