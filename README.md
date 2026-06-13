# NotePad - Seu Bloco de Notas Pessoal


O projeto foi desenvolvido com uma arquitetura separando backend e frontend web, e agora também conta com uma versão mobile em desenvolvimento, utilizando o mesmo backend da aplicação web.

## Estrutura do Projeto

```txt
NotePad/
├── notepad-backend      # API REST da aplicação
├── notepad-frontend     # Versão web da aplicação
└── notepad-mobile       # Versão mobile da aplicação
```

## Funcionalidades Principais

### Versão Web

* **Criação e Edição de Notas:** Um editor de texto rico para formatar suas ideias.
* **Organização com Pastas e Tags:** Categorize suas notas em pastas e adicione múltiplas tags para uma organização flexível.
* **Filtragem Dinâmica:** Encontre suas notas facilmente filtrando por pasta ou tag.
* **Interface Reativa:** Experiência de usuário fluida e rápida, construída com Angular.

### Versão Mobile

A versão mobile foi criada para reaproveitar o backend existente do projeto e permitir que o usuário gerencie suas notas diretamente pelo celular.

Funcionalidades da versão mobile:

* Listagem de notas cadastradas.
* Visualização dos detalhes de uma nota.
* Criação de novas notas.
* Edição de notas existentes.
* Exclusão de notas.
* Criação, edição e exclusão de pastas.
* Criação, edição e exclusão de tags.
* Associação de notas com pastas e tags.
* Geração de resumo inteligente de notas com IA.

## Resumo Inteligente com IA

A versão mobile possui uma funcionalidade de resumo inteligente, que permite gerar automaticamente um resumo do conteúdo de uma nota.

O fluxo da funcionalidade é:

```txt
Mobile Expo
    ↓
Backend Spring Boot
    ↓
Gemini API
    ↓
Backend salva o resumo no banco
    ↓
Mobile exibe o resumo ao usuário
```

A chave da API de IA não fica no aplicativo mobile. Ela é configurada apenas no backend, evitando a exposição de dados sensíveis no app.

Endpoint utilizado para gerar resumo:

```txt
POST /api/notas/{id}/resumo
```

Exemplo de resposta:

```json
{
  "noteId": 1,
  "resumo": "Resumo gerado automaticamente pela IA."
}
```

## Tecnologias Utilizadas

O projeto é dividido em três partes principais: backend, frontend web e mobile.

### Backend

* ![Java](https://img.shields.io/badge/Java-21-blue?logo=java)
* ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?logo=spring-boot)
* ![JPA/Hibernate](https://img.shields.io/badge/JPA_/_Hibernate-red)
* ![Maven](https://img.shields.io/badge/Maven-apache?logo=apache-maven\&logoColor=red)
* PostgreSQL
* Supabase

### Frontend Web

* ![Angular](https://img.shields.io/badge/Angular-17.x-red?logo=angular)
* ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
* ![SCSS](https://img.shields.io/badge/SCSS-pink?logo=sass)
* ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple?logo=bootstrap)

### Mobile

* Expo
* React Native
* TypeScript
* Axios
* React Navigation

### Banco de Dados

* ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql)
* Supabase

### Inteligência Artificial

* Gemini API
* Modelo: `gemini-2.5-flash-lite`

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas:

* Java JDK 21 ou superior
* Node.js e npm, versão 20.x ou superior
* Expo Go, caso deseje testar o app mobile em um celular físico
* Chave de API do Google AI Studio, caso queira utilizar a funcionalidade de resumo com IA

## Como Executar o Projeto

Para executar o projeto completo, você pode precisar de até três terminais:

1. Um terminal para o backend.
2. Um terminal para o frontend web.
3. Um terminal para o app mobile.

## 1. Configurando o Backend

O backend está localizado na pasta:

```txt
notepad-backend
```

```

### Variáveis de ambiente da IA

No Linux/macOS:

```bash
export GEMINI_API_KEY="SUA_CHAVE_DA_GEMINI"
export GEMINI_MODEL="gemini-2.5-flash-lite"
```

No Windows PowerShell:

```powershell
$env:GEMINI_API_KEY="SUA_CHAVE_DA_GEMINI"
$env:GEMINI_MODEL="gemini-2.5-flash-lite"
```

### Iniciando o servidor backend

Navegue até a pasta do backend:

```bash
cd notepad-backend
```

Execute o Maven Wrapper:

```bash
./mvnw spring-boot:run
```

No Windows:

```bash
mvnw.cmd spring-boot:run
```

O servidor backend estará disponível em:

```txt
http://localhost:8080
```

## 2. Configurando o Frontend Web

Em um novo terminal, navegue até a pasta do frontend:

```bash
cd notepad-frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação Angular:

```bash
npm start
```

A interface web estará disponível em:

```txt
http://localhost:4200
```

## 3. Configurando o App Mobile

Em um novo terminal, navegue até a pasta mobile:

```bash
cd notepad-mobile
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` dentro da pasta `notepad-mobile`.

Para Android Emulator:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api
```

Para iOS Simulator:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

Para celular físico, use o IP local do computador que está executando o backend:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:8080/api
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.15:8080/api
```

Depois execute:

```bash
npx expo start
```

O app pode ser testado usando:

* Expo Go
* Android Emulator
* iOS Simulator

## Endpoints Principais

### Notas

```txt
GET    /api/notas
GET    /api/notas/{id}
POST   /api/notas
PUT    /api/notas/{id}
DELETE /api/notas/{id}
POST   /api/notas/{id}/resumo
```

### Pastas

```txt
GET    /api/pastas
GET    /api/pastas/{id}
POST   /api/pastas
PUT    /api/pastas/{id}
DELETE /api/pastas/{id}
```

### Tags

```txt
GET    /api/tags
GET    /api/tags/{id}
POST   /api/tags
PUT    /api/tags/{id}
DELETE /api/tags/{id}
```

## Organização da Versão Mobile

A versão mobile segue uma estrutura simples e organizada:

```txt
notepad-mobile/
├── src/
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   ├── theme/
│   ├── types/
│   └── utils/
```

Responsabilidades principais:

```txt
components/   -> Componentes reutilizáveis
config/       -> Configurações da aplicação
hooks/        -> Hooks customizados
navigation/   -> Rotas e navegação
screens/      -> Telas da aplicação
services/     -> Comunicação com o backend
theme/        -> Cores, espaçamentos, tipografia e tema visual
types/        -> Tipagens TypeScript
utils/        -> Funções auxiliares
```

## Observações Importantes

* O backend precisa estar rodando para que a versão web e a versão mobile funcionem corretamente.
* No Android Emulator, use `10.0.2.2` para acessar o backend local.
* No celular físico, use o IP local do computador que está executando o backend.
* A chave da Gemini API deve ser adicionada ao backend.
