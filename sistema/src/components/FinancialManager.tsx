'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { FinancialTransaction, TransactionType, TransactionStatus } from '../types';
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Plus, CheckCircle2, Clock, Trash2, FileCheck } from 'lucide-react';

export const FinancialManager: React.FC = () => {
  const { transactions, addTransaction, updateTransactionStatus, deleteTransaction, events } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Formulário de Nova Transação
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('receita');
  const [category, setCategory] = useState('Honorários de Produção');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [recipient, setRecipient] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  // Totais
  const totalReceitas = transactions
    .filter(t => t.type === 'receita')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDespesas = transactions
    .filter(t => t.type !== 'receita')
    .reduce((acc, t) => acc + t.amount, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!desc || isNaN(val) || val <= 0) return;

    addTransaction({
      eventId: selectedEventId || undefined,
      type,
      description: desc,
      amount: val,
      dueDate,
      status: 'pendente',
      category,
      recipientOrPayer: recipient || 'GabiProduz'
    });

    setDesc('');
    setAmount('');
    setRecipient('');
  };

  const filteredTransactions = transactions.filter(t => {
    if (filterType !== 'ALL' && t.type !== filterType) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold text-[#B18A38] uppercase tracking-wider">Módulo Comercial & Financeiro (PRD 4.3)</span>
        <h2 className="font-serif text-2xl font-bold text-[#48243F]">Gestão Financeira & Fluxo de Caixa</h2>
        <p className="text-xs text-[#6E6877]">Controle de honorários, repasses a artistas e reembolsos operacionais</p>
      </div>

      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase">Receitas Totais</span>
            <ArrowUpCircle className="w-5 h-5 text-[#2E7D32]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#2E7D32]">{formatCurrency(totalReceitas)}</div>
          <p className="text-[11px] text-[#6E6877] mt-1">Sinais (40%) e Saldos (60%) de eventos</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase">Repasses & Custos</span>
            <ArrowDownCircle className="w-5 h-5 text-[#D32F2F]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#D32F2F]">{formatCurrency(totalDespesas)}</div>
          <p className="text-[11px] text-[#6E6877] mt-1">Cachês de artistas e custos de campo</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase">Margem Líquida da Produtora</span>
            <DollarSign className="w-5 h-5 text-[#B18A38]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#48243F]">{formatCurrency(saldoLiquido)}</div>
          <p className="text-[11px] text-[#2E7D32] mt-1 font-semibold">Operação sustentável e previsível</p>
        </div>

      </div>

      {/* Formulário de Novo Lançamento */}
      <form onSubmit={handleAddTx} className="bg-white p-5 rounded-xl border border-[#E5DDD3] shadow-sm space-y-4">
        <h4 className="font-serif text-sm font-bold text-[#48243F]">Novo Lançamento Financeiro</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Tipo de Lançamento</label>
            <select
              value={type}
              onChange={e => {
                const t = e.target.value as TransactionType;
                setType(t);
                if (t === 'receita') setCategory('Honorários de Produção');
                else if (t === 'repasse_artista') setCategory('Repasse a Artistas');
                else if (t === 'reembolso_km') setCategory('Despesas Reembolsáveis');
                else setCategory('Despesas Operacionais');
              }}
              className="w-full p-2 border border-[#E5DDD3] rounded-lg bg-[#FAF7F2]"
            >
              <option value="receita">Receita (Honorários / Cliente)</option>
              <option value="repasse_artista">Repasse de Cachê a Artista</option>
              <option value="reembolso_km">Reembolso de Deslocamento (R$ 1,50/km)</option>
              <option value="despesa_producao">Despesa de Produção / Terceiros</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full p-2 border border-[#E5DDD3] rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Data de Vencimento</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full p-2 border border-[#E5DDD3] rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Evento Vinculado</label>
            <select
              value={selectedEventId}
              onChange={e => setSelectedEventId(e.target.value)}
              className="w-full p-2 border border-[#E5DDD3] rounded-lg bg-[#FAF7F2]"
            >
              <option value="">Nenhum (Lançamento Geral)</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.code} - {ev.title}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Descrição</label>
            <input
              type="text"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Ex: Saldo restante de 60% — Happy Hour Kiki Danças"
              className="w-full p-2 border border-[#E5DDD3] rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#6E6877] mb-1">Favorecido / Pagador</label>
            <input
              type="text"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              placeholder="Ex: Kiki Bar e Danças"
              className="w-full p-2 border border-[#E5DDD3] rounded-lg"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-[#48243F] hover:bg-[#5E3253] text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Lançamento</span>
            </button>
          </div>
        </div>
      </form>

      {/* Tabela de Transações com Filtros */}
      <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#E5DDD3] flex flex-wrap items-center justify-between gap-3 bg-[#FAF7F2]">
          <h4 className="font-serif text-sm font-bold text-[#48243F]">Extrato de Lançamentos ({filteredTransactions.length})</h4>
          
          <div className="flex items-center space-x-2 text-xs">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="p-1.5 border border-[#E5DDD3] rounded bg-white"
            >
              <option value="ALL">Todos os Tipos</option>
              <option value="receita">Apenas Receitas</option>
              <option value="repasse_artista">Repasses a Artistas</option>
              <option value="reembolso_km">Reembolso de Km</option>
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="p-1.5 border border-[#E5DDD3] rounded bg-white"
            >
              <option value="ALL">Todos os Status</option>
              <option value="pago">Quitados</option>
              <option value="pendente">Pendentes</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF7F2] text-[#48243F] uppercase tracking-wider border-b border-[#E5DDD3]">
              <tr>
                <th className="p-3">Data Venc.</th>
                <th className="p-3">Descrição / Favorecido</th>
                <th className="p-3">Categoria</th>
                <th className="p-3 text-right">Valor</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DDD3]">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-[#FAF7F2]">
                  <td className="p-3 font-mono">{formatDate(tx.dueDate)}</td>
                  <td className="p-3">
                    <div className="font-semibold text-[#34313B]">{tx.description}</div>
                    <div className="text-[10px] text-[#6E6877]">{tx.recipientOrPayer}</div>
                  </td>
                  <td className="p-3">
                    <span className="bg-[#FAF7F2] border border-[#E5DDD3] px-2 py-0.5 rounded text-[11px] text-[#48243F]">
                      {tx.category}
                    </span>
                  </td>
                  <td className={`p-3 text-right font-bold ${
                    tx.type === 'receita' ? 'text-[#2E7D32]' : 'text-[#D32F2F]'
                  }`}>
                    {tx.type === 'receita' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => updateTransactionStatus(tx.id, tx.status === 'pago' ? 'pendente' : 'pago')}
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded transition ${
                        tx.status === 'pago'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                      title="Clique para alternar status"
                    >
                      {tx.status === 'pago' ? '✓ Pago' : 'Pendente'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Excluir lançamento"
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

    </div>
  );
};

