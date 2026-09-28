# Vitória Serro Beauty CRM

Sistema de gestão e agendamento personalizado, desenvolvido especificamente para otimizar o fluxo de atendimento no estúdio **Vitória Serro Beauty**.

## 🚀 Sobre o Projeto

Este CRM foi desenhado para simplificar a rotina de agendamento de uma *Lash Designer*, equilibrando funcionalidade técnica com uma identidade visual sóbria, elegante e focada na experiência do usuário. O sistema permite o agendamento intuitivo por parte das clientes e um painel administrativo robusto para gestão de horários, faturamento e histórico de anamnese.

## ✨ Funcionalidades

### Para a Cliente
*   **Fluxo de Agendamento Ágil:** Seleção de serviço, data e horário em poucos cliques.
*   **Ficha de Anamnese:** Coleta de dados essenciais pré-atendimento durante o agendamento.
*   **Confirmação:** Feedback visual claro após o agendamento.

### Para a Profissional (Painel Administrativo)
*   **Dashboard de Métricas:** Visualização rápida de atendimentos (hoje, semana, mês) e faturamento.
*   **Gestão de Agenda:** Bloqueio e liberação de horários de forma manual e segura.
*   **CRM de Clientes:** Acesso ao histórico e cadastro de clientes para reativação.
*   **Controle de Status:** Gestão de agendamentos pendentes, confirmados e concluídos.

## 🛠 Tecnologias Utilizadas

Este projeto utiliza um stack moderno focado em performance e segurança:

*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
*   **Interface:** [React](https://react.dev/) e [Tailwind CSS](https://tailwindcss.com/)
*   **Backend & Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Database Functions)

> **Diretrizes de Design:** O sistema segue uma identidade visual rigorosa baseada em cores sólidas, tipografia sóbria e ausência de gradientes decorativos, garantindo um visual limpo e profissional.

## ⚙️ Configuração do Ambiente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/Joelsonjr96/vitoria-serro-beauty.git
    cd vitoria-serro-beauty
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração de Variáveis de Ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto com as credenciais do Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
    NEXT_PUBLIC_PROFESSIONAL_PASSWORD=senha_do_painel
    ```

4.  **Execução em modo de desenvolvimento:**
    ```bash
    npm run dev
    ```

## 🔐 Observações de Manutenção

*   **Controle Administrativo:** A configuração do sistema e o setup de novos ambientes são restritos, garantindo a dependência necessária para o suporte técnico e a gestão personalizada da plataforma.
*   **Versionamento:** As regras de negócio críticas, como funções de banco de dados (`book_appointment`, `move_appointment`, etc.), estão versionadas na pasta `supabase/functions/` para garantir consistência e segurança.

---

*Desenvolvido com foco em excelência para Vitória Serro Beauty.*
