document.addEventListener('DOMContentLoaded', () => {
    const botoesVerMais = document.querySelectorAll('.btn-ver-mais');
    const modal = document.querySelector('.modal-overlay');
    const btnVoltar = document.querySelector('.btn-voltar-modal');

    // Elementos de DESTINO dentro do seu Modal
    const tituloModal = document.querySelector('.vaga-titulo-detalhe');
    const empresaModal = document.querySelector('.empresa-nome-detalhe');
    const enderecoModal = document.querySelector('.vaga-localizacao');
    const tagsContainerModal = document.querySelector('.tags-detalhes');
    const corpoDescricao = document.querySelector('.vaga-descricao-texto');

    botoesVerMais.forEach(botao => {
        botao.addEventListener('click', function() {
            // 1. Localiza o card pai
            const cardPai = this.closest('.card-das-vagas');

            // 2. Extrai os dados (Texto do Card + Data Attribute do Botão)
            const tituloVaga = cardPai.querySelector('.vaga-titulo').innerText;
            const nomeEmpresa = cardPai.querySelector('.vaga-empresa').innerText;
            const enderecoVaga = cardPai.querySelector('.vaga-endereco').innerText;
            const descricaoVaga = this.getAttribute('data-descricao'); // Captura o data-descricao
            
            // Pega as badges do card
            const badgesCard = cardPai.querySelectorAll('.badge');

            // 3. Alimenta o Modal
            tituloModal.innerText = tituloVaga;
            empresaModal.innerText = nomeEmpresa;
            enderecoModal.innerText = enderecoVaga;
            
            // Injeta a descrição (Se houver descrição no botão)
            if (corpoDescricao) {
                corpoDescricao.innerText = descricaoVaga || "Descrição não informada.";
            }

            // Atualiza as Tags
            tagsContainerModal.innerHTML = ''; 
            badgesCard.forEach(badge => {
                const novaBadge = document.createElement('span');
                novaBadge.classList.add('badge');
                novaBadge.innerText = badge.innerText;
                tagsContainerModal.appendChild(novaBadge);
            });

            // 4. Abre o modal
            modal.style.display = 'flex';
        });
    });

    // Fechar o modal
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
});