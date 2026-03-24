document.addEventListener("DOMContentLoaded", () => {

  const prev = document.querySelector(".nav a:first-child");
  const next = document.querySelector(".nav a:last-child");

  document.body.classList.add("fade-in");

  function navigate(url) {
    document.body.classList.remove("fade-in");
    document.body.classList.add("fade-out");
    setTimeout(() => { window.location.href = url; }, 300);
  }

  /* Navigation clavier (flèches + F pour plein écran) */
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" && next) navigate(next.href);
    if (e.key === "ArrowLeft" && prev) navigate(prev.href);
    if (e.key === "f") {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }
  });

  /* Clic avec animation */
  document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(link.href);
    });
  });

});
