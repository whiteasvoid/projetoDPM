// Link da Firebase
var URL_FIREBASE = "https://socialacademic-2d6ee-default-rtdb.europe-west1.firebasedatabase.app/";

// Guardar os dados de login do utilizador
// Inicialmente, o utilizador é null (não está logado)
var utilizador = null;

// Função que começa a aplicação
function comecar() {
    console.log("Social Academic está a iniciar.");
    try {
        // Carrega posts, artigos, eventos e notificações
        carregarPosts("populares");
        carregarArtigosAlta();
        carregarEventos();
        carregarNotificacoes();
        configurarBotoes();

        // Verificar se já existe um utilizador guardado na sessão
        console.log("A verificar utilizador na sessão.");
        var dadosUtilizador = sessionStorage.getItem("utilizador");
        if (dadosUtilizador) {
            utilizador = JSON.parse(dadosUtilizador);
            atualizarInterface();
            console.log("Utilizador encontrado: " + utilizador.nome);
        }
    } catch (erro) {
        console.error("Erro: ", erro);
    }
}

// Função para ligar todos os eventos dos botões
function configurarBotoes() {
    try {
        // Pega os elementos da página
        var botaoEntrar = document.getElementById("login-btn");
        var botaoRegistar = document.getElementById("register-btn");
        var botaoSair = document.getElementById("logout-btn");
        var janelaLogin = document.getElementById("login-modal");
        var janelaRegisto = document.getElementById("register-modal");
        var formLogin = document.getElementById("login-form");
        var formRegisto = document.getElementById("register-form");
        var botaoCriar = document.getElementById("create-post-btn");
        var formPost = document.getElementById("post-form-container");
        var formulario = document.getElementById("post-form");
        var botaoCancelar = document.getElementById("cancel-post-btn");
        var linkNotificacoes = document.getElementById("notifications-link");
        var areaNotificacoes = document.getElementById("notifications-list");
        var botoesFiltro = document.querySelectorAll(".filter-btn");
        var linksAreas = document.querySelectorAll(".sidebar-menu a[data-area]");
        var botoesFechar = document.querySelectorAll(".close");

        // Botão de entrar
        if (botaoEntrar) {
            botaoEntrar.addEventListener("click", function() {
                if (janelaLogin) janelaLogin.style.display = "block";
                console.log("Clicou no botão Entrar");
            });
        }

        // Botão de registar
        if (botaoRegistar) {
            botaoRegistar.addEventListener("click", function() {
                if (janelaRegisto) janelaRegisto.style.display = "block";
                console.log("Clicou no botão Registar");
            });
        }

        // Botão de sair
        if (botaoSair) {
            botaoSair.addEventListener("click", function() {
                utilizador = null;
                sessionStorage.removeItem("utilizador");
                atualizarInterface();
                var filtro = document.querySelector(".filter-btn.active")?.dataset.filter || "populares";
                carregarPosts(filtro);
                console.log("Clicou no botão Sair");
            });
        }

        // Fechar janelas de login e registo
        botoesFechar.forEach(botao => {
            botao.addEventListener("click", function() {
                if (janelaLogin) janelaLogin.style.display = "none";
                if (janelaRegisto) janelaRegisto.style.display = "none";
                console.log("Clicou para fechar uma janela");
            });
        });

        // Fechar janelas ao clicar fora
        window.addEventListener("click", function(evento) {
            if (evento.target == janelaLogin) {
                janelaLogin.style.display = "none";
                console.log("Fechou login clicando fora");
            }
            if (evento.target == janelaRegisto) {
                janelaRegisto.style.display = "none";
                console.log("Fechou registo clicando fora");
            }
        });

        // Formulário de login
        if (formLogin) {
            formLogin.addEventListener("submit", fazerLogin);
            console.log("Formulário de login configurado");
        }

        // Formulário de registo
        if (formRegisto) {
            formRegisto.addEventListener("submit", fazerRegisto);
            console.log("Formulário de registo configurado");
        }

        // Botão de criar post
        if (botaoCriar) {
            botaoCriar.addEventListener("click", function() {
                if (formPost) formPost.classList.remove("hidden");
                console.log("Clicou no botão Criar Publicação");
            });
        }

        // Botão de cancelar post
        if (botaoCancelar) {
            botaoCancelar.addEventListener("click", function() {
                if (formPost) formPost.classList.add("hidden");
                if (formulario) formulario.reset();
                console.log("Clicou no botão Cancelar post");
            });
        }

        // Formulário de novo post
        if (formulario) {
            formulario.addEventListener("submit", criarNovoPost);
            console.log("Formulário de novo post configurado");
        }

        // Link de notificações
        if (linkNotificacoes) {
            linkNotificacoes.addEventListener("click", function(evento) {
                evento.preventDefault();
                if (areaNotificacoes) {
                    areaNotificacoes.style.display = areaNotificacoes.style.display == "none" ? "block" : "none";
                    console.log(areaNotificacoes.style.display == "block" ? "Mostrou notificações" : "Escondeu notificações");
                }
            });
        }

        // Botões de filtro
        botoesFiltro.forEach(botao => {
            botao.addEventListener("click", function() {
                botoesFiltro.forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                var filtro = this.dataset.filter;
                carregarPosts(filtro);
                console.log("Clicou no filtro: " + filtro);
            });
        });

        // Links de áreas
        linksAreas.forEach(link => {
            link.addEventListener("click", function(evento) {
                evento.preventDefault();
                var area = this.dataset.area;
                if (area == "populares") {
                    carregarPosts("populares");
                } else if (area == "my-posts") {
                    if (!utilizador) {
                        alert("Faz login para ver os teus posts!");
                        console.log("Tentou ver meus posts sem login");
                        return;
                    }
                    carregarMeusPosts();
                } else if (area != "all" && area != "explorar" && area != "saved") {
                    carregarPostsPorArea(area);
                }
                console.log("Clicou na área: " + area);
            });
        });
    } catch (erro) {
        console.error("Erro ao configurar botões: ", erro);
    }
}

// Ao carregar a página, chama a função comecar
document.addEventListener("DOMContentLoaded", comecar);