# Arquitetura do Sistema

## Visão geral

O CRM de agendamento é construído como uma única aplicação Next.js (App Router) que combina frontend e backend, usando Supabase como banco de dados gerenciado. A aplicação é deployada na Vercel e funciona como PWA instalável.

## Estrutura de Pastas

```
VITORIA/
├── src/
│   ├── app/           # Rotas e páginas (Next.js App Router)
│   │   ├── api/       # Endpoints API route handlers
│   │   ├── (routes)/  # Layouts e páginas principais
│   │   └── ...
│   ├── components/    # Componentes React reutilizáveis
│   ├── lib/          # Configurações de bibliotecas (Supabase)
│   ├── types/        # Definições TypeScript
│   └── data/         # Dados estáticos (curriculo.json)
├── public/           # Assets estáticos e imagens
├── tests/            # Suíte de testes Playwright
└── docs/            # Esta documentação
```

## Fluxo de Dados

### Agendamento → Atendimento → Conclusão

1. **Cliente** seleciona serviço → visualiza horários disponíveis → confirma agendamento (nome + telefone)
2. **Sistema** cria registro de Agendamento com status `Pendente` → profissional confirma como `Confirmado`
3. **Em Atendimento** → profissional conclui → status muda para `Concluído`
4. **Cancelamento/No Show** → status altera, horário é liberado automaticamente

## Stack Técnico

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 15 (App Router) |
| Banco | Supabase (PostgreSQL + Realtime) |
| Frontend | Tailwind CSS + shadcn/ui |
| Estado | React Server Components + Supabase Realtime |
| Testes | Playwright |
| Deploy | Vercel (CDN global) |

## Decisões Arquiteturais

### Por que Supabase Realtime?
O painel profissional exige atualização em tempo real de novos agendamentos. Supabase Realtime oferece WebSocket gratuito com sincronização automática, evitando polling explícito.

### Transações Atômicas
Operações críticas (agendamento, liberação de horário) usam transações PostgreSQL via Supabase para garantir consistência. Um horário pode ser agendado apenas uma vez.

### App Router vs Pages Router
App Router permite Server Components nativos, melhor performance em dados que vêm do banco e Streaming SSR. Essencial para PWA com carregamento rápido.

### Variáveis de Ambiente

| Variável | Uso | Obrigatório |
|----------|-----|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | Sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima para cliente | Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service role (admin) | Sim (apenas serverless) |

## Testes

```bash
# Executar todos os testes
npm run test

# Em modo de desenvolvimento
npm run test:dev
```

Os testes cobrem fluxos críticos: seleção de serviço, escolha de horário, confirmação de agendamento.