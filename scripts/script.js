// Lista de utilizadores
let users = [
  {
    name: "Utilizador Teste",
    email: "teste@exemplo.com",
    password: "123456",
    area: "Ciências Exatas"
  }
];

let currentUser = null;
let postVotes = {}; // Para guardar os votos: {postId: {userEmail: true/false, totalVotes: number}}

document.addEventListener("DOMContentLoaded", function() {
  
  // Inicializar posts existentes
  initializeExistingPosts();
  
  // Botões e elementos
  let loginBtn = document.getElementById("login-btn");
  let registerBtn = document.getElementById("register-btn");
  let logoutBtn = document.getElementById("logout-btn");
  let authButtons = document.querySelector(".auth-buttons");
  let userInfo = document.getElementById("user-info");
  let userName = document.getElementById("user-name");
  let createPost = document.getElementById("create-post");
  
  // Modais
  let loginModal = document.getElementById("login-modal");
  let registerModal = document.getElementById("register-modal");
  
  // Formulários
  let loginForm = document.getElementById("login-form");
  let registerForm = document.getElementById("register-form");
  let postForm = document.getElementById("post-form");
  
  // Eventos dos botões
  loginBtn.onclick = function() {
    showModal(loginModal);
  };
  
  registerBtn.onclick = function() {
    showModal(registerModal);
  };
  
  logoutBtn.onclick = function() {
    currentUser = null;
    showLoggedOut();
    alert("Logout feito!");
  };
  
  // Eventos dos formulários
  loginForm.onsubmit = function(e) {
    e.preventDefault();
    
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;
    
    // Procurar utilizador
    let user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      currentUser = user;
      showLoggedIn();
      hideModal(loginModal);
      loginForm.reset();
      alert("Login feito com sucesso!");
    } else {
      alert("Email ou password errados!");
    }
  };
  
  registerForm.onsubmit = function(e) {
    e.preventDefault();
    
    let name = document.getElementById("register-name").value;
    let email = document.getElementById("register-email").value;
    let password = document.getElementById("register-password").value;
    let area = document.getElementById("register-area").value;
    
    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
      alert("Email já existe!");
      return;
    }
    
    // Adicionar novo utilizador
    let newUser = { name, email, password, area };
    users.push(newUser);
    currentUser = newUser;
    
    showLoggedIn();
    hideModal(registerModal);
    registerForm.reset();
    alert("Registo feito com sucesso!");
  };
  
  postForm.onsubmit = function(e) {
    e.preventDefault();
    
    let title = document.getElementById("post-title").value;
    let content = document.getElementById("post-content").value;
    
    createNewPost(title, content);
    postForm.reset();
    alert("Post criado!");
  };
  
  // Fechar modais
  document.querySelectorAll(".close").forEach(btn => {
    btn.onclick = function() {
      let modal = this.closest(".modal");
      hideModal(modal);
    };
  });
  
  // Filtros
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.onclick = function() {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");
    };
  });
  
  // Funções para mostrar/esconder elementos
  function showModal(modal) {
    modal.classList.remove("hide");
  }
  
  function hideModal(modal) {
    modal.classList.add("hide");
  }
  
  function showLoggedIn() {
    // Esconder botões de auth
    authButtons.classList.add("hide");
    
    // Mostrar info do utilizador
    userInfo.classList.remove("hide");
    userName.textContent = "Olá, " + currentUser.name;
    
    // Mostrar área de criar post
    createPost.classList.remove("hide");
  }
  
  function showLoggedOut() {
    // Mostrar botões de auth
    authButtons.classList.remove("hide");
    
    // Esconder info do utilizador
    userInfo.classList.add("hide");
    
    // Esconder área de criar post
    createPost.classList.add("hide");
  }
  
  function initializeExistingPosts() {
    // Dar ID aos posts existentes e adicionar funcionalidade de voto
    let existingPosts = document.querySelectorAll(".post:not(.create-post)");
    existingPosts.forEach((post, index) => {
      let postId = "existing-" + index;
      post.setAttribute("data-post-id", postId);
      postVotes[postId] = { totalVotes: 0 };
      
      // Encontrar botão de voto
      let voteBtn = post.querySelector(".action-btn");
      if (voteBtn && voteBtn.textContent.includes("Votar")) {
        voteBtn.className = "action-btn vote-btn";
        voteBtn.onclick = function() {
          handleVote(postId, this);
        };
      }
    });
  }
  
  function createNewPost(title, content) {
    // Criar ID único para o post
    let postId = Date.now().toString();
    
    // Criar novo elemento post
    let postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.setAttribute("data-post-id", postId);
    
    // Inicializar votos para este post
    postVotes[postId] = { totalVotes: 0 };
    
    // Criar header do post
    let postHeader = document.createElement("div");
    postHeader.className = "post-header";
    
    let postAuthor = document.createElement("div");
    postAuthor.className = "post-author";
    postAuthor.textContent = currentUser.name;
    
    let postMeta = document.createElement("div");
    postMeta.className = "post-meta";
    postMeta.textContent = currentUser.area + " • agora";
    
    postHeader.appendChild(postAuthor);
    postHeader.appendChild(postMeta);
    
    // Criar título
    let postTitle = document.createElement("h3");
    postTitle.textContent = title;
    
    // Criar conteúdo
    let postContent = document.createElement("p");
    postContent.textContent = content;
    
    // Criar ações do post
    let postActions = document.createElement("div");
    postActions.className = "post-actions";
    
    let voteBtn = document.createElement("button");
    voteBtn.className = "action-btn vote-btn";
    voteBtn.textContent = "Votar (0)";
    voteBtn.onclick = function() {
      handleVote(postId, this);
    };
    
    let commentBtn = document.createElement("button");
    commentBtn.className = "action-btn";
    commentBtn.textContent = "Comentar (0)";
    
    let saveBtn = document.createElement("button");
    saveBtn.className = "action-btn";
    saveBtn.textContent = "Guardar";
    
    postActions.appendChild(voteBtn);
    postActions.appendChild(commentBtn);
    postActions.appendChild(saveBtn);
    
    // Montar o post
    postDiv.appendChild(postHeader);
    postDiv.appendChild(postTitle);
    postDiv.appendChild(postContent);
    postDiv.appendChild(postActions);
    
    // Adicionar ao feed
    let feed = document.querySelector(".feed");
    let firstPost = document.querySelector(".post:not(.create-post)");
    if (firstPost) {
      feed.insertBefore(postDiv, firstPost);
    } else {
      feed.appendChild(postDiv);
    }
  }
  
  function handleVote(postId, button) {
    // Verificar se está logado
    if (!currentUser) {
      alert("Precisas fazer login para votar!");
      console.log(postVotes);
      return;
    }
    
    let userEmail = currentUser.email;
    
    // Verificar se o utilizador já votou neste post
    if (postVotes[postId][userEmail]) {
      // Remover voto
      postVotes[postId][userEmail] = false;
      postVotes[postId].totalVotes--;
      button.classList.remove("voted");
    } else {
      // Adicionar voto
      postVotes[postId][userEmail] = true;
      postVotes[postId].totalVotes++;
      button.classList.add("voted");
    }
    
    // Atualizar texto do botão
    button.textContent = "Votar (" + postVotes[postId].totalVotes + ")";
  }
});