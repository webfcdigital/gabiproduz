'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ROLE_LABELS } from '../lib/utils';
import { Sparkles, Calendar, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onOpenNewEvent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewEvent }) => {
  const { currentUser, switchUserRole, resetToInitialData } = useApp();

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
            </div>
            <p className="text-xs text-[#E2D7E0] italic font-light">"Ideias que acontecem." — Painel Integrado</p>
          </div>
        </div>

        {/* Controles de Topo & Role Switcher */}
        <div className="flex items-center space-x-4">
          
          {/* Alternador Rápido de Perfil (RBAC) */}
          <div className="bg-[#FAF7F2]/10 backdrop-blur-sm border border-[#FAF7F2]/20 rounded-xl p-1.5 flex items-center space-x-1">
            <span className="text-xs text-[#E2D7E0] font-medium px-2 hidden md:inline">Perfil Ativo:</span>
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

          {/* Botão Novo Evento (visível para Admin e Financeiro) */}
          {(currentUser.role === 'administrador' || currentUser.role === 'financeiro') && (
            <button
              onClick={onOpenNewEvent}
              className="bg-[#B18A38] hover:bg-[#CBA24B] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition flex items-center space-x-1.5"
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
            className="p-2 text-[#E2D7E0] hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
};

