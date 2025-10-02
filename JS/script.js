async function loadPortfolio() {
  try {
    const response = await fetch("data/data.json");
    const data = await response.json();

    // Header
    document.getElementById("name").textContent = data.header.name;
    document.getElementById("title").textContent = data.header.title;

    

    // Effet fade-in pour les sections au scroll
    function revealOnScroll() {
      const sections = document.querySelectorAll("section");
      const windowBottom = window.innerHeight;
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if(sectionTop < windowBottom - 100) {
          section.classList.add("visible", "animate__animated", "animate__fadeInUp");
        }
      });
    }
    window.addEventListener("scroll", revealOnScroll);
    window.addEventListener("DOMContentLoaded", revealOnScroll);

    // Fonction pour ajouter un titre avec icône à chaque section
    function addSectionTitle(container, title, iconClass) {
      const h2 = document.createElement("h2");
      h2.className = "mb-3";
      h2.id = title.toLowerCase();
      h2.innerHTML = `<i class="${iconClass} me-2"></i> ${title}`;
      container.prepend(h2);
    }

    // About
    const aboutSection = document.getElementById("about");
    addSectionTitle(aboutSection, "À propos", "fas fa-user");
    aboutSection.innerHTML += `
      <div class="card shadow-sm p-4 bg-white">
        <h3>${data.about.title}</h3>
        <p>${data.about.subtitle}</p>
        <p>${data.about.description}</p>
        <p><strong>Objectif :</strong> ${data.about.objective}</p>
        <h5>Intérêts :</h5>
        <ul class="list-group list-group-flush">
          ${data.about.interests.map(i => `<li class="list-group-item">${i}</li>`).join("")}
        </ul>
      </div>
    `;

    // Expériences
    const expContainer = document.getElementById("experiences");
    addSectionTitle(expContainer, "Expériences", "fas fa-briefcase");
    data.experiences.forEach(exp => {
      const card = document.createElement("div");
      card.className = "card mb-4 shadow-sm";
      card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${exp.titre}</h5>
          <h6 class="text-muted"><i class="fas fa-map-marker-alt"></i> ${exp.lieu}</h6>
          <p class="text-muted"><i class="fas fa-calendar-alt"></i> ${exp.date}</p>
          <ul class="list-group list-group-flush">
            ${exp.taches.map(t => `<li class="list-group-item"><i class="fas fa-check-circle text-success me-2"></i>${t}</li>`).join("")}
          </ul>
        </div>
      `;
      expContainer.appendChild(card);
    });

    // Formations (3 par ligne)
    const formContainer = document.getElementById("formations");
    addSectionTitle(formContainer, "Formations", "fas fa-graduation-cap");
    const formRow = document.createElement("div");
    formRow.className = "row g-3";
    data.formations.forEach(f => {
      const col = document.createElement("div");
      col.className = "col-md-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5>${f.titre}</h5>
            <p>${f.ecole}</p>
            <p class="text-muted">${f.date}</p>
          </div>
        </div>
      `;
      formRow.appendChild(col);
    });
    formContainer.appendChild(formRow);

    // Compétences (2 par ligne)
    const compContainer = document.getElementById("competences");
    addSectionTitle(compContainer, "Compétences", "fas fa-lightbulb");
    const compRow = document.createElement("div");
    compRow.className = "row g-3";
    const colors = ["primary","success","danger","warning","info","secondary"];

    Object.entries(data.competences).forEach(([key, items], i) => {
      const col = document.createElement("div");
      col.className = "col-md-6";
      if (typeof items === "object" && !Array.isArray(items)) {
        // Cas : "logiciels & Bases de données" avec sous-titres
        let listHTML = "";
        Object.entries(items).forEach(([subKey, subItems]) => {
          listHTML += `<h6 class="mt-2">${subKey}</h6>`;
          listHTML += `<ul class="list-group list-group-flush mb-2">`;
          subItems.forEach((item, j) => {
            listHTML += `<li class="list-group-item">${item.nom || item}</li>`;
          });
          listHTML += `</ul>`;
        });
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title text-capitalize">${key}</h5>
              ${listHTML}
            </div>
          </div>
        `;
      } else {
        // Cas normal : tableau simple
        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title text-capitalize">${key}</h5>
              <ul class="list-group list-group-flush">
                ${items.map((item,j) => typeof item === "object"
                  ? `<li class="list-group-item d-flex justify-content-between align-items-center">${item.nom} <span class="badge bg-${colors[j%colors.length]} rounded-pill">${item.niveau}</span></li>`
                  : `<li class="list-group-item">${item}</li>`
                ).join("")}
              </ul>
            </div>
          </div>
        `;
      }
      compRow.appendChild(col);
    });
    compContainer.appendChild(compRow);

    // Projets
    if(data.projets) {
      const projetsContainer = document.getElementById("projets");
      addSectionTitle(projetsContainer, "Projets", "fas fa-rocket");
      const row = document.createElement("div");
      row.className = "row g-4";
      projetsContainer.appendChild(row);
      data.projets.forEach(p => {
        const col = document.createElement("div");
        col.className = "col-md-4";
        col.innerHTML = `
          <div class="card h-100 shadow-sm border-info">
            <div class="card-body">
              <h5 class="card-title text-info">${p.titre}</h5>
              <p class="card-text">${p.description}</p>
              <p><strong>Techs:</strong> ${p.technologies.join(", ")}</p>
              <a href="${p.lien}" class="btn btn-outline-info btn-sm" target="_blank">Voir le projet</a>
            </div>
          </div>
        `;
        row.appendChild(col);
      });
    }

    // Contact
    const contactSection = document.getElementById("contact");
    addSectionTitle(contactSection, "Contact", "fas fa-envelope");
    for (const [key, value] of Object.entries(data.contact)) {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = (key === "linkedin" || key === "github")
        ? `<strong>${key} :</strong> <a href="${value}" target="_blank">${value}</a>`
        : `<strong>${key} :</strong> ${value}`;
      contactSection.appendChild(li);
    }

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: true });
          bsCollapse.hide();
        }
      });
    });

  } catch (err) {
    console.error("Erreur lors du chargement du portfolio :", err);
  }
}

window.addEventListener("DOMContentLoaded", loadPortfolio);
