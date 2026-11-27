'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatDate, STATUS_LABELS } from '../lib/utils';
import {
  FileText,
  CheckCircle2,
  Calendar,
  Clock,
  DollarSign,
  QrCode,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

interface ContractorPortalProps {
  onOpenDocument: (eventId: string) => void;
}

export const ContractorPortal: React.FC<ContractorPortalProps> = ({ onOpenDocument }) => {
  const { currentUser, events, contractors, documents, timeline, updateEventStatus, updateEvent, updateDocumentStatus } = useApp();

  // Buscar dados do contratante ativo ou fallback para o primeiro contratante cadastrado
  const contractor = contractors.find(c => c.id === currentUser.associatedContractorId) || contractors[0];
  const contractorEvents = events.filter(e => e.contractorId === contractor?.id);
  const activeEvent = contractorEvents[0] || events[0];

  const [activeSubTab, setActiveSubTab] = useState<'visao_geral' | 'contratos' | 'financeiro' | 'cronograma'>('visao_geral');
  const [copiedPix, setCopiedPix] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);

  if (!contractor || !activeEvent) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#E5DDD3] text-center">
        <h3 className="font-serif text-lg font-bold text-[#48243F]">Portal do Contratante</h3>
        <p className="text-sm text-[#6E6877] mt-2">Nenhum evento vinculado a esta conta no momento.</p>
      </div>
    );
  }

  const eventDocs = documents.filter(d => d.eventId === activeEvent.id);
  const eventTimeline = timeline.filter(t => t.eventId === activeEvent.id);
  const statusInfo = STATUS_LABELS[activeEvent.status] || STATUS_LABELS['prospeccao'];
  const isContractSigned = activeEvent.status === 'contrato_assinado' || activeEvent.status === 'pre_producao' || activeEvent.status === 'realizado';

  const handleSignContract = () => {
    // Atualizar status do evento para contrato_assinado
    updateEventStatus(activeEvent.id, 'contrato_assinado');
    // Atualizar os documentos para assinado
    eventDocs.forEach(d => {
      updateDocumentStatus(d.id, 'assinado');
    });
    setSignSuccess(true);
    setTimeout(() => setSignSuccess(false), 4000);
  };

  const handleConfirmSignalPayment = () => {
    updateEvent(activeEvent.id, { signalPaid: true });
    alert('Informação de pagamento enviada com sucesso para a coordenação financeira!');
  };

  const pixKey = 'financeiro@gabrielaprieto.com.br';

  const copyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Cabeçalho de Boas-Vindas */}
      <div className="bg-gradient-to-r from-[#48243F] to-[#2F1528] text-white p-6 rounded-2xl border-b-4 border-[#B18A38] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B18A38] font-bold">Portal do Cliente</span>
          <h2 className="font-serif text-2xl font-bold mt-1">{contractor.companyName || contractor.name}</h2>
          <p className="text-xs text-[#E2D7E0] mt-1">
            Responsável: <strong>{contractor.name}</strong> • CNPJ/CPF: {contractor.document}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 text-right">
          <span className="text-[11px] text-[#E2D7E0] block uppercase font-medium">Evento em Andamento:</span>
          <strong className="text-sm text-white block truncate">{activeEvent.title}</strong>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1"
            style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Navegação Interna do Portal */}
      <div className="flex border-b border-[#E5DDD3] space-x-2 bg-white px-4 pt-2 rounded-t-xl border-t border-x">
        <button
          onClick={() => setActiveSubTab('visao_geral')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeSubTab === 'visao_geral' ? 'bg-[#48243F] text-white' : 'text-[#6E6877] hover:bg-[#FAF7F2]'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#B18A38]" />
          <span>Visão Geral do Evento</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contratos')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeSubTab === 'contratos' ? 'bg-[#48243F] text-white' : 'text-[#6E6877] hover:bg-[#FAF7F2]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#B18A38]" />
          <span>Propostas & Contratos ({eventDocs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('financeiro')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeSubTab === 'financeiro' ? 'bg-[#48243F] text-white' : 'text-[#6E6877] hover:bg-[#FAF7F2]'
          }`}
        >
          <DollarSign className="w-4 h-4 text-[#B18A38]" />
          <span>Pagamento & Sinal (Spec 3)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cronograma')}
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition flex items-center space-x-1.5 ${
            activeSubTab === 'cronograma' ? 'bg-[#48243F] text-white' : 'text-[#6E6877] hover:bg-[#FAF7F2]'
          }`}
        >
          <Clock className="w-4 h-4 text-[#B18A38]" />
          <span>Cronograma Minuto a Minuto</span>
        </button>
      </div>

      {/* ABA: VISÃO GERAL */}
      {activeSubTab === 'visao_geral' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-6">
          
          {signSuccess && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs flex items-center space-x-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <strong>Proposta e Contrato Aprovados com Sucesso!</strong>
                <p className="mt-0.5">O status do seu evento avançou para "Contrato Assinado". Para travar definitivamente a data na agenda, realize o pagamento do sinal de 40%.</p>
              </div>
            </div>
          )}

          {/* Banner de Ação se o Contrato ainda não foi assinado */}
          {!isContractSigned && (
            <div className="bg-[#FAF7F2] p-5 rounded-xl border-l-4 border-[#B18A38] border border-[#E5DDD3] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B18A38] bg-white px-2 py-0.5 rounded border border-[#E5DDD3]">
                  Ação Pendente do Contratante
                </span>
                <h3 className="font-serif text-base font-bold text-[#48243F] mt-1.5">
                  Proposta Comercial aguardando sua aprovação
                </h3>
                <p className="text-xs text-[#6E6877] mt-0.5">
                  Valor total: <strong>{formatCurrency(activeEvent.totalFee)}</strong> • Sinal de reserva (40%): <strong>{formatCurrency(activeEvent.signalFee)}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenDocument(activeEvent.id)}
                  className="bg-white border border-[#E5DDD3] hover:bg-gray-50 text-[#48243F] text-xs font-semibold px-3 py-2 rounded-lg transition"
                >
                  Revisar Documento
                </button>
                <button
                  onClick={handleSignContract}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Aprovar & Assinar Proposta</span>
                </button>
              </div>
            </div>
          )}

          {/* Dados do Evento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DDD3]">
              <span className="text-[11px] font-bold text-[#6E6877] uppercase block">Data e Local</span>
              <p className="text-base font-bold text-[#48243F] mt-1">{formatDate(activeEvent.date)}</p>
              <p className="text-xs text-[#6E6877]">Jundiaí - SP</p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DDD3]">
              <span className="text-[11px] font-bold text-[#6E6877] uppercase block">Horários de Palco</span>
              <p className="text-base font-bold text-[#48243F] mt-1">{activeEvent.showTime} às {activeEvent.endTime}</p>
              <p className="text-xs text-[#6E6877]">Passagem de som: {activeEvent.soundcheckTime}</p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DDD3]">
              <span className="text-[11px] font-bold text-[#6E6877] uppercase block">Reserva de Agenda</span>
              <p className="text-base font-bold mt-1">
                {activeEvent.signalPaid ? (
                  <span className="text-[#2E7D32]">✓ Data Garantida</span>
                ) : (
                  <span className="text-[#D32F2F]">Aguardando Sinal (40%)</span>
                )}
              </p>
              <p className="text-xs text-[#6E6877]">Regra de proteção de agenda (Spec 3)</p>
            </div>
          </div>

        </div>
      )}

      {/* ABA: CONTRATOS & PROPOSTAS */}
      {activeSubTab === 'contratos' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-[#48243F]">Documentação Oficial do Evento</h3>
              <p className="text-xs text-[#6E6877]">Artefatos emitidos e sincronizados pela produtora</p>
            </div>

            {!isContractSigned && (
              <button
                onClick={handleSignContract}
                className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow transition flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Assinar Proposta Digitalmente</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventDocs.map(doc => (
              <div
                key={doc.id}
                onClick={() => onOpenDocument(activeEvent.id)}
                className="p-4 rounded-xl border border-[#E5DDD3] bg-[#FAF7F2] hover:bg-white hover:border-[#B18A38] transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#B18A38] bg-white px-2 py-0.5 rounded border border-[#E5DDD3]">
                      {doc.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      doc.status === 'assinado' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {doc.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-[#34313B] mt-2">{doc.title}</h4>
                  <p className="text-xs text-[#6E6877] mt-1 line-clamp-2">{doc.content.slice(0, 150)}...</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5DDD3] flex items-center justify-between text-xs">
                  <span className="text-[#48243F] font-semibold underline">Clique para ler na íntegra</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B18A38]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA: FINANCEIRO & PAGAMENTO */}
      {activeSubTab === 'financeiro' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-6">
          <div>
            <h3 className="font-serif text-base font-bold text-[#48243F]">Instruções de Pagamento & Quitação</h3>
            <p className="text-xs text-[#6E6877]">Conforme condições contratuais pactuadas (40% na contratação e 60% antes do evento)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Box de Valores */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[#E5DDD3] bg-[#FAF7F2]">
                <div className="flex justify-between items-center text-xs text-[#6E6877]">
                  <span>Valor Total Contratado:</span>
                  <strong className="text-base text-[#48243F]">{formatCurrency(activeEvent.totalFee)}</strong>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E5DDD3] space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>1. Sinal de Reserva de Data (40%):</span>
                    <div className="text-right">
                      <strong className="text-sm text-[#48243F]">{formatCurrency(activeEvent.signalFee)}</strong>
                      <span className={`block text-[10px] font-bold ${activeEvent.signalPaid ? 'text-green-600' : 'text-red-600'}`}>
                        {activeEvent.signalPaid ? '✓ QUITADO' : 'AGUARDANDO PAGAMENTO'}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span>2. Saldo Remanescente (60%):</span>
                    <div className="text-right">
                      <strong className="text-sm text-[#48243F]">{formatCurrency(activeEvent.balanceFee)}</strong>
                      <span className="block text-[10px] text-[#6E6877]">
                        Vencimento: até 24h antes do evento
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {!activeEvent.signalPaid && (
                <button
                  onClick={handleConfirmSignalPayment}
                  className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white text-xs font-semibold py-2.5 rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Informar que o Sinal foi Pago</span>
                </button>
              )}
            </div>

            {/* Box PIX */}
            <div className="p-5 rounded-xl border border-[#B18A38] bg-[#FAF7F2] flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold text-[#B18A38] uppercase">Chave PIX Oficial da Produtora</span>
                <p className="text-xs text-[#6E6877] mt-0.5">Utilize os dados abaixo para transferência bancária imediata:</p>
                
                <div className="mt-3 p-3 bg-white border border-[#E5DDD3] rounded-lg flex items-center justify-between">
                  <span className="font-mono text-xs text-[#48243F] font-bold select-all">{pixKey}</span>
                  <button
                    onClick={copyPix}
                    className="p-1.5 text-xs bg-[#FAF7F2] hover:bg-[#B18A38] text-[#48243F] hover:text-white rounded border border-[#E5DDD3] flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-[#6E6877] space-y-1 bg-white p-3 rounded-lg border border-[#E5DDD3]">
                <p><strong>Favorecido:</strong> Gabriela Prieto Produções</p>
                <p><strong>Instituição:</strong> Banco do Brasil / Nubank</p>
                <p className="italic text-[10px]">Após o pagamento, o comprovante pode ser enviado via WhatsApp para liberação imediata.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ABA: CRONOGRAMA MINUTO A MINUTO */}
      {activeSubTab === 'cronograma' && (
        <div className="bg-white p-6 rounded-b-xl border border-[#E5DDD3] shadow-sm space-y-4">
          <div>
            <h3 className="font-serif text-base font-bold text-[#48243F]">Cronograma Operacional do Evento</h3>
            <p className="text-xs text-[#6E6877]">Acompanhe em tempo real a grade horária de montagem e show</p>
          </div>

          <div className="space-y-2">
            {eventTimeline.map(item => (
              <div
                key={item.id}
                className="p-3 bg-[#FAF7F2] border border-[#E5DDD3] rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-[#B18A38] bg-white px-2 py-0.5 rounded border border-[#E5DDD3]">
                    {item.time}
                  </span>
                  <span className="font-semibold text-[#34313B]">{item.title}</span>
                </div>
                <span className="text-[#6E6877]">{item.responsible}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
