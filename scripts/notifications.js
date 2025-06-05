// Pega os elementos da página para notificações
var linkNotificacoes = document.getElementById("notifications-link");
var badgeNumero = document.getElementById("notification-badge");
var listaNotificacoes = document.getElementById("notifications-container");
var areaNotificacoes = document.getElementById("notifications-list");

// Função para ligar eventos das notificações
function configurarEventosNotificacoes() {
    // Quando clicar no link, esconde ou mostra a lista de notificações
    linkNotificacoes.addEventListener("click", function(evento) {
        evento.preventDefault();
        if (areaNotificacoes.style.display == "none") {
            areaNotificacoes.style.display = "block";
            console.log("Mostrou lista de notificações");
        } else {
            areaNotificacoes.style.display = "none";
            console.log("Escondeu lista de notificações");
        }
    });
}

// Função para carregar as notificações
function carregarNotificacoes() {
    if (utilizador == null) {
        badgeNumero.textContent = "0";
        listaNotificacoes.innerHTML = "";
        areaNotificacoes.style.display = "none";
        console.log("Sem utilizador, limpou notificações");
        return;
    }

    // Vai buscar as notificações do Firebase
    fetch(URL_FIREBASE + "notifications.json")
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(dados) {
            listaNotificacoes.innerHTML = ""; // Limpa a lista
            var notificacoes = [];
            for (var chave in dados) {
                if (dados[chave].userId == utilizador.id) {
                    dados[chave].chave = chave;
                    notificacoes.push(dados[chave]);
                }
            }
            console.log("Carregou " + notificacoes.length + " notificações");

            // Ordena por data (mais recente primeiro)
            for (var i = 0; i < notificacoes.length - 1; i++) {
                for (var j = i + 1; j < notificacoes.length; j++) {
                    if ((notificacoes[i].timestamp || 0) < (notificacoes[j].timestamp || 0)) {
                        var temp = notificacoes[i];
                        notificacoes[i] = notificacoes[j];
                        notificacoes[j] = temp;
                    }
                }
            }

            // Conta notificações não lidas
            var naoLidas = 0;
            for (var i = 0; i < notificacoes.length; i++) {
                if (notificacoes[i].read == false) {
                    naoLidas++;
                }
                var item = document.createElement("li");
                var texto = notificacoes[i].message;
                if (notificacoes[i].read == false) {
                    texto = "<strong>" + texto + "</strong>";
                }
                item.innerHTML = texto;
                var chaveNotificacao = notificacoes[i].chave;
                item.addEventListener("click", function() {
                    marcarLida(chaveNotificacao);
                });
                listaNotificacoes.appendChild(item);
            }
            badgeNumero.textContent = naoLidas;
            console.log("Mostrou " + naoLidas + " notificações não lidas");
        });
}

// Marca uma notificação como lida
// e atualiza a lista de notificações
function marcarLida(chave) {
    // Atualiza a notificação na base de dados
    fetch(URL_FIREBASE + "notifications/" + chave + ".json", {
        method: "PATCH",
        body: JSON.stringify({ read: true })
    }).then(function() {
        carregarNotificacoes();
        console.log("Marcou notificação como lida: " + chave);
    });
}

// Função para criar uma nova notificação
function novaNotificacao(userId, tipo, mensagem, relatedId) {
    // Ir buscar o próximo ID de notificação
    fetch(URL_FIREBASE + "config.json")
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(config) {
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
            // Adiciona a notificação
            fetch(URL_FIREBASE + "notifications.json", {
                method: "POST",
                body: JSON.stringify(notificacao)
            }).then(function() {
                // Atualiza o próximo ID
                fetch(URL_FIREBASE + "config.json", {
                    method: "PATCH",
                    body: JSON.stringify({ nextNotificationId: novoId + 1 })
                });
                if (utilizador != null && utilizador.id == userId) {
                    carregarNotificacoes();
                    console.log("Nova notificação criada para utilizador " + userId);
                }
            });
        });
}