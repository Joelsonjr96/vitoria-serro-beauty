# Plano: Fatia 4 - Tela da Profissional (Agenda/Bloqueio)

## Objetivo
Criar uma área restrita para a profissional gerenciar sua agenda.

## Fase 1: Proteção de Acesso
- [ ] Definir variável de ambiente `PROFESSIONAL_PASSWORD` no `.env.local`.
- [ ] Criar componente de proteção (senha) para a rota `/prof`.

## Fase 2: Dashboard da Profissional
- [ ] Criar página `src/app/prof/page.tsx`.
- [ ] Listar todos os agendamentos do dia (com nome do cliente, serviço e hora).
- [ ] Listar horários para permitir bloqueio/desbloqueio.

## Fase 3: Funcionalidades de Gestão
- [ ] Implementar ação para alternar `status` de horários no Supabase.

## Fase 4: Design e Verificação
- [ ] Garantir que o design siga as diretrizes (cores sólidas, sober).
- [ ] Rodar `code-review` e `security-review`.
