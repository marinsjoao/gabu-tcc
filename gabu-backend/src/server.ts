import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    const usersCount = await prisma.user.count();
    res.json({
      status: 'OK',
      message: 'Backend do GABU funcionando!',
      usersCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'ERROR', message: 'Falha no banco' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor GABU rodando na porta ${PORT}`);
});