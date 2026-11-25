# GabiProduz — Sistema de Gestão Integrada para Produtora de Eventos

> **"Ideias que acontecem."**  
> Aplicação Web Full-Stack para administração centralizada de produtora de eventos e agenciamento artístico, com RBAC (Administrador, Financeiro, Artista, Contratante), integração automatizada ao ecossistema Google Workspace e controle operacional minuto a minuto.

---

## 1. Visão Geral e Arquitetura

Este projeto foi desenvolvido em estrita conformidade com o **PRD — Sistema de Gestão Integrada para Produtora de Eventos**:

* **Frontend & Backend Full-Stack:** Desenvolvido em **Next.js 16 (App Router)** com **React 19**, **TypeScript** e **Tailwind CSS**, otimizado para deploy contínuo na **Vercel**.
* **Controle de Versão:** Pronto para versionamento e repositório público/privado no **GitHub**.
* **Banco de Dados:** Camada flexível preparada para bancos relacionais na nuvem (Supabase / PostgreSQL, Neon ou MongoDB) com persistência local reativa em tempo de execução via LocalStorage.
* **Integração Google Workspace (Drive & Docs):** Geração automática por evento de pasta estruturada e dos 4 artefatos padrões, editáveis em tempo real dentro do painel.

---

## 2. Perfis de Acesso (RBAC) Implementados

A aplicação conta com um alternador de perfil no topo (*Role Switcher*) que permite testar instantaneamente os 4 perfis previstos no PRD:

| Perfil | Escopo e Permissões no Painel |
| :--- | :--- |
| **Administrador** | Acesso irrestrito a todos os módulos, cadastros, criação de eventos, kanban, calendário, financeiro, edição de documentos e templates. |
| **Financeiro** | Focado em fluxo de caixa, conciliação de receitas (sinais de 40% e saldos de 60%), repasses a artistas, aprovação de orçamentos e reembolsos operacionais. |
| **Artista** | Portal exclusivo com visualização da própria agenda de shows, rider técnico, cronograma de palco minuto a minuto, extrato de cachês recebidos/a receber e apontamento de horas. |
| **Contratante** | Portal do cliente para visualização de propostas comerciais recebidas, acompanhamento do status do evento contratado e cronograma. |

---

## 3. Módulos do Sistema

### 3.1. Cadastros Base (CRM & Recursos)
* **Artistas:** Nome, foto/avatar, gênero musical, release, rider técnico, inputs de palco, cachê base e dados bancários completos (Chave PIX e conta).
* **Contratantes:** Pessoa Física/Jurídica, CNPJ/CPF, responsáveis, contatos e histórico.
* **Espaços de Eventos:** Catálogo com capacidade, pé-direito, voltagem (110V/220V/Ambos), horários de corte de som e restrições técnicas.

### 3.2. Gestão de Eventos e Agenda
* **Pipeline Kanban:** Acompanhamento visual dos estágios (`Prospecção` $\rightarrow$ `Orçamento` $\rightarrow$ `Contrato Assinado` $\rightarrow$ `Pré-Produção` $\rightarrow$ `Realizado` $\rightarrow$ `Encerrado`) com avanço de status em 1 clique.
* **Calendário Centralizado:** Visualização de datas, reservas (holds), horários de montagem, soundcheck e show.

### 3.3. Comercial e Financeiro
* **Composição de Orçamentos:** Aplicação oficial das regras de negócio da GabiProduz:
  - Pacotes de Pré-Produção (*Essencial* até 5h: R\$ 350, *Intermediária* até 9h: R\$ 600, *Completa* até 14h: R\$ 900);
  - Diária presencial de produção (R\$ 650);
  - Deslocamento oficial fixado em **R\$ 1,50 por km rodado (ida e volta)**;
  - Sinal de Reserva de Data (40% para travar a agenda) e Saldo Final (60%).
* **Controle Financeiro:** Extrato de receitas, custos de produção, repasses a artistas e reembolsos de pedágios/quilometragem.

### 3.4. Automação Documental & Google Drive
Ao cadastrar qualquer evento (ou nos eventos pré-carregados como o *Happy Hour Kiki Danças*), o sistema gera automaticamente:
1. **Orçamento Detalhado**
2. **Proposta Comercial**
3. **Contrato de Prestação de Serviços Artísticos**
4. **Ficha Cadastral Técnica do Evento**
* **Editor no Painel:** Permite ler, editar o conteúdo dos documentos, salvar alterações em tempo real, sincronizar com o Google Drive e exportar/imprimir em PDF.

### 3.5. Operação e Pré-Produção
* **Cronograma Minuto a Minuto:** Linha do tempo interativa com marcação de concluído e horários de montagem, soundcheck, início e término do show.
* **Checklists de Pré-Produção:** Tarefas divididas por fases (D-30, D-14, D-2, Dia D e Pós-evento) com responsáveis e prazos.
* **Controle de Horas:** Apontamento de horas gastas com barra de progresso visual, alerta em 80% e cálculo de horas técnicas excedentes cobradas a **R\$ 70,00/h**.

---

## 4. Como Executar a Aplicação Localmente

Requisitos: **Node.js 18+** e **npm**.

```bash
# 1. Acesse a pasta da aplicação
cd sistema

# 2. Instale as dependências (já instaladas)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Abra no seu navegador: `http://localhost:3000`.

---

## 5. Como Publicar no GitHub e na Vercel

### Publicação no GitHub:
```bash
# Na raiz do projeto:
git init
git add .
git commit -m "feat: Sistema de Gestão Integrada para Produtora de Eventos"
git branch -M main
git remote add origin https://github.com/<seu-usuario>/GabiProduz.git
git push -u origin main
```

### Deploy na Vercel:
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Importe o repositório **GabiProduz**.
3. O arquivo `vercel.json` já está configurado para realizar o build automaticamente:
   - **Framework Preset:** Next.js
   - **Build Command:** `cd sistema && npm run build`
   - **Output Directory:** `sistema/.next`
4. Clique em **Deploy**. A aplicação estará online e acessível publicamente em segundos!
