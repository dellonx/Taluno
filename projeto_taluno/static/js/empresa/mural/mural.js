document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.acao-like').forEach(label => {
        const input = label.querySelector('.like-toggle');

        label.addEventListener('click', () => {
            input.checked = !input.checked;

            if (input.checked) {
                label.classList.add('ativo', 'animar');

                setTimeout(() => {
                    label.classList.remove('animar');
                }, 400);
            } else {
                label.classList.remove('ativo');
            }
        });
    });
});
