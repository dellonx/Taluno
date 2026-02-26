// --- CONTROLE DE INTERFACE (MODAIS) ---
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

// --- LÓGICA DE DADOS E PAGINAÇÃO ---
let paginaAtual = 1;
const vagasPorPagina = 4;

// 1. RENDERIZAR LISTA DE VAGAS (Página Principal)
function renderizarVagas() {
    const container = document.querySelector('.container-vaga-empresa');
    if (!container) return;

    const btnAdicionar = document.querySelector('.btn-adicionar-vaga');
    const btnPgn = document.querySelector('.btn-pgn');
    container.innerHTML = '';
    if (btnAdicionar) container.appendChild(btnAdicionar);

    let listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    const listaParaExibir = [...listaVagas].reverse();

    const inicio = (paginaAtual - 1) * vagasPorPagina;
    const fim = inicio + vagasPorPagina;
    const vagasPaginadas = listaParaExibir.slice(inicio, fim);

    vagasPaginadas.forEach((vaga, index) => {
        const indexReal = listaVagas.length - 1 - (inicio + index);
        let classeCor = 'status-ativa';
        if(vaga.status === "Pausada") classeCor = 'status-pausada';
        if(vaga.status === "Encerrada") classeCor = 'status-encerrada';

        const cardHTML = `
            <article class="card-vaga-empresa">
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
                    <button class="btn-gerenciar" onclick="irParaGerenciamento(${indexReal})">Gerenciar Vaga</button>
                </div>
            </article>`;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
    if (btnPgn) container.appendChild(btnPgn);
}

// 2. IR PARA TELA DE GERENCIAMENTO
function irParaGerenciamento(index) {
    localStorage.setItem('vagaSelecionadaIndex', index);
    window.location.href = "gerenciar-vagas.html"; 
}

// 3. CARREGAR DETALHES (Página Gerenciar)
function carregarDetalhesGerenciamento() {
    const index = localStorage.getItem('vagaSelecionadaIndex');
    const listaVagas = JSON.parse(localStorage.getItem('minhasVagas'));
    
    if (index !== null && listaVagas && listaVagas[index]) {
        const vaga = listaVagas[index];

        const tituloH1 = document.querySelector('.titulo-vaga');
        const descP = document.querySelector('.box-descricao p');
        const dataPub = document.querySelector('.indicador-item:nth-child(2) .valor-box');
        
        if (tituloH1) tituloH1.innerText = vaga.titulo;
        if (descP) descP.innerText = vaga.descricao || "Sem descrição.";
        if (dataPub) dataPub.innerText = vaga.data;

        const containersTags = document.querySelectorAll('.tags-vaga');
        if (containersTags.length > 0) {
            containersTags[0].innerHTML = ''; 
            const infos = [vaga.modalidade, vaga.escala, vaga.salario ? `R$ ${vaga.salario}` : ''];
            
            infos.forEach(info => {
                if (info && info !== "") {
                    const span = document.createElement('span');
                    span.className = 'badge';
                    span.innerText = info.toUpperCase();
                    containersTags[0].appendChild(span);
                }
            });
            if(containersTags[1]) containersTags[1].style.display = 'none';
        }
    }
}

// 4. SALVAR NOVA VAGA (Formulário)
const formVaga = document.querySelector('.formulario-criacao-vaga');
if (formVaga) {
    formVaga.addEventListener('submit', function(e) {
        e.preventDefault();
        const novaVaga = {
            titulo: document.getElementById('titulo-vaga').value,
            modalidade: document.querySelector('select[name="nivel-vaga"]').value,
            escala: document.getElementById('escala-vaga').value,
            salario: document.getElementById('salario-vaga').value,
            descricao: document.getElementById('descricao-vaga').value,
            data: new Date().toLocaleDateString('pt-BR'),
            status: "Ativa"
        };

        let listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
        listaVagas.push(novaVaga);
        localStorage.setItem('minhasVagas', JSON.stringify(listaVagas));

        fecharModal('modal-cadastro');
        renderizarVagas();
        this.reset();
    });
}

// 5. EVENTOS DE CLIQUE (Status, Excluir, Voltar)
document.addEventListener('click', function(e) {
    
    // --- Lógica de Status (Cores individuais) ---
    if (e.target.classList.contains('btn-status')) {
        const botoes = document.querySelectorAll('.btn-status');
        botoes.forEach(b => b.classList.remove('ativa', 'pausada', 'encerrada'));

        const texto = e.target.innerText.toLowerCase();
        if (texto === 'ativa') {
            e.target.classList.add('ativa');
        } else if (texto === 'pausar') {
            e.target.classList.add('pausada');
        } else if (texto === 'encerrar') {
            e.target.classList.add('encerrada');
        }
    }

    // --- Botão Excluir ---
    if (e.target.classList.contains('btn-excluir')) {
        if (confirm("Tem certeza que deseja excluir esta vaga?")) {
            const index = localStorage.getItem('vagaSelecionadaIndex');
            let listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
            
            if (index !== null) {
                listaVagas.splice(index, 1);
                localStorage.setItem('minhasVagas', JSON.stringify(listaVagas));
                // Redireciona para a lista (ajustado para subir uma pasta se necessário)
                window.location.href = "vagas.html"; 
            }
        }
    }

    // --- Botão Voltar ---
    if (e.target.classList.contains('btn-voltar')) {
        window.history.back();
    }
});

// INICIALIZAÇÃO
window.onload = function() {
    renderizarVagas();
    carregarDetalhesGerenciamento();
};

function proximaPagina() {
    let listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    if (paginaAtual * vagasPorPagina < listaVagas.length) {
        paginaAtual++;
        renderizarVagas();
    }
}

function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        renderizarVagas();
    }
}