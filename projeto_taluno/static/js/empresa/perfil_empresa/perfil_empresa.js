document.addEventListener('DOMContentLoaded', () => {

    // VARIÁVEIS DE ESTADO
    let cardParaApagar = null;

    /* ============================================================
       1. UPLOAD DE LOGO DA EMPRESA
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
    const modalVaga = document.getElementById('modalVaga');
    const modalBeneficio = document.getElementById('modalBeneficio');
    const modalExcluir = document.getElementById('modalExcluir');
    
    function openModal(modal) { modal.classList.add('active'); }
    function closeModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    // Fechar modais
    document.querySelectorAll('.btn-close-modal, .btn-cancelar-modal').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if(e.target === overlay) closeModals();
        });
    });

    /* ============================================================
       3. SISTEMA DE EDIÇÃO E EXCLUSÃO (DELEGAÇÃO)
       ============================================================ */
    document.body.addEventListener('click', function(e) {
        
        // --- 3.1 CHAMA MODAL DE EXCLUSÃO ---
        const deleteBtn = e.target.closest('.btn-action.delete');
        if (deleteBtn) {
            cardParaApagar = deleteBtn.closest('.info-card, .feature-card');
            openModal(modalExcluir);
            return;
        }

        // --- 3.2 EDIÇÃO INLINE ---
        const editBtn = e.target.closest('.btn-action.edit');
        if (editBtn) {
            const card = editBtn.closest('.info-card, .feature-card');
            const contentDiv = card.querySelector('.card-left');
            const type = contentDiv.getAttribute('data-type'); // "vaga" ou "beneficio"
            const isEditing = card.classList.contains('is-editing');

            if (!isEditing) {
                // Entra no modo edição
                card.classList.add('is-editing');
                editBtn.innerHTML = '<i class="fas fa-check"></i>';
                editBtn.classList.add('save-btn');

                if (type === 'vaga') {
                    const title = contentDiv.querySelector('h4').innerText;
                    const subtitle = contentDiv.querySelector('.card-subtitle').innerText;
                    const status = contentDiv.querySelector('.card-status').innerText;
                    const date = contentDiv.querySelector('.card-date').innerText;

                    contentDiv.innerHTML = `
                        <input type="text" class="edit-input edit-title" value="${title}">
                        <input type="text" class="edit-input edit-subtitle" value="${subtitle}">
                        <input type="text" class="edit-input edit-status" value="${status}" placeholder="Aberta / Fechada">
                        <input type="text" class="edit-input edit-date" value="${date}">
                    `;
                } else if (type === 'beneficio') {
                    const title = contentDiv.querySelector('h4').innerText;
                    const level = contentDiv.querySelector('.feature-level').innerText;

                    contentDiv.innerHTML = `
                        <input type="text" class="edit-input edit-title" value="${title}">
                        <input type="text" class="edit-input edit-level" value="${level}" placeholder="Detalhes">
                    `;
                }
            } else {
                // Salva a edição
                card.classList.remove('is-editing');
                editBtn.innerHTML = '<i class="fas fa-pen"></i>';
                editBtn.classList.remove('save-btn');

                if (type === 'vaga') {
                    const newTitle = contentDiv.querySelector('.edit-title').value;
                    const newSubtitle = contentDiv.querySelector('.edit-subtitle').value;
                    const newStatus = contentDiv.querySelector('.edit-status').value;
                    const newDate = contentDiv.querySelector('.edit-date').value;

                    // Cor do status dinâmico para Vagas
                    let statusClass = 'status-completed'; // Laranja padrão (Pausada/Fechada)
                    if (newStatus.toLowerCase().includes('aberta')) statusClass = 'status-progress'; // Verde

                    contentDiv.innerHTML = `
                        <h4>${newTitle}</h4>
                        <span class="card-subtitle">${newSubtitle}</span>
                        <span class="card-status ${statusClass}">${newStatus}</span>
                        <span class="card-date">${newDate}</span>
                    `;
                } else if (type === 'beneficio') {
                    const newTitle = contentDiv.querySelector('.edit-title').value;
                    const newLevel = contentDiv.querySelector('.edit-level').value;

                    contentDiv.innerHTML = `
                        <h4>${newTitle}</h4>
                        <span class="feature-level">${newLevel}</span>
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
            cardParaApagar.style.transition = 'all 0.3s ease';
            cardParaApagar.style.opacity = '0';
            cardParaApagar.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                cardParaApagar.remove();
                cardParaApagar = null; 
            }, 300);
        }
        closeModals(); 
    });

    /* ============================================================
       5. ADICIONAR NOVOS CARDS (VAGAS E BENEFÍCIOS)
       ============================================================ */
    
    document.getElementById('btnAddVaga').addEventListener('click', () => openModal(modalVaga));
    document.getElementById('btnAddBeneficio').addEventListener('click', () => openModal(modalBeneficio));

    const formAddVaga = document.getElementById('formAddVaga');
    const formAddBeneficio = document.getElementById('formAddBeneficio');
    const listaVagas = document.getElementById('listaVagas');
    const listaBeneficios = document.getElementById('listaBeneficios');

    // Salvar nova Vaga
    formAddVaga.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const titulo = document.getElementById('inputVagaTitulo').value;
        const local = document.getElementById('inputVagaLocal').value;
        const status = document.getElementById('inputVagaStatus').value;
        const data = document.getElementById('inputVagaData').value;

        let statusClass = status === 'Aberta' ? 'status-progress' : 'status-completed';

        const cardHTML = `
            <div class="info-card new-card-anim">
                <div class="card-left" data-type="vaga">
                    <h4>${titulo}</h4>
                    <span class="card-subtitle">${local}</span>
                    <span class="card-status ${statusClass}">${status}</span>
                    <span class="card-date">${data}</span>
                </div>
                <div class="card-actions">
                    <button class="btn-action edit" title="Editar"><i class="fas fa-pen"></i></button>
                    <button class="btn-action delete" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
        
        listaVagas.insertAdjacentHTML('afterbegin', cardHTML); // Adiciona no topo da lista
        formAddVaga.reset();
        closeModals();
    });

    // Salvar novo Benefício
    formAddBeneficio.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('inputBenNome').value;
        const detalhe = document.getElementById('inputBenDetalhe').value;
        const icone = document.getElementById('inputBenIcone').value; 

        const cardHTML = `
            <div class="feature-card new-card-anim">
                <div class="feature-info">
                    <i class="${icone} feature-icon" style="color: var(--primary-color)"></i>
                    <div class="card-left" data-type="beneficio">
                        <h4>${nome}</h4>
                        <span class="feature-level">${detalhe}</span>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-action edit" title="Editar"><i class="fas fa-pen"></i></button>
                    <button class="btn-action delete"><i class="fas fa-times"></i></button>
                </div>
            </div>
        `;

        listaBeneficios.insertAdjacentHTML('beforeend', cardHTML);
        formAddBeneficio.reset();
        closeModals();
    });

    /* ============================================================
       6. LOGOUT
       ============================================================ */
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm('Deseja realmente sair do sistema da empresa?')) window.location.href = '../autenticacao/login.html';
        });
    }
});