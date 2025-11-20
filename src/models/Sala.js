class Sala {
  constructor(id,nome, descricao, andar, capacidade, status) {
    this.nome=nome;
    this.id = id;
    this.descricao = descricao;
    this.andar = andar;
    this.capacidade = capacidade;
    this.status = status; // 0: ativa, 1: inativa, 2: em manutenção
  }
}

module.exports = Sala;