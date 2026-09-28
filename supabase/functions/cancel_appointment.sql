CREATE OR REPLACE FUNCTION cancel_appointment(
  p_agendamento_id UUID
) RETURNS JSONB AS $$
DECLARE
  V_horario_id UUID;
  V_duracao_minutos INT;
  V_data DATE;
  V_hora_inicio TIME;
BEGIN
  -- Busca detalhes
  SELECT a.horario_id, s.duracao_minutos, h.data, h.hora_inicio
  INTO v_horario_id, v_duracao_minutos, v_data, v_hora_inicio
  FROM agendamentos a
  JOIN servicos s ON a.servico_id = s.id
  JOIN horarios_disponiveis h ON a.horario_id = h.id
  WHERE a.id = p_agendamento_id
  FOR UPDATE;

  -- Se não encontrar, retorna erro
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Agendamento não encontrado');
  END IF;

  -- Atualiza status agendamento
  UPDATE agendamentos SET status = 'cancelado' WHERE id = p_agendamento_id;

  -- Libera Slots
  UPDATE horarios_disponiveis
  SET status = 'livre'
  WHERE data = v_data
  AND hora_inicio >= v_hora_inicio
  AND hora_inicio < (v_hora_inicio + (v_duracao_minutos || ' minutes')::interval);

  RETURN jsonb_build_object('success', true);
END;
$$ LANGUAGE plpgsql;
