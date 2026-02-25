// --- CONTROLE DO MODAL E TEXTAREA ---
function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.add('ativo');
        document.body.style.overflow = 'hidden';
    }
}

function fecharModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.remove('ativo');
        document.body.style.overflow = 'auto';
    }
}

function autoExpand(field) {
    field.style.height = 'inherit';
    field.style.height = field.scrollHeight + 'px';
}

// --- LÓGICA DE PAGINAÇÃO E DADOS ---
let paginaAtual = 1;
const vagasPorPagina = 4;

// Inicializa com dados fake se o localStorage estiver vazio (para o cliente ver algo)
if (!localStorage.getItem('minhasVagas')) {
    const dadosIniciais = [
        { titulo: "Vaga Desenvolvedor Junior", data: "20/01/2026", status: "Ativa" },
        { titulo: "Vaga para Porteiro", data: "02/02/2026", status: "Pausada" },
        { titulo: "Vaga Web Designer", data: "15/01/2026", status: "Encerrada" }
    ];
    localStorage.setItem('minhasVagas', JSON.stringify(dadosIniciais));
}

// --- RENDERIZAÇÃO DOS CARDS ---
function renderizarVagas() {
    const container = document.querySelector('.container-vaga-empresa');
    
    // Capturamos os elementos que NÃO podem sumir (Botão de adicionar e a Div de paginação)
    const btnAdicionar = document.querySelector('.btn-adicionar-vaga');
    const btnPgn = document.querySelector('.btn-pgn');

    // Limpamos TUDO dentro do container para organizar do zero
    container.innerHTML = '';
    
    // Colocamos o botão de adicionar de volta no topo
    if (btnAdicionar) container.appendChild(btnAdicionar);

    let listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    
    // Invertemos para a mais nova aparecer primeiro
    const listaParaExibir = [...listaVagas].reverse();

    // Calculamos o corte da paginação
    const inicio = (paginaAtual - 1) * vagasPorPagina;
    const fim = inicio + vagasPorPagina;
    const vagasPaginadas = listaParaExibir.slice(inicio, fim);

    vagasPaginadas.forEach(vaga => {
        // Define a classe de cor baseada no status
        let classeCor = 'status-ativa';
        if(vaga.status === "Pausada") classeCor = 'status-pausada';
        if(vaga.status === "Encerrada") classeCor = 'status-encerrada';

        const cardHTML = `
            <article class="card-vaga-empresa card-dinamico">
                <div class="vaga-info-gestao">
                    <h3 class="vaga-titulo">${vaga.titulo}</h3>
                    <p class="vaga-empresa-ref">Simtec Soluções Tecnológicas</p>
                    <div class="vaga-detalhes-metricas">
                        <span class="metrica-item">Status: <span class="metrica-valor ${classeCor}">${vaga.status}</span></span>
                        <span class="metrica-item">Candidatos: <span class="metrica-valor">0 inscritos</span></span>
                        <span class="metrica-item">Publicada em: <span class="metrica-valor">${vaga.data}</span></span>
                    </div>
                </div>
                <div class="vaga-acao">
                    <button class="btn-gerenciar">Gerenciar Vaga</button>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Colocamos os botões de página de volta no final de tudo
    if (btnPgn) container.appendChild(btnPgn);
}

// --- EVENTO DE PUBLICAR ---
document.querySelector('.formulario-criacao-vaga').addEventListener('submit', function(e) {
    e.preventDefault();

    const tituloInput = document.getElementById('titulo-vaga');
    
    const novaVaga = {
        titulo: tituloInput.value,
        data: new Date().toLocaleDateString('pt-BR'),
        status: "Ativa"
    };

    let listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    listaVagas.push(novaVaga);
    localStorage.setItem('minhasVagas', JSON.stringify(listaVagas));

    paginaAtual = 1; // Volta para a primeira página para ver a nova vaga
    renderizarVagas();
    fecharModal('modal-cadastro');
    this.reset();
});

// --- CONTROLES DE PÁGINA ---
function proximaPagina() {
    let listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    if (paginaAtual * vagasPorPagina < listaVagas.length) {
        paginaAtual++;
        renderizarVagas();
        window.scrollTo(0,0);
    }
}

function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        renderizarVagas();
        window.scrollTo(0,0);
    }
}

// Inicialização
window.onload = renderizarVagas;