# 🔤 Diretrizes de Tipografia

Atualmente, utilizamos fontes via **CDN (Google Fonts)** para garantir performance e facilidade de implementação nesta fase do projeto.

---

## 1. Fonte Principal (Textos e Interface)
Para todo o corpo do site (títulos, parágrafos, botões e menus), utilizamos a família **Poppins**.

* **Nome:** Poppins
* **Pesos necessários:** Light (300), Regular (400), Medium (500), Bold (700).
* **Onde encontrar:** [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)

### 🚀 Como implementar
Não baixe os arquivos. Certifique-se de que este link está no `<head>` do seu `base.html`:

```html
<link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
<link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
<link href="[https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap](https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap)" rel="stylesheet">