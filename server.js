const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS manual - SEM usar a biblioteca cors
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware
app.use(express.json());

// Log para debug
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Dados mock - 5 andares, cada andar com 5 salas
const salas = [
  // 1º Andar - Salas 101 a 105
  { id: uuidv4(), descricao: '101', andar: '1º Andar', capacidade: 10, status: 0 },
  { id: uuidv4(), descricao: '102', andar: '1º Andar', capacidade: 12, status: 0 },
  { id: uuidv4(), descricao: '103', andar: '1º Andar', capacidade: 8, status: 0 },
  { id: uuidv4(), descricao: '104', andar: '1º Andar', capacidade: 15, status: 1 },
  { id: uuidv4(), descricao: '105', andar: '1º Andar', capacidade: 20, status: 0 },

  // 2º Andar - Salas 201 a 205
  { id: uuidv4(), descricao: '201', andar: '2º Andar', capacidade: 25, status: 0 },
  { id: uuidv4(), descricao: '202', andar: '2º Andar', capacidade: 30, status: 0 },
  { id: uuidv4(), descricao: '203', andar: '2º Andar', capacidade: 12, status: 2 },
  { id: uuidv4(), descricao: '204', andar: '2º Andar', capacidade: 18, status: 0 },
  { id: uuidv4(), descricao: '205', andar: '2º Andar', capacidade: 22, status: 0 },

  // 3º Andar - Salas 301 a 305
  { id: uuidv4(), descricao: '301', andar: '3º Andar', capacidade: 35, status: 0 },
  { id: uuidv4(), descricao: '302', andar: '3º Andar', capacidade: 40, status: 0 },
  { id: uuidv4(), descricao: '303', andar: '3º Andar', capacidade: 28, status: 0 },
  { id: uuidv4(), descricao: '304', andar: '3º Andar', capacidade: 32, status: 1 },
  { id: uuidv4(), descricao: '305', andar: '3º Andar', capacidade: 45, status: 0 },

  // 4º Andar - Salas 401 a 405
  { id: uuidv4(), descricao: '401', andar: '4º Andar', capacidade: 50, status: 0 },
  { id: uuidv4(), descricao: '402', andar: '4º Andar', capacidade: 55, status: 0 },
  { id: uuidv4(), descricao: '403', andar: '4º Andar', capacidade: 38, status: 0 },
  { id: uuidv4(), descricao: '404', andar: '4º Andar', capacidade: 42, status: 2 },
  { id: uuidv4(), descricao: '405', andar: '4º Andar', capacidade: 48, status: 0 },

  // 5º Andar - Salas 501 a 505
  { id: uuidv4(), descricao: '501', andar: '5º Andar', capacidade: 60, status: 0 },
  { id: uuidv4(), descricao: '502', andar: '5º Andar', capacidade: 65, status: 0 },
  { id: uuidv4(), descricao: '503', andar: '5º Andar', capacidade: 52, status: 0 },
  { id: uuidv4(), descricao: '504', andar: '5º Andar', capacidade: 58, status: 1 },
  { id: uuidv4(), descricao: '505', andar: '5º Andar', capacidade: 70, status: 0 }
];

let agendamentos = [
  {
    id: uuidv4(),
    sala_id: salas[0].id,
    data: '2024-01-15',
    turno: 'A',
    horario: 'Manhã',
    descricao: 'Reunião de planejamento'
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Sala Agendamento API'
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Agendamento de Salas',
    version: '1.0.0'
  });
});

// GET - Listar todos os andares
app.get('/api/andares', (req, res) => {
  try {
    const andaresComSalas = salas.map(sala => sala.andar)
      .filter((andar, index, self) => self.indexOf(andar) === index)
      .map(andar => {
        const salasDoAndar = salas.filter(sala => sala.andar === andar);
        
        const salasComAgendamentos = salasDoAndar.map(sala => {
          const agendamentosDaSala = agendamentos.filter(ag => ag.sala_id === sala.id);
          
          return {
            ...sala,
            agendamentos: agendamentosDaSala,
            totalAgendamentos: agendamentosDaSala.length
          };
        });

        return {
          andar,
          salas: salasComAgendamentos,
          totalSalas: salasDoAndar.length,
          salasDisponiveis: salasDoAndar.filter(s => s.status === 0).length
        };
      });

    res.json({
      success: true,
      data: andaresComSalas,
      count: andaresComSalas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar andares',
      error: error.message
    });
  }
});

// GET - Listar todos os agendamentos
app.get('/api/agendamentos', (req, res) => {
  try {
    res.json({
      success: true,
      data: agendamentos,
      count: agendamentos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar agendamentos',
      error: error.message
    });
  }
});

// POST - Criar agendamento
app.post('/api/agendamentos', (req, res) => {
  try {
    const { sala_id, data, turno, horario, descricao } = req.body;

    console.log('📝 Recebendo agendamento:', req.body);

    // Validações básicas
    if (!sala_id || !data || turno === undefined || horario === undefined || !descricao) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Verificar se sala existe
    const sala = salas.find(s => s.id === sala_id);
    if (!sala) {
      return res.status(400).json({
        success: false,
        message: 'Sala não encontrada'
      });
    }

    // Verificar se sala está ativa
    if (sala.status !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Sala não está disponível para agendamento'
      });
    }

    // Verificar conflito de agendamento
    const conflito = agendamentos.find(a => 
      a.sala_id === sala_id && 
      a.data === data && 
      a.turno === turno && 
      a.horario === horario
    );

    if (conflito) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um agendamento para esta sala no mesmo horário'
      });
    }

    const novoAgendamento = {
      id: uuidv4(),
      sala_id,
      data,
      turno,
      horario,
      descricao
    };

    agendamentos.push(novoAgendamento);

    console.log('✅ Agendamento criado:', novoAgendamento);

    res.status(201).json({
      success: true,
      message: 'Agendamento criado com sucesso',
      data: novoAgendamento
    });
  } catch (error) {
    console.error('❌ Erro ao criar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar agendamento',
      error: error.message
    });
  }
});

// PUT - Atualizar agendamento (ROTA QUE ESTAVA FALTANDO)
app.put('/api/agendamentos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { sala_id, data, turno, horario, descricao } = req.body;

    console.log('📝 Atualizando agendamento:', { id, ...req.body });

    // Validações básicas
    if (!sala_id || !data || turno === undefined || horario === undefined || !descricao) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Verificar se agendamento existe
    const agendamentoIndex = agendamentos.findIndex(a => a.id === id);
    if (agendamentoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    // Verificar se sala existe
    const sala = salas.find(s => s.id === sala_id);
    if (!sala) {
      return res.status(400).json({
        success: false,
        message: 'Sala não encontrada'
      });
    }

    // Verificar se sala está ativa
    if (sala.status !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Sala não está disponível para agendamento'
      });
    }

    // Verificar conflito de agendamento (excluindo o próprio agendamento)
    const conflito = agendamentos.find(a => 
      a.id !== id && // Excluir o próprio agendamento
      a.sala_id === sala_id && 
      a.data === data && 
      a.turno === turno && 
      a.horario === horario
    );

    if (conflito) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um agendamento para esta sala no mesmo horário'
      });
    }

    // Atualizar agendamento
    agendamentos[agendamentoIndex] = {
      ...agendamentos[agendamentoIndex],
      sala_id,
      data,
      turno,
      horario,
      descricao
    };

    console.log('✅ Agendamento atualizado:', agendamentos[agendamentoIndex]);

    res.json({
      success: true,
      message: 'Agendamento atualizado com sucesso',
      data: agendamentos[agendamentoIndex]
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar agendamento',
      error: error.message
    });
  }
});

// DELETE - Deletar agendamento
app.delete('/api/agendamentos/:id', (req, res) => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deletando agendamento:', id);

    const agendamentoIndex = agendamentos.findIndex(a => a.id === id);
    
    if (agendamentoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    const agendamentoRemovido = agendamentos.splice(agendamentoIndex, 1)[0];

    console.log('✅ Agendamento deletado:', agendamentoRemovido);

    res.json({
      success: true,
      message: 'Agendamento deletado com sucesso',
      data: agendamentoRemovido
    });
  } catch (error) {
    console.error('❌ Erro ao deletar agendamento:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar agendamento',
      error: error.message
    });
  }
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  console.log(`❌ Rota não encontrada: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada: ' + req.url
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API: http://localhost:${PORT}/api/agendamentos`);
  console.log(`🏢 Andares: http://localhost:${PORT}/api/andares`);
  console.log(`✅ Backend funcionando!`);
});