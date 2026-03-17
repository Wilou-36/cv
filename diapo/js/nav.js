document.addEventListener("DOMContentLoaded", () => {

  // 🔗 récupérer les liens
  const prev = document.querySelector(".nav a:first-child");
  const next = document.querySelector(".nav a:last-child");

  // animation entrée
  document.body.classList.add("fade-in");

  // navigation clavier
  document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowRight" && next) {
      navigate(next.href);
    }

    if (e.key === "ArrowLeft" && prev) {
      navigate(prev.href);
    }

  });

  function navigate(url) {
    document.body.classList.remove("fade-in");
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = url;
    }, 350);
  }

  document.querySelectorAll(".diapo-nav a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(link.href);
    });
  });

  // 🎬 animation au chargement
  document.body.classList.add("fade-in");

  // ⌨️ navigation clavier
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && next) {
      navigate(next.href);
    }
    if (e.key === "ArrowLeft" && prev) {
      navigate(prev.href);
    }
  });

  // 🔁 animation + redirection
  function navigate(url) {
    document.body.classList.remove("fade-in");
    document.body.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }

  // 🖱️ clic avec animation
  document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(link.href);
    });
  });

});