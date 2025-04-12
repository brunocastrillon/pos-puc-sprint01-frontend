# 📝 Microblog SPA - Frontend

Este projeto é um **Single Page Application (SPA)** minimalista para um **microblog** desenvolvido com **HTML, Bootstrap e JavaScript puro**. Ele consome uma API Flask no backend e permite funcionalidades como:

- Registro e login de usuários
- Criação, edição e exclusão de postagens
- Curtidas e comentários
- Página de perfil com listagem personalizada

---

## 🚀 Instalação e Configuração

Siga as etapas abaixo para rodar o projeto em ambiente local:

### 1. Pré-requisitos

- Um navegador moderno (Google Chrome, Firefox, etc.)
- Um servidor backend em Flask rodando na porta `http://127.0.0.1:5000` com os endpoints da API disponíveis

### 2. Etapas

1. Baixe ou clone este repositório frontend.
2. Certifique-se de que sua API Flask está rodando.
3. Abra o arquivo `index.html` em seu navegador para iniciar a aplicação.
4. Acesse a área pública, registre um novo usuário, e faça login para explorar o microblog.

---

## 📁 Estrutura de Pastas

```
/frontend/
│
├── assets/                 # (Vazio) imagens, icones, etc.
├── css/                    # folhas de estilo
├──── index.css             # (Opcional) Estilos customizados adicionais
├── js/                     # lógica de dinamismo da aplicação e acesso aos dados
├──── autenticacao.js       # login do usuário
├──── comentarios.js        # Comentários das postagens
├──── main.js               # Comentários das postagens
├──── perfil.js             # Página de perfil do usuário (posts pessoais, edição, exclusão)
├──── postagens.js          # Listagem, curtidas e comentários de postagens
├──── registro.js           # cadastro de novo usuário
└── index.html              # Página principal da aplicação
```

---

## 📌 Observações

- O frontend é totalmente estático e interage com a API via `fetch`.
- O token JWT é armazenado no `localStorage`.
- O projeto não utiliza nenhum framework JS (como React ou Vue), para manter a simplicidade.

---

## 📄 Licença

Este projeto é livre para uso educacional, acadêmico e pessoal.