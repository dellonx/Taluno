document.addEventListener('DOMContentLoaded', () => {
    const filtroSelect = document.getElementById('filtroStatus');
    const cards = document.querySelectorAll('.card-candidatura');

    filtroSelect.addEventListener('change', (e) => {
        const filtroSelecionado = e.target.value;

        cards.forEach(card => {
            const statusCard = card.getAttribute('data-status');
            if (filtroSelecionado === 'todos' || statusCard === filtroSelecionado) {
                card.style.display = 'flex'; // Mostra o card
            } else {
                card.style.display = 'none'; // Esconde o card
            }
        });
    });

    const botoesFechar = document.querySelectorAll('.btn-fechar');
    botoesFechar.forEach(botao => {
        botao.addEventListener('click', () => {
            if (confirm('Deseja remover esta candidatura?')) {
                botao.closest('.card-candidatura').remove();
            }
        });
    });
});