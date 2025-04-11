document.getElementById("go-profile").addEventListener("click", async () => {
    document.getElementById("info-tiles").classList.add("d-none");
    document.getElementById("post-feed").classList.add("d-none");
    document.getElementById("user-posts").classList.remove("d-none");
    document.getElementById("profile-menu").classList.remove("d-none");

    await carregarPostsDoUsuario();
});

document.getElementById("back-to-feed").addEventListener("click", async () => {
    document.getElementById("info-tiles").classList.add("d-none");
    document.getElementById("post-feed").classList.remove("d-none");
    document.getElementById("user-posts").classList.add("d-none");
    document.getElementById("profile-menu").classList.add("d-none");

    await carregarPosts();
});

document.getElementById("edit-post-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const id_postagem = document.getElementById("edit-post-id").value;
    const titulo = document.getElementById("edit-title").value.trim();
    const conteudo = document.getElementById("edit-content").value.trim();

    const response = await fetch(`http://127.0.0.1:5000/api/postagem/${id_postagem}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo, conteudo })
    });

    if (response.ok) {
        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
        await carregarPostsDoUsuario();
    } else {
        alert("Erro ao atualizar postagem.");
    }
});

function abrirModalEdicao(id, title, content) {
    document.getElementById("edit-post-id").value = id;
    document.getElementById("edit-title").value = title;
    document.getElementById("edit-content").value = content;

    const modal = new bootstrap.Modal(document.getElementById("editModal"));

    modal.show();
}

async function carregarPostsDoUsuario() {
    const token = localStorage.getItem("token");
    const container = document.getElementById("user-posts");

    container.innerHTML = "<p>Carregando suas postagens...</p>";

    const response = await fetch(`http://127.0.0.1:5000/api/postagem/usuario`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const posts = await response.json();

    if (!posts.length) {
        container.innerHTML = "<p class='text-muted'>Você ainda não postou nada.</p>";
        return;
    }

    container.innerHTML = "";
    posts.forEach(post => {
        const div = document.createElement("div");
        div.className = "card mb-3";
        div.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${post.titulo}</h5>

                <p class="card-text">${post.conteudo}</p>
                <p class="text-muted">Criado em: ${new Date(post.criado_em).toLocaleString()}</p>

                <button class="btn btn-sm btn-warning me-2" onclick="abrirModalEdicao(${post.id}, '${post.titulo}', \`${post.conteudo.replace(/`/g, "\\`")}\`)">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="excluirPost(${post.id})">Excluir</button>
            </div>
      `;
        container.appendChild(div);
    });
}

async function excluirPost(id_postagem) {
    if (!confirm("Tem certeza que deseja excluir esta postagem?")) return;
    const token = localStorage.getItem("token");

    const response = await fetch(`http://127.0.0.1:5000/api/postagem/${id_postagem}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (response.ok) {
        alert("Post excluído!");
        await carregarPostsDoUsuario();
    } else {
        alert("Erro ao excluir o post.");
    }
}