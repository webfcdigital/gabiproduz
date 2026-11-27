'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, User } from '../types';
import { ROLE_LABELS } from '../lib/utils';
import {
  ShieldCheck,
  Sparkles,
  UserCheck,
  Calendar,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  X,
  ArrowRight,
  LogIn,
  UserPlus
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, canClose = true }) => {
  const { users, currentUser, setCurrentUserAuth, artists, contractors, registerNewUser } = useApp();
  const [tab, setTab] = useState<'quick' | 'login' | 'register'>('quick');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('administrador');
  const [associatedArtistId, setAssociatedArtistId] = useState('');
  const [associatedContractorId, setAssociatedContractorId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectQuickUser = (user: User) => {
    setCurrentUserAuth(user);
    if (onClose) onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      setCurrentUserAuth(found);
      setSuccessMsg(`Bem-vindo(a) de volta, ${found.name}!`);
      setTimeout(() => {
        if (onClose) onClose();
      }, 800);
    } else {
      // Se não encontrar exatamente o e-mail, loga criando uma sessão correspondente
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email: email.trim(),
        role: 'administrador'
      };
      registerNewUser(newUser);
      setCurrentUserAuth(newUser);
      if (onClose) onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email: email.trim(),
      role,
      associatedArtistId: role === 'artista' ? (associatedArtistId || artists[0]?.id) : undefined,
      associatedContractorId: role === 'contratante' ? (associatedContractorId || contractors[0]?.id) : undefined,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`
    };

    registerNewUser(newUser);
    setCurrentUserAuth(newUser);
    setSuccessMsg(`Conta criada com sucesso para ${name}!`);
    setTimeout(() => {
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E5DDD3] overflow-hidden">
        
        {/* Header Elegante */}
        <div className="bg-gradient-to-r from-[#48243F] via-[#3B1C33] to-[#2F1528] p-6 text-white relative">
          {canClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#B18A38] text-white flex items-center justify-center font-serif text-xl font-bold shadow-inner">
              GP
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight">Gabriela Prieto</h2>
              <span className="text-[10px] text-[#E2D7E0] uppercase tracking-wider block font-semibold">
                Produção Executiva Musical
              </span>
            </div>
          </div>
          <p className="text-xs text-[#E2D7E0] italic font-light">
            Autenticação segura e controle de acesso baseado em papéis (RBAC).
          </p>

          {/* Abas */}
          <div className="flex space-x-2 mt-5">
            <button
              onClick={() => { setTab('quick'); setErrorMsg(''); }}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition ${
                tab === 'quick' ? 'bg-[#B18A38] text-white shadow' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              Acesso Rápido
            </button>
            <button
              onClick={() => { setTab('login'); setErrorMsg(''); }}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${
                tab === 'login' ? 'bg-[#B18A38] text-white shadow' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 inline mr-1" />
              <span>Entrar</span>
            </button>
            <button
              onClick={() => { setTab('register'); setErrorMsg(''); }}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${
                tab === 'register' ? 'bg-[#B18A38] text-white shadow' : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 inline mr-1" />
              <span>Novo Cadastro</span>
            </button>
          </div>
        </div>

        {/* Mensagens de Feedback */}
        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs px-4 py-2.5 border-b border-red-200">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-700 text-xs px-4 py-2.5 border-b border-green-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="p-6">
          {/* Aba 1: Acesso Rápido */}
          {tab === 'quick' && (
            <div className="space-y-4">
              <p className="text-xs text-[#6E6877]">
                Selecione o perfil desejado para entrar imediatamente no sistema com as permissões correspondentes:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {users.map(u => {
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSelectQuickUser(u)}
                      className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between group ${
                        isCurrent
                          ? 'border-[#B18A38] bg-[#FAF7F2] shadow-sm'
                          : 'border-[#E5DDD3] hover:border-[#48243F] hover:bg-[#FAF7F2]/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#48243F] text-white flex items-center justify-center font-bold text-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-sm text-[#34313B] group-hover:text-[#48243F]">
                              {u.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded">
                                Ativo
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#6E6877] block">{u.email}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          u.role === 'administrador'
                            ? 'bg-[#48243F] text-white'
                            : u.role === 'financeiro'
                            ? 'bg-amber-100 text-amber-900'
                            : u.role === 'artista'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}>
                          {u.role}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#B18A38] opacity-0 group-hover:opacity-100 transition" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Aba 2: Login E-mail e Senha */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#34313B] uppercase mb-1">
                  E-mail de Acesso
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6E6877] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ex: gabriela@gabrielaprieto.com.br"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#34313B] uppercase mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6E6877] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white text-sm font-semibold py-2.5 rounded-lg shadow transition"
              >
                Entrar no Sistema
              </button>
            </form>
          )}

          {/* Aba 3: Cadastro de Novo Usuário */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#34313B] uppercase mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#6E6877] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="ex: Maria Eduarda"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#34313B] uppercase mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6E6877] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="maria@email.com"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#34313B] uppercase mb-1">
                  Perfil de Acesso
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['administrador', 'financeiro', 'artista', 'contratante'] as UserRole[]).map(r => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setRole(r)}
                      className={`text-xs py-2 px-3 rounded-lg border font-medium capitalize text-left transition ${
                        role === r
                          ? 'border-[#B18A38] bg-[#FAF7F2] text-[#48243F] font-bold'
                          : 'border-[#E5DDD3] text-[#6E6877] hover:bg-gray-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Se for Artista, associar */}
              {role === 'artista' && (
                <div>
                  <label className="block text-xs font-semibold text-[#34313B] uppercase mb-1">
                    Vincular ao Artista Cadastrado
                  </label>
                  <select
                    value={associatedArtistId}
                    onChange={e => setAssociatedArtistId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  >
                    {artists.map(a => (
                      <option key={a.id} value={a.id}>{a.artisticName} ({a.name})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Se for Contratante, associar */}
              {role === 'contratante' && (
                <div>
                  <label className="block text-xs font-semibold text-[#34313B] uppercase mb-1">
                    Vincular ao Contratante / Empresa
                  </label>
                  <select
                    value={associatedContractorId}
                    onChange={e => setAssociatedContractorId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E5DDD3] rounded-lg focus:outline-none focus:border-[#B18A38]"
                  >
                    {contractors.map(c => (
                      <option key={c.id} value={c.id}>{c.companyName || c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#B18A38] hover:bg-[#CBA24B] text-white text-sm font-semibold py-2.5 rounded-lg shadow transition mt-2"
              >
                Cadastrar e Acessar
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
