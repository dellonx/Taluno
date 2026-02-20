document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. UPLOAD DE FOTO (Lógica do Perfil Vazio)
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
       2. DELETAR CARDS E EDITAR CARDS (INLINE)
       ============================================================ */
    document.body.addEventListener('click', function(e) {
        
        // DELETAR
        const deleteBtn = e.target.closest('.btn-action.delete');
        if (deleteBtn) {
            const card = deleteBtn.closest('.info-card, .skill-card');
            if (confirm('tem certeza que deseja apagar?')) {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => card.remove(), 300);
            }
            return; // Impede que execute os próximos blocos
        }

        // EDITAR E SALVAR
        const editBtn = e.target.closest('.btn-action.edit');
        if (editBtn) {
            const card = editBtn.closest('.info-card, .skill-card');
            const contentDiv = card.querySelector('.card-left');
            const type = contentDiv.getAttribute('data-type');
            const isEditing = card.classList.contains('is-editing');

            if (!isEditing) {
                // Entrar no modo edição
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
                // Salvar edição
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
       3. LÓGICA DOS MODAIS (ADICIONAR CARDS)
       ============================================================ */
    // Elementos do Modal
    const modalFormacao = document.getElementById('modalFormacao');
    const modalHabilidade = document.getElementById('modalHabilidade');
    const formAddFormacao = document.getElementById('formAddFormacao');
    const formAddHabilidade = document.getElementById('formAddHabilidade');
    
    // Contêineres onde os cards vão aparecer
    const listaFormacoes = document.getElementById('listaFormacoes');
    const listaHabilidades = document.getElementById('listaHabilidades');

    // Funções de Abrir/Fechar Modal
    function openModal(modal) { modal.classList.add('active'); }
    function closeModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    // Eventos nos botões "Adicionar" da tela principal
    document.getElementById('btnAddFormacao').addEventListener('click', () => openModal(modalFormacao));
    document.getElementById('btnAddHabilidade').addEventListener('click', () => openModal(modalHabilidade));

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

    // --- SALVAR NOVA FORMAÇÃO ---
    formAddFormacao.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita recarregar a página
        
        // Pega valores
        const curso = document.getElementById('inputFormCurso').value;
        const inst = document.getElementById('inputFormInst').value;
        const status = document.getElementById('inputFormStatus').value;
        const data = document.getElementById('inputFormData').value;

        let statusClass = status === 'Concluído' ? 'status-completed' : 'status-progress';

        // Cria o HTML do Card
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
        
        // Injeta no HTML e limpa
        listaFormacoes.insertAdjacentHTML('beforeend', cardHTML);
        formAddFormacao.reset();
        closeModals();
    });

    // --- SALVAR NOVA HABILIDADE ---
    formAddHabilidade.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('inputHabNome').value;
        const nivel = document.getElementById('inputHabNivel').value;
        const icone = document.getElementById('inputHabIcone').value; // ex: 'fas fa-code'

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
       4. LOGOUT
       ============================================================ */
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm('Deseja realmente sair?')) window.location.href = '../autenticacao/login.html';
        });
    }
});

// --- LÓGICA DO BOTÃO "SIM, APAGAR" NO MODAL ---
    document.getElementById('btnConfirmarExclusao').addEventListener('click', () => {
        if (cardParaApagar) {
            // Animação de sumir
            cardParaApagar.style.transition = 'all 0.3s ease';
            cardParaApagar.style.opacity = '0';
            cardParaApagar.style.transform = 'scale(0.9)';
            
            // Remove do HTML após a animação
            setTimeout(() => {
                cardParaApagar.remove();
                cardParaApagar = null; // Limpa a memória
            }, 300);
        }
        
        // Fecha o modal
        modalExcluir.classList.remove('active');
    });