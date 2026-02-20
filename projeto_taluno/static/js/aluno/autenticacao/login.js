document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    
    // Pegamos as duas imagens pelos IDs definidos no HTML
    const eyeOpen = document.getElementById('eyeOpen');
    const eyeClosed = document.getElementById('eyeClosed');

    if (toggleBtn && passwordInput && eyeOpen && eyeClosed) {
        toggleBtn.addEventListener('click', function() {
            // Verifica se está atualmente como senha (oculto)
            const isPassword = passwordInput.getAttribute('type') === 'password';

            if (isPassword) {
                // AÇÃO: MOSTRAR SENHA
                passwordInput.setAttribute('type', 'text');
                
                // Esconde o olho aberto, mostra o fechado
                eyeOpen.classList.add('hide');
                eyeClosed.classList.remove('hide');
                
                // Acessibilidade
                toggleBtn.setAttribute('aria-label', 'Ocultar senha');
            } else {
                // AÇÃO: OCULTAR SENHA
                passwordInput.setAttribute('type', 'password');
                
                // Mostra o olho aberto, esconde o fechado
                eyeOpen.classList.remove('hide');
                eyeClosed.classList.add('hide');
                
                // Acessibilidade
                toggleBtn.setAttribute('aria-label', 'Mostrar senha');
            }
        });
    } else {
        console.warn('Elementos do toggle de senha não encontrados no DOM.');
    }
});