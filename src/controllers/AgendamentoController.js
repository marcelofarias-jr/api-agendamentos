class AgendamentoController {
  constructor(agendamentoService) {
    this.agendamentoService = agendamentoService;
  }

  async getAllAgendamentos(req, res) {
    try {
      const agendamentos = await this.agendamentoService.getAllAgendamentos();
      res.json({
        success: true,
        data: agendamentos,
        count: agendamentos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  async getAgendamentoById(req, res) {
    try {
      const { id } = req.params;
      const agendamento = await this.agendamentoService.getAgendamentoById(id);
      
      res.json({
        success: true,
        data: agendamento
      });
    } catch (error) {
      if (error.message === 'Agendamento não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  async createAgendamento(req, res) {
    try {
      const agendamentoData = req.body;
      const novoAgendamento = await this.agendamentoService.createAgendamento(agendamentoData);
      
      res.status(201).json({
        success: true,
        message: 'Agendamento criado com sucesso',
        data: novoAgendamento
      });
    } catch (error) {
      if (error.message.includes('não encontrada') || error.message.includes('disponível') || error.message.includes('conflito')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }

  async updateAgendamento(req, res) {
    try {
      const { id } = req.params;
      const agendamentoData = req.body;
      
      const agendamentoAtualizado = await this.agendamentoService.updateAgendamento(id, agendamentoData);
      
      res.json({
        success: true,
        message: 'Agendamento atualizado com sucesso',
        data: agendamentoAtualizado
      });
    } catch (error) {
      if (error.message === 'Agendamento não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteAgendamento(req, res) {
    try {
      const { id } = req.params;
      await this.agendamentoService.deleteAgendamento(id);
      
      res.json({
        success: true,
        message: 'Agendamento deletado com sucesso'
      });
    } catch (error) {
      if (error.message === 'Agendamento não encontrado') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
      });
    }
  }
}

module.exports = AgendamentoController;