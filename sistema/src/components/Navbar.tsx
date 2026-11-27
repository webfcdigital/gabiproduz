'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ROLE_LABELS } from '../lib/utils';
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  LogIn,
  LogOut,
  Database,
  User as UserIcon
} from 'lucide-react';

interface NavbarProps {
  onOpenNewEvent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewEvent }) => {
  const {
    currentUser,
    switchUserRole,
    resetToInitialData,
    setIsAuthModalOpen,
    logout,
    isDbConnected
  } = useApp();

  return (
    <header className="bg-gradient-to-r from-[#48243F] via-[#3B1C33] to-[#2F1528] text-white border-b-4 border-[#B18A38] shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Marca / Identidade */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-lg bg-[#B18A38] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-inner">
            GP
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold tracking-tight">Gabriela Prieto</span>
              <span className="hidden sm:inline-block text-[10px] bg-[#B18A38] text-white px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                Produção Executiva
              </span>
              {isDbConnected && (
                <span className="hidden md:inline-flex items-center space-x-1 text-[9px] bg-green-500/20 text-green-300 border border-green-500/40 px-2 py-0.5 rounded-full font-medium">
                  <Database className="w-2.5 h-2.5 text-green-400" />
                  <span>Supabase PostgreSQL</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#E2D7E0] italic font-light">"Ideias que acontecem." — Painel Integrado</p>
          </div>
        </div>

        {/* Controles de Topo & Role Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Alternador Rápido de Perfil (RBAC) */}
          <div className="bg-[#FAF7F2]/10 backdrop-blur-sm border border-[#FAF7F2]/20 rounded-xl p-1.5 flex items-center space-x-1">
            <span className="text-xs text-[#E2D7E0] font-medium px-2 hidden lg:inline">Perfil Ativo:</span>
            {(['administrador', 'financeiro', 'artista', 'contratante'] as UserRole[]).map(role => {
              const isActive = currentUser.role === role;
              return (
                <button
                  key={role}
                  onClick={() => switchUserRole(role)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all duration-150 flex items-center space-x-1 ${
                    isActive
                      ? 'bg-[#B18A38] text-white shadow-sm font-semibold scale-105'
                      : 'text-[#E2D7E0] hover:bg-white/10'
                  }`}
                  title={`Alternar para perfil de ${ROLE_LABELS[role].label}`}
                >
                  {role === 'administrador' && <ShieldCheck className="w-3.5 h-3.5 inline mr-1" />}
                  {role === 'financeiro' && <Sparkles className="w-3.5 h-3.5 inline mr-1" />}
                  {role === 'artista' && <UserCheck className="w-3.5 h-3.5 inline mr-1" />}
                  {role === 'contratante' && <Calendar className="w-3.5 h-3.5 inline mr-1" />}
                  <span className="capitalize">{role}</span>
                </button>
              );
            })}
          </div>

          {/* Área do Usuário Autenticado */}
          <div className="flex items-center space-x-2 border-l border-white/20 pl-3">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition text-xs text-left"
              title="Gerenciar Sessão / Trocar Usuário"
            >
              <div className="w-6 h-6 rounded-full bg-[#B18A38] text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold block truncate max-w-[100px] leading-tight">
                  {currentUser?.name}
                </span>
                <span className="text-[10px] text-[#E2D7E0] block leading-tight capitalize">
                  {currentUser?.role}
                </span>
              </div>
            </button>

            <button
              onClick={logout}
              title="Sair / Trocar de Conta"
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Botão Novo Evento (visível para Admin e Financeiro) */}
          {(currentUser.role === 'administrador' || currentUser.role === 'financeiro') && (
            <button
              onClick={onOpenNewEvent}
              className="bg-[#B18A38] hover:bg-[#CBA24B] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg shadow transition flex items-center space-x-1.5"
            >
              <span>+ Novo Evento</span>
            </button>
          )}

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (confirm('Deseja restaurar os dados de demonstração iniciais?')) {
                resetToInitialData();
              }
            }}
            title="Restaurar dados de demonstração"
            className="p-2 text-[#E2D7E0] hover:text-white hover:bg-white/10 rounded-lg transition hidden md:block"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};
