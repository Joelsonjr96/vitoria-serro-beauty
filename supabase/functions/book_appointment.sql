CREATE OR REPLACE FUNCTION book_appointment(
  p_servico_id UUID,
  p_horario_id UUID,
  p_nome_cliente TEXT,
  p_telefone_cliente TEXT,
  p_anamnese JSONB,
  p_duracao_minutos INT
) RETURNS JSONB AS $$
DECLARE
  V_horario_data DATE;
  V_horario_inicio TIME;
  V_cliente_id UUID;
BEGIN
  -- Bloqueia a linha do horário inicial para leitura/escrita (Row-Level Lock)
  SELECT data, hora_inicio INTO v_horario_data, v_horario_inicio
  FROM horarios_disponiveis
  WHERE id = p_horario_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Horário não encontrado');
  END IF;

  -- Verifica se os slots necessários estão livres
  IF EXISTS (
    SELECT 1 FROM horarios_disponiveis
    WHERE data = v_horario_data
    AND status != 'livre'
    AND hora_inicio >= v_horario_inicio
    AND hora_inicio < (v_horario_inicio + (p_duracao_minutos || ' minutes')::interval)
    FOR UPDATE
  ) THEN
    RETURN jsonb_build_object('error', 'Horário já ocupado ou indisponível');
  END IF;

  -- Upsert Cliente
  INSERT INTO clientes (nome, telefone)
  VALUES (p_nome_cliente, p_telefone_cliente)
  ON CONFLICT (telefone) DO UPDATE SET nome = EXCLUDED.nome
  RETURNING id INTO v_cliente_id;

  -- Insere Agendamento
  INSERT INTO agendamentos (servico_id, horario_id, nome_cliente, telefone_cliente, anamnese, status)
  VALUES (p_servico_id, p_horario_id, p_nome_cliente, p_telefone_cliente, p_anamnese, 'confirmado');

  -- Bloqueia Slots
  UPDATE horarios_disponiveis
  SET status = 'ocupado'
  WHERE data = v_horario_data
  AND hora_inicio >= v_horario_inicio
  AND hora_inicio < (v_horario_inicio + (p_duracao_minutos || ' minutes')::interval);

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql;
