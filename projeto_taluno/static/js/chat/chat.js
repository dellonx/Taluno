document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DADOS MOCKADOS
    let dbChats = [
        {
            id: 1,
            name: "Empresa XPTO",
            avatar: "/projeto_taluno/static/img/logo/logo_taluno.png",
            time: "10:30",
            status: "Online",
            unread: true, 
            messages: [{ text: "Olá! Vimos seu perfil.", type: "text", sender: "received" }]
        },
        {
            id: 2,
            name: "Senac Tecnologia",
            avatar: "/projeto_taluno/static/img/logo/logo_taluno.png",
            time: "Ontem",
            status: "Offline",
            unread: false,
            messages: []
        },
        {
            id: 3,
            name: "DevSolutions",
            avatar: "/projeto_taluno/static/img/logo/logo_taluno.png",
            time: "Segunda",
            status: "Online",
            unread: false,
            messages: [
                { text: "Vaga preenchida.", type: "text", sender: "received" },
                { text: "Obrigado!", type: "text", sender: "sent" }
            ]
        }
    ];

    let currentChatId = null;
    let selectedFile = null; 
    let currentFilter = 'all';

    // 2. SELETORES
    const chatList = document.getElementById('chatList');
    const chatHeader = document.getElementById('chatHeader');
    const inputArea = document.getElementById('inputArea');
    const messagesBox = document.getElementById('messagesBox');
    const headerName = document.getElementById('headerName');
    const headerAvatar = document.getElementById('headerAvatar');
    const messageInput = document.getElementById('messageInput');
    const messageForm = document.getElementById('messageForm');
    const closeChatBtn = document.getElementById('closeChatBtn');
    
    // Extras
    const filterBtn = document.getElementById('filterBtn');
    const filterDropdown = document.getElementById('filterDropdown');
    const attachBtn = document.getElementById('attachBtn');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const fileNameDisplay = document.getElementById('fileName');
    const cancelFileBtn = document.getElementById('cancelFile');
    const filterOptions = document.querySelectorAll('.filter-dropdown li');

    // 3. RENDERIZAÇÃO DA SIDEBAR
    function renderSidebar() {
        chatList.innerHTML = '';
        
        // Filtra os chats baseado na seleção
        const filteredChats = dbChats.filter(chat => {
            if (currentFilter === 'online') return chat.status === 'Online';
            if (currentFilter === 'unread') return chat.unread === true;
            return true; // 'all' retorna sempre true
        });

        if (filteredChats.length === 0) {
            chatList.innerHTML = '<li style="padding:20px; text-align:center; opacity:0.7; color:white;">Nenhuma conversa encontrada.</li>';
            return;
        }

        filteredChats.forEach((chat, index) => {
            const li = document.createElement('li');
            li.className = `chat-item ${chat.id === currentChatId ? 'active' : ''}`;
            // Adiciona delay na animação para efeito cascata
            li.style.animationDelay = `${index * 0.05}s`; 
            
            li.onclick = () => openChat(chat.id);

            let lastMsg = "Clique para iniciar...";
            if(chat.messages.length > 0) {
                const last = chat.messages[chat.messages.length - 1];
                lastMsg = last.type === 'file' ? '📎 Arquivo enviado' : last.text;
            }

            const unreadDot = chat.unread ? `<span style="width:10px; height:10px; background:#EA2651; border-radius:50%; margin-left:auto;"></span>` : '';

            li.innerHTML = `
                <div class="avatar-container">
                    <img src="${chat.avatar}" alt="Logo" class="avatar-img">
                </div>
                <div class="chat-details">
                    <div class="chat-title">
                        <h4>${chat.name}</h4>
                        <span class="time">${chat.time}</span>
                    </div>
                    <p>${lastMsg}</p>
                </div>
                ${unreadDot}
            `;
            chatList.appendChild(li);
        });
    }

    // Abertura de Chat
    window.openChat = function(id) {
        currentChatId = id;
        const chat = dbChats.find(c => c.id === id);
        chat.unread = false; // Marca como lida

        chatHeader.classList.remove('hidden');
        inputArea.classList.remove('hidden');
        headerName.innerText = chat.name;
        headerAvatar.src = chat.avatar;
        
        const statusSpan = document.querySelector('.status-indicator');
        statusSpan.innerHTML = chat.status;
        statusSpan.style.color = chat.status === 'Online' ? '#4CAF50' : '#999';

        renderSidebar(); // Re-renderiza para atualizar status de lido/active
        renderMessages(chat.messages);
        
        messageInput.focus();
    };

    function renderMessages(messages) {
        messagesBox.innerHTML = '';
        if (messages.length === 0) {
            messagesBox.innerHTML = `<div class="empty-state"><p>Nenhuma mensagem.</p></div>`;
            return;
        }

        messages.forEach((msg, index) => {
            const div = document.createElement('div');
            div.className = `msg-bubble ${msg.sender}`;
            
            let contentHtml = msg.text;
            if (msg.type === 'file') {
                contentHtml = `
                    <div style="font-weight:600; margin-bottom:5px; font-size:0.8rem">ARQUIVO</div>
                    <div class="msg-file">
                        <i class="fas fa-file-alt"></i>
                        <span>${msg.text}</span>
                    </div>
                `;
            }

            div.innerHTML = `
                ${contentHtml}
                <button class="btn-delete" onclick="deleteMessage(${index})"><i class="fas fa-trash"></i></button>
            `;
            messagesBox.appendChild(div);
        });
        scrollToBottom();
    }

    // 4. LÓGICA DE FILTRO E DROPDOWN
    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Usa classe 'show' para animação CSS
        filterDropdown.classList.toggle('show');
        filterDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        filterDropdown.classList.remove('show');
        setTimeout(() => filterDropdown.classList.add('hidden'), 300); // Espera animação
    });

    filterOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            filterOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            
            currentFilter = opt.getAttribute('data-filter');
            
            if(currentFilter !== 'all') filterBtn.classList.add('filter-active');
            else filterBtn.classList.remove('filter-active');

            renderSidebar();
        });
    });

    // 5. ANEXO E ENVIO
    attachBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            fileNameDisplay.innerText = selectedFile.name;
            filePreview.classList.remove('hidden');
            messageInput.focus();
        }
    });

    cancelFileBtn.addEventListener('click', () => {
        selectedFile = null;
        fileInput.value = '';
        filePreview.classList.add('hidden');
    });

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = messageInput.value.trim();
        if ((!text && !selectedFile) || !currentChatId) return;

        const chat = dbChats.find(c => c.id === currentChatId);

        if (selectedFile) {
            chat.messages.push({ text: selectedFile.name, type: 'file', sender: 'sent' });
            if (text) chat.messages.push({ text: text, type: 'text', sender: 'sent' });
            selectedFile = null;
            fileInput.value = '';
            filePreview.classList.add('hidden');
        } else {
            chat.messages.push({ text: text, type: 'text', sender: 'sent' });
        }
        
        messageInput.value = '';
        renderMessages(chat.messages);
        renderSidebar();

        setTimeout(() => {
            chat.messages.push({ text: "Recebido!", type: 'text', sender: 'received' });
            if (currentChatId === chat.id) renderMessages(chat.messages);
            renderSidebar();
        }, 1500);
    });

    window.deleteMessage = function(index) {
        if (!currentChatId) return;
        const chat = dbChats.find(c => c.id === currentChatId);
        chat.messages.splice(index, 1);
        renderMessages(chat.messages);
        renderSidebar();
    };

    function scrollToBottom() {
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    // CORREÇÃO CRÍTICA: FECHAR CHAT E LIMPAR TELA
    closeChatBtn.addEventListener('click', () => {
        currentChatId = null;
        chatHeader.classList.add('hidden');
        inputArea.classList.add('hidden');
        
        // Restaura o Estado Vazio
        messagesBox.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="far fa-comments"></i>
                </div>
                <h3>Inicie uma conversa</h3>
                <p>Selecione uma empresa ao lado para negociar sua vaga ou tirar dúvidas.</p>
            </div>
        `;
        
        renderSidebar();
    });

    // INICIALIZAÇÃO
    renderSidebar();
});