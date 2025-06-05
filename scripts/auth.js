// Função para fazer login
function fazerLogin(evento) {
    evento.preventDefault();
    try {
        var email = document.getElementById("login-email")?.value;
        var senha = document.getElementById("login-password")?.value;
        if (!email || !senha) {
            alert("Preenche todos os campos!");
            console.log("Campos de login vazios");
            return;
        }
        console.log("A tentar login com email: " + email);

        fetch(URL_FIREBASE + "users.json")
            .then(resposta => resposta.json())
            .then(dados => {
                let encontrou = false;
                for (let chave in dados) {
                    if (dados[chave]?.email == email && dados[chave]?.password == senha) {
                        utilizador = {
                            id: dados[chave].id,
                            nome: dados[chave].name,
                            email: dados[chave].email,
                            area: dados[chave].area,
                            verified: dados[chave].verified || false
                        };
                        encontrou = true;
                        console.log("Utilizador encontrado: " + utilizador.nome);
                        sessionStorage.setItem("utilizador", JSON.stringify(utilizador));
                        fetch(URL_FIREBASE + "users/" + chave + ".json", {
                            method: "PATCH",
                            body: JSON.stringify({ lastLogin: Date.now() })
                        });
                        atualizarInterface();
                        document.getElementById("login-modal").style.display = "none";
                        document.getElementById("login-form").reset();
                        var filtro = document.querySelector(".filter-btn.active")?.dataset.filter || "populares";
                        carregarPosts(filtro);
                        break;
                    }
                }
                if (!encontrou) {
                    alert("Email ou palavra-passe errados!");
                    console.log("Login falhou");
                }
            })
            .catch(erro => console.error("Erro ao fazer login: ", erro));
    } catch (erro) {
        console.error("Erro no login: ", erro);
    }
}

// Função para fazer registo
function fazerRegisto(evento) {
    evento.preventDefault();
    try {
        var nome = document.getElementById("register-name")?.value;
        var email = document.getElementById("register-email")?.value;
        var senha = document.getElementById("register-password")?.value;
        var area = document.getElementById("register-area")?.value;
        if (!nome || !email || !senha || !area) {
            alert("Preenche todos os campos!");
            console.log("Campos de registo vazios");
            return;
        }
        console.log("A tentar registar: " + nome);

        fetch(URL_FIREBASE + "users.json")
            .then(resposta => resposta.json())
            .then(dados => {
                let emailExiste = false;
                for (let chave in dados) {
                    if (dados[chave]?.email == email) {
                        emailExiste = true;
                        break;
                    }
                }
                if (emailExiste) {
                    alert("Este email já está registado!");
                    console.log("Email já existe");
                    return;
                }

                fetch(URL_FIREBASE + "config.json")
                    .then(resposta => resposta.json())
                    .then(config => {
                        var proximoId = config.nextUserId || 1;
                        var novoUtilizador = {
                            id: proximoId,
                            name: nome,
                            email: email,
                            password: senha,
                            area: area,
                            verified: false,
                            createdAt: Date.now(),
                            lastLogin: Date.now()
                        };
                        fetch(URL_FIREBASE + "users.json", {
                            method: "POST",
                            body: JSON.stringify(novoUtilizador)
                        }).then(() => {
                            fetch(URL_FIREBASE + "config.json", {
                                method: "PATCH",
                                body: JSON.stringify({ nextUserId: proximoId + 1 })
                            });
                            utilizador = {
                                id: proximoId,
                                nome: nome,
                                email: email,
                                area: area,
                                verified: false
                            };
                            sessionStorage.setItem("utilizador", JSON.stringify(utilizador));
                            atualizarInterface();
                            document.getElementById("register-modal").style.display = "none";
                            document.getElementById("register-form").reset();
                            alert("Registo feito com sucesso!");
                            console.log("Novo utilizador registado");
                            var filtro = document.querySelector(".filter-btn.active")?.dataset.filter || "populares";
                            carregarPosts(filtro);
                        });
                    });
            })
            .catch(erro => console.error("Erro ao registar: ", erro));
    } catch (erro) {
        console.error("Erro no registo: ", erro);
    }
}

// Função para atualizar a interface
function atualizarInterface() {
    try {
        var botoesLoginRegisto = document.getElementById("auth-buttons");
        var areaPerfil = document.getElementById("user-profile");
        var textoNome = document.getElementById("username-display");

        if (utilizador) {
            botoesLoginRegisto.classList.add("hidden");
            areaPerfil.classList.remove("hidden");
            textoNome.textContent = utilizador.nome;
            document.getElementById("create-post-btn").classList.remove("hidden");
            console.log("Interface atualizada para utilizador logado: " + utilizador.nome);
        } else {
            botoesLoginRegisto.classList.remove("hidden");
            areaPerfil.classList.add("hidden");
            document.getElementById("create-post-btn").classList.add("hidden");
            document.getElementById("post-form-container").classList.add("hidden");
            console.log("Interface atualizada para sem utilizador");
        }
    } catch (erro) {
        console.error("Erro ao atualizar interface: ", erro);
    }
}