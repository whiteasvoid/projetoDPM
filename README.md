# 🎓 Social Academic

![Banner do Projeto](https://placehold.co/200x100/png)

## 📖 Sobre o Projeto

O **Social Academic** é uma plataforma de discussão focada na comunidade científica e acadêmica, oferecendo um espaço dedicado para o compartilhamento de conhecimento, colaboração em pesquisas, e discussões de alto nível sobre diversos campos da ciência.

### 💡 A Ideia

Este projeto nasceu da necessidade de criar um ambiente online onde pesquisadores, estudantes e entusiastas possam compartilhar e discutir conteúdo acadêmico com rigor científico, sem as distrações e limitações encontradas em redes sociais convencionais.

## ⚙️ Arquitetura do Sistema

O Social Academic é construído seguindo uma arquitetura moderna e escalável:

- **Frontend**: Desenvolvido HTML e CSS
- **Backend**: Javascript
- **Banco de Dados**: Javascript
- **Autenticação**:  JS com verificação de credenciais acadêmicas

## 🛠️ Funcionalidades Principais

### Já Implementadas

- ✅ Sistema de cadastro e login básico
- ✅ Estrutura de comunidades acadêmicas (subreddits temáticos)
- ✅ Sistema de postagem

### Em Desenvolvimento

- 🔄 **Verificação de Credenciais Acadêmicas**
  - Sistema de validação para especialistas e pesquisadores
  - Badges identificando área de especialidade e nível acadêmico

- 🔄 **Sistema de Citações Integrado**
  - Integração com bases de dados acadêmicas (FireBase)
  - Formatação automática de citações em diferentes padrões (APA, MLA, ABNT)
  - DOI linking automático

- 🔄 **Biblioteca Pessoal de Artigos**
  - Ferramenta de organização de artigos científicos
  - Sistema de anotações e destaques em PDFs
  - Tags e categorização personalizada

- 🔄 **Fóruns Moderados por Especialistas**
  - Moderação por profissionais verificados em cada área
  - Análise de qualidade de conteúdo para evitar desinformação

- 🔄 **Matchmaking para Colaboração**
  - Sistema para encontrar pesquisadores com interesses complementares
  - Ferramentas para iniciar projetos colaborativos

- 🔄 **Google FireBase**
  - Estrutura da base de dados:
  {
  "comments": {
    "placeholderCommentId123": {
      "text": null,           // Conteúdo do comentário (string)
      "userId": null,         // ID do utilizador que fez o comentário (string, ex: Auth UID)
      "postId": null,         // ID do post a que este comentário pertence (string)
      "timestamp": null,      // Carimbo de data/hora da criação (número ou string ISO 8601)
      "likesCount": null      // Número de 'gostos' no comentário (número)
    }
  },
  "config": {
    "maintenanceMode": null,  // Exemplo: true/false para modo de manutenção (boolean)
    "appVersion": null,       // Exemplo: Versão atual da app (string)
    "featureFlags": {         // Exemplo: Sub-objeto para 'feature flags'
      "novaFuncionalidadeAtiva": null // boolean
    }
  },
  "events": {
     "placeholderEventId456": {
       "name": null,         // Nome do evento (string)
       "date": null,         // Data/hora do evento (número ou string)
       "location": null,     // Localização (string)
       "description": null,  // Descrição longa (string)
       "organiserId": null,  // ID do organizador (string)
       "attendeesCount": null // Número de participantes (número)
     }
  },
  "posts": {
    "placeholderPostId789": {
      "title": null,          // Título do post (string)
      "body": null,           // Conteúdo principal do post (string)
      "authorId": null,       // ID do utilizador que criou o post (string)
      "timestamp": null,      // Carimbo de data/hora da criação (número ou string)
      "imageUrl": null,       // URL de uma imagem associada (string, pode ser null)
      "likesCount": null,     // Número de 'gostos' no post (número)
      "commentsCount": null,  // Número total de comentários no post (número)
      "comments": {
         "placeholderCommentIdDentroPost": { // ID de comentário dentro do post
            "text": null,
            "userId": null,
            "timestamp": null
         }
      },
    }
  },
  "users": {
    "placeholderUserIdABC": {
      "username": null,       // Nome de utilizador (string)
      "email": null,          // Endereço de email (string, pode ser nulo se não for necessário)
      "profileImageUrl": null,// URL da imagem de perfil (string, pode ser nulo)
      "registrationDate": null,// Data de registo (número ou string)
      "bio": null,            // Biografia curta (string, pode ser nulo)
      "lastLogin": null       // Último login (número ou string)
    }
  }
}


## 🖼️ Screenshots

### Protótipo da Interface

![Tela Inicial](https://placehold.co/200x100/png)
![Página de Discussão](https://placehold.co/200x100/png)
![Biblioteca de Artigos](https://placehold.co/200x100/png)

## 📱 Acesse a Plataforma

Scanneie o QR code abaixo para acessar o Social Academic:

![QR Code para o Social Academic](images/qr-code.svg)

## 📝 Plano de Desenvolvimento

### Fase 1 (Concluída)
- ✅ Conceituação do projeto
- ✅ Setup inicial do repositório
- ✅ Documentação básica

### Fase 2 (Concluída)
- ✅ Desenvolvimento do frontend básico
- ✅ Implementação do sistema de autenticação
- ✅ Estrutura de comunidades acadêmicas

### Fase 3 (Em execução)
- ⏳ Sistema de citações
- ⏳ Verificação de credenciais
- ⏳ Biblioteca de artigos

## 👥 Autores
| **João Curto** | **Lourenço Marques** |<br>
| [GitHub](https://github.com/whiteasvoid) | [GitHub](https://github.com/Quim0309) |

---

<div align="center">
  <sub>Desenvolvido para a disciplina de Desenvolvimento de Produtos Multimedia - 2025</sub>
</div>