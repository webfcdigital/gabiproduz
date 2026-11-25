# PRD — Sistema de Gestão Integrada para Produtora de Eventos

## 1. Visão Geral do Produto
Desenvolvimento de uma aplicação web completa para administração centralizada de uma produtora de eventos e agenciamento artístico. A plataforma permitirá o gerenciamento operacional, comercial, financeiro e documental, conectando diferentes perfis de usuários em um fluxo automatizado e integrado ao ecossistema Google Workspace.

---

## 2. Arquitetura Tecnológica e Infraestrutura
* **Frontend & Backend:** Aplicação Full-Stack (ex: Next.js / React com API Routes) hospedada com deploy contínuo e público na **Vercel**.
* **Controle de Versão:** Código-fonte versionado em repositório no **GitHub**.
* **Banco de Dados:** Banco de dados relacional ou documental em camada gratuita (ex: Supabase / PostgreSQL, Neon ou MongoDB Atlas).
* **Integrações Externas:** API do **Google Drive** e **Google Docs/Sheets** para criação, armazenamento, edição e sincronização de documentos operacionais e comerciais.

---

## 3. Perfis de Acesso (RBAC - Role-Based Access Control)
O sistema contará com controle de permissões granulares divididos em quatro perfis principais:

| Perfil | Escopo de Acesso e Permissões |
| :--- | :--- |
| **Administrador** | Acesso irrestrito a todos os módulos, configurações do sistema, gestão de usuários, cadastros, agenda, financeiro e templates de documentos. |
| **Financeiro** | Acesso completo ao módulo financeiro (contas a pagar/receber, fluxo de caixa, repasses a artistas), visualização e aprovação de orçamentos e contratos. |
| **Artista** | Acesso restrito à própria agenda de shows/eventos, visualização de contratos vinculados, extratos de repasses financeiros, cronogramas de evento e envio de apontamento de horas/atividades. |
| **Contratante** | Acesso ao portal do cliente para visualizar propostas e orçamentos recebidos, aprovar/assinar contratos, acompanhar cronogramas do seu evento e status financeiro. |

---

## 4. Requisitos Funcionais por Módulo

### 4.1. Cadastros Base (CRM & Recursos)
* **Artistas:** Cadastro completo (dados pessoais/artísticos, releases, rider técnico, dados bancários para repasse, cachê base e documentos).
* **Contratantes:** Gestão de clientes (Pessoa Física/Jurídica, CNPJ/CPF, contatos responsáveis, histórico de eventos e propostas).
* **Espaços de Eventos:** Catálogo de locais (endereço, capacidade, infraestrutura disponível, contatos do local e restrições técnicas).

### 4.2. Gestão de Eventos e Agenda
* **Calendário Centralizado:** Visualização mensal, semanal e diária de eventos confirmados, reservas de data (holds) e bloqueios de agenda de artistas ou espaços.
* **Pipeline de Eventos:** Acompanhamento do status do evento (`Prospecção` $\rightarrow$ `Orçamento` $\rightarrow$ `Contrato Assinado` $\rightarrow$ `Pré-Produção` $\rightarrow$ `Realizado` $\rightarrow$ `Pós-Produção/Encerrado`).

### 4.3. Comercial e Financeiro
* **Orçamentos e Propostas:** Criação de orçamentos detalhados por evento vinculando artista(s), espaço, custos de produção e margem da produtora.
* **Gestão de Contratos:** Controle de status de emissão, envio e assinatura.
* **Controle Financeiro:** Lançamento de receitas (parcelas de contratantes), despesas de produção, comissões e repasses aos artistas, com visão de fluxo de caixa e saldo por evento.

### 4.4. Automação Documental (Integração Google Drive API)
Ao criar ou avançar o status de um evento, o sistema deverá disparar automaticamente a criação de uma pasta estruturada no Google Drive e gerar os artefatos padrões a partir de templates pré-configurados:
* **Artefatos Gerados Automaticamente:**
  * Orçamento detalhado
  * Proposta comercial
  * Contrato de prestação de serviços / apresentação artística
  * Ficha cadastral do evento
* **Edição via Painel:** Interface dentro do próprio painel administrativo da produtora (via editor embutido ou sincronização bidirecional com a API do Google) que permita editar o conteúdo dos artefatos sem precisar sair da aplicação.

### 4.5. Operação e Pré-Produção
Módulo colaborativo vinculado a cada evento para atualização contínua dos artefatos operacionais:
* **Cronogramas:** Linha do tempo detalhada do evento (montagem, passagem de som, abertura de portas, show, desmontagem) com atualização em tempo real.
* **Checklists de Pré-Produção:** Listas de tarefas atribuíveis a responsáveis, com prazos e status de conclusão (ex: logística, transporte, hospedagem, equipamentos).
* **Controle de Horas por Atividade:** Registro e apontamento de horas trabalhadas por membro da equipe ou artista em cada atividade/etapa do evento para apuração de custos e produtividade.

---

## 5. Requisitos Não Funcionais
* **Segurança e Autenticação:** Autenticação segura (ex: NextAuth / Auth.js ou Supabase Auth) com criptografia de senhas e proteção de rotas baseada no perfil do usuário.
* **Responsividade:** Interface adaptável para uso em desktops (operação administrativa) e dispositivos móveis (consulta de agenda, checklists e cronogramas em campo durante os eventos).
* **Confiabilidade da Integração:** Tratamento de falhas e filas/retentativas para chamadas à API do Google Drive, garantindo que nenhum evento fique sem seus artefatos gerados.
* **Performance e Limites Free-Tier:** Otimização de consultas ao banco de dados e uso eficiente de cache para operar dentro dos limites gratuitos da Vercel e do provedor de banco de dados escolhido.

---

## 6. Critérios de Aceite (MVP)
1. Deploy público funcional na Vercel conectado ao repositório GitHub.
2. Login funcional diferenciando corretamente as telas e permissões de *Administrador*, *Financeiro*, *Artista* e *Contratante*.
3. CRUD completo de Artistas, Contratantes, Espaços, Eventos e Lançamentos Financeiros.
4. Criação automática real de pasta e dos 4 documentos padrões no Google Drive ao cadastrar um novo evento, com possibilidade de edição via painel.
5. Atualização funcional de cronogramas, checklists de pré-produção e apontamento de horas vinculados a um evento.