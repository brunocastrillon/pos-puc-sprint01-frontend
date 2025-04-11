
document.getElementById("register-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const login = document.getElementById("register-username").value;
  const senha = document.getElementById("register-password").value;
  const feedback = document.getElementById("register-feedback");

  try {
    const response = await fetch("http://127.0.0.1:5000/api/autenticar/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha })
    });

    const data = await response.json();

    if (response.ok) {
      feedback.classList.remove("text-danger");
      feedback.classList.add("text-success");
      
      feedback.textContent = "Conta criada com sucesso! Faça login.";
      
      setTimeout(() => bootstrap.Modal.getInstance(document.getElementById("registerModal")).hide(), 1500);
    } else {
      feedback.classList.add("text-danger");
      
      feedback.textContent = data.error || "Erro ao registrar.";
    }
  } catch (err) {
    feedback.classList.add("text-danger");
    
    feedback.textContent = "Erro de rede ao tentar registrar.";
  }
});
