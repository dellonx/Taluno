document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ESTADO DA APLICAÇÃO (Single Source of Truth) ---
    const State = {
        currentChatId: null,
        currentFilter: 'all',
        selectedFile: null,
        chats: [
            {
                id: 1, name: "Enzo da Silva", avatar: "/projeto_taluno/static/img/perfil/perfil_de_enzo.jpg",
                time: "10:30", status: "Online", unread: true,
                messages: [{ text: "Olá! acabei de receber uma proposta da sua empresa.", type: "text", sender: "received" }]
            },
            {
                id: 2, name: "Raimundo Neto", avatar: "/projeto_taluno/static/img/perfil/raimundo_neto_perfil.webp",
                time: "Ontem", status: "Offline", unread: false, messages: []
            },
            {
                id: 3, name: "Maria Joaquina", avatar: "/projeto_taluno/static/img/perfil/maria_perfil.jpg",
                time: "Segunda", status: "Online", unread: false,
                messages: [
                    { text: "olá, gostaria de tirar algumas dúvidas sobre a vaga.", type: "text", sender: "received" },
                    { text: "entraremos em contato o mais rapido possivel!", type: "text", sender: "sent" }
                ]
            }
        ]
    };

    // --- 2. CACHE DE ELEMENTOS DOM (Para performance) ---
    const DOM = {
        chatList: document.getElementById('chatList'),
        chatHeader: document.getElementById('chatHeader'),
        inputArea: document.getElementById('inputArea'),
        messagesBox: document.getElementById('messagesBox'),
        headerName: document.getElementById('headerName'),
        headerAvatar: document.getElementById('headerAvatar'),
        headerStatus: document.getElementById('headerStatus'),
        messageInput: document.getElementById('messageInput'),
        messageForm: document.getElementById('messageForm'),
        closeChatBtn: document.getElementById('closeChatBtn'),
        filterBtn: document.getElementById('filterBtn'),
        filterDropdown: document.getElementById('filterDropdown'),
        filterOptions: document.querySelectorAll('#filterOptions li'),
        attachBtn: document.getElementById('attachBtn'),
        fileInput: document.getElementById('fileInput'),
        filePreview: document.getElementById('filePreview'),
        fileName: document.getElementById('fileName'),
        cancelFileBtn: document.getElementById('cancelFile')
    };

    // --- 3. FUNÇÕES DE RENDERIZAÇÃO (VIEW) ---

    // Renderiza a lista lateral
    function renderSidebar() {
        DOM.chatList.innerHTML = '';
        
        const filtered = State.chats.filter(c => {
            if (State.currentFilter === 'online') return c.status === 'Online';
            if (State.currentFilter === 'unread') return c.unread;
            return true;
        });

        if (filtered.length === 0) {
            DOM.chatList.innerHTML = '<li style="padding:20px; text-align:center; opacity:0.7; color:white;">Nada encontrado.</li>';
            return;
        }

        filtered.forEach((chat, index) => {
            const li = document.createElement('li');
            li.className = `chat-item ${chat.id === State.currentChatId ? 'active' : ''}`;
            li.style.animationDelay = `${index * 0.05}s`;
            li.onclick = () => Actions.openChat(chat.id);

            // Preview da última mensagem
            let lastMsg = "Nova conversa";
            if(chat.messages.length > 0) {
                const last = chat.messages[chat.messages.length - 1];
                lastMsg = last.type === 'file' ? '📎 Arquivo' : last.text;
            }

            const unreadDot = chat.unread ? `<span style="width:10px; height:10px; background:#EA2651; border-radius:50%; margin-left:auto;"></span>` : '';

            li.innerHTML = `
                <div class="avatar-container"><img src="${chat.avatar}" class="avatar-img"></div>
                <div class="chat-details">
                    <div class="chat-title"><h4>${chat.name}</h4><span class="time">${chat.time}</span></div>
                    <p>${lastMsg}</p>
                </div>
                ${unreadDot}
            `;
            DOM.chatList.appendChild(li);
        });
    }

    // Renderiza a área de mensagens central
    function renderMessages(messages) {
        DOM.messagesBox.innerHTML = '';
        
        if (!messages || messages.length === 0) {
            DOM.messagesBox.innerHTML = '<div class="empty-state"><p>Nenhuma mensagem ainda.</p></div>';
            return;
        }

        messages.forEach((msg, index) => {
            const div = document.createElement('div');
            div.className = `msg-bubble ${msg.sender}`;
            
            let content = msg.text;
            if (msg.type === 'file') {
                content = `
                    <div class="msg-file">
                        <i class="fas fa-file-alt"></i> <span>${msg.text}</span>
                    </div>`;
            }

            // O botão de deletar usa data-index para sabermos qual apagar depois
            div.innerHTML = `${content} <button class="btn-delete" data-index="${index}"><i class="fas fa-trash"></i></button>`;
            DOM.messagesBox.appendChild(div);
        });
        
        DOM.messagesBox.scrollTop = DOM.messagesBox.scrollHeight;
    }

    // --- 4. AÇÕES E LÓGICA (CONTROLLER) ---
    const Actions = {
        openChat: (id) => {
            State.currentChatId = id;
            const chat = State.chats.find(c => c.id === id);
            chat.unread = false;

            // Atualiza UI
            DOM.chatHeader.classList.remove('hidden');
            DOM.inputArea.classList.remove('hidden');
            DOM.headerName.innerText = chat.name;
            DOM.headerAvatar.src = chat.avatar;
            DOM.headerStatus.innerText = chat.status;
            DOM.headerStatus.style.color = chat.status === 'Online' ? '#4CAF50' : '#999';

            renderSidebar();
            renderMessages(chat.messages);
            DOM.messageInput.focus();
        },

        closeChat: () => {
            State.currentChatId = null;
            DOM.chatHeader.classList.add('hidden');
            DOM.inputArea.classList.add('hidden');
            DOM.messagesBox.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="far fa-comments"></i></div>
                    <h3>Inicie uma conversa</h3>
                    <p>Selecione uma empresa ao lado.</p>
                </div>`;
            renderSidebar();
        },

        sendMessage: (e) => {
            e.preventDefault();
            const text = DOM.messageInput.value.trim();
            if ((!text && !State.selectedFile) || !State.currentChatId) return;

            const chat = State.chats.find(c => c.id === State.currentChatId);

            if (State.selectedFile) {
                chat.messages.push({ text: State.selectedFile.name, type: 'file', sender: 'sent' });
                Actions.clearFile();
            }
            if (text) {
                chat.messages.push({ text: text, type: 'text', sender: 'sent' });
            }

            DOM.messageInput.value = '';
            renderMessages(chat.messages);
            renderSidebar();

            // Simula resposta
            setTimeout(() => {
                chat.messages.push({ text: "Obrigado pela oportunidade! estarei aguardando.", type: 'text', sender: 'received' });
                if (State.currentChatId === chat.id) renderMessages(chat.messages);
                renderSidebar();
            }, 1000);
        },

        deleteMessage: (index) => {
            const chat = State.chats.find(c => c.id === State.currentChatId);
            if (chat) {
                chat.messages.splice(index, 1);
                renderMessages(chat.messages);
                renderSidebar();
            }
        },

        handleFileSelect: (e) => {
            if (e.target.files.length > 0) {
                State.selectedFile = e.target.files[0];
                DOM.fileName.innerText = State.selectedFile.name;
                DOM.filePreview.classList.remove('hidden');
                DOM.messageInput.focus();
            }
        },

        clearFile: () => {
            State.selectedFile = null;
            DOM.fileInput.value = '';
            DOM.filePreview.classList.add('hidden');
        },

        toggleFilter: (e) => {
            e.stopPropagation();
            DOM.filterDropdown.classList.toggle('show');
            DOM.filterDropdown.classList.toggle('hidden');
        },

        setFilter: (opt) => {
            DOM.filterOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            State.currentFilter = opt.getAttribute('data-filter');
            
            DOM.filterBtn.classList.toggle('active', State.currentFilter !== 'all');
            renderSidebar();
        }
    };

    // --- 5. EVENT LISTENERS (Ligação) ---

    // Navegação e Janela
    DOM.closeChatBtn.addEventListener('click', Actions.closeChat);
    DOM.messageForm.addEventListener('submit', Actions.sendMessage);

    // Delegação de Evento para Deletar (Performance!)
    // Em vez de criar um evento para cada botão, criamos um no container pai
    DOM.messagesBox.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-delete');
        if (btn) {
            Actions.deleteMessage(btn.getAttribute('data-index'));
        }
    });

    // Filtros
    DOM.filterBtn.addEventListener('click', Actions.toggleFilter);
    document.addEventListener('click', () => {
        DOM.filterDropdown.classList.remove('show');
        setTimeout(() => DOM.filterDropdown.classList.add('hidden'), 200);
    });
    DOM.filterOptions.forEach(opt => {
        opt.addEventListener('click', () => Actions.setFilter(opt));
    });

    // Arquivos
    DOM.attachBtn.addEventListener('click', () => DOM.fileInput.click());
    DOM.fileInput.addEventListener('change', Actions.handleFileSelect);
    DOM.cancelFileBtn.addEventListener('click', Actions.clearFile);

    // Inicialização
    renderSidebar();
});