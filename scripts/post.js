// Endereço da base de dados Firebase
var URL_FIREBASE = "https://socialacademic-2d6ee-default-rtdb.europe-west1.firebasedatabase.app/";

// Variável para guardar o utilizador logado
var utilizador = null;

function comecar() {
    try {
        console.log("A carregar página do post...");
        var dadosUtilizador = sessionStorage.getItem("utilizador");
        if (dadosUtilizador) {
            utilizador = JSON.parse(dadosUtilizador);
            console.log("Utilizador encontrado: " + utilizador.nome);
        }

        var urlParams = new URLSearchParams(window.location.search);
        var postId = urlParams.get("id");
        if (!postId) {
            mostrarErro("Nenhum post selecionado!");
            console.log("Sem ID do post na URL");
            return;
        }

        carregarPost(postId);
    } catch (erro) {
        console.error("Erro ao iniciar página do post: ", erro);
    }
}

// Função para carregar o post
function carregarPost(postId) {
    try {
        var container = document.getElementById("post-container");
        container.innerHTML = "";
        fetch(URL_FIREBASE + "posts.json")
            .then(resposta => resposta.json())
            .then(dados => {
                var post = null;
                for (var chave in dados) {
                    if (dados[chave].id == postId) {
                        post = dados[chave];
                        break;
                    }
                }
                if (!post) {
                    mostrarErro("Post não encontrado!");
                    console.log("Post com ID " + postId + " não existe");
                    return;
                }
                console.log("Post encontrado: " + post.title);
                mostrarPost(post);
            })
            .catch(erro => console.error("Erro ao carregar post: ", erro));
    } catch (erro) {
        console.error("Erro no carregarPost: ", erro);
    }
}

// Função para mostrar o post
function mostrarPost(post) {
    try {
        var container = document.getElementById("post-container");
        var modelo = document.getElementById("post-template");
        var postElemento = document.importNode(modelo.content, true).firstElementChild;
        postElemento.dataset.postId = post.id;

        fetch(URL_FIREBASE + "users.json")
            .then(resposta => resposta.json())
            .then(usuarios => {
                var nomeAutor = "Desconhecido";
                for (var chave in usuarios) {
                    if (usuarios[chave].id == post.authorId) {
                        nomeAutor = usuarios[chave].name;
                        if (usuarios[chave].verified) {
                            postElemento.querySelector(".verified-badge").classList.remove("hidden");
                        }
                        break;
                    }
                }
                postElemento.querySelector(".author-name").textContent = nomeAutor;

                postElemento.querySelector(".post-title").textContent = post.title;
                postElemento.querySelector(".post-text").textContent = post.content;
                postElemento.querySelector(".post-area").textContent = post.area;
                var data = new Date(post.timestamp);
                var dataTexto = data.toLocaleDateString("pt-PT") + " às " + data.toLocaleTimeString("pt-PT", {hour: "2-digit", minute: "2-digit"});
                postElemento.querySelector(".post-time").textContent = dataTexto;
                postElemento.querySelector(".vote-count").textContent = post.votes || 0;
                postElemento.querySelector(".comment-count").textContent = post.comments || 0;

                var tagsArea = postElemento.querySelector(".post-tags");
                (post.tags || []).forEach(tag => {
                    var tagElement = document.createElement("span");
                    tagElement.className = "tag";
                    tagElement.textContent = tag;
                    tagsArea.appendChild(tagElement);
                });

                if (post.citation) {
                    var citacaoArea = postElemento.querySelector(".citation");
                    citacaoArea.classList.remove("hidden");
                    citacaoArea.querySelector(".citation-text").textContent = post.citation;
                    if (post.citationLink) {
                        var link = citacaoArea.querySelector(".citation-link");
                        link.classList.remove("hidden");
                        link.href = post.citationLink;
                    }
                }

                var botaoVoto = postElemento.querySelector(".vote-btn");
                if (utilizador) {
                    fetch(URL_FIREBASE + "userVotes.json")
                        .then(resposta => resposta.json())
                        .then(votos => {
                            var jaVotou = false;
                            for (var chave in votos) {
                                if (votos[chave].userId == utilizador.id && votos[chave].postId == post.id) {
                                    jaVotou = true;
                                    break;
                                }
                            }
                            if (jaVotou) {
                                botaoVoto.classList.add("voted");
                                botaoVoto.disabled = true;
                                botaoVoto.querySelector("svg").style.fill = "#4a90e2";
                                botaoVoto.style.opacity = "0.6";
                                botaoVoto.style.cursor = "not-allowed";
                            } else {
                                botaoVoto.style.opacity = "1";
                                botaoVoto.style.cursor = "pointer";
                            }
                        });
                }
                botaoVoto.addEventListener("click", function() {
                    console.log("Clicou no botão de voto do post " + post.id);
                    votarPost(post.id);
                });

                container.appendChild(postElemento);
                console.log("Mostrou post: " + post.title);
            })
            .catch(erro => console.error("Erro ao mostrar post: ", erro));
    } catch (erro) {
        console.error("Erro no mostrarPost: ", erro);
    }
}

// Função para mostrar mensagem de erro
function mostrarErro(mensagem) {
    try {
        var container = document.getElementById("post-container");
        container.innerHTML = '<div class="post-card"><p>' + mensagem + '</p></div>';
    } catch (erro) {
        console.error("Erro ao mostrar erro: ", erro);
    }
}

// Função para votar num post
function votarPost(postId) {
    try {
        if (!utilizador) {
            alert("Tens de fazer login para votar!");
            console.log("Tentou votar sem login");
            return;
        }

        fetch(URL_FIREBASE + "posts.json")
            .then(resposta => resposta.json())
            .then(posts => {
                var chavePost = null;
                var post = null;
                for (var chave in posts) {
                    if (posts[chave].id == postId) {
                        chavePost = chave;
                        post = posts[chave];
                        break;
                    }
                }
                if (!post) {
                    console.log("Post não encontrado");
                    return;
                }

                fetch(URL_FIREBASE + "userVotes.json")
                    .then(resposta => resposta.json())
                    .then(votos => {
                        var jaVotou = false;
                        for (var chave in votos) {
                            if (votos[chave].userId == utilizador.id && votos[chave].postId == postId) {
                                jaVotou = true;
                                break;
                            }
                        }
                        if (jaVotou) {
                            alert("Já votaste neste post!");
                            console.log("Utilizador já votou no post " + postId);
                            return;
                        }

                        var votos = (post.votes || 0) + 1;
                        fetch(URL_FIREBASE + "posts/" + chavePost + ".json", {
                            method: "PATCH",
                            body: JSON.stringify({ votes: votos })
                        }).then(() => {
                            fetch(URL_FIREBASE + "userVotes.json", {
                                method: "POST",
                                body: JSON.stringify({
                                    userId: utilizador.id,
                                    postId: postId,
                                    timestamp: Date.now()
                                })
                            }).then(() => {
                                var postElemento = document.querySelector("[data-post-id='" + postId + "']");
                                if (postElemento) {
                                    postElemento.querySelector(".vote-count").textContent = votos;
                                    var botao = postElemento.querySelector(".vote-btn");
                                    botao.classList.add("voted");
                                    botao.disabled = true;
                                    botao.querySelector("svg").style.fill = "#4a90e2";
                                    botao.style.opacity = "0.6";
                                    botao.style.cursor = "not-allowed";
                                }
                                console.log("Voto adicionado no post " + postId);
                                if (post.authorId != utilizador.id) {
                                    novaNotificacao(post.authorId, "post_vote", "O teu post recebeu um voto", postId);
                                }
                            });
                        });
                    });
            })
            .catch(erro => console.error("Erro ao votar: ", erro));
    } catch (erro) {
        console.error("Erro no votarPost: ", erro);
    }
}

// Função para criar uma nova notificação
function novaNotificacao(userId, tipo, mensagem, relatedId) {
    try {
        fetch(URL_FIREBASE + "config.json")
            .then(resposta => resposta.json())
            .then(config => {
                var novoId = config.nextNotificationId || 1;
                var notificacao = {
                    id: novoId,
                    userId: userId,
                    type: tipo,
                    message: mensagem,
                    relatedId: relatedId,
                    timestamp: Date.now(),
                    read: false
                };
                fetch(URL_FIREBASE + "notifications.json", {
                    method: "POST",
                    body: JSON.stringify(notificacao)
                }).then(() => {
                    fetch(URL_FIREBASE + "config.json", {
                        method: "PATCH",
                        body: JSON.stringify({ nextNotificationId: novoId + 1 })
                    });
                    console.log("Nova notificação criada para utilizador " + userId);
                });
            })
            .catch(erro => console.error("Erro ao criar notificação: ", erro));
    } catch (erro) {
        console.error("Erro no novaNotificacao: ", erro);
    }
}

document.addEventListener("DOMContentLoaded", comecar);