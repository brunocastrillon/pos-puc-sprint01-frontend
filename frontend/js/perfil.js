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

                <button class="btn btn-sm btn-warning me-2" onclick="editarPost(${post.id}, '${post.titulo}', \`${post.conteudo.replace(/`/g, "\\`")}\`)">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="excluirPost(${post.id})">Excluir</button>
            </div>
      `;
        container.appendChild(div);
    });
}
