const { v4: uuidv4 } = require('uuid');
const Agendamento = require('../models/Agendamento');
const { Turno, Horario } = require('../utils/enums');

class AgendamentoRepository {
  constructor() {
    this.agendamentos = this.initializeMockData();
  }

  findAll() {
    return this.agendamentos;
  }

  findById(id) {
    return this.agendamentos.find(agendamento => agendamento.id === id);
  }

  create(agendamentoData) {
    const newAgendamento = new Agendamento(
      uuidv4(),
      agendamentoData.sala_id,
      agendamentoData.data,
      agendamentoData.turno,
      agendamentoData.horario,
      agendamentoData.descricao
    );
    
    this.agendamentos.push(newAgendamento);
    return newAgendamento;
  }

  update(id, agendamentoData) {
    const index = this.agendamentos.findIndex(agendamento => agendamento.id === id);
    
    if (index === -1) {
      return null;
    }

    this.agendamentos[index] = {
      ...this.agendamentos[index],
      ...agendamentoData,
      id
    };

    return this.agendamentos[index];
  }

  delete(id) {
    const index = this.agendamentos.findIndex(agendamento => agendamento.id === id);
    
    if (index === -1) {
      return false;
    }

    this.agendamentos.splice(index, 1);
    return true;
  }
}

module.exports = AgendamentoRepository;