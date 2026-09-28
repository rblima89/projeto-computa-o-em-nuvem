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

## Autores
Cesar Magagnin e Robson de Lima
