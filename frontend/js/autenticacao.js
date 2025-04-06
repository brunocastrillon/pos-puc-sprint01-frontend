document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const login = document.getElementById("login-username").value;
    const senha = document.getElementById("login-password").value;

    const response = await fetch("http://127.0.0.1:5000/api/autenticar/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, senha })
    });

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", login);
        
        document.getElementById("username-display").textContent = login;
        document.getElementById("login-btn").classList.add("d-none");
        document.getElementById("logout-btn").classList.remove("d-none");
        document.getElementById("info-tiles").style.display = "none";
        document.getElementById("post-section").style.display = "block";
        
        carregarPosts(); // chamada à função de posts.js
        
        const modal = bootstrap.Modal.getInstance(document.getElementById("loginModal"));
        
        modal.hide();
    } else {
        alert("Erro: " + data.error);
    }
});
