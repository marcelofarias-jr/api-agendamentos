class Agendamento {
  constructor(id, sala_id, data, turno, horario, descricao) {
    this.id = id;
    this.sala_id = sala_id;
    this.sala_nome = nome;
    this.data = data;
    this.turno = turno; // 0: manhã, 1: tarde, 2: noite
    this.horario = horario; // 0: A, 1: B, 2: C, 3: D, 4: E, 5: F
    this.descricao = descricao;
  }
}

module.exports = Agendamento;