document.addEventListener('DOMContentLoaded', () => {

    // VARIÁVEIS DE ESTADO
    let cardParaApagar = null;

    /* ============================================================
       1. UPLOAD DE FOTO DE PERFIL
       ============================================================ */
    const avatarBtn = document.querySelector('.btn-edit-avatar');
    const realAvatarImg = document.getElementById('realAvatar');
    const defaultAvatarPlaceholder = document.getElementById('defaultAvatar');

    const fileInput = document.createElement('input');
    fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    avatarBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                realAvatarImg.src = e.target.result;
                defaultAvatarPlaceholder.classList.add('hidden');
                realAvatarImg.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    });

    /* ============================================================
       2. MODAIS - ELEMENTOS E FUNÇÕES DE ABRIR/FECHAR
       ============================================================ */
    const modalFormacao = document.getElementById('modalFormacao');
    const modalHabilidade = document.getElementById('modalHabilidade');
    const modalExcluir = document.getElementById('modalExcluir');
    
    function openModal(modal) { modal.classList.add('active'); }
    function closeModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    // Fechar nos botões X ou Cancelar
    document.querySelectorAll('.btn-close-modal, .btn-cancelar-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    // Fechar clicando fora da caixa (no fundo escuro)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay) closeModals();
        });
    });

    /* ============================================================
       3. SISTEMA DE EDIÇÃO E EXCLUSÃO NOS CARDS (DELEGAÇÃO)
       ============================================================ */
    document.body.addEventListener('click', function(e) {
        
        // --- 3.1 CHAMA MODAL DE EXCLUSÃO ---
        const deleteBtn = e.target.closest('.btn-action.delete');
        if (deleteBtn) {
            // Guarda na memória QUAL card foi clicado
            cardParaApagar = deleteBtn.closest('.info-card, .skill-card');
            openModal(modalExcluir);
            return; // Impede a execução das próximas linhas
        }

        // --- 3.2 EDIÇÃO INLINE (LÁPIS E VISTO) ---
        const editBtn = e.target.closest('.btn-action.edit');
        if (editBtn) {
            const card = editBtn.closest('.info-card, .skill-card');
            const contentDiv = card.querySelector('.card-left');
            const type = contentDiv.getAttribute('data-type');
            const isEditing = card.classList.contains('is-editing');

            if (!isEditing) {
                // Entra no modo edição
                card.classList.add('is-editing');
                editBtn.innerHTML = '<i class="fas fa-check"></i>';
                editBtn.classList.add('save-btn');

                if (type === 'formacao') {
                    const title = contentDiv.querySelector('h4').innerText;
                    const subtitle = contentDiv.querySelector('.card-subtitle').innerText;
                    const status = contentDiv.querySelector('.card-status').innerText;
                    const date = contentDiv.querySelector('.card-date').innerText;

                    contentDiv.innerHTML = `
                        <input type="text" class="edit-input edit-title" value="${title}">
                        <input type="text" class="edit-input edit-subtitle" value="${subtitle}">
                        <input type="text" class="edit-input edit-status" value="${status}" placeholder="Status">
                        <input type="text" class="edit-input edit-date" value="${date}">
                    `;
                } else if (type === 'habilidade') {
                    const title = contentDiv.querySelector('h4').innerText;
                    const level = contentDiv.querySelector('.skill-level').innerText;

                    contentDiv.innerHTML = `
                        <input type="text" class="edit-input edit-title" value="${title}">
                        <input type="text" class="edit-input edit-level" value="${level}" placeholder="Nível">
                    `;
                }
            } else {
                // Salva a edição
                card.classList.remove('is-editing');
                editBtn.innerHTML = '<i class="fas fa-pen"></i>';
                editBtn.classList.remove('save-btn');

                if (type === 'formacao') {
                    const newTitle = contentDiv.querySelector('.edit-title').value;
                    const newSubtitle = contentDiv.querySelector('.edit-subtitle').value;
                    const newStatus = contentDiv.querySelector('.edit-status').value;
                    const newDate = contentDiv.querySelector('.edit-date').value;

                    let statusClass = 'status-progress';
                    if (newStatus.toLowerCase().includes('conclu')) statusClass = 'status-completed';

                    contentDiv.innerHTML = `
                        <h4>${newTitle}</h4>
                        <span class="card-subtitle">${newSubtitle}</span>
                        <span class="card-status ${statusClass}">${newStatus}</span>
                        <span class="card-date">${newDate}</span>
                    `;
                } else if (type === 'habilidade') {
                    const newTitle = contentDiv.querySelector('.edit-title').value;
                    const newLevel = contentDiv.querySelector('.edit-level').value;

                    contentDiv.innerHTML = `
                        <h4>${newTitle}</h4>
                        <span class="skill-level">${newLevel}</span>
                    `;
                }
            }
        }
    });

    /* ============================================================
       4. CONFIRMAR EXCLUSÃO NO MODAL VERMELHO
       ============================================================ */
    document.getElementById('btnConfirmarExclusao').addEventListener('click', () => {
        if (cardParaApagar) {
            // Animação de sumir
            cardParaApagar.style.transition = 'all 0.3s ease';
            cardParaApagar.style.opacity = '0';
            cardParaApagar.style.transform = 'scale(0.9)';
            
            // Remove do HTML após a animação
            setTimeout(() => {
                cardParaApagar.remove();
                cardParaApagar = null; // Limpa a memória para o próximo
            }, 300);
        }
        closeModals(); // Fecha o modal vermelho
    });

    /* ============================================================
       5. ADICIONAR NOVOS CARDS VIA FORMULÁRIO (MODAIS)
       ============================================================ */
    
    // Abre modais de adição ao clicar nos botões "+"
    document.getElementById('btnAddFormacao').addEventListener('click', () => openModal(modalFormacao));
    document.getElementById('btnAddHabilidade').addEventListener('click', () => openModal(modalHabilidade));

    // Elementos de destino e formulários
    const formAddFormacao = document.getElementById('formAddFormacao');
    const formAddHabilidade = document.getElementById('formAddHabilidade');
    const listaFormacoes = document.getElementById('listaFormacoes');
    const listaHabilidades = document.getElementById('listaHabilidades');

    // Salvar nova Formação
    formAddFormacao.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const curso = document.getElementById('inputFormCurso').value;
        const inst = document.getElementById('inputFormInst').value;
        const status = document.getElementById('inputFormStatus').value;
        const data = document.getElementById('inputFormData').value;

        let statusClass = status === 'Concluído' ? 'status-completed' : 'status-progress';

        const cardHTML = `
            <div class="info-card new-card-anim">
                <div class="card-left" data-type="formacao">
                    <h4>${curso}</h4>
                    <span class="card-subtitle">${inst}</span>
                    <span class="card-status ${statusClass}">${status}</span>
                    <span class="card-date">${data}</span>
                </div>
                <div class="card-actions">
                    <button class="btn-action edit" title="Editar"><i class="fas fa-pen"></i></button>
                    <button class="btn-action delete" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        listaFormacoes.insertAdjacentHTML('beforeend', cardHTML);
        formAddFormacao.reset();
        closeModals();
    });

    // Salvar nova Habilidade
    formAddHabilidade.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('inputHabNome').value;
        const nivel = document.getElementById('inputHabNivel').value;
        const icone = document.getElementById('inputHabIcone').value; 

        const cardHTML = `
            <div class="skill-card new-card-anim">
                <div class="skill-info">
                    <i class="${icone} skill-icon" style="color: var(--primary-color)"></i>
                    <div class="card-left" data-type="habilidade">
                        <h4>${nome}</h4>
                        <span class="skill-level">${nivel}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-action edit" title="Editar"><i class="fas fa-pen"></i></button>
                    <button class="btn-action delete"><i class="fas fa-times"></i></button>
                </div>
            </div>
        `;

        listaHabilidades.insertAdjacentHTML('beforeend', cardHTML);
        formAddHabilidade.reset();
        closeModals();
    });

    /* ============================================================
       6. LOGOUT
       ============================================================ */
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm('Deseja realmente sair?')) window.location.href = '../autenticacao/login.html';
        });
    }
});