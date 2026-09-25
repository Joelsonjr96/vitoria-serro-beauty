export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      servicos: {
        Row: {
          id: string
          nome: string
          duracao_minutos: number
          preco: number
        }
        Insert: {
          id?: string
          nome: string
          duracao_minutos: number
          preco: number
        }
        Update: {
          id?: string
          nome?: string
          duracao_minutos?: number
          preco?: number
        }
      }
      horarios_disponiveis: {
        Row: {
          id: string
          data: string
          hora_inicio: string
          hora_fim: string
          status: 'livre' | 'ocupado'
        }
        Insert: {
          id?: string
          data: string
          hora_inicio: string
          hora_fim: string
          status?: 'livre' | 'ocupado'
        }
        Update: {
          id?: string
          data?: string
          hora_inicio?: string
          hora_fim?: string
          status?: 'livre' | 'ocupado'
        }
      }
      agendamentos: {
        Row: {
          id: string
          servico_id: string
          horario_id: string
          nome_cliente: string
          telefone_cliente: string
          anamnese: Json | null
          status: 'confirmado' | 'cancelado' | 'pendente' | 'concluido'
          criado_em: string
        }
        Insert: {
          id?: string
          servico_id: string
          horario_id: string
          nome_cliente: string
          telefone_cliente: string
          anamnese?: Json | null
          status?: 'confirmado' | 'cancelado' | 'pendente' | 'concluido'
          criado_em?: string
        }
        Update: {
          id?: string
          servico_id?: string
          horario_id?: string
          nome_cliente?: string
          telefone_cliente?: string
          anamnese?: Json | null
          status?: 'confirmado' | 'cancelado' | 'pendente' | 'concluido'
          criado_em?: string
        }
      }
    }
  }
}
