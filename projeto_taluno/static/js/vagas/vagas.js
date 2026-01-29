document.addEventListener('DOMContentLoaded', () => {
    const botoesVerMais = document.querySelectorAll('.btn-ver-mais');
    const modal = document.querySelector('.modal-overlay');
    const btnVoltar = document.querySelector('.btn-voltar-modal');

    const tituloModal = document.querySelector('.vaga-titulo-detalhe');
    const empresaModal = document.querySelector('.empresa-nome-detalhe');
    const enderecoModal = document.querySelector('.vaga-localizacao');
    const tagsContainerModal = document.querySelector('.tags-detalhes');
    const corpoDescricao = document.querySelector('.vaga-descricao-texto');

    botoesVerMais.forEach(botao => {
        botao.addEventListener('click', function() {
            const cardPai = this.closest('.card-das-vagas');

            // Extração dos dados
            const tituloVaga = cardPai.querySelector('.vaga-titulo').innerText;
            const nomeEmpresa = cardPai.querySelector('.vaga-empresa').innerText;
            const enderecoVaga = cardPai.querySelector('.vaga-endereco').innerText;
            const descricaoVaga = this.getAttribute('data-descricao'); 
            const badgesCard = cardPai.querySelectorAll('.badge');

            // Alimentando o Modal
            tituloModal.innerText = tituloVaga;
            empresaModal.innerText = nomeEmpresa;
            enderecoModal.innerText = enderecoVaga;
            
            if (corpoDescricao) {
                corpoDescricao.innerText = descricaoVaga || "Descrição não informada.";
            }

            tagsContainerModal.innerHTML = ''; 
            badgesCard.forEach(badge => {
                const novaBadge = document.createElement('span');
                novaBadge.classList.add('badge');
                novaBadge.innerText = badge.innerText;
                tagsContainerModal.appendChild(novaBadge);
            });

            // --- INÍCIO DA ANIMAÇÃO DE ENTRADA ---
            modal.style.display = 'flex'; // Primeiro ativa o display
            setTimeout(() => {
                modal.classList.add('active'); // Depois de 10ms adiciona a classe que faz o fade-in
            }, 10);
        });
    });

    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            // --- INÍCIO DA ANIMAÇÃO DE SAÍDA ---
            modal.classList.remove('active'); // Começa a sumir (fade-out)
            
            setTimeout(() => {
                modal.style.display = 'none'; // Só desliga o display depois que a animação acaba
            }, 300); // 300ms é o tempo que definimos no CSS
        });
    }
});