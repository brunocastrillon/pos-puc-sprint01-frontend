async function carregarPosts() {
    const postsContainer = document.getElementById("posts-container");
    const token = localStorage.getItem("token");
    const currentUserId = getUserIdFromToken(token);

    try {
        const response = await fetch("http://127.0.0.1:5000/api/postagem");
        const posts = await response.json();

        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>Nenhuma postagem encontrada.</p>";
            return;
        }

        for (let post of posts) {
            const postElement = document.createElement("div");
            postElement.classList.add("card", "mb-3");

            postElement.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.content}</p>
            <p class="text-muted">Autor: ${post.author} | ${new Date(post.created_at).toLocaleDateString()}</p>
            <div class="d-flex gap-2">
              <button class="btn btn-primary btn-sm like-btn" data-post-id="${post.id}">Curtir (${post.likes})</button>
              <button class="btn btn-outline-secondary btn-sm view-likes-btn" data-post-id="${post.id}">Ver quem curtiu</button>
              <button class="btn btn-outline-success btn-sm view-comments-btn" data-post-id="${post.id}">Ver comentários</button>
              <button class="btn btn-outline-primary btn-sm toggle-comment-field" data-post-id="${post.id}">Comentar</button>
            </div>
            <div id="liked-by-${post.id}" class="mt-2 text-muted small"></div>
            <div id="like-list-${post.id}" class="mt-2 d-none"></div>
            <div id="comment-form-container-${post.id}" class="mt-3 d-none">
              <textarea class="form-control mb-2" id="comment-input-${post.id}" rows="2" placeholder="Escreva um comentário..."></textarea>
              <button class="btn btn-sm btn-success" onclick="enviarComentario(${post.id})">Enviar</button>
            </div>
            <div id="comment-list-${post.id}" class="mt-3 d-none"></div>
          </div>
        `;

            postsContainer.appendChild(postElement);
        }

        // Eventos de curtida
        document.querySelectorAll(".like-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const postId = this.getAttribute("data-post-id");
                await likePost(postId);
                location.reload();
            });
        });

        // Eventos de visualização de curtidas
        document.querySelectorAll(".view-likes-btn").forEach(button => {

            button.addEventListener("click", async function () {
                const postId = this.getAttribute("data-post-id");
                const likesData = await fetchWhoLikes(postId);

                const likesList = document.getElementById("likesList");
                likesList.innerHTML = "";

                console.log("[DEBUG] likesData:", likesData);

                if (!Array.isArray(likesData.users) || likesData.users.length === 0) {
                    //if (likesData.users.length === 0) {
                    likesList.innerHTML = "<p>Ninguém curtiu esta postagem ainda.</p>";
                } else {
                    likesData.users.forEach(user => {
                        const userItem = document.createElement("p");

                        userItem.textContent = user.username + (user.id === currentUserId ? " (você)" : "");
                        likesList.appendChild(userItem);
                    });
                }

                // Abrir modal
                const modal = new bootstrap.Modal(document.getElementById("likesModal"));
                modal.show();
            });
        });

        // Exibir "Você curtiu isso"
        const likeButtons = document.querySelectorAll(".view-likes-btn");

        for (let button of likeButtons) {
            const postId = button.dataset.postId;
            const likes = await fetchLikes(postId);
            const youLiked = Array.isArray(likes.users) && likes.users.some(user => user.id === currentUserId);
            
            if (youLiked) {
                document.getElementById(`liked-by-${postId}`).textContent = "Você curtiu isso ❤️";
            }
        }

    } catch (error) {
        postsContainer.innerHTML = "<p>Erro ao carregar postagens.</p>";
        console.error("Erro ao buscar postagens:", error);
    }
}

// Curtir
async function likePost(postId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Você precisa estar logado para curtir.");
        return;
    }

    const response = await fetch(`http://127.0.0.1:5000/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!response.ok) {
        alert("Você já curtiu essa postagem.");
    }
}

// Listar curtidas
async function fetchLikes(postId) {
    const response = await fetch(`http://127.0.0.1:5000/api/posts/${postId}/likes`);
    return await response.json();
}

// Buscar lista de curtidas e quem curtiu
async function fetchWhoLikes(postId) {
    const response = await fetch(`http://127.0.0.1:5000/api/posts/${postId}/wholikes`);
    return await response.json();
}

// Decodificar token
function getUserIdFromToken(token) {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return parseInt(payload.sub || payload.identity);
    } catch (err) {
        console.error("Erro ao decodificar token:", err);
        return null;
    }
}

// Delegação de eventos para curtidas e comentários
document.addEventListener("click", async (event) => {
    // Alternar comentários
    if (event.target.classList.contains("view-comments-btn")) {
        const postId = event.target.getAttribute("data-post-id");
        const commentList = document.getElementById(`comment-list-${postId}`);

        if (commentList.classList.contains("d-none")) {
            commentList.innerHTML = "<p class='text-muted'>Carregando comentários...</p>";
            commentList.classList.remove("d-none");
            await carregarComentarios(postId, commentList);
        } else {
            commentList.classList.add("d-none");
            commentList.innerHTML = "";
        }
    }

    // Alternar curtidas
    if (event.target.classList.contains("view-likes-btn")) {
        const postId = event.target.getAttribute("data-post-id");
        const likeList = document.getElementById(`like-list-${postId}`);

        if (likeList.classList.contains("d-none")) {
            likeList.innerHTML = "<p class='text-muted'>Carregando curtidas...</p>";
            likeList.classList.remove("d-none");

            const likesData = await fetchLikes(postId);

            if (likesData.users?.length) {
                likeList.innerHTML = "";

                likesData.users.forEach(user => {
                    const item = document.createElement("p");

                    item.className = "mb-1";
                    item.innerHTML = `<i class="bi bi-heart-fill text-danger me-1"></i> ${user.username}`;

                    likeList.appendChild(item);
                });

            } else {
                likeList.innerHTML = "<p class='text-muted'>Ninguém curtiu ainda.</p>";
            }
        } else {
            likeList.classList.add("d-none");
            likeList.innerHTML = "";
        }
    }
});