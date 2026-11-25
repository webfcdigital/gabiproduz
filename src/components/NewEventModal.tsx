'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventStatus, PreProductionPackage } from '../types';
import { formatCurrency, calculateKmCost } from '../lib/utils';
import { Calendar, X, Sparkles, FolderSync, Plus } from 'lucide-react';

interface NewEventModalProps {
  onClose: () => void;
  onEventCreated: (eventId: string) => void;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({ onClose, onEventCreated }) => {
  const { artists, contractors, venues, addEvent } = useApp();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-12-05');
  const [startTime, setStartTime] = useState('17:00');
  const [soundcheckTime, setSoundcheckTime] = useState('17:30');
  const [showTime, setShowTime] = useState('18:30');
  const [endTime, setEndTime] = useState('20:30');

  const [artistId, setArtistId] = useState(artists[0]?.id || '');
  const [contractorId, setContractorId] = useState(contractors[0]?.id || '');
  const [venueId, setVenueId] = useState(venues[0]?.id || '');

  // Comercial e Pacotes
  const [pkg, setPkg] = useState<PreProductionPackage>('intermediario');
  const [preFee, setPreFee] = useState(600);
  const [hoursLimit, setHoursLimit] = useState(9);
  const [presencialFee, setPresencialFee] = useState(650);
  const [kmDistance, setKmDistance] = useState(40);
  const [additionalServicesFee, setAdditionalServicesFee] = useState(0);
  const [hasAudiovisual, setHasAudiovisual] = useState(false);

  // Manipular mudança de pacote
  const handlePackageChange = (p: PreProductionPackage) => {
    setPkg(p);
    if (p === 'essencial') {
      setPreFee(350);
      setHoursLimit(5);
    } else if (p === 'intermediario') {
      setPreFee(600);
      setHoursLimit(9);
    } else if (p === 'completo') {
      setPreFee(900);
      setHoursLimit(14);
    } else {
      setPreFee(500);
      setHoursLimit(8);
    }
  };

  const kmFee = calculateKmCost(kmDistance);
  const extraTotal = (hasAudiovisual ? 300 : 0) + additionalServicesFee;
  const totalFee = preFee + presencialFee + kmFee + extraTotal;
  const signalFee = totalFee * 0.40;
  const balanceFee = totalFee * 0.60;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !artistId || !contractorId || !venueId) {
      alert('Por favor, preencha o título do evento e selecione artista, cliente e local.');
      return;
    }

    const createdEvent = addEvent({
      title,
      status: 'orcamento',
      date,
      startTime,
      soundcheckTime,
      showTime,
      endTime,
      artistId,
      contractorId,
      venueId,
      preProductionPackage: pkg,
      preProductionHoursLimit: hoursLimit,
      preProductionFee: preFee,
      presencialFee,
      kmDistance,
      kmFee,
      additionalServicesFee: extraTotal,
      totalFee,
      signalFee,
      signalPaid: false,
      balanceFee,
      balancePaid: false,
      notes: 'Evento criado via Painel Administrativo com geração automática dos 4 documentos no Google Drive.'
    });

    onEventCreated(createdEvent.id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5DDD3] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-[#48243F] to-[#2F1528] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#B18A38]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#B18A38] text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Cadastrar Novo Evento & Gerar Documentos</h3>
              <p className="text-xs text-[#E2D7E0]">Dispara automaticamente a criação de pasta e 4 artefatos no Google Drive</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Identificação Geral */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#48243F] mb-3">1. Identificação do Evento</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block font-semibold text-[#6E6877] mb-1">Nome do Evento / Projeto</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Noite de Gala Empresarial / Show Acústico"
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg text-sm"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Data do Evento</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Vínculo de Recursos CRM */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#48243F] mb-3">2. Artista, Cliente e Local</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Atração Musical / Artista</label>
                <select
                  value={artistId}
                  onChange={e => setArtistId(e.target.value)}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg bg-[#FAF7F2]"
                >
                  {artists.map(a => (
                    <option key={a.id} value={a.id}>{a.artisticName} ({a.genre})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Contratante / Empresa</label>
                <select
                  value={contractorId}
                  onChange={e => setContractorId(e.target.value)}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg bg-[#FAF7F2]"
                >
                  {contractors.map(c => (
                    <option key={c.id} value={c.id}>{c.companyName || c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Espaço do Evento</label>
                <select
                  value={venueId}
                  onChange={e => setVenueId(e.target.value)}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg bg-[#FAF7F2]"
                >
                  {venues.map(v => (
                    <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Horários Operacionais */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#48243F] mb-3">3. Grade de Horários</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Montagem Palco</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Soundcheck</label>
                <input
                  type="time"
                  value={soundcheckTime}
                  onChange={e => setSoundcheckTime(e.target.value)}
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Início do Show</label>
                <input
                  type="time"
                  value={showTime}
                  onChange={e => setShowTime(e.target.value)}
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Término do Show</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Pacote e Regras Comerciais GabiProduz */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DDD3] space-y-4">
            <h4 className="font-serif text-sm font-bold text-[#48243F]">4. Composição de Honorários & Deslocamento</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Pacote de Pré-Produção</label>
                <select
                  value={pkg}
                  onChange={e => handlePackageChange(e.target.value as PreProductionPackage)}
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg bg-white"
                >
                  <option value="essencial">Essencial (Até 5h) — R$ 350,00</option>
                  <option value="intermediario">Intermediária (Até 9h) — R$ 600,00</option>
                  <option value="completo">Completa (Até 14h) — R$ 900,00</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Diária Presencial (R$)</label>
                <input
                  type="number"
                  value={presencialFee}
                  onChange={e => setPresencialFee(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Quilometragem Ida e Volta (km)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={kmDistance}
                    onChange={e => setKmDistance(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-[#E5DDD3] rounded-lg bg-white"
                  />
                  <span className="text-[11px] font-bold text-[#B18A38] whitespace-nowrap">x R$ 1,50/km</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#E5DDD3]">
              <label className="flex items-center space-x-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasAudiovisual}
                  onChange={e => setHasAudiovisual(e.target.checked)}
                  className="w-4 h-4 rounded text-[#48243F] focus:ring-[#B18A38]"
                />
                <span className="text-[#34313B] font-medium">Incluir Captação Audiovisual Bruta (Smartphones) (+ R$ 300,00)</span>
              </label>
            </div>

            {/* Resumo com Sinal de 40% */}
            <div className="bg-white p-3.5 rounded-lg border border-[#E5DDD3] flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs text-[#6E6877]">Investimento Total:</span>
                <div className="text-base font-bold text-[#48243F]">{formatCurrency(totalFee)}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[#B18A38]">Sinal de Reserva (40% - Spec 3):</span>
                <div className="text-sm font-bold text-[#2E7D32]">{formatCurrency(signalFee)}</div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5DDD3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold border border-[#E5DDD3] rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#48243F] hover:bg-[#5E3253] text-white text-xs font-semibold px-5 py-2 rounded-lg flex items-center space-x-1.5 shadow"
            >
              <FolderSync className="w-4 h-4 text-[#B18A38]" />
              <span>Salvar Evento & Gerar Documentos</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

