// 1. Variáveis de controle de página
let paginaAtual = 1;
const vagasPorPagina = 4;

document.addEventListener('DOMContentLoaded', () => {
    renderizarVagasPaginadas();
    inicializarModal();
    configurarBotoesPaginacao();
});


function renderizarVagasPaginadas() {
    const containerVagas = document.querySelector('.vagas-container');
    const barraPaginacao = document.querySelector('.paginacao');
    
    if (!containerVagas) return;

   
    let vagasLocalStorage = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    

    vagasLocalStorage.reverse(); 


    containerVagas.querySelectorAll('.card-das-vagas').forEach(card => card.remove());

    
    const inicio = (paginaAtual - 1) * vagasPorPagina;
    const fim = inicio + vagasPorPagina;
    const vagasParaExibir = vagasLocalStorage.slice(inicio, fim);

   vagasParaExibir.forEach(vaga => {
    const novoCard = document.createElement('article');
    novoCard.classList.add('card-das-vagas');
    
    novoCard.innerHTML = `
        <div class="vaga-info-bloco">
            <h3 class="vaga-titulo">${vaga.titulo}</h3>
            <p class="vaga-empresa">Simtec Soluções Tecnológicas</p>
            <p class="vaga-endereco">${vaga.cidade || 'Recife, PE'}</p>
            
            <div class="vaga-badges">
                <span class="badge">${vaga.area || 'Geral'}</span>
                
                <span class="badge">${vaga.salario || 'A combinar'}</span>
                
                <span class="badge">${vaga.modalidade || 'Não informada'}</span>
            </div>
        </div>
        
        <button class="btn-ver-mais" 
            data-titulo="${vaga.titulo}"
            data-descricao="${vaga.descricao || 'Sem descrição.'}"
            data-area="${vaga.area || 'Geral'}"
            data-modalidade="${vaga.modalidade || 'Não informada'}"
            data-escolaridade="${vaga.escolaridade || 'Não informada'}"
            data-escala="${vaga.escala || 'Não informada'}"
            data-salario="${vaga.salario || 'A combinar'}"
            data-experiencia="${vaga.experiencia || 'Sem experiência'}"
        >Ver mais</button>
    `;
    containerVagas.insertBefore(novoCard, barraPaginacao);
});

    const botoes = document.querySelectorAll('.btn-paginacao');
    if (botoes.length >= 2) {
        botoes[0].style.opacity = (paginaAtual === 1) ? "0.3" : "1";
        const totalPaginas = Math.ceil(vagasLocalStorage.length / vagasPorPagina);
        botoes[1].style.opacity = (paginaAtual >= totalPaginas || totalPaginas === 0) ? "0.3" : "1";
    }
}

// --- FUNÇÃO: Configura os cliques nas setinhas ---
function configurarBotoesPaginacao() {
    const botoes = document.querySelectorAll('.btn-paginacao');
    if (!botoes.length) return;

    botoes[0].onclick = () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            renderizarVagasPaginadas();
            window.scrollTo(0, 0);
        }
    };

    botoes[1].onclick = () => {
        const vagasLocalStorage = JSON.parse(localStorage.getItem('minhasVagas')) || [];
        const totalPaginas = Math.ceil(vagasLocalStorage.length / vagasPorPagina);
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            renderizarVagasPaginadas();
            window.scrollTo(0, 0);
        }
    };
}

// --- FUNÇÃO: Modal Atualizada para Badges Dinâmicas ---
function inicializarModal() {
    const modal = document.querySelector('.modal-overlay');
    const btnVoltar = document.querySelector('.btn-voltar-modal');
    const containerTagsModal = document.querySelector('.tags-detalhes-vertical');

    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('btn-ver-mais')) {
            const btn = e.target;
            
            // 1. Preenche Título e Descrição
            document.querySelector('.vaga-titulo-detalhe').innerText = btn.getAttribute('data-titulo');
            document.querySelector('.vaga-descricao-box-cinza p').innerText = btn.getAttribute('data-descricao');

            // 2. Preencher as Badges dinâmicas na lateral
            if (containerTagsModal) {
                containerTagsModal.innerHTML = ''; // Limpa as tags "ÁREA, ESCALA..." que estão no HTML

                // Pegamos os valores que guardamos no botão
                const dadosParaBadges = [
                    btn.getAttribute('data-area'),
                    btn.getAttribute('data-modalidade'),
                    btn.getAttribute('data-escolaridade'),
                    btn.getAttribute('data-escala'),
                    btn.getAttribute('data-salario'),
                    btn.getAttribute('data-experiencia')
                ];

                // Criamos um <span> para cada dado que não estiver vazio
                dadosParaBadges.forEach(texto => {
                    if (texto && texto !== "undefined" && texto !== "null") {
                        const span = document.createElement('span');
                        span.classList.add('badge');
                        span.innerText = texto;
                        containerTagsModal.appendChild(span);
                    }
                });
            }

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

