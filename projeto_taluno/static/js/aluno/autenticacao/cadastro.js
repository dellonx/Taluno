document.addEventListener('DOMContentLoaded', function() {
    
    // Função reutilizável para configurar o toggle de qualquer campo de senha
    function setupPasswordToggle(inputId, toggleBtnId, eyeOpenId, eyeClosedId) {
        const input = document.getElementById(inputId);
        const btn = document.getElementById(toggleBtnId);
        const eyeOpen = document.getElementById(eyeOpenId);
        const eyeClosed = document.getElementById(eyeClosedId);

        // Só adiciona o evento se todos os elementos existirem na página
        if (input && btn && eyeOpen && eyeClosed) {
            btn.addEventListener('click', function() {
                const isPassword = input.getAttribute('type') === 'password';

                if (isPassword) {
                    // Mostrar Senha
                    input.setAttribute('type', 'text');
                    eyeOpen.classList.add('hide');
                    eyeClosed.classList.remove('hide');
                    btn.setAttribute('aria-label', 'Ocultar senha');
                } else {
                    // Ocultar Senha
                    input.setAttribute('type', 'password');
                    eyeOpen.classList.remove('hide');
                    eyeClosed.classList.add('hide');
                    btn.setAttribute('aria-label', 'Mostrar senha');
                }
            });
        }
    }

    // Configuração para a TELA DE LOGIN (1 senha)
    // Se não encontrar os IDs, a função simplesmente ignora (não dá erro)
    setupPasswordToggle('password', 'togglePassword', 'eyeOpen', 'eyeClosed');

    // Configuração para a TELA DE CADASTRO (2 senhas)
    // Senha Principal
    setupPasswordToggle('senha', 'toggleSenha', 'eyeOpen1', 'eyeClosed1');
    // Confirmar Senha
    setupPasswordToggle('confirmarSenha', 'toggleConfirmar', 'eyeOpen2', 'eyeClosed2');

});