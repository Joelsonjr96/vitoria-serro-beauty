# Documentação do Projeto: Sistema de Agendamento Vitória Serro Beauty

## 1. Documento de Estruturação Completa

### Introdução e Justificativa
Este projeto é um piloto de um sistema de agendamento desenvolvido para o estúdio "Vitória Serro Beauty", localizado em Vista Alegre, Rio de Janeiro. O sistema visa digitalizar o agendamento, trazendo organização, profissionalismo e redução de falhas operacionais.

### Objetivos
*   **Geral:** Implementar um sistema de agendamento online prático para o estúdio.
*   **Específicos:** Digitalizar serviços, automatizar reserva de horários e prover painel de gestão para a profissional.

### Cronograma de Desenvolvimento (Fatias)
| Atividade | Período | Status |
| :--- | :--- | :--- |
| Estruturação e Lista de Serviços | 01/09 - 05/09 | Concluído |
| Implementação de Horários | 06/09 - 10/09 | Concluído |
| Desenvolvimento do Formulário | 11/09 - 15/09 | Concluído |
| Painel do Profissional | 16/09 - 20/09 | Concluído |
| Tela de Confirmação & Refinamentos | 21/09 - 24/09 | Concluído |
| Testes Automatizados e MCP | 24/09 | Concluído |

### Recursos Tecnológicos
*   **Framework:** Next.js (App Router)
*   **Banco de Dados:** Supabase (PostgreSQL)
*   **Testes:** Playwright
*   **Integração:** MCP Supabase Server

---

## 2. Relatório de Execução Técnica (Ajustes de 24/09/2026)

### Melhorias Realizadas
Hoje consolidamos a estabilidade do sistema com os seguintes ajustes:

1.  **Estabilidade de Rotas (Bug 404):**
    *   Corrigido erro na página `/agendado/[id]` através de uma query híbrida que aceita tanto o ID do Agendamento quanto o ID do Horário.
    *   Implementada ordenação por `criado_em` para garantir que o cliente veja sempre o agendamento mais recente.

2.  **Experiência do Cliente (UX):**
    *   **Cancelamento Ativo:** Agora o cliente pode cancelar seu próprio agendamento na tela de confirmação. O sistema libera o horário automaticamente.
    *   **Endereço:** Unificado em todo o sistema para "Av. Braz de Pina 1720 - Vista Alegre".
    *   **Comunicação:** Mensagem de WhatsApp automatizada e coerente para envio de comprovantes.

3.  **Qualidade e Infraestrutura:**
    *   **Testes E2E:** Criada suíte Playwright (`tests/pages-check.spec.ts`) que valida todos os fluxos críticos (Home -> Agendar -> Confirmar -> Cancelar).
    *   **SSR Hydration:** Corrigido erro de sincronia de data/ano no rodapé.
    *   **MCP Setup:** Configurado servidor MCP do Supabase para gestão do banco via IA.

---

## 3. Organização do Projeto

### Estrutura de Pastas
- `src/app/`: Rotas do Next.js (Home, Agendar, Agendado, Profissional, API).
- `src/components/`: Componentes reutilizáveis (Wizard, Cards, Header, Footer).
- `src/lib/`: Configurações do Supabase e utilitários.
- `src/types/`: Definições de tipos TypeScript.
- `tests/`: Testes automatizados (Playwright).
- `public/`: Imagens e ativos estáticos.

### Comandos Úteis
- `npm run dev`: Iniciar ambiente de desenvolvimento.
- `npx playwright test`: Rodar testes automatizados.
- `npm run lint`: Verificar padrões de código.

---
**Documentação atualizada em 24/09/2026.**
