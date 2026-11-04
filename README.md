# GABU — Assistente de Estudos para o ENEM

Aplicativo mobile gamificado para preparação do ENEM, construído com **React Native (Expo)** no frontend, **Node.js + Express + Prisma** no backend e **PostgreSQL** como banco de dados. Todo o ambiente de desenvolvimento é orquestrado com **Docker**.

O frontend atualmente segue uma estratégia **offline-first**: as questões e o progresso do jogador ficam disponíveis localmente no dispositivo, sem depender de conexão com o backend ou com a internet. As instruções e informações do backend neste README são mantidas para referência.

As questões locais estão organizadas por ano em `gabu-frontend/public/`; o catálogo foi obtido do projeto [enem-api](https://github.com/yunger7/enem-api), documentado em [docs.enem.dev](https://docs.enem.dev/introduction). O progresso do jogador é armazenado no SQLite do dispositivo.

![Node](https://img.shields.io/badge/Node.js-18.x-green)
![Docker](https://img.shields.io/badge/Docker-✓-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Expo](https://img.shields.io/badge/Expo-✓-black)

---

## 📋 Sumário

- [Pré-requisitos](#-pré-requisitos)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Configuração da Conta Expo](#-configuração-da-conta-expo)
- [Comandos do Dia a Dia](#-comandos-do-dia-a-dia)
- [Testando o Backend](#-testando-o-backend)
- [Rodando o Frontend](#-rodando-o-frontend)
- [Trabalhando com o Banco de Dados](#-trabalhando-com-o-banco-de-dados)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Solução de Problemas](#-solução-de-problemas)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Licença](#-licença)
- [Autores](#-autores)

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

| Ferramenta | Versão Mínima | Para que serve | Download |
| :--- | :--- | :--- | :--- |
| **Git** | 2.x | Clonar o repositório | [git-scm.com](https://git-scm.com) |
| **Docker Desktop** | 4.x | Rodar backend e banco em containers | [docker.com](https://www.docker.com/products/docker-desktop) |
| **Node.js (LTS)** | 18.x | Rodar o Expo (frontend) fora do Docker | [nodejs.org](https://nodejs.org) |
| **Expo Go** (celular) | Última | Testar o app no celular físico | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779) |

> **💡 Dica (Windows):** O Docker Desktop precisa do **WSL 2** habilitado. Se ainda não tiver, execute `wsl --install` no PowerShell como Administrador e reinicie o computador.

---

## 📁 Estrutura do Projeto

```
tcc/
├── docker-compose.yml        # Orquestra os containers (backend + banco)
├── .gitignore                # Arquivos ignorados pelo Git
├── README.md                 # Este arquivo
├── gabu-backend/             # API Node.js + Prisma
│   ├── Dockerfile            # Build do backend
│   ├── .dockerignore         # Arquivos ignorados no build
│   ├── prisma/
│   │   ├── schema.prisma     # Modelagem do banco
│   │   └── migrations/       # Histórico de migrações
│   ├── src/
│   │   └── server.ts         # Ponto de entrada do servidor
│   ├── package.json
│   └── tsconfig.json
└── gabu-frontend/            # App React Native (Expo)
    ├── App.tsx               # Componente raiz
    ├── package.json
    └── ...
```

---

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd tcc
```

### 2. Inicie o Docker Desktop

Abra o **Docker Desktop** e aguarde até que o ícone na bandeja do sistema fique **estável** (sem animação de carregamento).

Confirme que o Docker está funcionando:

```bash
docker --version
docker ps
```

O segundo comando deve retornar uma tabela vazia, sem erros.

### 3. Suba os containers

Na raiz do projeto:

```bash
docker compose up --build
```

O Docker vai:

1. Baixar as imagens do **Node.js 18** e **PostgreSQL 15**
2. Copiar os arquivos do backend para dentro do container
3. Rodar `npm install` e `npx prisma generate`
4. Iniciar o Postgres e o backend

Aguarde até ver nos logs:

```
gabu_db       | database system is ready to accept connections
gabu_backend  | 🚀 Servidor GABU rodando na porta 3333
```

> ⚠️ **Não feche este terminal.** Ele está servindo os logs dos containers. Para rodar outros comandos, abra **outro terminal**.

### 4. Rode as migrações do banco

**Em outro terminal**, na raiz do projeto:

```bash
docker compose exec backend npx prisma migrate dev --name init
```

Isso cria as tabelas no banco de dados com base no `schema.prisma`.

### 5. Teste o backend

Abra no navegador: [http://localhost:3333/health](http://localhost:3333/health)

Você deve ver:

```json
{
  "status": "OK",
  "message": "Backend do GABU funcionando!",
  "usersCount": 0
}
```

Se retornou isso, **o backend está 100% funcional**. 🎉

### 6. Instale as dependências do frontend

**Em outro terminal**, entre na pasta do frontend. O app pode ser desenvolvido e executado sem iniciar o backend:

```bash
cd gabu-frontend
npm ci
```

As dependências de cada plataforma já estão declaradas no projeto e instaladas pelo comando acima.

### 7. Faça login na sua conta Expo (opcional, mas recomendado)

O login na conta Expo é **opcional** para rodar o projeto localmente, mas é **obrigatório** para:

- Publicar o app via **EAS Build** (gerar APK/IPA)
- Usar **EAS Update** (atualizações OTA)
- Sincronizar configurações entre máquinas

Para fazer login:

```bash
npx expo login
```

Você será solicitado a informar:

```
Log in to EAS with email or username (exit and run 'npx expo login --help' for other login options)
√ Email or username ... seu-usuario-expo
√ Password ... **********
```

Após o login, confirme que está autenticado:

```bash
npx expo whoami
```

Deve retornar o nome de usuário logado (ex: `marinsjoao`).

**Para criar uma conta gratuita:** acesse [expo.dev/signup](https://expo.dev/signup).

**Para fazer logout:**

```bash
npx expo logout
```

### 8. Rode o frontend

Execute na pasta `gabu-frontend`:

```bash
npm run start
```

Escolha como abrir o app:

- Pressione **`a`** para abrir no emulador Android
- Pressione **`w`** para abrir no navegador
- Escaneie o **QR Code** com o app **Expo Go** no celular

O SQLite local é inicializado automaticamente quando o app é aberto pela primeira vez.

---

## 📱 Configuração da Conta Expo

### Por que fazer login?

O Expo oferece uma conta gratuita que dá acesso a:

| Recurso | Benefício |
| :--- | :--- |
| **EAS Build** | Compilar o app na nuvem (gera APK/IPA) sem precisar de Android Studio/Xcode local |
| **EAS Update** | Publicar atualizações OTA (sem precisar reenviar para as lojas) |
| **EAS Submit** | Publicar automaticamente na Play Store/App Store |
| **Expo Dev Tools** | Acessar o dashboard com projetos e builds |

### Comandos úteis

| Ação | Comando |
| :--- | :--- |
| Fazer login | `npx expo login` |
| Fazer logout | `npx expo logout` |
| Ver quem está logado | `npx expo whoami` |
| Criar conta (via navegador) | [expo.dev/signup](https://expo.dev/signup) |

### Alternativa: variável de ambiente

Se estiver em CI/CD (ex: GitHub Actions), você pode autenticar via token:

```bash
export EXPO_TOKEN=seu-token-aqui
```

O token é gerado em [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens).

---

## 🔁 Comandos do Dia a Dia

### Containers

| Ação | Comando |
| :--- | :--- |
| Subir os containers | `docker compose up` |
| Subir e rebuildar imagens | `docker compose up --build` |
| Subir em background | `docker compose up -d` |
| Parar os containers | `docker compose down` |
| Parar e apagar o volume do banco | `docker compose down -v` |
| Ver status dos containers | `docker ps` |
| Ver logs do backend | `docker compose logs -f backend` |
| Ver logs do banco | `docker compose logs -f db` |

### Backend

| Ação | Comando |
| :--- | :--- |
| Entrar no shell do container | `docker compose exec backend sh` |
| Rodar migração | `docker compose exec backend npx prisma migrate dev --name <nome>` |
| Regerar o Prisma Client | `docker compose exec backend npx prisma generate` |
| Abrir o Prisma Studio | `docker compose exec backend npx prisma studio` |
| Resetar o banco (apaga tudo e reaplica) | `docker compose exec backend npx prisma migrate reset` |

### Frontend

| Ação | Comando |
| :--- | :--- |
| Rodar o Expo | `npm run start` |
| Rodar no navegador | `npm run web` |
| Rodar no Android | `npm run android` |
| Rodar no iOS (macOS) | `npm run ios` |
| Limpar cache | `npx expo start --clear` |
| Login no Expo | `npx expo login` |
| Logout | `npx expo logout` |

---

## 🧪 Testando o Backend

### Endpoint `/health`

```bash
curl http://localhost:3333/health
```

**Resposta esperada:**

```json
{
  "status": "OK",
  "message": "Backend do GABU funcionando!",
  "usersCount": 0
}
```

### Ver o banco visualmente com o Prisma Studio

```bash
docker compose exec backend npx prisma studio
```

Abra no navegador: [http://localhost:5555](http://localhost:5555)

---

## 📱 Rodando o Frontend

O frontend **não roda dentro do Docker** durante o desenvolvimento, porque o Expo precisa de hot reload instantâneo e comunicação direta com o emulador ou celular. A execução atual é offline-first e não exige que o backend esteja iniciado.

### Primeira vez

```bash
cd gabu-frontend
npm ci
npx expo login     # opcional
npm run start
```

### Próximas vezes

```bash
cd gabu-frontend
npm run start
```

### Ajuste o `API_URL` conforme o ambiente

Esta configuração é mantida como referência para a integração com o backend. O frontend offline-first atual não depende de `API_URL` para carregar questões ou salvar o progresso local.

No arquivo `gabu-frontend/App.tsx`:

```typescript
// ⚠️ Troque conforme o ambiente:
// - Android Emulator: http://10.0.2.2:3333
// - iOS Simulator / Web: http://localhost:3333
// - Celular físico: http://SEU_IP_LOCAL:3333
const API_URL = 'http://localhost:3333';
```

| Ambiente | Valor de `API_URL` |
| :--- | :--- |
| Navegador / iOS Simulator | `http://localhost:3333` |
| Emulador Android | `http://10.0.2.2:3333` |
| Celular físico | `http://SEU_IP_LOCAL:3333` (ex: `192.168.0.10`) |

### Descobrir seu IP local (para testar no celular físico)

```bash
# Windows
ipconfig
# Procure pelo "Endereço IPv4" da sua rede Wi-Fi

# macOS / Linux
ifconfig
```

---

## 🗄️ Trabalhando com o Banco de Dados

### Alterar o schema

1. Edite o arquivo `gabu-backend/prisma/schema.prisma`
2. Rode a migração:

   ```bash
   docker compose exec backend npx prisma migrate dev --name nome_da_alteracao
   ```

3. O Prisma Client é regenerado automaticamente.

### Resetar o banco (apaga tudo)

```bash
docker compose exec backend npx prisma migrate reset
```

### Acessar o Postgres direto pelo terminal

```bash
docker compose exec db psql -U gabu -d gabu_db
```

Comandos úteis dentro do `psql`:

```sql
\dt                     -- lista as tabelas
SELECT * FROM "User";   -- consulta a tabela User
\q                      -- sair
```

### Conectar pelo DBeaver ou outro cliente SQL

| Campo | Valor |
| :--- | :--- |
| Host | `localhost` |
| Porta | `5432` |
| Database | `gabu_db` |
| Usuário | `gabu` |
| Senha | `gabu123` |

---

## 🔐 Variáveis de Ambiente

### Backend

As variáveis de ambiente do backend ficam **dentro do `docker-compose.yml`** durante o desenvolvimento:

```yaml
environment:
  DATABASE_URL: postgresql://gabu:gabu123@db:5432/gabu_db?schema=public
  PORT: 3333
```

Para rodar o Prisma **fora do Docker** (ex: no Windows), crie um arquivo `gabu-backend/.env`:

```env
DATABASE_URL="postgresql://gabu:gabu123@localhost:5432/gabu_db?schema=public"
```

> ⚠️ **Nunca commite o arquivo `.env`.** Ele já está no `.gitignore`.

### Banco de Dados

As credenciais do Postgres ficam no `docker-compose.yml`:

```yaml
environment:
  POSTGRES_USER: gabu
  POSTGRES_PASSWORD: gabu123
  POSTGRES_DB: gabu_db
```

Em produção, use um gerenciador de segredos (ex: GCP Secret Manager).

---

## 🛠️ Solução de Problemas

### `Cannot connect to the Docker daemon`

**Causa:** O Docker Desktop não está rodando.

**Solução:** Abra o Docker Desktop e aguarde a inicialização completa (ícone estável na bandeja). Depois, rode `docker ps` para confirmar.

### `port is already allocated` (porta 5432 ou 3333 em uso)

**Causa:** Outro serviço (ou um container antigo) está usando a mesma porta.

**Solução:**

```bash
# Ver containers em execução
docker ps

# Parar containers antigos do projeto
docker compose down

# Se ainda houver conflito, mude a porta no docker-compose.yml
# Ex: ports: "5433:5432"
```

### `relation "public.User" does not exist`

**Causa:** As migrações do Prisma ainda não foram executadas.

**Solução:**

```bash
docker compose exec backend npx prisma migrate dev --name init
```

### App mostra "Erro ao conectar no backend"

**Causa:** O `API_URL` está errado para o ambiente, ou o backend não está rodando.

**Solução:**

1. Confirme que o backend está no ar: [http://localhost:3333/health](http://localhost:3333/health)
2. Ajuste o `API_URL` no `App.tsx` conforme o ambiente
3. No celular físico, garanta que ele está na **mesma rede Wi-Fi** do PC

### Build do Docker falha com erro de permissão

**Causa:** O Docker Desktop no Windows precisa de acesso administrativo para algumas operações.

**Solução:** Feche o Docker Desktop, abra como Administrador e tente novamente.

### Erro `npm install-scripts` no build

**Causa:** Proteção de segurança do npm bloqueia scripts de pós-instalação (ex: `esbuild`).

**Solução:** Adicione ao `Dockerfile`:

```Dockerfile
RUN npm install --foreground-scripts
```

### Erro `wsl.exe exited with code 4294967295` (Rancher Desktop)

**Causa:** Falha na inicialização do WSL.

**Solução:** Prefira usar o **Docker Desktop** em vez do Rancher Desktop no Windows. O Docker Desktop tem melhor suporte a pipes nomeados e permissões.

### Containers sobem, mas o frontend não conecta

**Causa:** No Android Emulator, `localhost` aponta para o próprio emulador, não para o host.

**Solução:** Use `http://10.0.2.2:3333` no `App.tsx`.

### Acentos e emojis aparecem como `Г§ГЈo`, `рџ“‹` (encoding errado)

**Causa:** O arquivo foi salvo com encoding ANSI/Windows-1252 em vez de UTF-8.

**Solução:** No VS Code, clique no encoding no canto inferior direito, escolha **"Save with Encoding"** → **"UTF-8"**.

### `Failed to resolve the Android SDK path`

**Causa:** O Android Studio não está instalado ou a variável `ANDROID_HOME` não está configurada.

**Solução:** Instale o **Android Studio** e configure a variável de ambiente `ANDROID_HOME` apontando para `C:\Users\<Usuario>\AppData\Local\Android\Sdk`. Adicione `%ANDROID_HOME%\platform-tools` ao `Path`.

### `Unable to determine the default URI scheme for deep linking`

**Causa:** O Expo entrou em modo "development build" sem o pacote `expo-dev-client`.

**Solução:** No terminal do Expo, pressione **`s`** para alternar para o modo **Expo Go**.

---

## 🧰 Tecnologias Utilizadas

### Backend

- **Node.js 18** — Ambiente de execução
- **Express** — Framework HTTP
- **TypeScript** — Tipagem estática
- **Prisma ORM** — Modelagem e migração do banco
- **PostgreSQL 15** — Banco de dados relacional

### Frontend

- **React Native** — Framework mobile
- **Expo** — Ferramentas e build
- **TypeScript** — Tipagem estática
- **Axios** — Cliente HTTP

### Infraestrutura

- **Docker** — Containerização
- **Docker Compose** — Orquestração local
- **GCP (Google Cloud Platform)** — Deploy em produção (planejado)

---

## 📄 Licença

Este projeto é parte de um Trabalho de Conclusão de Curso (TCC). Todos os direitos reservados aos autores.

---

## 👤 Autores

**Gabriel Ferraz**
Curso de Sistemas de Informação
UFF
2026

**João Vitor Marins da Silva**
Curso de Sistemas de Informação
UFF
2026