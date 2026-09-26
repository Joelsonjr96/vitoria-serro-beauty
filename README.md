# CRM de Agendamento - Vitória Serro Beauty

## O que é este projeto

CRM de agendamento personalizado desenvolvido para o estúdio **Vitória Serro Beauty**, um Lash Designer em Penha, Rio de Janeiro. Substitui o uso de cadernos manuais e WhatsApp para gerenciar agendamentos, eliminando perda de horários, esquecimento de compromissos e retrabalho da profissional.

## O problema

Antes deste sistema, o estúdio operava com:
- Agendamentos feitos via WhatsApp (sem rastreamento centralizado)
- Cadernos físicos para registro
- Perda frequente de horários disponíveis
- Esquecimento de confirmações por parte dos clientes
- Retrabalho constante da profissional para marcar e bloquear horários

## Solução

A aplicação permite aos clientes escolher serviços e horários, confirmar agendamentos e à profissional visualizar sua agenda diária com bloqueio de horários. Focado em um piloto de execução com escopo restrito:

### Funcionalidades (piloto)

- **Fluxo de Agendamento Inteligente** – Wizard em 3 etapas para o cliente:
  1. Escolha do serviço
  2. Seleção de data e horário
  3. Cadastro de dados e anamnese

- **Painel Profissional** – Dashboard com:
  - Alertas de confirmações, clientes inativos e horários livres
  - Métricas de faturamento
  - Fluxo de gestão de atendimentos

- **Máquina de Estados de Atendimento** – Ciclo completo (`Pendente` → `Confirmado` → `Em Atendimento` → `Concluído`) com suporte a fluxos de `Cancelamento` e `Não Compareceu`

- **Fluxo de Conclusão de Atendimento** – Registro estruturado de atendimentos com observações e atualização automática de histórico

- **Responsividade Total** – Interface otimizada para uso em dispositivos móveis e desktops

## Stack Tecnológico

- **Frontend & Backend** – Next.js (App Router)
- **Banco de Dados** – Supabase (PostgreSQL) com transações atômicas
- **Estilização** – Tailwind CSS (cores sólidas, tipografia sobreduzida)
- **Testes** – Playwright (automação de fluxos)

## Escopo (Piloto)

Este é um **piloto de execução** do Projeto de Extensão V (Curso ADS - Descomplica). O sistema é uma versão funcional do CRM, mas **fora desse escopo** não há implementação de:

- Login/cadastro de clientes
- Histórico de atendimentos
- Notificações automáticas (WhatsApp/SMS/e-mail)
- Múltiplos profissionais ou múltiplas agendas
- Pagamento online
- Painel administrativo com relatórios/gráficos

Qualquer funcionalidade além do escopo definido deve ser solicitada antes da implementação.

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse a aplicação:
   [http://localhost:3000](http://localhost:3000)

## Design e Experiência

A interface segue diretrizes obrigatórias:
- Sem gradientes decorativos sem função clara
- CTAs apenas onde há ação real (ex.: "Confirmar agendamento")
- Tipografia sobreduzida e consistente (sem serifas premium)
- Sem seções artificiais para parecer "completo"
- Copy direta e específica, sem clichês de marketing genérico

## Documentação

- **[Contexto de Negócio](docs/contesto_negocio.md)** – Escopo, entidades e regras de negócio
- **[Arquitetura](docs/arquitetura.md)** – Decisões técnicas e estrutura de pastas
- **[Roteiro de Evolução](docs/ROTEIRO_CRM.md)** – Plano de evolução do projeto para um CRM completo

## Status

O projeto está estável. O build de produção passa 100% e está pronto para uso pela cliente final (teste com usuária real previsto para 27/11).

---
*Projeto desenvolvido como parte do Projeto de Extensão V (Curso ADS - Descomplica).*
