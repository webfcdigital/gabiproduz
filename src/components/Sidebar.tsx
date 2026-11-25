'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Kanban,
  CalendarDays,
  ClipboardList,
  FileText,
  DollarSign,
  Users,
  Music,
  Building,
  CheckCircle2,
  FolderSync
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser } = useApp();

  // Itens de navegação baseados no perfil RBAC
  const getNavItems = () => {
    if (currentUser.role === 'artista') {
      return [
        { id: 'dashboard', label: 'Painel do Artista', icon: Music },
        { id: 'calendar', label: 'Minha Agenda de Shows', icon: CalendarDays },
        { id: 'pre-production', label: 'Cronogramas & Rider', icon: ClipboardList },
        { id: 'documents', label: 'Meus Contratos', icon: FileText },
        { id: 'financial', label: 'Extrato de Repasses', icon: DollarSign }
      ];
    }

    if (currentUser.role === 'contratante') {
      return [
        { id: 'dashboard', label: 'Portal do Cliente', icon: LayoutDashboard },
        { id: 'documents', label: 'Propostas & Contratos', icon: FileText },
        { id: 'pre-production', label: 'Cronograma do Meu Evento', icon: ClipboardList },
        { id: 'financial', label: 'Status de Pagamentos', icon: DollarSign }
      ];
    }

    if (currentUser.role === 'financeiro') {
      return [
        { id: 'dashboard', label: 'Visão Geral Financeira', icon: LayoutDashboard },
        { id: 'financial', label: 'Fluxo de Caixa & Contas', icon: DollarSign },
        { id: 'pipeline', label: 'Pipeline de Eventos', icon: Kanban },
        { id: 'documents', label: 'Orçamentos & Contratos', icon: FileText },
        { id: 'calendar', label: 'Calendário de Eventos', icon: CalendarDays },
        { id: 'crm', label: 'Cadastros (CRM)', icon: Users }
      ];
    }

    // Administrador (Acesso completo)
    return [
      { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
      { id: 'pipeline', label: 'Pipeline (Kanban)', icon: Kanban },
      { id: 'calendar', label: 'Agenda & Calendário', icon: CalendarDays },
      { id: 'pre-production', label: 'Pré-Produção & Campo', icon: ClipboardList },
      { id: 'documents', label: 'Documentos & Google Drive', icon: FolderSync },
      { id: 'financial', label: 'Gestão Financeira', icon: DollarSign },
      { id: 'crm', label: 'Cadastros (Artistas / Clientes)', icon: Users }
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-[#E5DDD3] shadow-sm flex flex-col shrink-0 min-h-[calc(100vh-80px)]">
      
      {/* Informações do Usuário Ativo */}
      <div className="p-4 border-b border-[#E5DDD3] bg-[#FAF7F2]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#48243F] text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-semibold text-[#34313B] truncate">{currentUser.name}</h4>
            <span className="inline-block text-[11px] font-medium text-[#B18A38] uppercase tracking-wide">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Menus */}
      <nav className="p-3 space-y-1 flex-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#48243F] text-white shadow-sm'
                  : 'text-[#6E6877] hover:bg-[#FAF7F2] hover:text-[#48243F]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#B18A38]' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Banner de Sincronização Google Drive */}
      <div className="p-4 m-3 bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl text-xs text-[#6E6877]">
        <div className="flex items-center space-x-2 text-[#48243F] font-semibold mb-1">
          <FolderSync className="w-4 h-4 text-[#B18A38]" />
          <span>Google Workspace API</span>
        </div>
        <p className="leading-tight text-[11px]">
          Pastas e documentos são sincronizados automaticamente por evento.
        </p>
      </div>

    </aside>
  );
};

