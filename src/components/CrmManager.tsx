'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../lib/utils';
import { Artist, Contractor, Venue } from '../types';
import {
  Music,
  Users,
  Building,
  Plus,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Save,
  Check
} from 'lucide-react';

export const CrmManager: React.FC = () => {
  const {
    artists,
    addArtist,
    updateArtist,
    deleteArtist,
    contractors,
    addContractor,
    updateContractor,
    deleteContractor,
    venues,
    addVenue,
    updateVenue,
    deleteVenue
  } = useApp();

  const [tab, setTab] = useState<'artistas' | 'contratantes' | 'espacos'>('artistas');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ==========================================
  // ESTADOS DE CADASTRO NOVO
  // ==========================================
  // Artista
  const [artName, setArtName] = useState('');
  const [artArtistic, setArtArtistic] = useState('');
  const [artGenre, setArtGenre] = useState('');
  const [artFee, setArtFee] = useState('');
  const [artPix, setArtPix] = useState('');
  const [artBank, setArtBank] = useState('');
  const [artRider, setArtRider] = useState('');

  // Contratante
  const [contName, setContName] = useState('');
  const [contCompany, setContCompany] = useState('');
  const [contDoc, setContDoc] = useState('');
  const [contEmail, setContEmail] = useState('');
  const [contPhone, setContPhone] = useState('');
  const [contCity, setContCity] = useState('');

  // Espaço
  const [venName, setVenName] = useState('');
  const [venAddress, setVenAddress] = useState('');
  const [venCity, setVenCity] = useState('');
  const [venCapacity, setVenCapacity] = useState('');
  const [venVoltage, setVenVoltage] = useState<'110V' | '220V' | 'Ambos'>('Ambos');

  // ==========================================
  // ESTADOS DE EDIÇÃO (MODAIS)
  // ==========================================
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  // Submits de criação
  const handleAddArtist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artArtistic) return;
    addArtist({
      name: artName || artArtistic,
      artisticName: artArtistic,
      genre: artGenre || 'Música Brasileira',
      bio: 'Artista agenciado pela GabiProduz.',
      photoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      email: 'contato@artista.com',
      phone: '(11) 99999-9999',
      baseFee: parseFloat(artFee) || 2000,
      bankInfo: {
        pixKey: artPix || 'chave@pix.com',
        pixType: 'E-mail',
        bankName: artBank || 'Banco do Brasil',
        agency: '0001',
        account: '12345-6'
      },
      riderNotes: artRider || 'Rider padrão de voz e violão.',
      active: true
    });
    setArtName('');
    setArtArtistic('');
    setArtGenre('');
    setArtFee('');
    setArtPix('');
    setArtBank('');
    setArtRider('');
    showToast(`Artista "${artArtistic}" cadastrado com sucesso no Supabase!`);
  };

  const handleAddContractor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contName) return;
    addContractor({
      name: contName,
      companyName: contCompany || contName,
      document: contDoc || '00.000.000/0001-00',
      type: 'PJ',
      email: contEmail || 'contato@cliente.com',
      phone: contPhone || '(11) 99999-9999',
      address: 'Endereço Comercial',
      city: contCity || 'São Paulo',
      state: 'SP'
    });
    setContName('');
    setContCompany('');
    setContDoc('');
    setContEmail('');
    setContPhone('');
    setContCity('');
    showToast(`Contratante "${contCompany || contName}" cadastrado com sucesso no Supabase!`);
  };

  const handleAddVenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venName) return;
    addVenue({
      name: venName,
      address: venAddress || 'Endereço do Espaço',
      city: venCity || 'São Paulo',
      state: 'SP',
      capacity: parseInt(venCapacity) || 300,
      ceilingHeight: '3,50m',
      voltage: venVoltage,
      soundCurfew: '22:00',
      contactName: 'Gerência do Local',
      contactPhone: '(11) 98888-0000',
      technicalNotes: 'Doca de carga e acesso térreo facilitado.'
    });
    setVenName('');
    setVenAddress('');
    setVenCity('');
    setVenCapacity('');
    showToast(`Local "${venName}" cadastrado com sucesso no Supabase!`);
  };

  // Submits de edição
  const handleSaveArtistEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtist) return;
    updateArtist(editingArtist.id, editingArtist);
    showToast(`Cadastro de ${editingArtist.artisticName} atualizado com sucesso!`);
    setEditingArtist(null);
  };

  const handleSaveContractorEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContractor) return;
    updateContractor(editingContractor.id, editingContractor);
    showToast(`Cadastro de ${editingContractor.companyName || editingContractor.name} atualizado!`);
    setEditingContractor(null);
  };

  const handleSaveVenueEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVenue) return;
    updateVenue(editingVenue.id, editingVenue);
    showToast(`Espaço "${editingVenue.name}" atualizado com sucesso!`);
    setEditingVenue(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast de Sucesso */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#48243F] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 border-l-4 border-[#B18A38]">
          <CheckCircle2 className="w-5 h-5 text-[#B18A38]" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DDD3] pb-4">
        <div>
          <span className="text-xs font-semibold text-[#B18A38] uppercase tracking-wider">
            Gestão de Cadastros & CRM
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#48243F]">
            Artistas, Contratantes e Locais
          </h2>
          <p className="text-xs text-[#6E6877]">
            Base de dados unificada e persistida em tempo real no Supabase PostgreSQL.
          </p>
        </div>

        {/* Alternador de Abas */}
        <div className="flex bg-[#FAF7F2] p-1 rounded-xl border border-[#E5DDD3] text-xs">
          <button
            onClick={() => setTab('artistas')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              tab === 'artistas' ? 'bg-[#48243F] text-white shadow-sm font-semibold' : 'text-[#6E6877] hover:text-[#48243F]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>Artistas ({artists.length})</span>
          </button>
          <button
            onClick={() => setTab('contratantes')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              tab === 'contratantes' ? 'bg-[#48243F] text-white shadow-sm font-semibold' : 'text-[#6E6877] hover:text-[#48243F]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Contratantes ({contractors.length})</span>
          </button>
          <button
            onClick={() => setTab('espacos')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              tab === 'espacos' ? 'bg-[#48243F] text-white shadow-sm font-semibold' : 'text-[#6E6877] hover:text-[#48243F]'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Locais ({venues.length})</span>
          </button>
        </div>
      </div>

      {/* ABA ARTISTAS */}
      {tab === 'artistas' && (
        <div className="space-y-6">
          {/* Formulário Novo Artista */}
          <form onSubmit={handleAddArtist} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#48243F] flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#B18A38]" />
              <span>Cadastrar Novo Artista / Banda</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Nome Artístico *</label>
                <input
                  type="text"
                  value={artArtistic}
                  onChange={e => setArtArtistic(e.target.value)}
                  placeholder="Ex: Trio Harmony"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Nome Completo / Razão</label>
                <input
                  type="text"
                  value={artName}
                  onChange={e => setArtName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo de Souza"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Gênero Musical</label>
                <input
                  type="text"
                  value={artGenre}
                  onChange={e => setArtGenre(e.target.value)}
                  placeholder="Ex: MPB / Acústico"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Cachê Base (R$)</label>
                <input
                  type="number"
                  value={artFee}
                  onChange={e => setArtFee(e.target.value)}
                  placeholder="Ex: 2500"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Chave PIX</label>
                <input
                  type="text"
                  value={artPix}
                  onChange={e => setArtPix(e.target.value)}
                  placeholder="Ex: contato@artista.com"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Banco / Agência</label>
                <input
                  type="text"
                  value={artBank}
                  onChange={e => setArtBank(e.target.value)}
                  placeholder="Ex: Nubank / Inter"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#6E6877] mb-1">Ação</label>
                <button
                  type="submit"
                  className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Salvar Artista no Supabase</span>
                </button>
              </div>
            </div>
          </form>

          {/* Cards de Artistas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {artists.map(art => (
              <div key={art.id} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#48243F] flex items-center justify-center font-bold text-base border border-[#E5DDD3]">
                      {art.artisticName.charAt(0)}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setEditingArtist({ ...art })}
                        title="Editar Artista"
                        className="text-[#6E6877] hover:text-[#B18A38] p-1.5 rounded-lg hover:bg-[#FAF7F2] transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir artista ${art.artisticName}?`)) deleteArtist(art.id);
                        }}
                        title="Excluir Artista"
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-base text-[#34313B]">{art.artisticName}</h4>
                  <p className="text-xs text-[#B18A38] font-medium">{art.genre}</p>
                  <p className="text-xs text-[#6E6877] mt-2 line-clamp-2">{art.bio}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#FAF7F2] text-xs space-y-1.5 text-[#6E6877]">
                  <div className="flex justify-between">
                    <span>Cachê Base:</span>
                    <strong className="text-[#48243F]">{formatCurrency(art.baseFee)}</strong>
                  </div>
                  <div className="flex justify-between truncate">
                    <span>Chave PIX:</span>
                    <span className="font-mono text-[11px] truncate text-[#34313B]">{art.bankInfo?.pixKey || 'Não informada'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Telefone:</span>
                    <span className="text-[11px]">{art.phone || 'Não informado'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA CONTRATANTES */}
      {tab === 'contratantes' && (
        <div className="space-y-6">
          <form onSubmit={handleAddContractor} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#48243F] flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#B18A38]" />
              <span>Cadastrar Novo Contratante</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Nome do Responsável *</label>
                <input
                  type="text"
                  value={contName}
                  onChange={e => setContName(e.target.value)}
                  placeholder="Ex: Mariana Silva"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Empresa / Razão Social</label>
                <input
                  type="text"
                  value={contCompany}
                  onChange={e => setContCompany(e.target.value)}
                  placeholder="Ex: Kiki Produções Ltda"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">CNPJ / CPF</label>
                <input
                  type="text"
                  value={contDoc}
                  onChange={e => setContDoc(e.target.value)}
                  placeholder="Ex: 00.000.000/0001-00"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">E-mail</label>
                <input
                  type="email"
                  value={contEmail}
                  onChange={e => setContEmail(e.target.value)}
                  placeholder="contato@empresa.com"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={contPhone}
                  onChange={e => setContPhone(e.target.value)}
                  placeholder="(11) 98888-7777"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Ação</label>
                <button
                  type="submit"
                  className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Salvar Contratante no Supabase</span>
                </button>
              </div>
            </div>
          </form>

          {/* Cards de Contratantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {contractors.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {c.type}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setEditingContractor({ ...c })}
                        title="Editar Contratante"
                        className="text-[#6E6877] hover:text-[#B18A38] p-1.5 rounded-lg hover:bg-[#FAF7F2] transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir contratante ${c.companyName || c.name}?`)) deleteContractor(c.id);
                        }}
                        title="Excluir Contratante"
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-base text-[#34313B]">{c.companyName || c.name}</h4>
                  <p className="text-xs text-[#6E6877] mt-0.5">Resp: {c.name}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#FAF7F2] text-xs space-y-1.5 text-[#6E6877]">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-[#B18A38]" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-[#B18A38]" />
                    <span>{c.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-[#B18A38]" />
                    <span>{c.city} - {c.state}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA ESPAÇOS / LOCAIS */}
      {tab === 'espacos' && (
        <div className="space-y-6">
          <form onSubmit={handleAddVenue} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#48243F] flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#B18A38]" />
              <span>Cadastrar Novo Local de Evento</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Nome do Espaço *</label>
                <input
                  type="text"
                  value={venName}
                  onChange={e => setVenName(e.target.value)}
                  placeholder="Ex: Villa Bisutti"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Endereço</label>
                <input
                  type="text"
                  value={venAddress}
                  onChange={e => setVenAddress(e.target.value)}
                  placeholder="Ex: Rua Funchal, 500"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Cidade</label>
                <input
                  type="text"
                  value={venCity}
                  onChange={e => setVenCity(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Capacidade de Pessoas</label>
                <input
                  type="number"
                  value={venCapacity}
                  onChange={e => setVenCapacity(e.target.value)}
                  placeholder="Ex: 500"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Voltagem</label>
                <select
                  value={venVoltage}
                  onChange={e => setVenVoltage(e.target.value as any)}
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                >
                  <option value="110V">110V</option>
                  <option value="220V">220V</option>
                  <option value="Ambos">Ambos (110V / 220V)</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="block font-semibold text-[#6E6877] mb-1">Ação</label>
                <button
                  type="submit"
                  className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Salvar Espaço no Supabase</span>
                </button>
              </div>
            </div>
          </form>

          {/* Cards de Espaços */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {venues.map(v => (
              <div key={v.id} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                      Cap: {v.capacity} pax
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setEditingVenue({ ...v })}
                        title="Editar Local"
                        className="text-[#6E6877] hover:text-[#B18A38] p-1.5 rounded-lg hover:bg-[#FAF7F2] transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Excluir espaço ${v.name}?`)) deleteVenue(v.id);
                        }}
                        title="Excluir Local"
                        className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-base text-[#34313B]">{v.name}</h4>
                  <p className="text-xs text-[#6E6877] mt-1 flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-[#B18A38] mr-1 shrink-0" />
                    <span>{v.address}, {v.city} - {v.state}</span>
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#FAF7F2] text-xs space-y-1.5 text-[#6E6877]">
                  <div className="flex justify-between">
                    <span>Voltagem Elétrica:</span>
                    <strong className="text-[#48243F]">{v.voltage}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Limite de Horário de Som:</span>
                    <span className="font-semibold text-red-600">{v.soundCurfew || '22:00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pé Direito:</span>
                    <span>{v.ceilingHeight || 'Padrão'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DE EDIÇÃO DE ARTISTA
      ========================================== */}
      {editingArtist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E5DDD3] overflow-hidden">
            <div className="bg-[#48243F] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#B18A38]" />
                <h3 className="font-serif font-bold text-lg">Editar Artista / Atração</h3>
              </div>
              <button onClick={() => setEditingArtist(null)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArtistEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-[#34313B] uppercase mb-1">Nome Artístico</label>
                <input
                  type="text"
                  required
                  value={editingArtist.artisticName}
                  onChange={e => setEditingArtist({ ...editingArtist, artisticName: e.target.value })}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#34313B] uppercase mb-1">Nome Completo / Razão</label>
                <input
                  type="text"
                  value={editingArtist.name}
                  onChange={e => setEditingArtist({ ...editingArtist, name: e.target.value })}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Gênero Musical</label>
                  <input
                    type="text"
                    value={editingArtist.genre}
                    onChange={e => setEditingArtist({ ...editingArtist, genre: e.target.value })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Cachê Base (R$)</label>
                  <input
                    type="number"
                    value={editingArtist.baseFee}
                    onChange={e => setEditingArtist({ ...editingArtist, baseFee: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Chave PIX</label>
                  <input
                    type="text"
                    value={editingArtist.bankInfo?.pixKey || ''}
                    onChange={e => setEditingArtist({
                      ...editingArtist,
                      bankInfo: { ...(editingArtist.bankInfo || { pixType: 'Aleatória', bankName: '', agency: '', account: '' }), pixKey: e.target.value }
                    })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Telefone</label>
                  <input
                    type="text"
                    value={editingArtist.phone}
                    onChange={e => setEditingArtist({ ...editingArtist, phone: e.target.value })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#34313B] uppercase mb-1">Rider Técnico e Observações</label>
                <textarea
                  rows={3}
                  value={editingArtist.riderNotes}
                  onChange={e => setEditingArtist({ ...editingArtist, riderNotes: e.target.value })}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#E5DDD3]">
                <button
                  type="button"
                  onClick={() => setEditingArtist(null)}
                  className="px-4 py-2 border border-[#E5DDD3] rounded-lg text-[#6E6877] font-semibold hover:bg-[#FAF7F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B18A38] hover:bg-[#CBA24B] text-white font-semibold rounded-lg shadow flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DE EDIÇÃO DE CONTRATANTE
      ========================================== */}
      {editingContractor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E5DDD3] overflow-hidden">
            <div className="bg-[#48243F] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#B18A38]" />
                <h3 className="font-serif font-bold text-lg">Editar Contratante</h3>
              </div>
              <button onClick={() => setEditingContractor(null)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContractorEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-[#34313B] uppercase mb-1">Empresa / Razão Social</label>
                <input
                  type="text"
                  required
                  value={editingContractor.companyName}
                  onChange={e => setEditingContractor({ ...editingContractor, companyName: e.target.value })}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#34313B] uppercase mb-1">Nome do Responsável</label>
                <input
                  type="text"
                  required
                  value={editingContractor.name}
                  onChange={e => setEditingContractor({ ...editingContractor, name: e.target.value })}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">CNPJ / CPF</label>
                  <input
                    type="text"
                    value={editingContractor.document}
                    onChange={e => setEditingContractor({ ...editingContractor, document: e.target.value })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Tipo</label>
                  <select
                    value={editingContractor.type}
                    onChange={e => setEditingContractor({ ...editingContractor, type: e.target.value as any })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  >
                    <option value="PJ">Pessoa Jurídica (PJ)</option>
                    <option value="PF">Pessoa Física (PF)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">E-mail</label>
                  <input
                    type="email"
                    value={editingContractor.email}
                    onChange={e => setEditingContractor({ ...editingContractor, email: e.target.value })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Telefone</label>
                  <input
                    type="text"
                    value={editingContractor.phone}
                    onChange={e => setEditingContractor({ ...editingContractor, phone: e.target.value })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Cidade</label>
                  <input
                    type="text"
                    value={editingContractor.city}
                    onChange={e => setEditingContractor({ ...editingContractor, city: e.target.value })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Estado</label>
                  <input
                    type="text"
                    value={editingContractor.state}
                    onChange={e => setEditingContractor({ ...editingContractor, state: e.target.value })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#E5DDD3]">
                <button
                  type="button"
                  onClick={() => setEditingContractor(null)}
                  className="px-4 py-2 border border-[#E5DDD3] rounded-lg text-[#6E6877] font-semibold hover:bg-[#FAF7F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B18A38] hover:bg-[#CBA24B] text-white font-semibold rounded-lg shadow flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DE EDIÇÃO DE ESPAÇO / LOCAL
      ========================================== */}
      {editingVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E5DDD3] overflow-hidden">
            <div className="bg-[#48243F] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-[#B18A38]" />
                <h3 className="font-serif font-bold text-lg">Editar Local de Evento</h3>
              </div>
              <button onClick={() => setEditingVenue(null)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVenueEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="block font-semibold text-[#34313B] uppercase mb-1">Nome do Espaço</label>
                <input
                  type="text"
                  required
                  value={editingVenue.name}
                  onChange={e => setEditingVenue({ ...editingVenue, name: e.target.value })}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#34313B] uppercase mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={editingVenue.address}
                  onChange={e => setEditingVenue({ ...editingVenue, address: e.target.value })}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Cidade</label>
                  <input
                    type="text"
                    value={editingVenue.city}
                    onChange={e => setEditingVenue({ ...editingVenue, city: e.target.value })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Capacidade (Pax)</label>
                  <input
                    type="number"
                    value={editingVenue.capacity}
                    onChange={e => setEditingVenue({ ...editingVenue, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Voltagem Elétrica</label>
                  <select
                    value={editingVenue.voltage}
                    onChange={e => setEditingVenue({ ...editingVenue, voltage: e.target.value as any })}
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  >
                    <option value="110V">110V</option>
                    <option value="220V">220V</option>
                    <option value="Ambos">Ambos (110V / 220V)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#34313B] uppercase mb-1">Restrição de Horário (Som)</label>
                  <input
                    type="text"
                    value={editingVenue.soundCurfew}
                    onChange={e => setEditingVenue({ ...editingVenue, soundCurfew: e.target.value })}
                    placeholder="Ex: 22:00"
                    className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#34313B] uppercase mb-1">Notas Técnicas e Acessibilidade</label>
                <textarea
                  rows={2}
                  value={editingVenue.technicalNotes}
                  onChange={e => setEditingVenue({ ...editingVenue, technicalNotes: e.target.value })}
                  className="w-full p-2.5 border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#E5DDD3]">
                <button
                  type="button"
                  onClick={() => setEditingVenue(null)}
                  className="px-4 py-2 border border-[#E5DDD3] rounded-lg text-[#6E6877] font-semibold hover:bg-[#FAF7F2]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B18A38] hover:bg-[#CBA24B] text-white font-semibold rounded-lg shadow flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
