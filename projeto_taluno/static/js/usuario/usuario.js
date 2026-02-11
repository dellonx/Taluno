document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. UPLOAD DE FOTO (Lógica do Perfil Vazio)
       ============================================================ */
    const avatarBtn = document.querySelector('.btn-edit-avatar');
    // Pegamos os elementos pelos IDs novos que colocamos no HTML
    const realAvatarImg = document.getElementById('realAvatar');
    const defaultAvatarPlaceholder = document.getElementById('defaultAvatar');

    // Cria um input de arquivo invisível
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Quando clicar na câmera, abre o seletor de arquivos
    avatarBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Quando o usuário escolhe um arquivo
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // 1. Define a foto escolhida como fonte da imagem
                realAvatarImg.src = e.target.result;
                
                // 2. Esconde o placeholder (o ícone de usuário)
                defaultAvatarPlaceholder.classList.add('hidden');
                
                // 3. Remove a classe hidden da imagem real para ela aparecer
                realAvatarImg.classList.remove('hidden');
                
                // Feedback visual rápido (opcional)
                console.log('Foto atualizada');
            }
            
            reader.readAsDataURL(file);
        }
    });

    /* ============================================================
       2. INTERATIVIDADE DA SIDEBAR (BOTÕES ATIVOS)
       ============================================================ */
    const navBtns = document.querySelectorAll('.nav-btn');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' de todos
            navBtns.forEach(b => b.classList.remove('active'));
            // Adiciona a classe 'active' apenas no clicado
            btn.classList.add('active');
        });
    });

    /* ============================================================
       3. BOTÕES DE EXCLUIR (LIXEIRA)
       ============================================================ */
    const deleteBtns = document.querySelectorAll('.btn-action.delete');

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Encontra o card pai (seja info-card ou skill-card)
            const card = this.closest('.info-card, .skill-card');
            
            // Confirmação simples
            if (confirm('Tem certeza que deseja remover este item do seu currículo?')) {
                // Adiciona uma animação de saída antes de remover
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    card.remove();
                }, 300);
            }
        });
    });

    /* ============================================================
       4. BOTÕES DE EDITAR E ADICIONAR (PLACEHOLDER)
       ============================================================ */
    const editBtns = document.querySelectorAll('.btn-action.edit');
    const addBtns = document.querySelectorAll('.btn-add');

    // Função genérica para botões que ainda não têm backend
    function showDevelopmentMessage() {
        alert('Esta funcionalidade abrirá um modal de formulário em breve.');
    }

    editBtns.forEach(btn => btn.addEventListener('click', showDevelopmentMessage));
    addBtns.forEach(btn => btn.addEventListener('click', showDevelopmentMessage));

    /* ============================================================
       5. LOGOUT
       ============================================================ */
    const logoutBtn = document.querySelector('.btn-logout');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm('Deseja realmente sair?')) {
                window.location.href = '../autenticacao/login.html';
            }
        });
    }
});