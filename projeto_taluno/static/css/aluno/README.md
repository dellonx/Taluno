# 🎨 Diretrizes de Estilização (CSS)

Aqui ficam todas as folhas de estilo do Taluno. Não usamos pré-processadores (Sass/Less) neste momento, apenas **CSS3 Puro**.

## 📂 Estrutura de Arquivos

Para evitar conflitos, seguimos a estratégia de **Escopo Local**:

1.  **`global.css`**: Use APENAS para variáveis (`:root`), resets e elementos universais (body, h1, .btn-primary).
2.  **`core/` e `autenticacao/`**: Estilos específicos de cada módulo. Não misture CSS da Home no CSS de Login.

## ⚠️ Regras de Ouro

### 1. Variáveis CSS
Sempre use as variáveis definidas no `global.css` para manter a identidade visual.
* ✅ `color: var(--primary);`
* ❌ `color: #9600FF;` (Hardcoded proibido!)

### 2. Nomenclatura de Classes
Use nomes descritivos em minúsculo, separados por traço (kebab-case).
* ✅ `.card-aluno-destaque`
* ❌ `.CardAluno`, `.caixa_azul`

### 3. Responsividade Futura (Estratégia Desktop-First) 
Como nosso design no Canva é Desktop, vamos codificar primeiro a versão PC.
Utilizem Media Queries com `max-width` para ajustar o layout em telas menores.

* Breakpoint Tablet: `@media (max-width: 992px)`
* Breakpoint Celular: `@media (max-width: 768px)`