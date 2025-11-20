const Sala = require('../models/Sala');
const { SalaStatus } = require('../utils/enums');

class SalaRepository {
  constructor() {
    this.salas = this.initializeMockData();
  }

  initializeMockData() {
    return [
      new Sala('s1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sala de Reuniões A', '1º Andar', 10, SalaStatus.ATIVA),
      new Sala('s2c3d4e5-f6g7-8901-bcde-fg2345678901', 'Auditório Principal', 'Térreo', 50, SalaStatus.ATIVA),
      new Sala('s3d4e5f6-g7h8-9012-cdef-gh3456789012', 'Sala de Treinamento B', '2º Andar', 20, SalaStatus.EM_MANUTENCAO)
    ];
  }

  findById(id) {
    return this.salas.find(sala => sala.id === id);
  }

  findAll() {
    return this.salas;
  }
}

module.exports = SalaRepository;