/**
 * Presentación Interactiva: Aprende Git desde Antigravity con Azure Repos
 * Lógica de navegación, interactividad y evaluación
 */

document.addEventListener('DOMContentLoaded', () => {
  // Estado de navegación
  let currentSlide = 1;
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;

  // Elementos UI
  const prevBtn = document.getElementById('btn-prev-slide');
  const nextBtn = document.getElementById('btn-next-slide');
  const currentNumEl = document.getElementById('current-slide-num');
  const totalNumEl = document.getElementById('total-slides-num');
  const progressBar = document.getElementById('progress-bar-fill');

  // Modales
  const overviewBtn = document.getElementById('btn-overview');
  const overviewModal = document.getElementById('overview-modal');
  const closeOverviewBtn = document.getElementById('btn-close-overview');
  const overviewGrid = document.getElementById('overview-grid');

  const shortcutsBtn = document.getElementById('btn-shortcuts');
  const shortcutsModal = document.getElementById('shortcuts-modal');
  const closeShortcutsBtn = document.getElementById('btn-close-shortcuts');
  const fullscreenBtn = document.getElementById('btn-fullscreen');

  // Inicialización de números
  if (totalNumEl) totalNumEl.textContent = totalSlides;

  // Función principal para cambiar de diapositiva
  function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;

    currentSlide = slideNumber;

    // Actualizar clases de diapositivas
    slides.forEach((slide) => {
      const idx = parseInt(slide.getAttribute('data-index'), 10);
      if (idx === currentSlide) {
        slide.classList.add('active');
        slide.scrollTop = 0;
      } else {
        slide.classList.remove('active');
      }
    });

    // Actualizar barra de progreso y número de diapositiva
    if (currentNumEl) currentNumEl.textContent = currentSlide;
    if (progressBar) {
      const percent = (currentSlide / totalSlides) * 100;
      progressBar.style.width = `${percent}%`;
    }

    // Actualizar botones de navegación
    if (prevBtn) prevBtn.disabled = currentSlide === 1;
    if (nextBtn) {
      if (currentSlide === totalSlides) {
        nextBtn.innerHTML = `
          Completado
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
      } else {
        nextBtn.innerHTML = `
          Siguiente
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        `;
      }
    }

    // Actualizar selección en el modal de vista general
    document.querySelectorAll('.overview-card').forEach((card) => {
      const cardIdx = parseInt(card.getAttribute('data-target-slide'), 10);
      card.classList.toggle('active', cardIdx === currentSlide);
    });
  }

  function nextSlide() {
    if (currentSlide < totalSlides) {
      goToSlide(currentSlide + 1);
    }
  }

  function prevSlide() {
    if (currentSlide > 1) {
      goToSlide(currentSlide - 1);
    }
  }

  // Eventos de botones de navegación
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlide === totalSlides) {
        // Al final, abrir resumen general
        overviewModal.classList.add('open');
      } else {
        nextSlide();
      }
    });
  }

  // Teclado
  document.addEventListener('keydown', (e) => {
    // Si algún modal está abierto y se presiona Escape, cerrarlo
    if (e.key === 'Escape') {
      overviewModal.classList.remove('open');
      shortcutsModal.classList.remove('open');
      return;
    }

    // Si los modales están abiertos, evitar cambiar de diapositiva con flechas
    if (overviewModal.classList.contains('open') || shortcutsModal.classList.contains('open')) {
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'Space':
      case 'PageDown':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'g':
      case 'G':
        overviewModal.classList.toggle('open');
        break;
      case '?':
        shortcutsModal.classList.toggle('open');
        break;
    }
  });

  // Gestos táctiles (Swipe)
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 60) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
  }

  // Pantalla Completa
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }
  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Modales
  if (overviewBtn) {
    overviewBtn.addEventListener('click', () => overviewModal.classList.add('open'));
  }
  if (closeOverviewBtn) {
    closeOverviewBtn.addEventListener('click', () => overviewModal.classList.remove('open'));
  }

  if (shortcutsBtn) {
    shortcutsBtn.addEventListener('click', () => shortcutsModal.classList.add('open'));
  }
  if (closeShortcutsBtn) {
    closeShortcutsBtn.addEventListener('click', () => shortcutsModal.classList.remove('open'));
  }

  // Generar tarjetas para el modal de vista general
  slides.forEach((slide) => {
    const idx = slide.getAttribute('data-index');
    let title = `Diapositiva ${idx}`;
    const h1 = slide.querySelector('h1');
    const h2 = slide.querySelector('h2');
    if (h1) title = h1.textContent;
    else if (h2) title = h2.textContent;

    const card = document.createElement('div');
    card.className = `overview-card ${idx == 1 ? 'active' : ''}`;
    card.setAttribute('data-target-slide', idx);
    card.innerHTML = `
      <div class="overview-card-num">DIAPOSITIVA ${idx.padStart(2, '0')}</div>
      <div class="overview-card-title">${title}</div>
    `;

    card.addEventListener('click', () => {
      goToSlide(parseInt(idx, 10));
      overviewModal.classList.remove('open');
    });

    overviewGrid.appendChild(card);
  });

  // Botones de copiar código
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-clipboard');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ¡Copiado!
          `;
          btn.style.background = '#10b981';
          btn.style.color = '#ffffff';

          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
          }, 1800);
        });
      }
    });
  });

  // Interacción en la Slide 2: Ciclo de vida de Git
  const zoneDetails = {
    workdir: {
      title: "1. Directorio de Trabajo (Working Directory)",
      desc: "Aquí es donde editas activamente tus archivos en Antigravity. Los archivos modificados aún no están listos para ser guardados. Usa 'git status' para identificarlos y 'git diff' para revisar exactamente qué líneas cambiaron."
    },
    staging: {
      title: "2. Área de Preparación (Staging Area / Index)",
      desc: "Actúa como un filtro selectivo previo al guardado. Con 'git add <archivo>' seleccionas cuidadosamente qué cambios específicos formarán parte del siguiente commit, permitiendo commits atómicos y limpios."
    },
    local: {
      title: "3. Repositorio Local (.git / HEAD)",
      desc: "Al ejecutar 'git commit -m \"...\"', Git toma una fotografía inmutable de los archivos en staging y la guarda de forma definitiva en la base de datos local de tu máquina. Ya está seguro localmente."
    },
    azure: {
      title: "4. Azure Repos (Repositorio Remoto)",
      desc: "El destino en la nube de Azure DevOps. Mediante 'git push origin <rama>', subes tus commits para que tu equipo pueda revisarlos, vincularlos con Work Items de Azure Boards y detonar Pipelines de CI/CD."
    }
  };

  const zoneCards = document.querySelectorAll('.git-zone-card');
  const zoneTitleEl = document.getElementById('zone-detail-title');
  const zoneDescEl = document.getElementById('zone-detail-desc');
  const zonesArray = ['workdir', 'staging', 'local', 'azure'];
  let currentZoneIndex = 0;

  zoneCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      selectZone(index);
    });
  });

  function selectZone(index) {
    currentZoneIndex = index;
    const zoneKey = zonesArray[index];
    const data = zoneDetails[zoneKey];

    zoneCards.forEach((c) => c.classList.remove('selected'));
    zoneCards[index].classList.add('selected');

    if (zoneTitleEl && zoneDescEl && data) {
      zoneTitleEl.style.opacity = '0';
      zoneDescEl.style.opacity = '0';
      setTimeout(() => {
        zoneTitleEl.textContent = data.title;
        zoneDescEl.textContent = data.desc;
        zoneTitleEl.style.opacity = '1';
        zoneDescEl.style.opacity = '1';
      }, 150);
    }
  }

  window.highlightNextZone = function () {
    currentZoneIndex = (currentZoneIndex + 1) % zonesArray.length;
    selectZone(currentZoneIndex);
  };

  // Interacción en la Slide 9: Quiz Interactivo
  let score = 0;
  const answeredQuestions = new Set();
  const scoreEl = document.getElementById('quiz-score');
  const resetQuizBtn = document.getElementById('btn-reset-quiz');

  document.querySelectorAll('.quiz-card').forEach((card) => {
    const qId = card.getAttribute('data-question');
    const options = card.querySelectorAll('.quiz-btn');

    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (answeredQuestions.has(qId)) return; // No permitir cambiar respuesta

        answeredQuestions.add(qId);
        const isCorrect = btn.getAttribute('data-correct') === 'true';

        if (isCorrect) {
          btn.classList.add('correct');
          score++;
        } else {
          btn.classList.add('incorrect');
          // Resaltar la correcta para aprendizaje
          options.forEach((o) => {
            if (o.getAttribute('data-correct') === 'true') {
              o.classList.add('correct');
            }
          });
        }

        // Deshabilitar botones de esta pregunta
        options.forEach((o) => {
          o.style.cursor = 'default';
        });

        if (scoreEl) scoreEl.textContent = score;
      });
    });
  });

  if (resetQuizBtn) {
    resetQuizBtn.addEventListener('click', () => {
      score = 0;
      answeredQuestions.clear();
      if (scoreEl) scoreEl.textContent = '0';

      document.querySelectorAll('.quiz-btn').forEach((btn) => {
        btn.classList.remove('correct', 'incorrect');
        btn.style.cursor = 'pointer';
      });
    });
  }

  // Inicializar en la diapositiva 1
  goToSlide(1);
});
