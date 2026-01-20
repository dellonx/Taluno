# 🚀 Taluno | Conexão Senac & Mercado

Bem-vindo ao repositório oficial do **Taluno**, a plataforma desenvolvida para conectar os talentos formados no Senac às melhores oportunidades do mercado de trabalho.

> **Status do Projeto:** 🚧 Em Desenvolvimento (Front-end & Arquitetura)

---

## 🎯 Objetivo
Facilitar a contratação de alunos do Senac, permitindo que:
- **Empresas:** Publiquem vagas, filtrem candidatos e gerenciem processos seletivos.
- **Alunos:** Mantenham perfis atualizados (currículo vivo), candidatem-se a vagas e acompanhem o status.
- **Senac:** Tenha métricas sobre a empregabilidade dos seus estudantes.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Python 3 + Django Framework
* **Frontend:** HTML5, CSS3 (Modularizado), JavaScript
* **Banco de Dados:** ...
* **Versionamento:** Git & GitHub

---

# 📘 Guia de Desenvolvimento (Protocolo da Equipe)

Este documento define o padrão de trabalho para manter o projeto organizado e funcional, considerando o uso de computadores compartilhados.

### ⚠️ A REGRA DE OURO
**A branch `main` é sagrada.** Ela contém a versão oficial e funcional do nosso site.
1.  **Ninguém coda na main.**
2.  **Ninguém dá push direto na main.**
3.  Todo código novo deve passar por **Revisão (Pull Request)** antes de entrar.

---

## 🔄 1. Rotina Diária (Começando os Trabalhos)

Antes de digitar uma linha de código, você precisa garantir que o seu ambiente está limpo e atualizado. Identifique o seu caso:

### 🅰️ CENÁRIO A: O PC NÃO tem a pasta do projeto
*(Se é a primeira vez na máquina ou se você prefere apagar tudo para garantir).*

Abra o terminal (Git Bash) e rode:

```bash
git clone [https://github.com/SEU-USUARIO/Taluno.git](https://github.com/SEU-USUARIO/Taluno.git)
cd Taluno
code .
```

###🅱️ CENÁRIO B: A pasta "Taluno" JÁ EXISTE no PC
(MUITO CUIDADO: O código pode estar velho ou com "lixo" de outro aluno).

Abra o VS Code na pasta do projeto.

Abra o terminal (Ctrl + J).

PASSO OBRIGATÓRIO: Volte para a base e baixe as atualizações:

```bash
git checkout main
git pull origin main
``` 

### 🆘 DEU ERRO NO GIT PULL? (Conflito de PC Compartilhado)
Se aparecerem erros vermelhos dizendo que existem arquivos modificados (que não são seus), rode o Comando de Limpeza Total.

ATENÇÃO: Isso apaga qualquer alteração local não salva e deixa o PC idêntico ao GitHub.

```bash
git reset --hard origin/main
``` 

### 🌿 2. Criando sua Tarefa (Branches)
Nunca trabalhe na main. Crie um "universo paralelo" para sua tarefa.

Padrão de Nomes (Obrigatório): Use categoria/nome-da-tarefa (tudo minúsculo, separado por hífen).

```bash
Categoria	|  Uso	|  Exemplo
---
feature/    | Novas funcionalidades	| feature/tela-login
---
fix/    	| Correções de bugs	| fix/botao-entrar
---
style/  	| Ajustes visuais/CSS	| style/cores-home
```

Comando para criar e entrar na branch:

```bash
git checkout -b feature/nome-da-sua-tarefa
```

### 🚀 3. Salvando e Enviando (Push)
Terminou a tarefa ou acabou a aula? Salve na nuvem.

1.  **Adicione e comite suas alterações:**

```bash
git add .
git commit -m "Explique brevemente o que fez"
```

2.  **Envie a SUA BRANCH para o GitHub:**

```bash
git push origin feature/nome-da-sua-tarefa
```

*(Jamais tente git push origin main, o GitHub vai bloquear).*

### 🛡️ 4. Entregando a Tarefa (Pull Request)
O trabalho não acaba no terminal. Para seu código entrar no projeto oficial:

1. **Entre no repositório do GitHub.**

2. **Você verá um aviso amarelo com sua branch. Clique em "Compare & pull request".**

3. **Coloque um título claro sobre o que você fez.**

4. **Clique em Create Pull Request.**

5. **Avisar o Tech Lead para fazer a revisão.**

### 🛠️ 5. Ciclo de Correção (O Tech Lead pediu ajustes?)
Se o Tech Lead pedir alterações no seu Pull Request (PR), NÃO feche o PR e NÃO crie outro.

1. **Volte para o VS Code e garanta que está na branch certa:**

```bash
git checkout feature/sua-tarefa
```

2. **Faça as correções no código.**

3. **Salve e envie novamente (na mesma branch):**

```bash
git add .
git commit -m "Correções solicitadas"
git push origin feature/sua-tarefa
```

4. **Pronto! O Pull Request no site será atualizado automaticamente. Avise o Tech Lead.**

### ⚡ Cheat Sheet (Resumão de Comandos)
```bash
Ação	                    | Comando
Baixar projeto (Zero)	    |git clone [link]
Atualizar projeto (Diário)	|git pull origin main
Forçar atualização (Limpar)	|git reset --hard origin/main
Criar Branch	            |git checkout -b tipo/nome-tarefa
Trocar de Branch	        |git checkout nome-da-branch
Enviar Branch	            |git push origin tipo/nome-tarefa
Verificar onde estou	    |git status
```

**Dúvidas? Travou no Git? Chame o Tech Lead antes de rodar comandos desconhecidos.**
