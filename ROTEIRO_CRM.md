# Roteiro de Evolução: Do Agendamento ao CRM

Este roteiro organiza as tarefas para transformar o piloto em um sistema de gestão completo para a Vitória, garantindo autonomia e inteligência de negócio.

## Fase 1: Robustez e Segurança (Imediato)
*Antes de expandir, precisamos garantir que o coração não falhe.*
- [ ] **Correção da API de Agendamento:** Implementar validação atômica no backend para impedir que dois clientes agendem o mesmo horário simultaneamente.
- [ ] **Lógica de Liberação Total:** Ajustar o cancelamento para liberar todos os slots de um serviço (ex: liberar 4 slots ao cancelar um Volume Brasileiro).

## Fase 2: Gestão de Serviços e Negócio (Autonomia)
*A Vitória deve controlar as regras do jogo.*
- [ ] **CRUD de Serviços:** Criar interface para Cadastrar, Editar e Excluir serviços (Nome, Preço, Duração).
- [ ] **Painel de Configurações:** Tela para alterar endereço, WhatsApp de contato e horários de funcionamento.

## Fase 3: CRM e Inteligência de Cliente (O Diferencial)
*Transformar dados em relacionamento.*
- [ ] **Módulo de Clientes:** Lista centralizada de todas as clientes que já agendaram.
- [ ] **Ficha da Cliente:**
    - Histórico completo de visitas.
    - Valor total investido (LTV).
    - Campo de observações persistentes (preferências, alergias recorrentes).
- [ ] **Cálculo de Retorno:** Indicar quando a cliente deve retornar (ex: após 21 dias).

## Fase 4: Gestão Avançada de Agenda
*Controle total sobre o tempo.*
- [ ] **Agendamento Manual:** Permitir que a Vitória cadastre um agendamento direto pelo painel (para clientes que pedem pelo WhatsApp).
- [ ] **Edição de Agendamento:** Mover uma cliente de um horário para outro sem precisar cancelar e refazer.

---
**Próximo Passo:** Iniciar as correções de segurança da Fase 1 e a base para a Fase 2.
