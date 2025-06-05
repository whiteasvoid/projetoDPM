var areaArtigos = document.getElementById("trending-articles");
var areaEventos = document.getElementById("upcoming-events");

// Carregar artigos em alta
function carregarArtigosAlta() {
    areaArtigos.innerHTML = '<h2 class="trending-title">Artigos em Alta</h2>'; // Coloca o título
    fetch(URL_FIREBASE + "trendingArticles.json")
        .then(function(resposta) {
            return resposta.json(); // Converte a resposta para JSON
        })
        .then(function(dados) {
            var artigos = [];
            for (var chave in dados) {
                artigos.push(dados[chave]);
            }
            console.log("Carregou " + artigos.length + " artigos em alta");

            // Ordena por visualizações (Descendente)
            // Se não houver visualizações, assume 0
            for (var i = 0; i < artigos.length - 1; i++) {
                for (var j = i + 1; j < artigos.length; j++) {
                    if ((artigos[i].views || 0) < (artigos[j].views || 0)) {
                        var temp = artigos[i];
                        artigos[i] = artigos[j];
                        artigos[j] = temp;
                    }
                }
            }

            // Mostra cada artigo
            for (var i = 0; i < artigos.length; i++) {
                var artigo = document.createElement("div");
                artigo.className = "trending-item";
                artigo.innerHTML = `
                    <div class="trending-number">${i + 1}</div>
                    <div class="trending-content">
                        <a href="${artigos[i].url || "#"}">${artigos[i].title}</a>
                        <div class="trending-meta">${artigos[i].area} • ${artigos[i].views || 0} visualizações</div>
                    </div>
                `;
                areaArtigos.appendChild(artigo);
            }
        });
}

// Função para carregar eventos
function carregarEventos() {
    areaEventos.innerHTML = '<h2 class="trending-title">Conferências & Eventos</h2>'; // Coloca o título
    fetch(URL_FIREBASE + "events.json")
        .then(function(resposta) {
            return resposta.json(); // Converte a resposta para JSON
        })
        .then(function(dados) {
            var eventos = [];
            for (var chave in dados) {
                eventos.push(dados[chave]);
            }
            console.log("Carregou " + eventos.length + " eventos");

            // Ordena por data (mais cedo primeiro)
            for (var i = 0; i < eventos.length - 1; i++) {
                for (var j = i + 1; j < eventos.length; j++) {
                    if ((eventos[i].startDate || 0) > (eventos[j].startDate || 0)) {
                        var temp = eventos[i];
                        eventos[i] = eventos[j];
                        eventos[j] = temp;
                    }
                }
            }

            // Mostra cada evento
            for (var i = 0; i < eventos.length; i++) {
                var evento = document.createElement("div");
                evento.className = "trending-item";
                evento.innerHTML = `
                    <div class="trending-content">
                        <a href="${eventos[i].website || "#"}">${eventos[i].title}</a>
                        <div class="trending-meta">📅 ${eventos[i].date} • 📍 ${eventos[i].location}</div>
                    </div>
                `;
                areaEventos.appendChild(evento);
            }
        });
}