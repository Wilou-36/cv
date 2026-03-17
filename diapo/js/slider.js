document.addEventListener("DOMContentLoaded", () => {

  /* 🎬 SLIDER */
  let index = 0;
  const slides = document.querySelectorAll(".slide-img");

  function showSlide(i) {
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
  }

  document.getElementById("next").onclick = () => {
    index = (index + 1) % slides.length;
    showSlide(index);
  };

  document.getElementById("prev").onclick = () => {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  };

  /* 🍩 GRAPH PROJET */
  const ctx = document.getElementById('projectChart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Frontend', 'Backend', 'Database'],
      datasets: [{
        data: [30, 50, 20],
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#10b981'
        ]
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

});