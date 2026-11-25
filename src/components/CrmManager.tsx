'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../lib/utils';
import { Artist, Contractor, Venue } from '../types';
import { Music, Users, Building, Plus, Trash2, Phone, Mail, MapPin, Landmark } from 'lucide-react';

export const CrmManager: React.FC = () => {
  const { artists, addArtist, deleteArtist, contractors, addContractor, deleteContractor, venues, addVenue, deleteVenue } = useApp();
  const [tab, setTab] = useState<'artistas' | 'contratantes' | 'espacos'>('artistas');

  // Formulário Artista
  const [artName, setArtName] = useState('');
  const [artArtistic, setArtArtistic] = useState('');
  const [artGenre, setArtGenre] = useState('');
  const [artFee, setArtFee] = useState('');
  const [artPix, setArtPix] = useState('');
  const [artBank, setArtBank] = useState('');
  const [artRider, setArtRider] = useState('');

  // Formulário Contratante
  const [contName, setContName] = useState('');
  const [contCompany, setContCompany] = useState('');
  const [contDoc, setContDoc] = useState('');
  const [contEmail, setContEmail] = useState('');
  const [contPhone, setContPhone] = useState('');
  const [contCity, setContCity] = useState('');

  // Formulário Espaço
  const [venName, setVenName] = useState('');
  const [venAddress, setVenAddress] = useState('');
  const [venCity, setVenCity] = useState('');
  const [venCapacity, setVenCapacity] = useState('');
  const [venVoltage, setVenVoltage] = useState<'110V' | '220V' | 'Ambos'>('Ambos');

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
      soundCurfew: '23:00',
      contactName: 'Gerência do Local',
      contactPhone: '(11) 98888-8888',
      technicalNotes: 'Palco com pontos de tomada dedicados.'
    });
    setVenName('');
    setVenAddress('');
    setVenCity('');
    setVenCapacity('');
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold text-[#B18A38] uppercase tracking-wider">Cadastros Base & CRM (PRD 4.1)</span>
        <h2 className="font-serif text-2xl font-bold text-[#48243F]">Artistas, Contratantes & Espaços</h2>
        <p className="text-xs text-[#6E6877]">Administração centralizada do catálogo de recursos da produtora</p>
      </div>

      {/* Abas */}
      <div className="flex border-b border-[#E5DDD3] space-x-2">
        <button
          onClick={() => setTab('artistas')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            tab === 'artistas' ? 'bg-[#48243F] text-white' : 'text-[#6E6877] hover:bg-white'
          }`}
        >
          <Music className="w-4 h-4 text-[#B18A38]" />
          <span>Artistas ({artists.length})</span>
        </button>

        <button
          onClick={() => setTab('contratantes')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            tab === 'contratantes' ? 'bg-[#48243F] text-white' : 'text-[#6E6877] hover:bg-white'
          }`}
        >
          <Users className="w-4 h-4 text-[#B18A38]" />
          <span>Contratantes ({contractors.length})</span>
        </button>

        <button
          onClick={() => setTab('espacos')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            tab === 'espacos' ? 'bg-[#48243F] text-white' : 'text-[#6E6877] hover:bg-white'
          }`}
        >
          <Building className="w-4 h-4 text-[#B18A38]" />
          <span>Espaços de Eventos ({venues.length})</span>
        </button>
      </div>

      {/* ABA ARTISTAS */}
      {tab === 'artistas' && (
        <div className="space-y-6">
          <form onSubmit={handleAddArtist} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#48243F]">Cadastrar Novo Artista / Banda</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Nome Artístico / Banda</label>
                <input
                  type="text"
                  value={artArtistic}
                  onChange={e => setArtArtistic(e.target.value)}
                  placeholder="Ex: Trio Mandinga"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Gênero Musical</label>
                <input
                  type="text"
                  value={artGenre}
                  onChange={e => setArtGenre(e.target.value)}
                  placeholder="Ex: Samba de Gafieira"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Cachê Base (R$)</label>
                <input
                  type="number"
                  value={artFee}
                  onChange={e => setArtFee(e.target.value)}
                  placeholder="Ex: 3000"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Chave PIX para Repasse</label>
                <input
                  type="text"
                  value={artPix}
                  onChange={e => setArtPix(e.target.value)}
                  placeholder="Ex: pix@artista.com"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Banco / Agência</label>
                <input
                  type="text"
                  value={artBank}
                  onChange={e => setArtBank(e.target.value)}
                  placeholder="Ex: Nubank / Inter"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Ação</label>
                <button
                  type="submit"
                  className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Artista</span>
                </button>
              </div>
            </div>
          </form>

          {/* Cards de Artistas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {artists.map(art => (
              <div key={art.id} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#48243F] flex items-center justify-center font-bold text-base border border-[#E5DDD3]">
                    {art.artisticName.charAt(0)}
                  </div>
                  <button onClick={() => deleteArtist(art.id)} className="text-gray-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-semibold text-sm text-[#34313B]">{art.artisticName}</h4>
                <p className="text-xs text-[#B18A38] font-medium">{art.genre}</p>
                <p className="text-xs text-[#6E6877] mt-2 line-clamp-2">{art.bio}</p>

                <div className="mt-4 pt-3 border-t border-[#FAF7F2] text-xs space-y-1 text-[#6E6877]">
                  <div className="flex justify-between">
                    <span>Cachê Base:</span>
                    <strong className="text-[#48243F]">{formatCurrency(art.baseFee)}</strong>
                  </div>
                  <div className="flex justify-between truncate">
                    <span>PIX:</span>
                    <span className="font-mono text-[11px] truncate">{art.bankInfo.pixKey}</span>
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
            <h4 className="font-serif text-sm font-bold text-[#48243F]">Cadastrar Novo Contratante</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Nome do Responsável</label>
                <input
                  type="text"
                  value={contName}
                  onChange={e => setContName(e.target.value)}
                  placeholder="Ex: Mariana Silva"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Empresa / Razão Social</label>
                <input
                  type="text"
                  value={contCompany}
                  onChange={e => setContCompany(e.target.value)}
                  placeholder="Ex: Eventos Brasil Ltda"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">CNPJ / CPF</label>
                <input
                  type="text"
                  value={contDoc}
                  onChange={e => setContDoc(e.target.value)}
                  placeholder="Ex: 00.000.000/0001-00"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">E-mail</label>
                <input
                  type="email"
                  value={contEmail}
                  onChange={e => setContEmail(e.target.value)}
                  placeholder="contato@empresa.com"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Telefone / WhatsApp</label>
                <input
                  type="text"
                  value={contPhone}
                  onChange={e => setContPhone(e.target.value)}
                  placeholder="(11) 98888-7777"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Ação</label>
                <button
                  type="submit"
                  className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Cliente</span>
                </button>
              </div>
            </div>
          </form>

          {/* Cards de Contratantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contractors.map(cont => (
              <div key={cont.id} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#B18A38] flex items-center justify-center font-bold text-base border border-[#E5DDD3]">
                    {cont.name.charAt(0)}
                  </div>
                  <button onClick={() => deleteContractor(cont.id)} className="text-gray-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-semibold text-sm text-[#34313B]">{cont.companyName || cont.name}</h4>
                <p className="text-xs text-[#6E6877]">Resp: {cont.name}</p>

                <div className="mt-4 pt-3 border-t border-[#FAF7F2] text-xs space-y-1.5 text-[#6E6877]">
                  <div className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-[#B18A38]" />
                    <span className="truncate">{cont.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1.5 text-[#B18A38]" />
                    <span>{cont.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#B18A38]" />
                    <span>{cont.city} - {cont.state}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA ESPAÇOS */}
      {tab === 'espacos' && (
        <div className="space-y-6">
          <form onSubmit={handleAddVenue} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm space-y-3">
            <h4 className="font-serif text-sm font-bold text-[#48243F]">Cadastrar Espaço de Eventos</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#6E6877] mb-1">Nome do Espaço</label>
                <input
                  type="text"
                  value={venName}
                  onChange={e => setVenName(e.target.value)}
                  placeholder="Ex: Villa Blue Tree"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Cidade</label>
                <input
                  type="text"
                  value={venCity}
                  onChange={e => setVenCity(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Capacidade (Pessoas)</label>
                <input
                  type="number"
                  value={venCapacity}
                  onChange={e => setVenCapacity(e.target.value)}
                  placeholder="Ex: 500"
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block font-semibold text-[#6E6877] mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={venAddress}
                  onChange={e => setVenAddress(e.target.value)}
                  placeholder="Rua, número, bairro..."
                  className="w-full p-2 border border-[#E5DDD3] rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#6E6877] mb-1">Ação</label>
                <button
                  type="submit"
                  className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Local</span>
                </button>
              </div>
            </div>
          </form>

          {/* Cards de Espaços */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {venues.map(v => (
              <div key={v.id} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm hover:shadow transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] text-[#48243F] flex items-center justify-center font-bold text-base border border-[#E5DDD3]">
                    {v.name.charAt(0)}
                  </div>
                  <button onClick={() => deleteVenue(v.id)} className="text-gray-400 hover:text-red-600 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-semibold text-sm text-[#34313B]">{v.name}</h4>
                <p className="text-xs text-[#B18A38] font-medium">{v.city} - {v.state}</p>

                <div className="mt-4 pt-3 border-t border-[#FAF7F2] text-xs space-y-1 text-[#6E6877]">
                  <div className="flex justify-between">
                    <span>Capacidade:</span>
                    <strong className="text-[#48243F]">{v.capacity} pessoas</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Voltagem:</span>
                    <span>{v.voltage}</span>
                  </div>
                  <p className="text-[11px] italic mt-2 text-[#34313B]">{v.technicalNotes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
