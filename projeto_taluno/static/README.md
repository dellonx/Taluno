# 📦 Arquivos Estáticos (Static Files)

Esta pasta contém todos os ativos **públicos e fixos** do projeto. São arquivos que fazem parte da interface do sistema e **não mudam** com o uso da aplicação.

## 📂 Estrutura de Pastas

* **`/css`**: Folhas de estilo (Cascading Style Sheets).
* **`/fonts`**: Fontes locais baixadas.
* **`/img`**: Imagens do layout (Logos, ícones, banners, backgrounds).
* **`/js`**: Scripts de interação no Front-end (Menus, validações, animações).

---

## ⛔ O que NÃO colocar aqui?

### 1. Uploads de Usuários (Media)
**NUNCA** coloque fotos de perfil, currículos em PDF ou imagens de posts criados pelos alunos aqui.
* ❌ **Errado:** Salvar a foto do usuário em `static/img/perfil_joao.jpg`.
* ✅ **Certo:** Arquivos de usuário vão para a pasta `media/` (configurada no Django).

### 2. Dados Sensíveis
Como o próprio nome diz, esta pasta é **pública**. Qualquer arquivo colocado aqui pode ser acessado diretamente pelo navegador (ex: `site.com/static/senha.txt`). Não coloque chaves de API ou anotações privadas aqui.

---

## 🛠️ Boas Práticas

1.  **Nomenclatura:** Use nomes em minúsculo e sem espaços (`logo_senac.png`).
2.  **Imagens Pesadas:** Otimize imagens antes de subir (use sites como TinyPNG). Imagens acima de 1MB deixam o site lento.
3.  **Cache:** Lembre-se que navegadores guardam cache desses arquivos. Se alterar um CSS e não mudar na tela, force a limpeza do cache (Ctrl + F5).