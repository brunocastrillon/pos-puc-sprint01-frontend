// Evento para alternar a exibição do campo de comentário ao clicar em "Comentar"
document.addEventListener("click", (event) => {
    if (event.target && event.target.classList.contains("toggle-comment-field")) {
        const postId = event.target.getAttribute("data-post-id");
        const formContainer = document.getElementById(`comment-form-container-${postId}`);
        if (formContainer.classList.contains("d-none")) {
            formContainer.classList.remove("d-none");
        } else {
            formContainer.classList.add("d-none");
        }
    }
});

// Submeter comentário
async function enviarComentario(postId) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Você precisa estar logado para comentar.");
        return;
    }

    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();

    if (!content) {
        alert("O comentário não pode estar vazio.");
        return;
    }

    const response = await fetch(`http://127.0.0.1:5000/api/comments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ post_id: postId, content })
    });

    const result = await response.json();

    if (response.ok) {
        input.value = "";
        const container = document.getElementById(`comment-list-${postId}`);
        await carregarComentarios(postId, container);
    } else {
        alert("Erro ao adicionar comentário: " + (result.error || result.message));
    }
}

// Carregar comentários de uma postagem
async function carregarComentarios(postId, container) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://127.0.0.1:5000/api/postagem/${postId}/comentarios`, {
            headers:{
                "Authorization": `Bearer ${token}`
            }
        });

        const comentarios = await response.json();

        if (comentarios.length === 0) {
            container.innerHTML = "<p class='text-muted'>Nenhum comentário ainda.</p>";
            return;
        }

        container.innerHTML = "";
        comentarios.forEach(comment => {
            const item = document.createElement("div");
            item.className = "mb-2 border-bottom pb-2";
            item.innerHTML = `
          <p class="mb-1"><strong>${comment.autor}</strong> 
            <span class="text-muted small">(${new Date(comment.criado_em).toLocaleString()})</span></p>
          <p class="mb-0">${comment.conteudo}</p>
        `;
            container.appendChild(item);
        });
    } catch (err) {
        container.innerHTML = "<p class='text-danger'>Erro ao carregar comentários.</p>";
        console.error("Erro ao buscar comentários:", err);
    }
} 