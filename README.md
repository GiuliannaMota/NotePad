#  NotePad - Seu Bloco de Notas Pessoal 📝

Uma aplicação web moderna e elegante para criar, gerenciar e organizar suas anotações. Desenvolvida com uma arquitetura separando backend e frontend.

## ✨ Funcionalidades Principais

*   **Criação e Edição de Notas:** Um editor de texto rico para você formatar suas ideias.
*   **Organização com Pastas e Tags:** Categorize suas notas em pastas e adicione múltiplas tags para uma organização flexível.
*   **Filtragem Dinâmica:** Encontre suas notas facilmente filtrando por pasta ou tag.
*   **Interface Reativa:** Experiência de usuário fluida e rápida, construída com Angular.
*   **Tema Escuro:** Uma interface elegante e confortável para os olhos.

## 🚀 Tecnologias Utilizadas

O projeto é dividido em duas partes principais:

*   **Backend:**
    *   ![Java](https://img.shields.io/badge/Java-21-blue?logo=java)
    *   ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green?logo=spring-boot)
    *   ![JPA/Hibernate](https://img.shields.io/badge/JPA_/_Hibernate-red)
    *   ![Maven](https://img.shields.io/badge/Maven-apache?logo=apache-maven&logoColor=red)
*   **Frontend:**
    *   ![Angular](https://img.shields.io/badge/Angular-17.x-red?logo=angular)
    *   ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
    *   ![SCSS](https://img.shields.io/badge/SCSS-pink?logo=sass)
    *   ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-purple?logo=bootstrap)
*   **Banco de Dados:**
    *   ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql) (utilizando [Supabase](https://supabase.com/))

## 📋 Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas:

*   [Java JDK](https://www.oracle.com/java/technologies/downloads/) (versão 21 ou superior)
*   [Node.js e npm](https://nodejs.org/en/) (versão 20.x ou superior)

## ⚡ Como Executar o Projeto

Siga os passos abaixo para ter a aplicação rodando localmente. Você precisará de dois terminais.

### 1. Configurando o Backend

- **Banco de Dados:**
  Este projeto está configurado para usar um banco de dados PostgreSQL. As credenciais devem ser ajustadas no arquivo:
  ```
  notepad-backend/src/main/resources/application.properties
  ```

- **Iniciando o Servidor:**
  Navegue até a pasta do backend e execute o Maven Wrapper.

  ```bash
  # Navegue para a pasta do backend
  cd notepad-backend

  # Inicie a aplicação Spring Boot (ele irá baixar o Maven se necessário)
  ./mvnw spring-boot:run
  ```
  O servidor backend estará rodando em `http://localhost:8080`.

### 2. Configurando o Frontend

- **Instalação:**
  Em um **novo terminal**, navegue até a pasta do frontend e instale as dependências.

  ```bash
  # Navegue para a pasta do frontend
  cd notepad-frontend

  # Instale os pacotes npm
  npm install
  ```

- **Iniciando a Aplicação:**
  Após a instalação, inicie o servidor de desenvolvimento do Angular.

  ```bash
  # Inicie a aplicação
  npm start
  ```
  A interface da aplicação estará disponível em `http://localhost:4200`.

