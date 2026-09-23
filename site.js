document.addEventListener("DOMContentLoaded", () => {

  efeitoScroll();
  animarCards();
  validarFormulario();
  controlarBotaoTopo();
  verificarLogin();

});

/* Animação dos cards */

function animarCards() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

}

function efeitoScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") {
        return;
      }
      const destino = document.querySelector(id);
      if (destino) {
        e.preventDefault();
        destino.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}


/* Formulário */

function validarFormulario() {
  const form = document.querySelector("#formSugestao");
  const mensagemLogin = document.querySelector("#mensagemLogin");
  const mensagemSucesso = document.querySelector("#mensagemSucesso");

  /* Se a página não tiver o formulário, não faz nada. */
  if (!form) {
    return;
  }

  /* Verifica se o usuário está logado. */
  const usuarioLogado =
    localStorage.getItem("usuarioLogado") === "true";
  if (usuarioLogado) {
    form.classList.remove("d-none");
    if (mensagemLogin) {
      mensagemLogin.classList.add("d-none");
    }
  } else {
    form.classList.add("d-none");
    if (mensagemLogin) {
      mensagemLogin.classList.remove("d-none");
    }

  }

  /* Envio do formulário. */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    /* Confirma novamente se o usuário está logado.*/

    if (localStorage.getItem("usuarioLogado") !== "true") {
      alert("Para comentar, faça login.");
      form.classList.add("d-none");
      if (mensagemLogin) {
        mensagemLogin.classList.remove("d-none");
      }
      return;
    }

    const perfil = document.querySelector("#perfil");
    const sugestao = document.querySelector("#sugestaoTexto");

    if (!perfil || !sugestao) {
      return;
    }


    /*Verifica se os campos foram preenchidos. */

    if (
      perfil.value === "" ||
      sugestao.value.trim() === ""
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    /* Mostra mensagem de sucesso.*/
    if (mensagemSucesso) {
      mensagemSucesso.classList.remove("d-none");
    } else {
      alert("Obrigado! Sua sugestão foi enviada com sucesso.");
    }

    /* Limpa o formulário.*/
    form.reset();

    /* Esconde a mensagem depois de 4 segundos.*/
    if (mensagemSucesso) {
      setTimeout(() => {
        mensagemSucesso.classList.add("d-none");
      }, 4000);
    }
  });
}

/* Botão voltar ao topo */

function controlarBotaoTopo() {
  const voltarTopo = document.createElement("button");
  voltarTopo.type = "button";
  voltarTopo.innerHTML = "↑";
  voltarTopo.setAttribute(
    "aria-label",
    "Voltar ao topo"
  );
  voltarTopo.title = "Voltar ao topo";
  voltarTopo.style.position = "fixed";
  voltarTopo.style.right = "25px";
  voltarTopo.style.bottom = "25px";
  voltarTopo.style.width = "50px";
  voltarTopo.style.height = "50px";
  voltarTopo.style.borderRadius = "50%";
  voltarTopo.style.border = "none";
  voltarTopo.style.background = "#468C5C";
  voltarTopo.style.color = "white";
  voltarTopo.style.fontSize = "22px";
  voltarTopo.style.fontWeight = "bold";
  voltarTopo.style.cursor = "pointer";
  voltarTopo.style.display = "none";
  voltarTopo.style.zIndex = "999";
  voltarTopo.style.boxShadow =
    "0 5px 15px rgba(0,0,0,.2)";

  document.body.appendChild(voltarTopo);
  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      voltarTopo.style.display = "block";
    } else {
      voltarTopo.style.display = "none";
    }
  });
  voltarTopo.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* Login */
function verificarLogin() {
  const loginForm = document.querySelector("#loginForm");

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.querySelector("#email");
    const senha = document.querySelector("#senha");
    if (!email || !senha) {
      return;
    }

    /* Verifica se os campos foram preenchidos. */
    if (
      email.value.trim() !== "" &&
      senha.value.trim() !== ""
    ) {

      /*Salva o login no navegador. */
      localStorage.setItem(
        "usuarioLogado",
        "true"
      );
      alert("Login realizado com sucesso!");

      /* Volta para a página principal. */
      window.location.href = "site.html";
    } else {
      alert("Preencha o e-mail e a senha.");
    }
  });

}