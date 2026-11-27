'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FinancialTransaction } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import {
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  ShieldCheck,
  Send,
  Building,
  Car
} from 'lucide-react';

export const FinancialPortal: React.FC = () => {
  const { events, transactions, artists, contractors, updateTransactionStatus, addTransaction } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'receita' | 'despesa'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Totais
  const totalReceitas = transactions
    .filter((t: FinancialTransaction) => t.type === 'receita')
    .reduce((acc: number, t: FinancialTransaction) => acc + t.amount, 0);

  const totalDespesas = transactions
    .filter((t: FinancialTransaction) => t.type !== 'receita')
    .reduce((acc: number, t: FinancialTransaction) => acc + t.amount, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  // Receitas quitadas vs pendentes
  const receitasPagas = transactions
    .filter((t: FinancialTransaction) => t.type === 'receita' && t.status === 'pago')
    .reduce((acc: number, t: FinancialTransaction) => acc + t.amount, 0);

  const receitasPendentes = transactions
    .filter((t: FinancialTransaction) => t.type === 'receita' && t.status === 'pendente')
    .reduce((acc: number, t: FinancialTransaction) => acc + t.amount, 0);

  // Despesas pagas vs pendentes
  const despesasPagas = transactions
    .filter((t: FinancialTransaction) => t.type !== 'receita' && t.status === 'pago')
    .reduce((acc: number, t: FinancialTransaction) => acc + t.amount, 0);

  const despesasPendentes = transactions
    .filter((t: FinancialTransaction) => t.type !== 'receita' && t.status === 'pendente')
    .reduce((acc: number, t: FinancialTransaction) => acc + t.amount, 0);

  const handleApproveTransaction = (txId: string, desc: string) => {
    updateTransactionStatus(txId, 'pago', new Date().toISOString());
    setSuccessToast(`Transação "${desc}" liquidada com sucesso!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleApproveMileageExpense = (eventId: string, artistName: string, km: number) => {
    const amount = km * 1.50; // R$ 1,50/km conforme PRD
    addTransaction({
      eventId,
      type: 'reembolso_km',
      category: 'logistica',
      description: `Reembolso de Deslocamento (${km} km @ R$ 1,50/km) - ${artistName}`,
      amount,
      dueDate: new Date().toISOString(),
      paymentDate: new Date().toISOString(),
      status: 'pago',
      recipientOrPayer: artistName
    });
    setSuccessToast(`Reembolso de R$ ${amount.toFixed(2)} (${km} km) aprovado para ${artistName}!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const filteredTransactions = transactions.filter((t: FinancialTransaction) => {
    if (filterType === 'receita') return t.type === 'receita';
    if (filterType === 'despesa') return t.type !== 'receita';
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Toast Notificação */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#48243F] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 border-l-4 border-[#B18A38]">
          <CheckCircle2 className="w-5 h-5 text-[#B18A38]" />
          <span className="text-sm font-medium">{successToast}</span>
        </div>
      )}

      {/* Header do Portal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5DDD3] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#B18A38] uppercase tracking-wider">
              Controladoria & Compliance Financeiro
            </span>
            <span className="text-[10px] bg-[#FAF7F2] text-[#48243F] border border-[#B18A38] px-2 py-0.5 rounded-full font-bold">
              PRD Seção 4.3 & 5.1
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#48243F] mt-1">
            Painel do Departamento Financeiro
          </h1>
          <p className="text-sm text-[#6E6877] mt-1">
            Conciliação de pagamentos de clientes (Sinal 40% + Saldo 60%), liquidação de cachês artísticos e reembolsos de produção.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-xs text-[#6E6877] block font-medium">Margem Operacional Líquida</span>
            <span className="text-xl font-bold text-[#48243F]">
              {totalReceitas > 0 ? `${((saldoLiquido / totalReceitas) * 100).toFixed(1)}%` : '0%'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#B18A38] flex items-center justify-center text-[#B18A38]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-[#E5DDD3] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase tracking-wider">Receitas Totais</span>
            <div className="p-2 bg-green-50 text-green-700 rounded-lg">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#34313B] mt-2">{formatCurrency(totalReceitas)}</h3>
          <div className="mt-2 text-xs flex justify-between text-[#6E6877]">
            <span className="text-green-600 font-medium">Quitado: {formatCurrency(receitasPagas)}</span>
            <span className="text-amber-600 font-medium">A Receber: {formatCurrency(receitasPendentes)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5DDD3] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase tracking-wider">Despesas / Custos</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#34313B] mt-2">{formatCurrency(totalDespesas)}</h3>
          <div className="mt-2 text-xs flex justify-between text-[#6E6877]">
            <span className="text-gray-600">Pago: {formatCurrency(despesasPagas)}</span>
            <span className="text-red-500 font-medium">A Pagar: {formatCurrency(despesasPendentes)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5DDD3] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase tracking-wider">Saldo Líquido</span>
            <div className="p-2 bg-[#FAF7F2] text-[#48243F] rounded-lg">
              <DollarSign className="w-4 h-4 text-[#B18A38]" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#48243F] mt-2">{formatCurrency(saldoLiquido)}</h3>
          <div className="mt-2 text-xs text-green-600 flex items-center font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Fluxo positivo e saudável
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#E5DDD3] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6E6877] uppercase tracking-wider">Regra de Pagamento</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#6E6877]">Sinal de Reserva:</span>
              <strong className="text-[#48243F]">40% no aceite</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#6E6877]">Saldo Restante:</span>
              <strong className="text-[#48243F]">60% até 48h antes</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 1: Conciliação de Eventos (Sinal 40% vs Saldo 60%) */}
      <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-sm overflow-hidden">
        <div className="p-5 bg-[#FAF7F2] border-b border-[#E5DDD3] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#48243F] text-white rounded-lg">
              <Building className="w-5 h-5 text-[#B18A38]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#34313B]">Conciliação de Eventos Ativos</h2>
              <p className="text-xs text-[#6E6877]">Controle de liquidação de sinal e quitação de saldo por evento</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#48243F] bg-white px-3 py-1 rounded-full border border-[#E5DDD3]">
            {events.length} Eventos Cadastrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF7F2]/60 text-xs text-[#6E6877] uppercase border-b border-[#E5DDD3]">
              <tr>
                <th className="px-5 py-3 font-semibold">Evento / Cliente</th>
                <th className="px-5 py-3 font-semibold">Data do Evento</th>
                <th className="px-5 py-3 font-semibold">Valor Contrato</th>
                <th className="px-5 py-3 font-semibold">Sinal (40%)</th>
                <th className="px-5 py-3 font-semibold">Saldo (60%)</th>
                <th className="px-5 py-3 font-semibold">Status Geral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DDD3]">
              {events.map(event => {
                const contractor = contractors.find(c => c.id === event.contractorId);
                const valorTotal = event.totalFee || 0;
                const sinal = event.signalFee || valorTotal * 0.40;
                const saldo = event.balanceFee || valorTotal * 0.60;
                const isQuitado = event.signalPaid && event.balancePaid;

                return (
                  <tr key={event.id} className="hover:bg-[#FAF7F2]/50 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#34313B]">{event.title}</div>
                      <div className="text-xs text-[#6E6877]">{contractor?.companyName || contractor?.name} ({event.code})</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-[#34313B]">
                      {formatDate(event.date)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#48243F]">
                      {formatCurrency(valorTotal)}
                    </td>
                    <td className="px-5 py-4">
                      <div className={`text-xs font-medium px-2 py-1 rounded inline-block ${
                        event.signalPaid ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'
                      }`}>
                        {event.signalPaid ? `✓ ${formatCurrency(sinal)} (Pago)` : `⏳ ${formatCurrency(sinal)} (Pendente)`}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className={`text-xs font-medium px-2 py-1 rounded inline-block ${
                        event.balancePaid ? 'text-green-700 bg-green-50' : 'text-amber-700 bg-amber-50'
                      }`}>
                        {event.balancePaid ? `✓ ${formatCurrency(saldo)} (Liquidado)` : `⏳ ${formatCurrency(saldo)} (Aberto)`}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        isQuitado ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isQuitado ? 'Quitado' : 'Em Aberto'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seção 2: Liquidação de Repasses a Artistas & Reembolso de KM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Painel de Cachês de Artistas */}
        <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DDD3] pb-3">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-[#B18A38]" />
              <h3 className="font-semibold text-[#48243F]">Repasses de Cachês Artísticos</h3>
            </div>
            <span className="text-xs text-[#6E6877]">Prazo: até 48h pós-evento</span>
          </div>

          <div className="space-y-3">
            {artists.map(artist => {
              const artistTx = transactions.find(
                (t: FinancialTransaction) => t.description.toLowerCase().includes(artist.artisticName.toLowerCase()) && t.type === 'repasse_artista'
              );
              const isPago = artistTx?.status === 'pago';

              return (
                <div key={artist.id} className="p-3.5 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-[#34313B]">{artist.artisticName}</h4>
                    <p className="text-xs text-[#6E6877]">Chave PIX: <span className="font-mono">{artist.bankInfo.pixKey}</span></p>
                    <p className="text-xs text-[#B18A38] font-medium mt-0.5">Cachê Base: {formatCurrency(artist.baseFee)}</p>
                  </div>

                  <div>
                    {isPago ? (
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Repassado
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (artistTx) {
                            handleApproveTransaction(artistTx.id, `Cachê de ${artist.artisticName}`);
                          } else {
                            addTransaction({
                              eventId: events[0]?.id || 'evt_001',
                              type: 'repasse_artista',
                              category: 'artistas',
                              description: `Cachê Artístico - ${artist.artisticName}`,
                              amount: artist.baseFee,
                              dueDate: new Date().toISOString(),
                              paymentDate: new Date().toISOString(),
                              status: 'pago',
                              recipientOrPayer: artist.artisticName
                            });
                            setSuccessToast(`Cachê de ${artist.artisticName} repassado com sucesso via PIX!`);
                            setTimeout(() => setSuccessToast(null), 4000);
                          }
                        }}
                        className="bg-[#48243F] hover:bg-[#5E3253] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition flex items-center space-x-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Pagar via PIX</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Painel de Reembolso de Deslocamento / KM (R$ 1,50/km) */}
        <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DDD3] pb-3">
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-[#B18A38]" />
              <h3 className="font-semibold text-[#48243F]">Reembolsos de Quilometragem (KM)</h3>
            </div>
            <span className="text-xs font-bold text-[#B18A38]">Tabela: R$ 1,50 / km</span>
          </div>

          <p className="text-xs text-[#6E6877]">
            Conforme a Seção 4.3 do PRD, trajetos intermunicipais de bandas e equipe são reembolsados com taxa de R$ 1,50/km mediante validação do produtor de campo.
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#34313B]">Deslocamento Curitiba → Lapa</h4>
                <p className="text-xs text-[#6E6877]">Trajeto: 72 km rodados | Solicitante: Trio Acústico Harmony</p>
                <p className="text-xs font-bold text-[#48243F] mt-0.5">Valor: {formatCurrency(72 * 1.50)} (72 km × R$ 1,50)</p>
              </div>
              <button
                onClick={() => handleApproveMileageExpense(events[0]?.id || 'evt_001', 'Trio Harmony', 72)}
                className="bg-[#B18A38] hover:bg-[#CBA24B] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition"
              >
                Aprovar Reembolso
              </button>
            </div>

            <div className="p-3.5 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-[#34313B]">Deslocamento Curitiba → Ponta Grossa</h4>
                <p className="text-xs text-[#6E6877]">Trajeto: 115 km rodados | Solicitante: Banda Aurora Pop</p>
                <p className="text-xs font-bold text-[#48243F] mt-0.5">Valor: {formatCurrency(115 * 1.50)} (115 km × R$ 1,50)</p>
              </div>
              <button
                onClick={() => handleApproveMileageExpense(events[1]?.id || 'evt_002', 'Banda Aurora Pop', 115)}
                className="bg-[#B18A38] hover:bg-[#CBA24B] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition"
              >
                Aprovar Reembolso
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Seção 3: Extrato de Transações Financeiras Completo */}
      <div className="bg-white rounded-xl border border-[#E5DDD3] shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DDD3] pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#48243F]" />
            <h3 className="font-semibold text-lg text-[#34313B]">Livro Razão & Transações</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterType('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === 'all' ? 'bg-[#48243F] text-white' : 'bg-[#FAF7F2] text-[#6E6877] hover:bg-[#E5DDD3]'
              }`}
            >
              Todas ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('receita')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === 'receita' ? 'bg-green-700 text-white' : 'bg-[#FAF7F2] text-[#6E6877] hover:bg-[#E5DDD3]'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilterType('despesa')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === 'despesa' ? 'bg-red-600 text-white' : 'bg-[#FAF7F2] text-[#6E6877] hover:bg-[#E5DDD3]'
              }`}
            >
              Despesas
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#E5DDD3]">
          {filteredTransactions.map((tx: FinancialTransaction) => {
            const isReceita = tx.type === 'receita';
            const isPago = tx.status === 'pago';

            return (
              <div key={tx.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF7F2]/40 transition px-2 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg mt-0.5 ${isReceita ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {isReceita ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h5 className="font-medium text-sm text-[#34313B]">{tx.description}</h5>
                    <div className="flex items-center space-x-3 text-xs text-[#6E6877] mt-0.5">
                      <span>Categoria: <strong className="capitalize">{tx.category}</strong></span>
                      <span>•</span>
                      <span>Vencimento: {formatDate(tx.dueDate)}</span>
                      <span>•</span>
                      <span>Beneficiário/Pagador: <strong>{tx.recipientOrPayer}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center">
                  <span className={`font-semibold text-base ${isReceita ? 'text-green-700' : 'text-red-600'}`}>
                    {isReceita ? '+' : '-'} {formatCurrency(tx.amount)}
                  </span>

                  {isPago ? (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Pago
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApproveTransaction(tx.id, tx.description)}
                      className="text-xs bg-[#B18A38] hover:bg-[#CBA24B] text-white font-semibold px-3 py-1 rounded-lg transition"
                    >
                      Dar Baixa
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
