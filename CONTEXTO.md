# CONTEXTO DO PROJETO — Sistema de Agendamento Vitória Serro Beauty

## O que é isto
Piloto de execução preliminar do Projeto de Extensão V (curso de ADS,
Descomplica). Não é o sistema completo — é um recorte funcional que
será testado com uma usuária real antes da entrega final (27/11).

## Cliente
Estúdio de lash designer Vitória Serro Beauty, Penha, Rio de Janeiro.
Hoje o agendamento é feito via WhatsApp e anotado em caderno.
Problemas identificados: falta de controle de horários, esquecimento
de agendamentos por parte de clientes, retrabalho na profissional.

## Escopo deste piloto (NÃO EXTRAPOLAR)
Fluxo completo:
1. Cliente vê a lista de serviços oferecidos.
2. Cliente escolhe um serviço e vê os horários disponíveis.
3. Cliente confirma um agendamento (nome + telefone, sem login).
4. Tela de confirmação simples pro cliente.
5. Tela separada, só para a profissional, para marcar/bloquear
   horários disponíveis e ver os agendamentos do dia.

## Explicitamente FORA de escopo nesta fase
Não implementar, mesmo que pareça fácil:
- Login/cadastro de cliente
- Histórico de atendimentos
- Notificação automática via WhatsApp/SMS/e-mail (a confirmação
  pode ser só uma tela — não é preciso integração externa)
- Múltiplos profissionais/múltiplas agendas
- Pagamento online
- Painel administrativo com relatórios/gráficos

Se durante o desenvolvimento parecer que "seria fácil adicionar X",
a resposta padrão é não — qualquer coisa fora desta lista deve ser
perguntada antes de ser implementada, não implementada por padrão.

## Entidades (modelo mínimo)
- **Servico**: id, nome, duracao_minutos, preco
- **HorarioDisponivel**: id, data, hora_inicio, hora_fim, status
  (livre/ocupado)
- **Agendamento**: id, servico_id, horario_id, nome_cliente,
  telefone_cliente, status (confirmado/cancelado), criado_em

## Regras de negócio
- Um horário não pode ser agendado duas vezes.
- A duração do serviço deve bloquear os slots seguintes necessários
  (ex.: serviço de 90 min bloqueia 3 slots de 30 min).
- Agendamento cancelado libera o horário de volta.

## Stack
- Next.js (front-end e back-end no mesmo projeto)
- Supabase (Postgres gerenciado) como banco de dados
- Deploy em Vercel (link acessível por celular para o teste com a
  usuária)

## Diretrizes de design e copy (obrigatórias)
Este projeto segue diretrizes específicas para não parecer uma
interface genérica gerada por IA. Antes de considerar qualquer tela
pronta, aplicar:
- Sem gradientes decorativos sem função clara; priorizar cores
  sólidas e contraste.
- CTAs só onde há ação real (ex.: "Confirmar agendamento"), não em
  todo bloco.
- Favicon, título de página e metadados básicos configurados.
- Tipografia sóbria e consistente, sem serifada "premium" sem motivo.
- Nenhuma prova social inventada (este projeto não usa prova social).
- Sem seções artificiais só para parecer "completo" — a tela é
  utilitária, feita para uma profissional e clientes reais usarem no
  dia a dia, não uma landing page de vendas.
- Copy direta e específica, sem clichês de marketing genérico
  ("experiência única", "solução completa", etc.).

## Forma de trabalho esperada do Claude Code
Construir em fatias pequenas, uma de cada vez, na ordem:
1. Estrutura do projeto + lista de serviços
2. Tela de horários disponíveis por serviço
3. Formulário de agendamento + gravação no banco
4. Tela da profissional (marcar/bloquear horários, ver agenda do dia)
5. Tela de confirmação para o cliente

Não avançar para a próxima fatia sem o desenvolvedor confirmar que a
anterior está funcionando. Não propor funcionalidades fora do escopo
definido acima, mesmo que pareçam melhorias óbvias — qualquer
sugestão deve ser feita como pergunta, não implementada direto.
