document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. ACORDEÃO (ABRIR E FECHAR OS FILTROS LATERAIS)
       ============================================================ */
    const titulosFiltro = document.querySelectorAll('.filtro-titulo');

    titulosFiltro.forEach(titulo => {
        titulo.addEventListener('click', () => {
            const opcoes = titulo.nextElementSibling;
            const icone = titulo.querySelector('i');

            if (opcoes.style.display === 'flex') {
                opcoes.style.display = 'none';
                icone.classList.remove('fa-chevron-up');
                icone.classList.add('fa-chevron-down');
            } else {
                opcoes.style.display = 'flex';
                icone.classList.remove('fa-chevron-down');
                icone.classList.add('fa-chevron-up');
            }
        });
    });

    /* ============================================================
       2. SLIDER DUPLO (SALÁRIO) E INTEGRAÇÃO DE FILTROS
       ============================================================ */
    const sliderMin = document.getElementById("sliderMin");
    const sliderMax = document.getElementById("sliderMax");
    const valorMinText = document.getElementById("valorMin");
    const valorMaxText = document.getElementById("valorMax");
    const sliderTrack = document.getElementById("sliderTrack");

    const checkboxes = document.querySelectorAll('.filtro-opcoes input[type="checkbox"]');
    const cardsCandidatos = document.querySelectorAll('.card-candidato');

    const gapMinimo = 500; 
    // Captura o valor máximo definido no HTML (agora é 10000)
    const maxPossivel = parseInt(sliderMax.max);

    function atualizarTrilhaCor() {
        let valMin = parseInt(sliderMin.value);
        let valMax = parseInt(sliderMax.value);
        
        // Calcula a porcentagem correta baseada no min e max reais
        let minRange = parseInt(sliderMin.min);
        let maxRange = parseInt(sliderMax.max);
        
        let percent1 = ((valMin - minRange) / (maxRange - minRange)) * 100;
        let percent2 = ((valMax - minRange) / (maxRange - minRange)) * 100;
        
        sliderTrack.style.background = `linear-gradient(to right, #ccc ${percent1}%, #6a00ff ${percent1}%, #6a00ff ${percent2}%, #ccc ${percent2}%)`;
    }

    function atualizarTextosEFiltrar() {
        let valMin = parseInt(sliderMin.value);
        let valMax = parseInt(sliderMax.value);

        // Impede que as bolinhas se cruzem ou cheguem muito perto
        if (valMax - valMin <= gapMinimo) {
            if (this === sliderMin) {
                sliderMin.value = valMax - gapMinimo;
            } else {
                sliderMax.value = valMin + gapMinimo;
            }
        }

        // Atualiza texto do Mínimo
        valorMinText.textContent = `R$ ${parseInt(sliderMin.value).toLocaleString('pt-BR')}`;
        
        // Atualiza texto do Máximo: se chegar no limite, mostra "+ R$ 10.000"
        if (parseInt(sliderMax.value) === maxPossivel) {
            valorMaxText.textContent = "+ R$ 10.000";
        } else {
            valorMaxText.textContent = `R$ ${parseInt(sliderMax.value).toLocaleString('pt-BR')}`;
        }

        atualizarTrilhaCor();
        aplicarFiltrosGlobais();
    }

    /* ============================================================
       3. FUNÇÃO MESTRE DE FILTRAGEM
       ============================================================ */
    function aplicarFiltrosGlobais() {
        const filtrosSelecionados = Array.from(checkboxes)
            .filter(box => box.checked)
            .map(box => box.value); 

        const minSalario = parseInt(sliderMin.value);
        const maxSalario = parseInt(sliderMax.value);

        cardsCandidatos.forEach(card => {
            const filtrosDoCard = card.getAttribute('data-filtros') ? card.getAttribute('data-filtros').split(' ') : [];
            const salarioDoCard = parseInt(card.getAttribute('data-salario') || "0");

            let atendeCheckbox = true;
            if (filtrosSelecionados.length > 0) {
                atendeCheckbox = filtrosSelecionados.some(filtro => filtrosDoCard.includes(filtro));
            }

            let atendeSalario = true;
            if (salarioDoCard < minSalario || salarioDoCard > maxSalario) {
                if (maxSalario === maxPossivel && salarioDoCard >= minSalario) {
                    atendeSalario = true;
                } else {
                    atendeSalario = false;
                }
            }

            if (atendeCheckbox && atendeSalario) {
                card.style.display = 'grid';
            } else {
                card.style.display = 'none';
            }
        });
    }

    sliderMin.addEventListener("input", atualizarTextosEFiltrar);
    sliderMax.addEventListener("input", atualizarTextosEFiltrar);
    
    checkboxes.forEach(box => {
        box.addEventListener('change', aplicarFiltrosGlobais);
    });

    atualizarTrilhaCor();

    /* ============================================================
       4. LÓGICA SIMPLIFICADA DOS MODAIS (MVP)
       ============================================================ */
    // Fecha o modal se clicar no fundo preto
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

});

// Funções globais chamadas direto no HTML (onclick)
function abrirModal(idModal) {
    document.getElementById(idModal).classList.add('active');
}

function fecharModal(idModal) {
    document.getElementById(idModal).classList.remove('active');
}