# Quiz Docker
Aplicação web de quiz containerizada com Docker.
O usuário responde 3 perguntas, e o resultado é salvo em um banco PostgreSQL que roda em outro container.
Os dados ficam em um volume nomeado e sobrevivem ao `docker compose down`.

**Tecnologias:**
Node.js (Express), PostgreSQL 16, Docker e Docker Compose.

## Pré-requisitos
- Docker Desktop (inclui o Docker Compose)
- Git

## Como subir o ambiente
```bash
git clone https://github.com/rblima89/projeto-computa-o-em-nuvem.git
cd projeto-computa-o-em-nuvem
cp .env.example .env
docker compose up -d --build
```

## Como acessar
Abra http://localhost:8000 no navegador, digite seu nome, responda o quiz e clique em **Enviar**.
O resultado aparece na lista "Últimos resultados".

## Como encerrar
```bash
docker compose down
```
Isso preserva os dados. Para apagar também o banco, use `docker compose down -v`.

## Configuração
As variáveis ficam no arquivo `.env` (copiado do `.env.example`): `DB_USER`, `DB_PASSWORD` e `DB_NAME`. O `.env` não é versionado.

## Verificação do ambiente

Para verificar se os containers estão em execução:

```bash
docker compose ps
```

O serviço `db` deve aparecer com o status `healthy` e a aplicação deve estar disponível em:

http://localhost:8000

Para acompanhar os logs da aplicação:

```bash
docker compose logs -f app
```

Para acompanhar os logs do PostgreSQL:

```bash
docker compose logs -f db
```

## Teste de persistência

Após responder ao quiz, os resultados são armazenados no PostgreSQL.

É possível verificar diretamente os registros com:

```bash
docker compose exec db psql -U quiz_user -d quiz_db \
  -c "SELECT id, nome, acertos, total, criado_em FROM resultados;"
```

Ao executar:

```bash
docker compose down
docker compose up -d
```

os resultados permanecem armazenados porque o volume nomeado `dados` não é removido.

Para remover containers e também os dados persistidos:

```bash
docker compose down -v
```

Na próxima inicialização será criado um novo volume vazio.

## Arquitetura Docker

O projeto utiliza dois serviços:

- `app`: aplicação Node.js com Express;
- `db`: banco PostgreSQL 16.

A aplicação se conecta ao banco pelo hostname `db`, fornecido pela rede interna do Docker Compose, sem utilização de IP fixo ou `localhost`.

O serviço `db` possui um `healthcheck`, e o serviço `app` só é iniciado após o banco atingir o estado `healthy`.

## Autores

- Robson de Lima
- Cesar Magagnin
