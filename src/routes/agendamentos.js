const express = require('express');
const router = express.Router();
const AgendamentoController = require('../controllers/AgendamentoController');
const AgendamentoService = require('../services/AgendamentoService');
const AgendamentoRepository = require('../repositories/AgendamentoRepository');
const SalaRepository = require('../repositories/SalaRepository');

// Injeção de dependências
const agendamentoRepository = new AgendamentoRepository();
const salaRepository = new SalaRepository();
const agendamentoService = new AgendamentoService(agendamentoRepository, salaRepository);
const agendamentoController = new AgendamentoController(agendamentoService);

// Rotas
router.get('/', (req, res) => agendamentoController.getAllAgendamentos(req, res));
router.get('/:id', (req, res) => agendamentoController.getAgendamentoById(req, res));
router.post('/', (req, res) => agendamentoController.createAgendamento(req, res));
router.put('/:id', (req, res) => agendamentoController.updateAgendamento(req, res));
router.delete('/:id', (req, res) => agendamentoController.deleteAgendamento(req, res));

module.exports = router;