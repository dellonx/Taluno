document.addEventListener('DOMContentLoaded', () => {
    // Selecionamos todos os botões "Ver mais" da lista
    const botoesVerMais = document.querySelectorAll('.btn-ver-mais');
    
    // Selecionamos o modal e o botão de voltar
    const modal = document.querySelector('.modal-overlay');
    const btnVoltar = document.querySelector('.btn-voltar-modal');

    // Para cada botão "Ver mais" encontrado, adicionamos o evento de abrir
    botoesVerMais.forEach(botao => {
        botao.addEventListener('click', () => {
            modal.style.display = 'flex'; // Mostra o modal centralizado
            console.log("Abrindo detalhes da vaga...");
        });
    });

    // Evento para fechar o modal ao clicar na seta
    if (btnVoltar) {
        btnVoltar.addEventListener('click', () => {
            modal.style.display = 'none'; // Esconde o modal novamente
            console.log("Fechando modal.");
        });
    }
});