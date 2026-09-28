const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const PERGUNTAS = [
  { texto: 'O que o Docker cria a partir de um Dockerfile?', opcoes: ['Uma imagem', 'Uma VM', 'Um commit'], correta: 0 },
  { texto: 'Qual arquivo orquestra vários containers?', opcoes: ['Dockerfile', 'docker-compose.yml', '.gitignore'], correta: 1 },
  { texto: 'Qual comando encerra os containers e preserva os volumes?', opcoes: ['docker compose down -v', 'docker compose down', 'docker rm -f'], correta: 1 },
];

async function iniciarBanco() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS resultados (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      acertos INT NOT NULL,
      total INT NOT NULL,
      criado_em TIMESTAMP DEFAULT NOW()
    )`);
}

app.get('/api/perguntas', (req, res) => {
  res.json(PERGUNTAS.map(({ texto, opcoes }) => ({ texto, opcoes })));
});

app.post('/api/respostas', async (req, res) => {
  try {
    const { nome, respostas } = req.body;
    if (!nome || !Array.isArray(respostas)) return res.status(400).json({ erro: 'Dados inválidos' });
    const acertos = PERGUNTAS.filter((p, i) => respostas[i] === p.correta).length;
    await pool.query(
      'INSERT INTO resultados (nome, acertos, total) VALUES ($1, $2, $3)',
      [nome, acertos, PERGUNTAS.length]
    );
    res.json({ acertos, total: PERGUNTAS.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Erro ao salvar' });
  }
});

app.get('/api/resultados', async (req, res) => {
  const { rows } = await pool.query('SELECT nome, acertos, total, criado_em FROM resultados ORDER BY id DESC LIMIT 20');
  res.json(rows);
});

iniciarBanco()
  .then(() => app.listen(3000, () => console.log('Rodando na porta 3000')))
  .catch((e) => { console.error('Falha ao conectar no banco', e); process.exit(1); });
