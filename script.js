// Carregar o DOM
document.addEventListener("DOMContentLoaded", function () {
  // Elementos
  var loginBtn = document.getElementById("login-btn");
  var registerBtn = document.getElementById("register-btn");
  var filterBtns = document.querySelectorAll(".filter-btn");

  // Evento para o botão de login
  loginBtn.addEventListener("click", function () {
    alert("Login");
  });

  // Evento para o botão de cadastro
  registerBtn.addEventListener("click", function () {
    alert("Registro");
  });

  // Eventos aos botões de filtro
  for (var i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener("click", function () {
      // Remove classe 'active' de todos os botões
      for (var j = 0; j < filterBtns.length; j++) {
        filterBtns[j].classList.remove("active");
      }

      // Adiciona classe 'active' ao botão clicado
      this.classList.add("active");

      // Mensagem no cmd
      console.log("Filtro: " + this.textContent);
    });
  }

  // Mensagem no cmd quando carregar a pagina
  console.log("Reddit Academia - Versão inicial");
});
