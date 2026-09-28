CREATE OR REPLACE FUNCTION move_appointment(
  p_agendamento_id UUID,
  p_new_horario_id UUID
) RETURNS JSONB AS $$
DECLARE
  V_old_horario_id UUID;
  V_servico_id UUID;
  V_nome_cliente TEXT;
  V_telefone_cliente TEXT;
  V_anamnese JSONB;
  V_duracao_minutos INT;
  V_result JSONB;
BEGIN
  -- 1. Get old appointment details
  SELECT servico_id, horario_id, nome_cliente, telefone_cliente, anamnese
  INTO V_servico_id, V_old_horario_id, V_nome_cliente, V_telefone_cliente, V_anamnese
  FROM agendamentos WHERE id = p_agendamento_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Agendamento não encontrado');
  END IF;

  -- 2. Get service duration
  SELECT duracao_minutos INTO V_duracao_minutos FROM servicos WHERE id = V_servico_id;

  -- 3. Cancel old appointment (Atomic in transaction)
  PERFORM cancel_appointment(p_agendamento_id);

  -- 4. Book new appointment (Atomic in transaction)
  V_result := book_appointment(V_servico_id, p_new_horario_id, V_nome_cliente, V_telefone_cliente, V_anamnese, V_duracao_minutos);

  -- Check if booking succeeded
  IF (V_result->>'success')::boolean = true THEN
    RETURN jsonb_build_object('success', true);
  ELSE
    -- If booking fails, raise exception to rollback everything
    RAISE EXCEPTION 'Erro ao reservar novo horário: %', V_result->>'error';
  END IF;
END;
$$ LANGUAGE plpgsql;
