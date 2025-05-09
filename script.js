// Sistema de gestão de utilizadores
document.addEventListener("DOMContentLoaded", function () {
  // Dados de utilizadores
  const users = [
    // Conta temporária pré-configurada
    {
      name: "Utilizador Teste",
      email: "teste@exemplo.com",
      password: "123456",
      area: "Ciências Exatas"
    }
  ];

  // Variáveis para controlo de sessão
  let loggedInUser = null;

  // Cache de elementos DOM frequentemente utilizados
  const elements = {
    // Botões de autenticação
    loginBtn: document.getElementById("login-btn"),
    registerBtn: document.getElementById("register-btn"),
    
    // Modais
    loginModal: document.getElementById("login-modal"),
    
    // Formulários
    loginForm: document.getElementById("login-form"),
    
    // Filtros de conteúdo
    filterBtns: document.querySelectorAll(".filter-btn"),
    
    // Área de autenticação no cabeçalho
    authButtons: document.querySelector(".auth-buttons")
  };

  // ===== FUNÇÕES DE UTILIDADE =====
  
  // Mostrar modal
  function showModal(modal) {
    modal.classList.remove("hidden");
  }
  
  // Esconder modal
  function hideModal(modal) {
    modal.classList.add("hidden");
  }

  // Verificar se o email já está registado
  function isEmailRegistered(email) {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Autenticar utilizador
  function authenticateUser(email, password) {
    return users.find(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.password === password
    );
  }

  // Gerar interface de utilizador autenticado
  function updateUIForLoggedIn(user) {
    // Atualizar área de autenticação no cabeçalho
    elements.authButtons.innerHTML = `
      <div class="user-info">
        <span>Olá, ${user.name}</span>
        <button id="logout-btn" class="btn-outline">Sair</button>
      </div>
    `;
    
    // Adicionar evento ao botão de terminar sessão
    document.getElementById("logout-btn").addEventListener("click", logout);
    
    // Adicionar botão para criar publicações
    const feed = document.querySelector(".feed");
    if (!document.querySelector(".create-post")) {
      const createPostElem = document.createElement("div");
      createPostElem.className = "post create-post";
      createPostElem.innerHTML = `
        <h3>Criar Nova Publicação</h3>
        <form id="post-form">
          <div class="form-group">
            <label for="post-title">Título</label>
            <input type="text" id="post-title" required>
          </div>
          <div class="form-group">
            <label for="post-content">Conteúdo</label>
            <textarea id="post-content" rows="4" required></textarea>
          </div>
          <button type="submit" class="btn-primary">Publicar</button>
        </form>
      `;
      feed.insertBefore(createPostElem, feed.firstChild.nextSibling);
      
      // Adicionar evento ao formulário de publicação
      document.getElementById("post-form").addEventListener("submit", createPost);
    }
  }

  // Gerar interface de utilizador não autenticado
  function updateUIForLoggedOut() {
    elements.authButtons.innerHTML = `
      <button id="login-btn" class="btn-outline">Entrar</button>
      <button id="register-btn" class="btn-primary">Registar</button>
    `;
    
    // Recriar eventos para os novos botões
    document.getElementById("login-btn").addEventListener("click", showLoginModal);
    document.getElementById("register-btn").addEventListener("click", showRegisterModal);
    
    // Remover área de criação de publicação, se existir
    const createPostElem = document.querySelector(".create-post");
    if (createPostElem) {
      createPostElem.remove();
    }
  }

  // ===== MANIPULADORES DE EVENTOS =====
  
  // Mostrar modal de autenticação
  function showLoginModal() {
    showModal(elements.loginModal);
  }
  
  // Mostrar modal de registo (criamos o HTML e o modal dinamicamente)
  function showRegisterModal() {
    // Criar modal de registo se não existir
    if (!document.getElementById("register-modal")) {
      const registerModal = document.createElement("div");
      registerModal.id = "register-modal";
      registerModal.className = "modal hidden";
      registerModal.innerHTML = `
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Registar</h2>
          <form id="register-form">
            <div class="form-group">
              <label for="register-name">Nome</label>
              <input type="text" id="register-name" required>
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" required>
            </div>
            <div class="form-group">
              <label for="register-password">Senha</label>
              <input type="password" id="register-password" required>
            </div>
            <div class="form-group">
              <label for="register-area">Área de Interesse</label>
              <select id="register-area" required>
                <option value="Ciências Exatas">Ciências Exatas</option>
                <option value="Ciências Biológicas">Ciências Biológicas</option>
                <option value="Ciências Humanas">Ciências Humanas</option>
                <option value="Engenharias">Engenharias</option>
                <option value="Ciências da Saúde">Ciências da Saúde</option>
              </select>
            </div>
            <button type="submit" class="btn-primary">Registar</button>
          </form>
        </div>
      `;
      document.body.appendChild(registerModal);
      
      // Adicionar evento ao botão de fechar
      registerModal.querySelector(".close").addEventListener("click", function() {
        hideModal(registerModal);
      });
      
      // Adicionar evento ao formulário de registo
      document.getElementById("register-form").addEventListener("submit", registerUser);
    }
    
    showModal(document.getElementById("register-modal"));
  }
  
  // Processar autenticação do utilizador
  function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    
    const user = authenticateUser(email, password);
    
    if (user) {
      loggedInUser = user;
      updateUIForLoggedIn(user);
      hideModal(elements.loginModal);
      
      // Limpar formulário
      document.getElementById("login-form").reset();
      
      // Feedback de sucesso
      alert("Autenticação realizada com sucesso!");
    } else {
      alert("Email ou senha incorretos.");
    }
  }
  
  // Registar novo utilizador
  function registerUser(e) {
    e.preventDefault();
    
    const name = document.getElementById("register-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const area = document.getElementById("register-area").value;
    
    if (isEmailRegistered(email)) {
      alert("Este email já está registado.");
      return;
    }
    
    // Adicionar novo utilizador
    const newUser = { name, email, password, area };
    users.push(newUser);
    
    // Fazer autenticação com o novo utilizador
    loggedInUser = newUser;
    updateUIForLoggedIn(newUser);
    
    // Esconder modal de registo
    hideModal(document.getElementById("register-modal"));
    
    // Limpar formulário
    document.getElementById("register-form").reset();
    
    // Feedback de sucesso
    alert("Registo realizado com sucesso!");
  }
  
  // Terminar sessão de utilizador
  function logout() {
    loggedInUser = null;
    updateUIForLoggedOut();
    alert("Sessão terminada com sucesso!");
  }
  
  // Criar nova publicação
  function createPost(e) {
    e.preventDefault();
    
    if (!loggedInUser) {
      alert("Precisas de estar autenticado para criar uma publicação.");
      return;
    }
    
    const title = document.getElementById("post-title").value;
    const content = document.getElementById("post-content").value;
    
    // Criar elemento de publicação
    const postElement = document.createElement("div");
    postElement.className = "post";
    
    // Obter data atual formatada
    const now = new Date();
    const timeAgo = "agora mesmo";
    
    postElement.innerHTML = `
      <div class="post-header">
        <div class="post-author">${loggedInUser.name}</div>
        <div class="post-meta">${loggedInUser.area} • ${timeAgo}</div>
      </div>
      <h3>${title}</h3>
      <p>${content}</p>
      <div class="post-actions">
        <button class="action-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 4.5L4 15H20L12 4.5Z" fill="currentColor"/>
          </svg>
          Votar (0)
        </button>
        <button class="action-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" stroke-width="2"/>
          </svg>
          Comentar (0)
        </button>
        <button class="action-btn">Guardar</button>
      </div>
    `;
    
    // Adicionar publicação ao feed
    const feed = document.querySelector(".feed");
    const firstPost = document.querySelector(".post:not(.create-post)");
    if (firstPost) {
      feed.insertBefore(postElement, firstPost);
    } else {
      feed.appendChild(postElement);
    }
    
    // Limpar formulário
    document.getElementById("post-form").reset();
    
    // Feedback de sucesso
    alert("Publicação criada com sucesso!");
  }

  // ===== INICIALIZAÇÃO =====
  
  // Adicionar eventos aos modais
  document.querySelectorAll(".modal .close").forEach(closeBtn => {
    closeBtn.addEventListener("click", function() {
      hideModal(this.closest(".modal"));
    });
  });
  
  // Eventos para os botões de autenticação
  elements.loginBtn.addEventListener("click", showLoginModal);
  elements.registerBtn.addEventListener("click", showRegisterModal);
  
  // Evento para o formulário de autenticação
  elements.loginForm.addEventListener("submit", handleLogin);
  
  // Eventos para os botões de filtro
  elements.filterBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      // Remover classe 'active' de todos os botões
      elements.filterBtns.forEach(b => b.classList.remove("active"));
      
      // Adicionar classe 'active' ao botão clicado
      this.classList.add("active");
      
      // Fazer algo com o filtro (por exemplo, carregar publicações diferentes)
      console.log("Filtro aplicado:", this.textContent);
    });
  });
  
  // Fechar modais ao clicar fora do conteúdo
  window.addEventListener("click", function(e) {
    document.querySelectorAll(".modal").forEach(modal => {
      if (e.target === modal) {
        hideModal(modal);
      }
    });
  });

  // Adicionar CSS para os novos elementos e estilos
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    /* Estilos para modal */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal.hidden {
      display: none;
    }
    
    .modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      width: 80%;
      max-width: 500px;
      position: relative;
    }
    
    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 20px;
      cursor: pointer;
    }
    
    /* Estilos para formulários */
    .form-group {
      margin-bottom: 15px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    
    /* Estilos para área do utilizador */
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    /* Estilos para os botões */
    .btn-primary {
      background-color: #4b6584;
      color: white;
      padding: 8px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .btn-outline {
      background-color: transparent;
      color: #f5f6fa;
      padding: 8px 15px;
      border: 1px solid #4b6584;
      background-color: #4b6584;
      border-radius: 4px;
      cursor: pointer;
    }
    
    /* Estilos para a criação de publicações */
    .create-post {
      margin-bottom: 20px;
    }
    
    .create-post form {
      margin-top: 15px;
    }
  `;
  document.head.appendChild(styleElement);

  console.log("Social Academic - Sistema inicializado");
});