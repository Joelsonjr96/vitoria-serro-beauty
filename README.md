# CRM de agendamento personalizado - Vitória Serro Beauty

Este é o CRM de agendamento personalizado desenvolvido para o estúdio **Vitória Serro Beauty**. Este projeto nasce como uma solução para otimizar o fluxo de agendamentos, substituindo o uso de cadernos e organização manual via WhatsApp por um sistema digital, intuitivo e eficiente.

## 🎯 Objetivo
Otimizar a gestão de horários do estúdio, proporcionando uma experiência superior para a cliente e maior controle para a profissional, focando em usabilidade mobile e estabilidade.

## ✨ Funcionalidades Principais
- **Fluxo de Agendamento Inteligente:** Wizard em 3 etapas para cliente (Escolha do Serviço -> Seleção de Data e Horário -> Cadastro de Dados e Anamnese).
- **Painel Profissional Aprimorado:** Dashboard acionável com área de "Atenção" (alertas sobre confirmações, clientes inativos e horários), métricas de faturamento e fluxo de gestão de atendimentos.
- **Máquina de Estados de Atendimento:** Ciclo completo de status (`Pendente` → `Confirmado` → `Em Atendimento` → `Concluído`) com suporte a fluxos de `Cancelamento` e `Não Compareceu`.
- **Fluxo de Conclusão de Atendimento:** Registro estruturado de atendimentos com observações, atualização automática de histórico e métricas.
- **Responsividade Total:** Interface adaptada para uso fluido em dispositivos móveis e desktops, com áreas de toque otimizadas para smartphones.
- **PWA (Progressive Web App):** Instalável como aplicativo nativo no celular.

## 🛠️ Tecnologias
- **Framework:** Next.js (App Router)
- **Banco de Dados:** Supabase (PostgreSQL) com transações atômicas para garantia de consistência.
- **Estilização:** Tailwind CSS (seguindo diretrizes de design luxuoso/sóbrio).
- **Testes:** Playwright para automação de testes de fluxo.

## 🚀 Como rodar localmente
1. **Instale as dependências:**
   ```bash
   npm install
   ```
2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
3. **Acesse:** [http://localhost:3000](http://localhost:3000)

## 📖 Documentação
Para detalhes técnicos, história do projeto, regras de negócio e estrutura de pastas, consulte:
- `DOCUMENTACAO_PROJETO.md`: Visão geral e funcionalidades.
- `CONTEXTO.md`: Requisitos de escopo e diretrizes obrigatórias.

---
*Projeto desenvolvido como parte do Projeto de Extensão V (Curso ADS - Descomplica).*
