document.addEventListener("DOMContentLoaded", () => {

  // 🎬 animation barres
  const bars = document.querySelectorAll(".fill");

  setTimeout(() => {
    bars.forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  }, 400);

  // 🍩 graphique premium
  const ctx = document.getElementById('skillsChart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['HTML/CSS', 'JS', 'PHP', 'SQL', 'Python', 'Git'],
      datasets: [{
        data: [60, 32, 50, 60, 30, 58],
        backgroundColor: [
          '#3b82f6',
          '#06b6d4',
          '#8b5cf6',
          '#10b981',
          '#f59e0b',
          '#ef4444'
        ],
        hoverOffset: 10,
        borderWidth: 0
      }]
    },
    options: {
      cutout: '70%',
      animation: {
        animateRotate: true,
        duration: 1400
      },

      plugins: {
        legend: {
          display: false // ✅ SUPPRIME la légende
        }
      }

    }
  });

});