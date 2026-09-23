# Plano: Fatia 3 - Formulário de Agendamento e Persistência

## Objetivo
Implementar o fluxo de agendamento: frontend, validação e gravação no banco Supabase.

## Fase 1: Estrutura de Dados
- [ ] Definir interface `Agendamento` em `src/types/agendamento.ts`.

## Fase 2: Infraestrutura Supabase
- [ ] Criar `src/lib/supabase.ts` para inicialização do cliente (usando variáveis de ambiente).

## Fase 3: API Route
- [ ] Criar `src/app/api/agendar/route.ts` para receber POST com dados do cliente e realizar a inserção.

## Fase 4: Frontend
- [ ] Criar componente de formulário (Nome, Telefone) na página de horários.
- [ ] Integração com a API `POST /api/agendar`.

## Fase 5: Verificação e Segurança
- [ ] Aplicar `code-review`.
- [ ] Aplicar `simplify`.
- [ ] Aplicar `security-review`.

## Observações
- Não implementar autenticação (fora de escopo).
- Validar apenas campos obrigatórios.
