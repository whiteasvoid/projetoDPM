// Função para criar um novo post
function criarNovoPost(evento) {
    evento.preventDefault();
    try {
        if (!utilizador) {
            alert("Tens de fazer login para criar um post!");
            console.log("Tentou criar post sem login");
            return;
        }

        var titulo = document.getElementById("post-title")?.value;
        var texto = document.getElementById("post-content")?.value;
        var area = document.getElementById("post-area")?.value;
        var tags = document.getElementById("post-tags")?.value;
        var citacao = document.getElementById("post-citation")?.value;
        var linkCitacao = document.getElementById("post-citation-link")?.value;
        if (!titulo || !texto || !area) {
            alert("Preenche os campos obrigatórios!");
            console.log("Campos do post vazios");
            return;
        }

        var listaTags = tags ? tags.split(",").map(tag => tag.trim()).filter(tag => tag) : [];

        fetch(URL_FIREBASE + "config.json")
            .then(resposta => resposta.json())
            .then(config => {
                var novoId = config.nextPostId || 1;
                var post = {
                    id: novoId,
                    authorId: utilizador.id,
                    title: titulo,
                    content: texto,
                    area: area,
                    timestamp: Date.now(),
                    votes: 0,
                    comments: 0,
                    tags: listaTags,
                    citation: citacao || "",
                    citationLink: linkCitacao || "",
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };
                fetch(URL_FIREBASE + "posts.json", {
                    method: "POST",
                    body: JSON.stringify(post)
                }).then(() => {
                    fetch(URL_FIREBASE + "config.json", {
                        method: "PATCH",
                        body: JSON.stringify({ nextPostId: novoId + 1 })
                    });
                    document.getElementById("post-form").reset();
                    document.getElementById("post-form-container").classList.add("hidden");
                    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
                    document.querySelector(".filter-btn[data-filter='recentes']").classList.add("active");
                    carregarPosts("recentes");
                    alert("Post criado com sucesso!");
                    console.log("Novo post criado: " + titulo);
                });
            })
            .catch(erro => console.error("Erro ao criar post: ", erro));
    } catch (erro) {
        console.error("Erro no criarNovoPost: ", erro);
    }
}

// Função para carregar os posts
function carregarPosts(filtro) {
    try {
        var listaPosts = document.getElementById("posts-container");
        listaPosts.innerHTML = "";
        fetch(URL_FIREBASE + "posts.json")
            .then(resposta => resposta.json())
            .then(dados => {
                var posts = [];
                for (var chave in dados) {
                    posts.push(dados[chave]);
                }
                console.log("Carregou " + posts.length + " posts");

                if (filtro == "recentes") {
                    posts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                } else if (filtro == "populares") {
                    posts.sort((a, b) => (b.votes || 0) - (a.votes || 0));
                } else if (filtro == "minha-area") {
                    if (!utilizador) {
                        alert("Faz login para ver posts da tua área!");
                        console.log("Tentou ver posts da área sem login");
                        return;
                    }
                    posts = posts.filter(post => post.area == utilizador.area);
                } else if (filtro == "verificados") {
                    fetch(URL_FIREBASE + "users.json")
                        .then(resposta => resposta.json())
                        .then(usuarios => {
                            posts = posts.filter(post => {
                                for (var chave in usuarios) {
                                    if (usuarios[chave].id == post.authorId && usuarios[chave].verified) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                            mostrarPosts(posts);
                        })
                        .catch(erro => console.error("Erro ao carregar posts verificados: ", erro));
                    return;
                }
                mostrarPosts(posts);
            })
            .catch(erro => console.error("Erro ao carregar posts: ", erro));
    } catch (erro) {
        console.error("Erro no carregarPosts: ", erro);
    }
}

// Função para carregar posts de uma área
function carregarPostsPorArea(area) {
    try {
        var listaPosts = document.getElementById("posts-container");
        listaPosts.innerHTML = "";
        fetch(URL_FIREBASE + "posts.json")
            .then(resposta => resposta.json())
            .then(dados => {
                var posts = [];
                for (var chave in dados) {
                    if (dados[chave].area == area) {
                        posts.push(dados[chave]);
                    }
                }
                document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
                if (posts.length > 0) {
                    mostrarPosts(posts);
                } else {
                    listaPosts.innerHTML = '<div class="post-card"><p>Nenhum post encontrado na área de ' + area + '.</p></div>';
                    console.log("Sem posts na área: " + area);
                }
            })
            .catch(erro => console.error("Erro ao carregar posts por área: ", erro));
    } catch (erro) {
        console.error("Erro no carregarPostsPorArea: ", erro);
    }
}

// Função para carregar apenas os posts do utilizador logado
function carregarMeusPosts() {
    try {
        var listaPosts = document.getElementById("posts-container");
        listaPosts.innerHTML = "";
        fetch(URL_FIREBASE + "posts.json")
            .then(resposta => resposta.json())
            .then(dados => {
                var posts = [];
                for (var chave in dados) {
                    if (dados[chave].authorId == utilizador.id) {
                        posts.push(dados[chave]);
                    }
                }
                console.log("Carregou " + posts.length + " posts do utilizador");
                document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
                if (posts.length > 0) {
                    mostrarPosts(posts);
                } else {
                    listaPosts.innerHTML = '<div class="post-card"><p>Não tens nenhum post publicado.</p></div>';
                    console.log("Sem posts do utilizador");
                }
            })
            .catch(erro => console.error("Erro ao carregar meus posts: ", erro));
    } catch (erro) {
        console.error("Erro no carregarMeusPosts: ", erro);
    }
}

// Função para mostrar os posts
function mostrarPosts(posts) {
    try {
        var listaPosts = document.getElementById("posts-container");
        console.log("A mostrar " + posts.length + " posts");
        if (posts.length == 0) {
            listaPosts.innerHTML = '<div class="post-card"><p>Nenhum post encontrado.</p></div>';
        }
        posts.forEach(post => mostrarUmPost(post));
    } catch (erro) {
        console.error("Erro no mostrarPosts: ", erro);
    }
}

// Função para mostrar um post
function mostrarUmPost(post) {
    try {
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

                var tituloPost = postElemento.querySelector(".post-title");
                tituloPost.style.cursor = "pointer";
                tituloPost.addEventListener("click", function() {
                    console.log("Clicou no post com ID: " + post.id);
                    window.location.href = "post.html?id=" + post.id;
                });

                document.getElementById("posts-container").appendChild(postElemento);
                console.log("Mostrou post: " + post.title);
            })
            .catch(erro => console.error("Erro ao mostrar post: ", erro));
    } catch (erro) {
        console.error("Erro no mostrarUmPost: ", erro);
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