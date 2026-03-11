// =========================================================
// JS FINAL - TALUNO (CORRIGIDO E COMPLETO)
// =========================================================

let paginaAtual = 1;

// --- 1. FUNÇÕES DE PAGINAÇÃO ---

function paginaAnterior() {
    if (paginaAtual > 1) {
        paginaAtual--;
        renderizarVagas();
    }
}

function proximaPagina() {
    let lista = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    const totalPaginas = Math.ceil(lista.length / 4);
    if (paginaAtual < totalPaginas) {
        paginaAtual++;
        renderizarVagas();
    }
}

// --- 2. UTILITÁRIOS E MODAIS ---

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

// --- 3. LÓGICA DE RENDERIZAÇÃO DE VAGAS ---

function renderizarVagas() {
    const container = document.querySelector('.container-vaga-empresa');
    if (!container) return;

    const btnAdicionar = document.querySelector('.btn-adicionar-vaga');
    const barraPgn = document.querySelector('.btn-pgn');
    
    container.innerHTML = '';
    if (btnAdicionar) container.appendChild(btnAdicionar);

    let listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    const listaParaExibir = [...listaVagas].reverse();

    const vagasPorPagina = 4;
    const totalPaginas = Math.ceil(listaParaExibir.length / vagasPorPagina);
    
    if (paginaAtual > totalPaginas && totalPaginas > 0) paginaAtual = totalPaginas;

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

    if (barraPgn) {
        container.appendChild(barraPgn);
        const botoes = barraPgn.querySelectorAll('.btn-paginacao');
        if (botoes.length >= 2) {
            botoes[0].style.opacity = (paginaAtual === 1) ? "0.3" : "1";
            botoes[1].style.opacity = (paginaAtual === totalPaginas || totalPaginas === 0) ? "0.3" : "1";
        }
    }
}

function irParaGerenciamento(index) {
    localStorage.setItem('vagaSelecionadaIndex', index);
    window.location.href = "gerenciar-vagas.html";
}

// --- 4. DETALHES E BADGES (CORRIGIDO: SEM PJ E COM FILTRO DE SELEÇÃO) ---

function carregarDetalhesGerenciamento() {
    const index = localStorage.getItem('vagaSelecionadaIndex');
    const listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    
    if (index !== null && listaVagas[index]) {
        const vaga = listaVagas[index];
        const tituloH1 = document.querySelector('.titulo-vaga');
        const descP = document.querySelector('.box-descricao p');
        const dataPub = document.querySelector('.valor-box:last-child'); 
        
        if (tituloH1) tituloH1.innerText = vaga.titulo;
        if (descP) descP.innerText = vaga.descricao || "Sem descrição informada.";
        
        const containerTags = document.querySelector('.tags-vaga');
        if (containerTags) {
            containerTags.innerHTML = ''; 

            const badgesParaCriar = [];
            
            // FILTROS: Só adiciona se o valor existir e não for o texto padrão do select
            if (vaga.area && !vaga.area.includes("Selecione") && vaga.area !== "") badgesParaCriar.push(vaga.area);
            if (vaga.escolaridade && !vaga.escolaridade.includes("Selecione") && vaga.escolaridade !== "") badgesParaCriar.push(vaga.escolaridade);
            if (vaga.escala && !vaga.escala.includes("Selecione") && vaga.escala !== "") badgesParaCriar.push(vaga.escala);
            
            // Salário
            if (vaga.salario && vaga.salario.trim() !== "") {
                badgesParaCriar.push(vaga.salario);
            }
            
            // Experiência
            if (vaga.experiencia) {
                const txtExp = vaga.experiencia.toLowerCase() === "sim" ? "COM EXPERIÊNCIA" : "SEM EXPERIÊNCIA";
                badgesParaCriar.push(txtExp);
            }

            // NOTA IMPORTANTE: vaga.modalidade (onde fica o PJ) foi REMOVIDO daqui.
            // Por isso, o badge PJ nunca será criado.

            badgesParaCriar.forEach(texto => {
                const span = document.createElement('span');
                span.className = 'badge';
                span.innerText = texto.toUpperCase();
                containerTags.appendChild(span);
            });
        }
    }
}

function abrirCandidatos() {
    const index = localStorage.getItem('vagaSelecionadaIndex');
    const listaVagas = JSON.parse(localStorage.getItem('minhasVagas')) || [];
    if (index !== null && listaVagas[index]) {
        const vaga = listaVagas[index];
        const tituloModal = document.getElementById('modal-candidatos-titulo');
        if (tituloModal) tituloModal.innerText = vaga.titulo;
        abrirModal('modal-lista-candidatos');
    }
}

function alterarStatusCandidato(btn, novoStatus) {
    const linha = btn.closest('tr');
    const celulaStatus = linha.querySelector('td:nth-child(2)');
    if (celulaStatus) {
        celulaStatus.innerText = novoStatus === 'reprovar' ? 'Reprovado' : novoStatus;
        celulaStatus.className = novoStatus === 'reprovar' ? 'status-reprovado' : 'status-aprovado';
    }
}

// --- 5. FORMULÁRIOS E INICIALIZAÇÃO ---

window.addEventListener('DOMContentLoaded', () => {
    renderizarVagas();
    carregarDetalhesGerenciamento();
// Cadastro de Nova Vaga (Ajustado para o seu HTML real)
const formCriar = document.querySelector('.formulario-criacao-vaga');
if (formCriar && !formCriar.id.includes('edicao')) {
    formCriar.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const titulo = document.getElementById('titulo-vaga').value.trim();
        const descricao = document.getElementById('descricao-vaga').value.trim();

        if (titulo === "" || descricao === "") {
            alert("Por favor, preencha o título e a descrição.");
            return;
        }

        
                    // 1. Pegamos os valores brutos primeiro
            const valorSalario = document.getElementById('salario-vaga')?.value;
            const valorExperiencia = document.getElementById('experiencia')?.value;

            // 2. CAPTURA CORRIGIDA E MELHORADA:
            const novaVaga = {
                titulo: titulo,
                descricao: descricao,
                area: document.querySelector('select[name="area-vaga"]')?.options[document.querySelector('select[name="area-vaga"]').selectedIndex].text || "Geral",
                modalidade: document.querySelector('select[name="nivel-vaga"]')?.value || "Não informada",
                escolaridade: document.getElementById('escolaridade')?.options[document.getElementById('escolaridade').selectedIndex].text || "Não informada",
                escala: document.getElementById('escala-vaga')?.options[document.getElementById('escala-vaga').selectedIndex].text || "Não informada",
                
                // --- MELHORIA AQUI: Salário com R$ ---
                salario: valorSalario ? `R$ ${valorSalario}` : "A combinar",
                
                // --- MELHORIA AQUI: Tradução de Sim/Não ---
                experiencia: (valorExperiencia === "sim" || valorExperiencia === "Sim") ? "Com experiência" : "Sem experiência",
                
                data: new Date().toLocaleDateString('pt-BR'),
                status: "Ativa"
            };

        let lista = JSON.parse(localStorage.getItem('minhasVagas')) || [];
        lista.push(novaVaga);
        localStorage.setItem('minhasVagas', JSON.stringify(lista));
        
        // Feedback visual antes de recarregar
        alert("Vaga publicada com sucesso!");
        window.location.reload();
    });
}

 // Edição de Vaga Existente (VERSÃO CORRIGIDA)
const formEditar = document.getElementById('formulario-edicao-vaga');
if (formEditar) {
    formEditar.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = localStorage.getItem('vagaSelecionadaIndex');
        let lista = JSON.parse(localStorage.getItem('minhasVagas')) || [];

        if (index !== null && lista[index]) {
            // Captura os textos das opções para as Tags ficarem corretas
            const selArea = document.getElementById('edit-area');
            const selEscolaridade = document.getElementById('edit-escolaridade');
            const selEscala = document.getElementById('edit-escala');
            const selSalario = document.getElementById('edit-salario');

            lista[index].titulo = document.getElementById('edit-titulo').value.trim();
            lista[index].descricao = document.getElementById('edit-descricao').value.trim();
            
            // Aqui garantimos que a TAG salve o texto bonitinho (ex: "Design e UX")
            lista[index].area = selArea.options[selArea.selectedIndex].text;
            lista[index].escolaridade = selEscolaridade.options[selEscolaridade.selectedIndex].text;
            lista[index].escala = selEscala.options[selEscala.selectedIndex].text;
            lista[index].salario = selSalario.options[selSalario.selectedIndex].value; // Salário mantemos o valor
            lista[index].experiencia = document.getElementById('edit-experiencia').value;

            localStorage.setItem('minhasVagas', JSON.stringify(lista));
            
            fecharModal('modal-edicao');
            
            // Recarrega os detalhes e as TAGS na tela imediatamente
            carregarDetalhesGerenciamento(); 
            alert("Informações atualizadas com sucesso!");
        }
    });
}
});

// --- 6. EVENTOS DE CLIQUE (UNIFICADOS E CORRIGIDOS) ---

document.addEventListener('click', (e) => {
    
    // 1. VOLTAR / CANCELAR / FECHAR MODAIS
    if (e.target.closest('.btn-voltar-cinza') || e.target.classList.contains('btn-vaga-cancelar')) {
        fecharModal('modal-edicao');
        fecharModal('modal-lista-candidatos');
        return;
    }

    // 2. VOLTAR PARA A PÁGINA DE LISTAGEM (Botão principal da tela)
    if (e.target.classList.contains('btn-voltar') || e.target.closest('.btn-voltar')) {
        window.location.href = "vagas.html";
        return;
    }

    // 3. ABRIR MODAL DE CANDIDATOS
    if (e.target.classList.contains('btn-candidatos') || e.target.closest('.btn-candidatos')) {
        abrirCandidatos();
        return;
    }

    // 4. ALTERAR STATUS DA VAGA (Ativa, Pausada, Encerrada)
    if (e.target.classList.contains('btn-status')) {
        const index = localStorage.getItem('vagaSelecionadaIndex');
        let lista = JSON.parse(localStorage.getItem('minhasVagas'));
        if (index !== null && lista[index]) {
            const botoes = document.querySelectorAll('.btn-status');
            botoes.forEach(b => b.classList.remove('ativa', 'pausada', 'encerrada'));
            const texto = e.target.innerText.toLowerCase();
            let novoStatus = "Ativa";
            if (texto.includes('ativa')) novoStatus = "Ativa";
            else if (texto.includes('pausar')) novoStatus = "Pausada";
            else if (texto.includes('encerrar')) novoStatus = "Encerrada";
            e.target.classList.add(novoStatus.toLowerCase());
            lista[index].status = novoStatus;
            localStorage.setItem('minhasVagas', JSON.stringify(lista));
        }
    }

    // 5. EDITAR VAGA (Preencher e Abrir Modal)
    if (e.target.classList.contains('btn-editar')) {
        const index = localStorage.getItem('vagaSelecionadaIndex');
        const listaVagas = JSON.parse(localStorage.getItem('minhasVagas'));
        
        if (index !== null && listaVagas[index]) {
            const vaga = listaVagas[index];
            
            document.getElementById('edit-titulo').value = vaga.titulo || "";
            document.getElementById('edit-descricao').value = vaga.descricao || "";
            document.getElementById('edit-salario').value = vaga.salario || "";
            document.getElementById('edit-experiencia').value = vaga.experiencia || "nao";

            const selecionarPorTexto = (idSelect, textoAlvo) => {
                const select = document.getElementById(idSelect);
                if (!select || !textoAlvo) return;
                for (let i = 0; i < select.options.length; i++) {
                    if (select.options[i].text === textoAlvo) {
                        select.selectedIndex = i;
                        break;
                    }
                }
            };

            selecionarPorTexto('edit-area', vaga.area);
            selecionarPorTexto('edit-escolaridade', vaga.escolaridade);
            selecionarPorTexto('edit-escala', vaga.escala);

            abrirModal('modal-edicao');
        }
    }

    // 6. EXCLUIR VAGA
    if (e.target.classList.contains('btn-excluir')) {
        if (confirm("Deseja realmente excluir esta vaga?")) {
            const index = localStorage.getItem('vagaSelecionadaIndex');
            let lista = JSON.parse(localStorage.getItem('minhasVagas'));
            lista.splice(index, 1);
            localStorage.setItem('minhasVagas', JSON.stringify(lista));
            window.location.href = "vagas.html";
        }
    }

    // 7. APROVAR / REPROVAR CANDIDATOS (Tabela)
    if (e.target.classList.contains('aprovar')) {
        const linha = e.target.closest('tr');
        const statusCelula = linha.querySelector('td:nth-child(2)');
        statusCelula.textContent = 'Aprovado';
        statusCelula.style.color = '#2ecc71';
    }

    if (e.target.classList.contains('reprovar')) {
        const linha = e.target.closest('tr');
        const statusCelula = linha.querySelector('td:nth-child(2)');
        statusCelula.textContent = 'Reprovado';
        statusCelula.style.color = '#e91e63';
    }
});


document.addEventListener('click', function(e) {

    if (e.target.classList.contains('aprovar')) {
        const linha = e.target.closest('tr'); // Identifica a linha da Anna ou do Allan
        const statusCelula = linha.querySelector('td:nth-child(2)'); // Segunda coluna de status
        statusCelula.textContent = 'Aprovado';
        statusCelula.style.color = '#2ecc71'; // Cor verde
    }

    if (e.target.classList.contains('reprovar')) {
        const linha = e.target.closest('tr');
        const statusCelula = linha.querySelector('td:nth-child(2)');
        statusCelula.textContent = 'Reprovado';
        statusCelula.style.color = '#e91e63'; // Cor rosa/vermelha
    }
});