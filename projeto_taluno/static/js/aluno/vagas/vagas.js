// 1. Variáveis de controle de página
let paginaAtual = 1;
const vagasPorPagina = 4; // Quantas vagas aparecem por vez

document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a tela e o modal
    renderizarVagasPaginadas();
    inicializarModal();
    configurarBotoesPaginacao();
});

// --- FUNÇÃO: Renderiza apenas as vagas da página atual ---
function renderizarVagasPaginadas() {
    const containerVagas = document.querySelector('.vagas-container');
    const barraPaginacao = document.querySelector('.paginacao');
    
    if (!containerVagas) return;

    // 1. Pegamos a lista total (LocalStorage)
    const vagasLocalStorage = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    
    // Limpamos apenas os cards antigos para não duplicar
    containerVagas.querySelectorAll('.card-das-vagas').forEach(card => card.remove());

    // 2. Cálculo de fatiamento (Slice)
    const inicio = (paginaAtual - 1) * vagasPorPagina;
    const fim = inicio + vagasPorPagina;
    const vagasParaExibir = vagasLocalStorage.slice(inicio, fim);

    // 3. Criamos os cards da página atual
    vagasParaExibir.forEach(vaga => {
        const novoCard = document.createElement('article');
        novoCard.classList.add('card-das-vagas');
        novoCard.innerHTML = `
            <div class="vaga-info-bloco">
                <h3 class="vaga-titulo">${vaga.titulo}</h3>
                <p class="vaga-empresa">Simtec Soluções Tecnológicas</p>
                <p class="vaga-endereco">Recife, PE</p>
                <div class="vaga-badges">
                    <span class="badge">${vaga.modalidade || 'Estágio'}</span>
                    <span class="badge">Ativa</span>
                </div>
            </div>
            <button class="btn-ver-mais" data-descricao="${vaga.descricao}">Ver mais</button>
        `;
        // Insere antes da barra de paginação
        containerVagas.insertBefore(novoCard, barraPaginacao);
    });

    // 4. Feedback visual nos botões (opcional: desativa se não houver mais páginas)
    const botoes = document.querySelectorAll('.btn-paginacao');
    if (botoes.length >= 2) {
        botoes[0].style.opacity = (paginaAtual === 1) ? "0.3" : "1";
        const totalPaginas = Math.ceil(vagasLocalStorage.length / vagasPorPagina);
        botoes[1].style.opacity = (paginaAtual >= totalPaginas) ? "0.3" : "1";
    }
}

// --- FUNÇÃO: Configura os cliques nas setinhas ---
function configurarBotoesPaginacao() {
    const botoes = document.querySelectorAll('.btn-paginacao');
    
    // Botão Anterior (Página Anterior)
    botoes[0].addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarVagasPaginadas();
            window.scrollTo(0, 0); // Volta pro topo da lista
        }
    });

    // Botão Próximo (Próxima Página)
    botoes[1].addEventListener('click', () => {
        const vagasLocalStorage = JSON.parse(localStorage.getItem('minhasVagas')) || [];
        const totalPaginas = Math.ceil(vagasLocalStorage.length / vagasPorPagina);
        
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarVagasPaginadas();
            window.scrollTo(0, 0);
        }
    });
}

// --- FUNÇÃO: Modal (Delegação de evento para funcionar em qualquer página) ---
function inicializarModal() {
    const modal = document.querySelector('.modal-overlay');
    const btnVoltar = document.querySelector('.btn-voltar-modal');

    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-ver-mais')) {
            const botao = e.target;
            const cardPai = botao.closest('.card-das-vagas');
            if (!cardPai || !modal) return;

            // Preenche os dados (Título, descrição, etc)
            document.querySelector('.vaga-titulo-detalhe').innerText = cardPai.querySelector('.vaga-titulo').innerText;
            document.querySelector('.vaga-descricao-box-cinza p').innerText = botao.getAttribute('data-descricao') || "Sem descrição.";

            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    });

    if (btnVoltar) {
        btnVoltar.onclick = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        };
    }
}