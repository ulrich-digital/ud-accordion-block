/******/ (() => { // webpackBootstrap
/*!****************************!*\
  !*** ./src/js/frontend.js ***!
  \****************************/
/* =============================================================== *\
   Accordion-Block (finale Version mit Grow/Shrink-Fix)
   Zweck: Interaktive Accordion-Komponente mit animierter Höhe
   Architektur: Bottom-up / selbstbeobachtend
   Reagiert auf:
       - Klicks auf die eigene Toggle-Fläche
       - externe Klassenänderungen (z. B. durch CMS oder JS)
       - Resize-Events innerhalb des Inhalts
   Unterstützt verschachtelte Accordions
   Umsetzung mit max-height und Transition

   Voraussetzungen:
       - Jedes Accordion-Element braucht eine feste Struktur:
         .ud-accordion
           > .ud-accordion__title
           > .ud-accordion__content
             > .ud-accordion__content-inner
\* =============================================================== */

/* =============================================================== *\
   UD Accordion Block – optimierte Version (Firefox Performance Fix)
   - Minimiert Reflows durch gecachtes scrollHeight
   - Throttled ResizeObserver
   - Kürzere, weichere Transition
   - Gleiches Verhalten / API wie bisher
\* =============================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Entferne leere Accordions
  document.querySelectorAll(".ud-accordion").forEach(accordion => {
    const inner = accordion.querySelector(".ud-accordion__content-inner");
    if (!inner) return;
    const contentText = inner.textContent.trim();
    const hasOnlyEmptyBlocks = inner.innerHTML.replace(/<[^\/>][^>]*><\/[^>]+>/gi, "").trim() === "";
    if (contentText === "" || hasOnlyEmptyBlocks) {
      accordion.remove();
    }
  });
  const allAccordions = [...document.querySelectorAll(".ud-accordion")];
  const sortedAccordions = allAccordions.sort((a, b) => a.contains(b) ? 1 : b.contains(a) ? -1 : 0);
  sortedAccordions.forEach((accordion, index) => {
    const toggleArea = accordion.querySelector(":scope > .ud-accordion__title");
    const content = accordion.querySelector(":scope > .ud-accordion__content");
    const icon = accordion.querySelector(":scope > .ud-accordion__title > .ud-accordion__icon");
    if (!toggleArea || !content) {
      console.warn(`[Accordion ${index}] ❌ Ungültige Struktur – wird übersprungen`);
      return;
    }

    // 🧩 Hilfsfunktionen
    const setMaxHeight = (h = null) => {
      const fullHeight = h !== null && h !== void 0 ? h : content.scrollHeight;
      content.style.maxHeight = fullHeight + "px";
    };
    const close = () => content.style.maxHeight = "0px";
    const updateState = () => {
      const isOpen = accordion.classList.contains("is-open");
      toggleArea.setAttribute("aria-expanded", String(isOpen));
      icon?.classList.toggle("is-open", isOpen);
      if (isOpen) setMaxHeight();else close();
    };
    const updateAncestors = (element, childHeight = null) => {
      let parent = element.parentElement;
      while (parent) {
        if (parent.classList.contains("ud-accordion") && parent.classList.contains("is-open")) {
          const parentContent = parent.querySelector(":scope > .ud-accordion__content");
          if (parentContent) {
            const h = parentContent.scrollHeight;
            parentContent.style.maxHeight = h + "px";
          }
        }
        parent = parent.parentElement;
      }
    };

    // 🧠 Klick-Handler
    toggleArea.addEventListener("click", e => {
      e.preventDefault();
      const isOpen = accordion.classList.toggle("is-open");
      if (isOpen) {
        const h = content.scrollHeight;
        setMaxHeight(h);
        updateAncestors(accordion, h);
      } else {
        close();
        updateAncestors(accordion);
      }
    });

    // 🧩 MutationObserver (externe Klassenänderungen)
    const mutationObserver = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "class") {
          updateState();
          updateAncestors(accordion);
        }
      }
    });
    mutationObserver.observe(accordion, {
      attributes: true
    });

    // 🧩 ResizeObserver – throttled (Firefox-friendly)
    let resizeTimeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (accordion.classList.contains("is-open")) {
          const h = content.scrollHeight;
          setMaxHeight(h);
          updateAncestors(accordion, h);
        }
      }, 80);
    });
    resizeObserver.observe(content);
    updateState();
  });

  /* === FluentForm-Integration: Accordion-Höhenanpassung === */
  /* === FluentForm-Integration: stabile Accordion-Höhenanpassung === */

  // 🔹 Funktion zur Neuberechnung aller offenen Accordions
  const recalcAllAccordions = () => {
    document.querySelectorAll(".ud-accordion.is-open").forEach(accordion => {
      const content = accordion.querySelector(":scope > .ud-accordion__content");
      if (content) {
        content.style.maxHeight = content.scrollHeight + "px";

        // Verschachtelte Eltern mitaktualisieren
        let parent = accordion.parentElement;
        while (parent) {
          if (parent.classList.contains("ud-accordion") && parent.classList.contains("is-open")) {
            const parentContent = parent.querySelector(":scope > .ud-accordion__content");
            if (parentContent) {
              parentContent.style.maxHeight = parentContent.scrollHeight + "px";
            }
          }
          parent = parent.parentElement;
        }
      }
    });
  };

  // 🔹 Stabiler Beobachter (Polling für max. 1 Sekunde)
  const triggerAccordionRecalc = () => {
    let elapsed = 0;
    const interval = setInterval(() => {
      recalcAllAccordions();
      elapsed += 100;
      if (elapsed >= 1000) clearInterval(interval);
    }, 100);
  };

  // 🔹 Klicks auf Next/Prev in FluentForm
  document.addEventListener("click", e => {
    if (e.target.closest(".ff-btn-next") || e.target.closest(".ff-btn-prev")) {
      triggerAccordionRecalc();
    }
  });

  // 🔹 Reaktion auf Radio-/Checkbox-Wechsel in FluentForm
  document.addEventListener("change", e => {
    if (e.target.closest(".fluentform")) {
      triggerAccordionRecalc();
    }
  });
});
/******/ })()
;
//# sourceMappingURL=frontend-script.js.map