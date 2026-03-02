// =========================================================
// JS FINAL, UNIFICADO E CORRIGIDO - TALUNO
// =========================================================

// --- 1. UTILITÁRIOS E MODAIS ---
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

// --- 2. LOGICA DE VAGAS (LISTAGEM E REDIRECIONAMENTO) ---
function renderizarVagas() {
    const container = document.querySelector('.container-vaga-empresa');
    if (!container) return;

    const btnAdicionar = document.querySelector('.btn-adicionar-vaga');
    const btnPgn = document.querySelector('.btn-pgn');
    container.innerHTML = '';
    if (btnAdicionar) container.appendChild(btnAdicionar);

    let listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    const listaParaExibir = [...listaVagas].reverse();

    const vagasPorPagina = 4;
    const inicio = (typeof paginaAtual !== 'undefined' ? (paginaAtual - 1) : 0) * vagasPorPagina;
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
                        <span class="metrica-item">Status: <span class="metrica-valor ${classeCor}">${vaga.status || 'Ativa'}</span></span>
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

function irParaGerenciamento(index) {
    localStorage.setItem('vagaSelecionadaIndex', index);
    window.location.href = "gerenciar-vagas.html";
}

// --- 3. GERENCIAMENTO (CONTEÚDO DA PÁGINA) ---
function carregarDetalhesGerenciamento() {
    const index = localStorage.getItem('vagaSelecionadaIndex');
    const listaVagas = JSON.parse(localStorage.getItem('minhasVagas'));
    
    if (index !== null && listaVagas && listaVagas[index]) {
        const vaga = listaVagas[index];

        const tituloH1 = document.querySelector('.titulo-vaga');
        const descP = document.querySelector('.box-descricao p');
        const dataPub = document.querySelector('.indicador-item:last-child .valor-box'); 
        
        if (tituloH1) tituloH1.innerText = vaga.titulo;
        if (descP) descP.innerText = vaga.descricao || "Sem descrição informada.";
        if (dataPub) dataPub.innerText = vaga.data || "N/A";
        
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

// --- 4. CANDIDATOS E STATUS ---
function abrirCandidatos() {
    const index = localStorage.getItem('vagaSelecionadaIndex');
    const listaVagas = JSON.parse(localStorage.getItem('minhasVagas'));
    
    if (index !== null && listaVagas && listaVagas[index]) {
        const vaga = listaVagas[index];
        // Seleciona o h2 correto dentro do modal
        const tituloModal = document.getElementById('modal-candidatos-titulo');
        if (tituloModal) tituloModal.innerText = vaga.titulo;
        abrirModal('modal-lista-candidatos');
    }
}

function alterarStatusCandidato(btn, novoStatus) {
    const linha = btn.closest('tr');
    const celulaStatus = linha.querySelector('td:nth-child(2)');
    const containerBotoes = btn.parentElement;

    celulaStatus.classList.remove('status-aprovado', 'status-analise', 'status-reprovado');
    celulaStatus.innerText = novoStatus === 'reprovar' ? 'Reprovado' : novoStatus;
    
    const classeCss = novoStatus === 'reprovar' ? 'status-reprovado' : 'status-aprovado';
    celulaStatus.classList.add(classeCss);
    containerBotoes.classList.remove('borda-roxo');
}

// --- 5. INICIALIZAÇÃO E EVENTOS ---

window.addEventListener('DOMContentLoaded', () => {
    renderizarVagas();
    carregarDetalhesGerenciamento();

    // Formulário de Criação (vagas.html)
    const formCriar = document.querySelector('.formulario-criacao-vaga');
    if (formCriar && !formCriar.id.includes('edicao')) {
        formCriar.addEventListener('submit', (e) => {
            e.preventDefault();
            const novaVaga = {
                titulo: document.getElementById('titulo-vaga').value,
                modalidade: document.querySelector('select[name="nivel-vaga"]')?.value || "",
                escala: document.getElementById('escala-vaga')?.value || "",
                salario: document.getElementById('salario-vaga')?.value || "",
                descricao: document.getElementById('descricao-vaga')?.value || "",
                data: new Date().toLocaleDateString('pt-BR'),
                status: "Ativa"
            };
            let lista = JSON.parse(localStorage.getItem('minhasVagas')) || [];
            lista.push(novaVaga);
            localStorage.setItem('minhasVagas', JSON.stringify(lista));
            window.location.reload();
        });
    }

    // Formulário de Edição (gerenciar-vagas.html)
    const formEditar = document.getElementById('formulario-edicao-vaga');
    if (formEditar) {
        formEditar.addEventListener('submit', (e) => {
            e.preventDefault();
            const index = localStorage.getItem('vagaSelecionadaIndex');
            let lista = JSON.parse(localStorage.getItem('minhasVagas'));

            lista[index].titulo = document.getElementById('edit-titulo').value;
            lista[index].modalidade = document.getElementById('edit-modalidade').value;
            lista[index].escala = document.getElementById('edit-escala').value;
            lista[index].descricao = document.getElementById('edit-descricao').value;
            lista[index].salario = document.getElementById('edit-salario').value;

            localStorage.setItem('minhasVagas', JSON.stringify(lista));
            fecharModal('modal-edicao');
            carregarDetalhesGerenciamento();
        });
    }
});

// DELEGAÇÃO DE CLIQUE ÚNICA (Resolve o erro de múltiplos listeners)
document.addEventListener('click', (e) => {
    // 1. Botão Editar Vaga
    if (e.target.classList.contains('btn-editar')) {
        const index = localStorage.getItem('vagaSelecionadaIndex');
        const listaVagas = JSON.parse(localStorage.getItem('minhasVagas'));
        if (index !== null && listaVagas[index]) {
            const vaga = listaVagas[index];
            document.getElementById('edit-titulo').value = vaga.titulo || "";
            document.getElementById('edit-modalidade').value = vaga.modalidade || "";
            document.getElementById('edit-escala').value = vaga.escala || "";
            document.getElementById('edit-descricao').value = vaga.descricao || "";
            document.getElementById('edit-salario').value = vaga.salario || "";
            abrirModal('modal-edicao');
        }
    }

    // 2. Botão Cancelar Modal Edição
    if (e.target.classList.contains('btn-vaga-cancelar')) {
        fecharModal('modal-edicao');
    }

    // 3. Botão Voltar (Página)
    if (e.target.classList.contains('btn-voltar')) {
        window.location.href = "vagas.html";
    }

    // 4. Botão Excluir
    if (e.target.classList.contains('btn-excluir')) {
        if (confirm("Deseja realmente excluir esta vaga?")) {
            const index = localStorage.getItem('vagaSelecionadaIndex');
            let lista = JSON.parse(localStorage.getItem('minhasVagas'));
            lista.splice(index, 1);
            localStorage.setItem('minhasVagas', JSON.stringify(lista));
            window.location.href = "vagas.html";
        }
    }

    // 5. Botões de Status (Ativa, Pausar, Encerrar)
    if (e.target.classList.contains('btn-status')) {
        const botoes = document.querySelectorAll('.btn-status');
        botoes.forEach(b => b.classList.remove('ativa', 'pausada', 'encerrada'));
        
        const texto = e.target.innerText.toLowerCase();
        if (texto.includes('ativa')) e.target.classList.add('ativa');
        if (texto.includes('pausar')) e.target.classList.add('pausada');
        if (texto.includes('encerrar')) e.target.classList.add('encerrada');
    }

    // 6. Botão Candidatos (Badge)
    if (e.target.closest('.btn-candidatos') || e.target.classList.contains('btn-candidatos')) {
        abrirCandidatos();
    }

    // 7. Botão Voltar do Modal Candidatos
    if (e.target.classList.contains('btn-voltar-cinza')) {
        fecharModal('modal-lista-candidatos');
    }

    // 8. Aprovar/Reprovar na tabela
    if (e.target.classList.contains('aprovar')) {
        alterarStatusCandidato(e.target, 'Aprovado');
    }
    if (e.target.classList.contains('reprovar')) {
        alterarStatusCandidato(e.target, 'reprovar');
    }

    // 9. Botão Avançar Fase
    if (e.target.classList.contains('btn-avancar-fase')) {
        alert("Candidatos aprovados avançaram para a próxima fase!");
        fecharModal('modal-lista-candidatos');
    }
});