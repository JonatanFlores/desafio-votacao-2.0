# Votação

Este repositório contém a aplicação full stack, organizada em dois principais diretórios: `frontend` e `backend`. Cada parte é projetada para funcionar de forma integrada, proporcionando uma experiência de usuário completa.

## Configuração Inicial

Primeiro, clone o repositório para sua máquina local. Depois, navegue até cada diretório do projeto (`frontend` e `backend`) para configurá-los individualmente.

### Frontend

Localizado no diretório `frontend`, construído com Angular:

1. Execute `npm install` para instalar as dependências.
2. Utilize `ng serve` para iniciar o servidor de desenvolvimento.
3. Acesse `http://localhost:4200/` para visualizar a aplicação.

### Backend

Localizado no diretório `backend`, desenvolvido com NestJS:

1. Execute `npm install` para instalar as dependências.
2. Copie o arquivo `.env.example` para `.env` e atualize-o com as configurações específicas do seu ambiente.
3. Inicie o servidor com `npm run start:dev`.
4. A documentação Swagger está disponível em `http://localhost:3000/api-docs` para visualizar e testar os endpoints da API.

## Docker

Consulte o `compose.yaml` na raiz para as configurações do Docker aplicáveis tanto ao frontend quanto ao backend.
