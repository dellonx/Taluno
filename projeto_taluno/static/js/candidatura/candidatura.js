document.addEventListener('DOMContentLoaded', () => {
    const filtro = document.getElementById('status-filter');
    const cards = document.querySelectorAll('.card-candidatura');

    filtro.addEventListener('change', () => {
        const valorSelecionado = filtro.value;

        cards.forEach(card => {
            const statusCard = card.getAttribute('data-status');

            // Se for "nenhuma", mostra todos. Caso contrário, filtra pelo status.
            if (valorSelecionado === "nenhuma" || statusCard === valorSelecionado) {
                card.classList.remove('card-hidden');
            } else {
                card.classList.add('card-hidden');
            }
        });
    });
});