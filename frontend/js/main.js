// const loginBtn = document.getElementById('login-btn');
// const logoutBtn = document.getElementById('logout-btn');
// const usernameDisplay = document.getElementById('username-display');
// const postSection = document.getElementById('post-section');
// const infoTiles = document.getElementById('info-tiles');

// // Simulação de login (substituir pela lógica real com fetch)
// document.getElementById('login-form').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const username = document.getElementById('login-username').value;
//   const password = document.getElementById('login-password').value;

//   // Aqui você usaria fetch para autenticar, por enquanto é mock
//   if (username && password) {
//     localStorage.setItem('user', username); // pode ser token também
//     loginSuccess(username);
    
//     const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    
//     modal.hide();
//   }
// });

// function loginSuccess(username) {
//   usernameDisplay.textContent = username;
  
//   loginBtn.classList.add('d-none');
//   logoutBtn.classList.remove('d-none');
  
//   postSection.style.display = 'block';
//   infoTiles.style.display = 'none';
//   // carregarPosts();
// }

// logoutBtn.addEventListener('click', () => {
//   localStorage.removeItem('user');
//   usernameDisplay.textContent = '';
//   loginBtn.classList.remove('d-none');
//   logoutBtn.classList.add('d-none');
//   postSection.style.display = 'none';
//   infoTiles.style.display = 'flex';
// });

// // Verifica se já está logado
// window.addEventListener('DOMContentLoaded', () => {
//   const user = localStorage.getItem('user');
//   if (user) loginSuccess(user);
// });

// // Abrir modal ao clicar no botão de login
// loginBtn.addEventListener('click', () => {
//   const modal = new bootstrap.Modal(document.getElementById('loginModal'));
//   modal.show();
// });

document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const usernameDisplay = document.getElementById("username-display");
    const postSection = document.getElementById("post-section");
    const infoTiles = document.getElementById("info-tiles");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
        // Usuário logado
        usernameDisplay.textContent = username;

        loginBtn.classList.add("d-none");
        logoutBtn.classList.remove("d-none");

        postSection.style.display = "block";
        infoTiles.style.display = "none";

        carregarPosts();
    } else {
        // Usuário não logado
        usernameDisplay.textContent = "";

        loginBtn.classList.remove("d-none");
        logoutBtn.classList.add("d-none");

        postSection.style.display = "none";
        infoTiles.style.display = "flex";
    }

    // Botão login abre modal
    loginBtn.addEventListener("click", function () {
        const modal = new bootstrap.Modal(document.getElementById("loginModal"));
        
        modal.show();
    });

    // Botão logout limpa sessão
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        usernameDisplay.textContent = "";

        loginBtn.classList.remove("d-none");
        logoutBtn.classList.add("d-none");

        postSection.style.display = "none";
        infoTiles.style.display = "flex";

        document.getElementById("post-feed").innerHTML = "";
    });
});