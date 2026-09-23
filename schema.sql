-- 1. Tabela de Serviços
CREATE TABLE servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  duracao_minutos INTEGER NOT NULL,
  preco DECIMAL(10, 2) NOT NULL
);

-- 2. Tabela de Horários Disponíveis
CREATE TABLE horarios_disponiveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  status TEXT CHECK (status IN ('livre', 'ocupado')) DEFAULT 'livre'
);

-- 3. Tabela de Agendamentos
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID REFERENCES servicos(id),
  horario_id UUID REFERENCES horarios_disponiveis(id),
  nome_cliente TEXT NOT NULL,
  telefone_cliente TEXT NOT NULL,
  status TEXT CHECK (status IN ('confirmado', 'cancelado')) DEFAULT 'confirmado',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
