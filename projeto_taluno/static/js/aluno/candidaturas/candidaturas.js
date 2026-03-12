document.addEventListener('DOMContentLoaded', () => {
    const filtroSelect = document.getElementById('filtroStatus');
    const listaCandidaturas = document.getElementById('listaCandidaturas');

    // Filtro de Status funcional
    filtroSelect.addEventListener('change', () => {
        const filtroSelecionado = filtroSelect.value;
        const cards = document.querySelectorAll('.card-candidatura');

        cards.forEach(card => {
            const statusCard = card.getAttribute('data-status');
            if (filtroSelecionado === 'todos' || statusCard === filtroSelecionado) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Exclusão com confirmação
    document.addEventListener('click', (e) => {
        const btnExcluir = e.target.closest('.btn-excluir');
        if (btnExcluir) {
            if (confirm("Deseja remover esta candidatura?")) {
                const card = btnExcluir.closest('.card-candidatura');
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.remove(), 300);
            }
        }
    });
});