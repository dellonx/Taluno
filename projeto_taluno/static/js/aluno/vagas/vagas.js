document.addEventListener('DOMContentLoaded', () => {
    const botoesVerMais = document.querySelectorAll('.btn-ver-mais');
    const modal = document.querySelector('.modal-overlay');
    const btnVoltar = document.querySelector('.btn-voltar-modal');

    // ATUALIZADO: Seletores novos baseados no seu HTML atual
    const tituloModal = document.querySelector('.vaga-titulo-detalhe');
    const empresaModal = document.querySelector('.empresa-nome-detalhe');
    const enderecoModal = document.querySelector('.vaga-localizacao');
    const tagsContainerModal = document.querySelector('.tags-detalhes-vertical'); // Mudou aqui
    const corpoDescricao = document.querySelector('.vaga-descricao-box-cinza p'); // Mudou aqui (pegando o p dentro da box)

    botoesVerMais.forEach(botao => {
        botao.addEventListener('click', function() {
            // Certifique-se que o card das vagas tem essa classe exata
            const cardPai = this.closest('.card-das-vagas'); 

            if (!cardPai) return; // Segurança caso o clique falhe

            // Extração (Verifique se esses nomes batem com o seu card da lista de vagas)
            const tituloVaga = cardPai.querySelector('.vaga-titulo').innerText;
            const nomeEmpresa = cardPai.querySelector('.vaga-empresa').innerText;
            const enderecoVaga = cardPai.querySelector('.vaga-endereco').innerText;
            const descricaoVaga = this.getAttribute('data-descricao'); 
            const badgesCard = cardPai.querySelectorAll('.badge');

            // Alimentando o Modal
            tituloModal.innerText = tituloVaga;
            empresaModal.innerText = nomeEmpresa;
            enderecoModal.innerText = enderecoVaga;
            corpoDescricao.innerText = descricaoVaga || "Descrição não informada.";

            // Limpa e recria os badges na vertical
            tagsContainerModal.innerHTML = ''; 
            badgesCard.forEach(badge => {
                const novaBadge = document.createElement('span');
                novaBadge.classList.add('badge'); // Usa o seu CSS de desenho
                novaBadge.innerText = badge.innerText;
                tagsContainerModal.appendChild(novaBadge);
            });

            // Mostra o modal
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        });
    });

    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        });
    }
});