'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { ChecklistPhase, EventItem } from '../types';
import { Clock, CheckSquare, Calendar, AlertTriangle, Plus, Trash2, CheckCircle2, User } from 'lucide-react';

interface PreProductionPanelProps {
  selectedEventId?: string;
  onSelectEvent: (eventId: string) => void;
}

export const PreProductionPanel: React.FC<PreProductionPanelProps> = ({ selectedEventId, onSelectEvent }) => {
  const {
    events,
    timeline,
    addTimelineItem,
    toggleTimelineItemCompleted,
    deleteTimelineItem,
    checklist,
    addChecklistItem,
    toggleChecklistItemCompleted,
    deleteChecklistItem,
    timeLogs,
    addTimeLog,
    deleteTimeLog
  } = useApp();

  // Se nenhum evento foi passado, selecionar o primeiro ativo
  const activeEventId = selectedEventId || events[0]?.id;
  const currentEvent = events.find(e => e.id === activeEventId);

  const [activeTab, setActiveTab] = useState<'cronograma' | 'checklist' | 'horas'>('cronograma');
  const [selectedPhase, setSelectedPhase] = useState<ChecklistPhase | 'ALL'>('ALL');

  // Formulário Novo Item Cronograma
  const [newTime, setNewTime] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newResp, setNewResp] = useState('');

  // Formulário Nova Tarefa Checklist
  const [newChecklistTask, setNewChecklistTask] = useState('');
  const [newChecklistPhase, setNewChecklistPhase] = useState<ChecklistPhase>('D-14');
  const [newChecklistResp, setNewChecklistResp] = useState('Gabriela Prieto');
  const [newChecklistDeadline, setNewChecklistDeadline] = useState('');

  // Formulário Novo Registro de Horas
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logType, setLogType] = useState<'Reunião' | 'Briefing' | 'Cronograma' | 'Logística/Fornecedor' | 'Acessos/Staff' | 'Outros'>('Cronograma');
  const [logHours, setLogHours] = useState('1.5');
  const [logDesc, setLogDesc] = useState('');

  if (!currentEvent) {
    return (
      <div className="bg-white p-8 rounded-xl border border-[#E5DDD3] text-center">
        <p className="text-sm text-[#6E6877]">Nenhum evento selecionado para pré-produção.</p>
      </div>
    );
  }

  // Dados do evento ativo
  const eventTimeline = timeline.filter(t => t.eventId === currentEvent.id);
  const eventChecklist = checklist.filter(c => c.eventId === currentEvent.id);
  const eventTimeLogs = timeLogs.filter(tl => tl.eventId === currentEvent.id);

  // Cálculos de Horas
  const totalHoursLogged = eventTimeLogs.reduce((acc, l) => acc + l.hours, 0);
  const hoursLimit = currentEvent.preProductionHoursLimit || 9;
  const percentageUsed = Math.min((totalHoursLogged / hoursLimit) * 100, 100);
  const isNearLimit = totalHoursLogged >= hoursLimit * 0.8 && totalHoursLogged <= hoursLimit;
  const isExceeded = totalHoursLogged > hoursLimit;
  const exceededHours = isExceeded ? totalHoursLogged - hoursLimit : 0;
  const extraCharge = exceededHours * 70;

  const handleAddTimeline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newTitle) return;
    addTimelineItem({
      eventId: currentEvent.id,
      time: newTime,
      title: newTitle,
      responsible: newResp || 'Gabriela Prieto',
      completed: false
    });
    setNewTime('');
    setNewTitle('');
    setNewResp('');
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTask) return;
    addChecklistItem({
      eventId: currentEvent.id,
      phase: newChecklistPhase,
      task: newChecklistTask,
      responsible: newChecklistResp,
      deadline: newChecklistDeadline || currentEvent.date,
      completed: false
    });
    setNewChecklistTask('');
  };

  const handleAddTimeLog = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(logHours);
    if (!logDesc || isNaN(h) || h <= 0) return;
    addTimeLog({
      eventId: currentEvent.id,
      date: logDate,
      activityType: logType,
      description: logDesc,
      hours: h,
      hourlyRate: 70,
      loggedBy: 'Gabriela Prieto'
    });
    setLogDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Seletor de Evento Ativo */}
      <div className="bg-white p-4 rounded-xl border border-[#E5DDD3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-[#B18A38] uppercase tracking-wider">Módulo Operacional (PRD 4.5)</span>
          <h2 className="font-serif text-xl font-bold text-[#48243F] flex items-center gap-2">
            <span>Pré-Produção & Execução em Campo</span>
          </h2>
          <p className="text-xs text-[#6E6877]">Sincronização em tempo real de cronogramas, checklists e horas técnicas</p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-[#34313B]">Evento:</label>
          <select
            value={currentEvent.id}
            onChange={e => onSelectEvent(e.target.value)}
            className="text-xs font-medium bg-[#FAF7F2] border border-[#E5DDD3] rounded-lg p-2 focus:ring-2 focus:ring-[#B18A38]"
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.code} — {ev.title} ({formatDate(ev.date)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navegação entre as 3 Abas Operacionais */}
      <div className="flex border-b border-[#E5DDD3] space-x-2 bg-white px-4 pt-2 rounded-t-xl border-t border-x">
        <button
          onClick={() => setActiveTab('cronograma')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeTab === 'cronograma'
              ? 'bg-[#48243F] text-white'
              : 'text-[#6E6877] hover:text-[#48243F] hover:bg-[#FAF7F2]'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#B18A38]" />
          <span>Cronograma Minuto a Minuto ({eventTimeline.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeTab === 'checklist'
              ? 'bg-[#48243F] text-white'
              : 'text-[#6E6877] hover:text-[#48243F] hover:bg-[#FAF7F2]'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-[#B18A38]" />
          <span>Checklists de Pré-Produção ({eventChecklist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('horas')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeTab === 'horas'
              ? 'bg-[#48243F] text-white'
              : 'text-[#6E6877] hover:text-[#48243F] hover:bg-[#FAF7F2]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#B18A38]" />
          <span>Controle de Horas ({totalHoursLogged.toFixed(1)}h / {hoursLimit}h)</span>
        </button>
      </div>

      {/* CONTEÚDO DA ABA 1: CRONOGRAMA MINUTO A MINUTO */}
      {activeTab === 'cronograma' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-[#48243F]">Linha do Tempo Operacional</h3>
              <p className="text-xs text-[#6E6877]">Grade horária do dia do evento (chegada, montagem, passagem de som e show)</p>
            </div>
          </div>

          {/* Adicionar Novo Marco no Cronograma */}
          <form onSubmit={handleAddTimeline} className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DDD3] grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Horário (ex: 17:30)</label>
              <input
                type="time"
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="w-full text-xs p-2 border border-[#E5DDD3] rounded-lg bg-white"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Atividade / Marco Operacional</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Ex: Passagem de Som (Soundcheck rigoroso)"
                className="w-full text-xs p-2 border border-[#E5DDD3] rounded-lg bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Responsável</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newResp}
                  onChange={e => setNewResp(e.target.value)}
                  placeholder="Ex: Gabriela / Técnico Som"
                  className="w-full text-xs p-2 border border-[#E5DDD3] rounded-lg bg-white"
                />
                <button
                  type="submit"
                  className="bg-[#48243F] hover:bg-[#5E3253] text-white px-3 py-2 rounded-lg text-xs font-semibold shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>

          {/* Timeline Visual */}
          <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5DDD3]">
            {eventTimeline.map(item => (
              <div key={item.id} className="relative flex items-start space-x-3 group">
                <button
                  onClick={() => toggleTimelineItemCompleted(item.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center -ml-6 transition border-2 ${
                    item.completed
                      ? 'bg-[#2E7D32] border-[#2E7D32] text-white'
                      : 'bg-white border-[#B18A38] text-transparent hover:text-[#B18A38]'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>

                <div className={`flex-1 p-3.5 rounded-xl border transition ${
                  item.completed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-[#FAF7F2] border-[#E5DDD3]'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#B18A38] bg-white px-2 py-0.5 rounded border border-[#E5DDD3]">
                      {item.time}
                    </span>
                    <button
                      onClick={() => deleteTimelineItem(item.id)}
                      className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className={`text-sm font-semibold mt-1.5 ${item.completed ? 'line-through text-gray-500' : 'text-[#34313B]'}`}>
                    {item.title}
                  </h4>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-[#6E6877]">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1 text-[#B18A38]" /> {item.responsible}
                    </span>
                    {item.notes && <span className="italic">{item.notes}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 2: CHECKLISTS DE PRÉ-PRODUÇÃO */}
      {activeTab === 'checklist' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-base font-bold text-[#48243F]">Checklist Operacional por Fases</h3>
              <p className="text-xs text-[#6E6877]">Tarefas divididas por marcos temporais (D-30, D-14, D-2, Dia D e Pós)</p>
            </div>

            {/* Filtro por Fase */}
            <div className="flex flex-wrap gap-1">
              {(['ALL', 'D-30', 'D-14', 'D-2', 'D-Day', 'Pos'] as const).map(phase => (
                <button
                  key={phase}
                  onClick={() => setSelectedPhase(phase)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedPhase === phase
                      ? 'bg-[#B18A38] text-white font-semibold'
                      : 'bg-[#FAF7F2] text-[#6E6877] hover:bg-gray-200'
                  }`}
                >
                  {phase === 'ALL' ? 'Todas' : phase}
                </button>
              ))}
            </div>
          </div>

          {/* Adicionar Tarefa */}
          <form onSubmit={handleAddChecklist} className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DDD3] grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Nova Tarefa</label>
              <input
                type="text"
                value={newChecklistTask}
                onChange={e => setNewChecklistTask(e.target.value)}
                placeholder="Ex: Checagem de aterramento e voltagem do palco"
                className="w-full text-xs p-2 border border-[#E5DDD3] rounded-lg bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Fase</label>
              <select
                value={newChecklistPhase}
                onChange={e => setNewChecklistPhase(e.target.value as ChecklistPhase)}
                className="w-full text-xs p-2 border border-[#E5DDD3] rounded-lg bg-white"
              >
                <option value="D-30">D-30 (Contratos / Sinal)</option>
                <option value="D-14">D-14 (Logística / Rider)</option>
                <option value="D-2">D-2 (Reta Final)</option>
                <option value="D-Day">D-Day (Dia do Evento)</option>
                <option value="Pos">Pós (Reembolsos / Brutos)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Ação</label>
              <button
                type="submit"
                className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Tarefa</span>
              </button>
            </div>
          </form>

          {/* Lista de Checklists */}
          <div className="space-y-2">
            {eventChecklist
              .filter(c => selectedPhase === 'ALL' || c.phase === selectedPhase)
              .map(item => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItemCompleted(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    item.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-[#E5DDD3] hover:border-[#B18A38]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-[#48243F] focus:ring-[#B18A38] border-[#E5DDD3]"
                    />
                    <div>
                      <span className={`text-xs font-semibold ${item.completed ? 'line-through text-gray-400' : 'text-[#34313B]'}`}>
                        {item.task}
                      </span>
                      <div className="flex items-center space-x-3 mt-1 text-[11px] text-[#6E6877]">
                        <span className="font-bold text-[#B18A38]">{item.phase}</span>
                        <span>Resp: {item.responsible}</span>
                        <span>Prazo: {formatDate(item.deadline)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteChecklistItem(item.id);
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO DA ABA 3: CONTROLE DE HORAS */}
      {activeTab === 'horas' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-6">
          <div>
            <h3 className="font-serif text-base font-bold text-[#48243F]">Apontamento de Horas de Pré-Produção</h3>
            <p className="text-xs text-[#6E6877]">
              Pacote contratado: <strong className="capitalize">{currentEvent.preProductionPackage}</strong> (Teto: {hoursLimit} horas)
            </p>
          </div>

          {/* Barra de Progresso Visual de Horas */}
          <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DDD3]">
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-[#34313B]">
                Horas Lançadas: <strong>{totalHoursLogged.toFixed(1)}h</strong> de {hoursLimit}h
              </span>
              <span className="text-[#6E6877]">{percentageUsed.toFixed(0)}% do pacote</span>
            </div>
            
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isExceeded ? 'bg-red-600' : isNearLimit ? 'bg-amber-500' : 'bg-[#2E7D32]'
                }`}
                style={{ width: `${percentageUsed}%` }}
              />
            </div>

            {/* Alertas Automáticos do PRD */}
            {isNearLimit && !isExceeded && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Atenção ao Escopo (Spec 1):</strong> Você atingiu mais de 80% da franquia contratada. Comunique o cliente caso novas demandas extras sejam solicitadas para faturamento adicional a R$ 70,00/h.
                </span>
              </div>
            )}

            {isExceeded && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    <strong>Limite do Pacote Excedido!</strong> Excedente de <strong>{excedenteFormat(exceededHours)}h</strong>.
                  </span>
                </div>
                <strong className="text-red-700 font-bold bg-white px-2.5 py-1 rounded border border-red-200">
                  + {formatCurrency(extraCharge)} a faturar
                </strong>
              </div>
            )}
          </div>

          {/* Lançar Nova Atividade de Horas */}
          <form onSubmit={handleAddTimeLog} className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E5DDD3] grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Data</label>
              <input
                type="date"
                value={logDate}
                onChange={e => setLogDate(e.target.value)}
                className="w-full text-xs p-2 border border-[#E5DDD3] rounded-lg bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Tipo</label>
              <select
                value={logType}
                onChange={e => setLogType(e.target.value as any)}
                className="w-full text-xs p-2 border border-[#E5DDD3] rounded-lg bg-white"
              >
                <option value="Reunião">Reunião Online</option>
                <option value="Briefing">Briefing / Levantamento</option>
                <option value="Cronograma">Cronograma Minuto a Minuto</option>
                <option value="Logística/Fornecedor">Contato Fornecedores</option>
                <option value="Acessos/Staff">Acessos & Staff</option>
                <option value="Outros">Outras Demandas</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Horas Dedicadas (ex: 1.5)</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={logHours}
                onChange={e => setLogHours(e.target.value)}
                className="w-full text-xs p-2 border border-[#E5DDD3] rounded-lg bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Ação</label>
              <button
                type="submit"
                className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Horas</span>
              </button>
            </div>
            <div className="sm:col-span-4">
              <input
                type="text"
                value={logDesc}
                onChange={e => setLogDesc(e.target.value)}
                placeholder="Descrição detalhada da atividade executada..."
                className="w-full text-xs p-2 border border-[#E5DDD3] rounded-lg bg-white"
                required
              />
            </div>
          </form>

          {/* Tabela de Lançamentos */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF7F2] text-[#48243F] border-b border-[#E5DDD3] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Data</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3">Descrição</th>
                  <th className="p-3 text-center">Horas</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DDD3]">
                {eventTimeLogs.map(log => (
                  <tr key={log.id} className="hover:bg-[#FAF7F2]">
                    <td className="p-3 font-mono">{formatDate(log.date)}</td>
                    <td className="p-3">
                      <span className="bg-white border border-[#E5DDD3] px-2 py-0.5 rounded text-[#48243F] font-semibold">
                        {log.activityType}
                      </span>
                    </td>
                    <td className="p-3 text-[#34313B]">{log.description}</td>
                    <td className="p-3 text-center font-bold text-[#48243F]">{log.hours.toFixed(2)}h</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteTimeLog(log.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};

function excedenteFormat(val: number): string {
  return val.toFixed(2);
}

