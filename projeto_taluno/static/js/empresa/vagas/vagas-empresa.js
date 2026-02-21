// Função para abrir o modal
function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.add('ativo'); // Garante que a classe 'ativo' seja adicionada
        document.body.style.overflow = 'hidden'; // Trava a rolagem da página
    } else {
        console.error("Modal não encontrado! Verifique se o ID está correto.");
    }
}

// Função para fechar o modal
function fecharModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.classList.remove('ativo'); // Remove a classe 'ativo'
        document.body.style.overflow = 'auto'; // Libera a rolagem da página
    }
}

// Função para expandir o campo de texto automaticamente
function autoExpand(field) {
    field.style.height = 'inherit'; // Reseta a altura para recalcular
    const height = field.scrollHeight; // Pega a altura total do conteúdo
    field.style.height = height + 'px'; // Aplica a nova altura
}