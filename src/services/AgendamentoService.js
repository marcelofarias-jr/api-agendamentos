class AgendamentoService {
  constructor(agendamentoRepository, salaRepository) {
    this.agendamentoRepository = agendamentoRepository;
    this.salaRepository = salaRepository;
  }

  getAllAgendamentos() {
    return this.agendamentoRepository.findAll();
  }

  getAgendamentoById(id) {
    if (!id) {
      throw new Error('ID do agendamento é obrigatório');
    }

    const agendamento = this.agendamentoRepository.findById(id);
    if (!agendamento) {
      throw new Error('Agendamento não encontrado');
    }

    return agendamento;
  }

  createAgendamento(agendamentoData) {
    this.validateAgendamentoData(agendamentoData);

    // Verifica se a sala existe
    const sala = this.salaRepository.findById(agendamentoData.sala_id);
    if (!sala) {
      throw new Error('Sala não encontrada');
    }

    // Verifica se a sala está ativa
    if (sala.status !== 0) { // 0 = ATIVA
      throw new Error('Sala não está disponível para agendamento');
    }

    // Verifica conflitos de agendamento (implementação básica)
    const conflito = this.agendamentoRepository.findAll().find(ag => 
      ag.sala_id === agendamentoData.sala_id &&
      ag.data === agendamentoData.data &&
      ag.turno === agendamentoData.turno &&
      ag.horario === agendamentoData.horario
    );

    if (conflito) {
      throw new Error('Já existe um agendamento para esta sala no mesmo horário');
    }

    return this.agendamentoRepository.create(agendamentoData);
  }

  updateAgendamento(id, agendamentoData) {
    if (!id) {
      throw new Error('ID do agendamento é obrigatório');
    }

    const existingAgendamento = this.agendamentoRepository.findById(id);
    if (!existingAgendamento) {
      throw new Error('Agendamento não encontrado');
    }

    this.validateAgendamentoData(agendamentoData);

    return this.agendamentoRepository.update(id, agendamentoData);
  }

  deleteAgendamento(id) {
    if (!id) {
      throw new Error('ID do agendamento é obrigatório');
    }

    const success = this.agendamentoRepository.delete(id);
    if (!success) {
      throw new Error('Agendamento não encontrado');
    }

    return success;
  }

  validateAgendamentoData(agendamentoData) {
    const { sala_id, data, turno, horario, descricao } = agendamentoData;

    if (!sala_id || !data || turno === undefined || horario === undefined || !descricao) {
      throw new Error('Todos os campos são obrigatórios');
    }

    if (turno < 0 || turno > 2) {
      throw new Error('Turno inválido');
    }

    if (horario < 0 || horario > 5) {
      throw new Error('Horário inválido');
    }

    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      throw new Error('Data inválida');
    }
  }
}

module.exports = AgendamentoService;