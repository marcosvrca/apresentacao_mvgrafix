(() => {
  const MODULES = [
    {
      id: "dashboard",
      num: "01",
      tag: "Operacional",
      badge: "Mais usado",
      title: "Visão Geral",
      desc: "Painel executivo em tempo real. Monitore produção, orçamentos e saúde financeira em um só lugar.",
      url: "app.mvgrafix.com.br/dashboard",
      image: "screenshots/02-dashboard.png",
      alt: "Dashboard do mvGrafix",
    },
    {
      id: "pedidos",
      num: "02",
      tag: "Operacional",
      title: "Pedidos",
      desc: "Inventário completo de pedidos com grade de tamanhos, detalhes da peça, arte por item e folha de produção.",
      url: "app.mvgrafix.com.br/pedidos",
      image: "screenshots/03-pedidos.png",
      alt: "Lista de pedidos do mvGrafix",
    },
    {
      id: "pipeline",
      num: "03",
      tag: "Operacional",
      title: "Pipeline Kanban",
      desc: "Acompanhe cada peça do novo pedido até a entrega — Impressão, Corte, Costura, Pronto e Entregue.",
      url: "app.mvgrafix.com.br/pipeline",
      image: "screenshots/04-pipeline.png",
      alt: "Pipeline de produção Kanban",
    },
    {
      id: "novo-pedido",
      num: "04",
      tag: "Operacional",
      title: "Novo Pedido",
      desc: "Formulário pensado para produção: produto, detalhes do item, urgência e o que sua operação precisa registrar.",
      url: "app.mvgrafix.com.br/pedidos/novo",
      image: "screenshots/05-novo-pedido.png",
      alt: "Formulário de novo pedido",
    },
    {
      id: "orcamentos",
      num: "05",
      tag: "Comercial",
      title: "Orçamentos",
      desc: "Propostas com PDF profissional, envio via WhatsApp e conversão em pedido de produção com um clique.",
      url: "app.mvgrafix.com.br/orcamentos",
      image: "screenshots/06-orcamentos.png",
      alt: "Módulo de orçamentos",
    },
    {
      id: "vendas",
      num: "06",
      tag: "Comercial",
      title: "Vendas",
      desc: "KPIs comerciais, ticket médio, pedidos em produção, filtros por período e relatórios imprimíveis.",
      url: "app.mvgrafix.com.br/vendas",
      image: "screenshots/07-vendas.png",
      alt: "Módulo de vendas",
    },
    {
      id: "financeiro",
      num: "07",
      tag: "Gestão",
      title: "Financeiro",
      desc: "Receita, despesas, patrimônio, caixa e contas fixas conectados ao fluxo de pedidos.",
      url: "app.mvgrafix.com.br/financeiro",
      image: "screenshots/08-financeiro.png",
      alt: "Módulo financeiro",
    },
    {
      id: "notas",
      num: "08",
      tag: "Gestão",
      title: "Notas Fiscais",
      desc: "Controle de notas de entrada e saída com importação de XML e organização fiscal.",
      url: "app.mvgrafix.com.br/notas-fiscais",
      image: "screenshots/09-notas-fiscais.png",
      alt: "Módulo de notas fiscais",
    },
    {
      id: "admin",
      num: "09",
      tag: "Gestão",
      title: "Admin",
      desc: "Usuários, permissões granulares e configuração das etapas da pipeline de produção.",
      url: "app.mvgrafix.com.br/admin",
      image: "screenshots/10-admin.png",
      alt: "Painel administrativo",
    },
    {
      id: "ia",
      num: "10",
      tag: "Inteligência",
      badge: "Novo",
      title: "Sublime IA",
      desc: "Painel no sistema com leitura de pedidos, orçamentos e financeiro: prazos, funil comercial e o que receber.",
      url: "app.mvgrafix.com.br/ia",
      image: "screenshots/12-ia-full.png",
      alt: "Painel Sublime IA do mvGrafix",
    },
  ];

  let activeModule = 0;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 6000;

  const listEl = document.querySelector(".module-list");
  const thumbsEl = document.getElementById("module-thumbs");
  const tagEl = document.getElementById("module-tag");
  const counterEl = document.getElementById("module-counter");
  const titleEl = document.getElementById("module-title");
  const descEl = document.getElementById("module-desc");
  const urlEl = document.getElementById("module-url");
  const imageEl = document.getElementById("module-image");
  const prevBtn = document.getElementById("module-prev");
  const nextBtn = document.getElementById("module-next");

  function renderModuleList() {
    listEl.innerHTML = MODULES.map((mod, i) => {
      const badge = mod.badge
        ? `<span class="module-item-badge">${mod.badge}</span>`
        : "";
      return `
        <button
          type="button"
          class="module-item${i === activeModule ? " is-active" : ""}"
          role="tab"
          aria-selected="${i === activeModule}"
          data-index="${i}"
        >
          <span class="module-item-num">${mod.num}</span>
          <span class="module-item-body">
            <span class="module-item-title">${mod.title}${badge}</span>
            <span class="module-item-desc">${mod.desc}</span>
          </span>
        </button>
      `;
    }).join("");

    thumbsEl.innerHTML = MODULES.map((mod, i) => `
      <button type="button" class="module-thumb${i === activeModule ? " is-active" : ""}" data-index="${i}" aria-label="${mod.title}"></button>
    `).join("");
  }

  function setModule(index, { restartAutoplay = true } = {}) {
    activeModule = (index + MODULES.length) % MODULES.length;
    const mod = MODULES[activeModule];

    tagEl.textContent = mod.tag;
    counterEl.textContent = `${mod.num} / ${String(MODULES.length).padStart(2, "0")}`;
    titleEl.textContent = mod.title;
    descEl.textContent = mod.desc;
    urlEl.textContent = mod.url;
    imageEl.src = mod.image;
    imageEl.alt = mod.alt;

    listEl.querySelectorAll(".module-item").forEach((btn, i) => {
      const active = i === activeModule;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
    });

    thumbsEl.querySelectorAll(".module-thumb").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === activeModule);
    });

    if (restartAutoplay) startAutoplay();
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = window.setInterval(() => {
      setModule(activeModule + 1, { restartAutoplay: false });
    }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  listEl?.addEventListener("click", (e) => {
    const btn = e.target.closest(".module-item");
    if (!btn) return;
    setModule(Number(btn.dataset.index));
  });

  thumbsEl?.addEventListener("click", (e) => {
    const btn = e.target.closest(".module-thumb");
    if (!btn) return;
    setModule(Number(btn.dataset.index));
  });

  prevBtn?.addEventListener("click", () => setModule(activeModule - 1));
  nextBtn?.addEventListener("click", () => setModule(activeModule + 1));

  document.querySelector(".module-showcase")?.addEventListener("mouseenter", stopAutoplay);
  document.querySelector(".module-showcase")?.addEventListener("mouseleave", startAutoplay);

  /* Typewriter */
  const typeEl = document.querySelector(".typewriter");
  const cursorEl = document.querySelector(".cursor");

  if (typeEl) {
    const words = typeEl.dataset.words.split(",");
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex += 1;
        typeEl.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(tick, 2200);
          return;
        }
        setTimeout(tick, 90);
      } else {
        charIndex -= 1;
        typeEl.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 45);
      }
    }

    setTimeout(tick, 800);
  }

  if (cursorEl) {
    setInterval(() => {
      cursorEl.style.opacity = cursorEl.style.opacity === "0" ? "1" : "0";
    }, 530);
  }

  /* Header scroll + mobile menu */
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  window.addEventListener("scroll", () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  }, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  /* Smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(
    ".card, .flow-steps li, .highlight-shot, .pillar, .module-showcase"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));

  /* Footer year */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  renderModuleList();
  setModule(0, { restartAutoplay: false });
  startAutoplay();
})();
