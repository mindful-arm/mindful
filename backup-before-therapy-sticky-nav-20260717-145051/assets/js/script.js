document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const countryPicker = document.getElementById("countryPicker");
  const countryButton = document.getElementById("countryPickerButton");
  const countryCurrent = document.getElementById("countryPickerCurrent");
  const countryCode = document.getElementById("countryCode");
  const phoneInput = document.getElementById("phone");
  const countryOptions = document.querySelectorAll(".country-option");
  const formStatus = document.getElementById("formStatus");
  const submitButton = document.getElementById("contactSubmit");

  const localLengthRules = {
    "+374": [8],
    "+7": [10],
    "+1": [10],
    "+44": [10],
    "+33": [9],
    "+49": [10, 11],
    "+39": [9, 10],
    "+34": [9],
    "+31": [9],
    "+32": [9],
    "+41": [9],
    "+43": [10, 11],
    "+46": [9],
    "+47": [8],
    "+45": [8],
    "+358": [9, 10],
    "+48": [9],
    "+420": [9],
    "+30": [10],
    "+357": [8],
    "+995": [9],
    "+971": [9],
    "+972": [9],
    "+91": [10],
    "+86": [11],
    "+81": [10],
    "+82": [10],
    "+61": [9],
    "+64": [8, 9],
    "+55": [10, 11],
    "+52": [10]
  };

  function onlyDigits(value) {
    return value.replace(/\D/g, "");
  }

  function showStatus(type, text) {
    formStatus.className = "form-status " + (type === "success" ? "is-success" : "is-error");
    formStatus.textContent = text;
  }

  function clearStatus() {
    formStatus.className = "form-status";
    formStatus.textContent = "";
  }

  function setError(inputId, message) {
    const input = document.getElementById(inputId);
    const row = input.closest(".form-row");
    const error = document.getElementById(inputId + "Error");

    if (message) {
      row.classList.add("has-error");
      error.textContent = message;
      return false;
    }

    row.classList.remove("has-error");
    error.textContent = "";
    return true;
  }

  function validateName() {
    const value = document.getElementById("name").value.trim();
    if (!value) return setError("name", "Այս դաշտը պարտադիր է։");
    if (value.length < 2) return setError("name", "Խնդրում ենք գրել առնվազն 2 նիշ։");
    return setError("name", "");
  }

  function validatePhone() {
    const code = countryCode.value;
    const raw = phoneInput.value.trim();
    const digits = onlyDigits(raw);
    const active = document.querySelector(".country-option.is-active");
    const example = active ? active.dataset.placeholder : "";
    const allowed = localLengthRules[code] || [7, 8, 9, 10, 11, 12];

    if (!raw) return setError("phone", "Այս դաշտը պարտադիր է։");

    if (!/^[0-9\s\-()]+$/.test(raw)) {
      return setError("phone", "Հեռախոսահամարը կարող է պարունակել միայն թվեր։");
    }

    if (!allowed.includes(digits.length)) {
      return setError("phone", "Սխալ հեռախոսահամարի ֆորմատ։ Օրինակ՝ " + code + " " + example);
    }

    return setError("phone", "");
  }

  function validateEmail() {
    const value = document.getElementById("email").value.trim();

    if (!value) {
      return setError("email", "Այս դաշտը պարտադիր է։");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return setError("email", "Խնդրում ենք գրել ճիշտ էլ․ հասցե։");
    }

    return setError("email", "");
  }

  function validateMessage() {
    const value = document.getElementById("message").value.trim();
    if (!value) return setError("message", "Այս դաշտը պարտադիր է։");
    if (value.length < 5) return setError("message", "Խնդրում ենք գրել մի փոքր ավելի մանրամասն։");
    return setError("message", "");
  }

  countryButton.addEventListener("click", function (event) {
    event.preventDefault();
    event.stopPropagation();

    countryPicker.classList.toggle("is-open");

    const isOpen = countryPicker.classList.contains("is-open");
    countryButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  countryOptions.forEach(function (option) {
    option.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      countryOptions.forEach(function (item) {
        item.classList.remove("is-active");
      });

      option.classList.add("is-active");
      countryCode.value = option.dataset.code;
      countryCurrent.textContent = option.dataset.label || option.textContent.trim();
      phoneInput.placeholder = option.dataset.placeholder || "";
      countryPicker.classList.remove("is-open");
      countryButton.setAttribute("aria-expanded", "false");

      if (phoneInput.value.trim()) validatePhone();
    });
  });

  document.addEventListener("click", function (event) {
    if (!countryPicker.contains(event.target)) {
      countryPicker.classList.remove("is-open");
      countryButton.setAttribute("aria-expanded", "false");
    }
  });

  phoneInput.addEventListener("input", function () {
    phoneInput.value = phoneInput.value.replace(/[^\d\s\-()]/g, "");
  });

  ["name", "phone", "email", "message"].forEach(function (id) {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("blur", function () {
      if (id === "name") validateName();
      if (id === "phone") validatePhone();
      if (id === "email") validateEmail();
      if (id === "message") validateMessage();
    });
  });

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearStatus();

    const valid = Boolean(
      validateName() &
      validatePhone() &
      validateEmail() &
      validateMessage()
    );

    if (!valid) return;

    submitButton.disabled = true;
    submitButton.textContent = "Ուղարկվում է...";

    const name = document.getElementById("name").value.trim();
    const code = countryCode.value;
    const phone = phoneInput.value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const formData = new FormData();
    formData.append("Անուն", name);
    formData.append("Հեռախոս", code + " " + phone);
    formData.append("Էլ․ հասցե", email);
    formData.append("Հաղորդագրություն", message);
    formData.append("_subject", "Նոր հաղորդագրություն Mindful Armenia կայքից");

    try {
      const response = await fetch("https://formspree.io/f/xrewvynj", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        contactForm.reset();
        countryCode.value = "+374";
        countryCurrent.textContent = "🇦🇲 ARM +374";
        phoneInput.placeholder = "44 18 1230";

        countryOptions.forEach(function (item) {
          item.classList.remove("is-active");
        });

        const armOption = document.querySelector('.country-option[data-code="+374"]');
        if (armOption) armOption.classList.add("is-active");

        showStatus("success", "Շնորհակալություն։ Ձեր հաղորդագրությունը հաջողությամբ ուղարկվեց։ Մենք կկապվենք ձեզ հետ հնարավորինս շուտ։");
      } else {
        showStatus("error", "Չհաջողվեց ուղարկել հաղորդագրությունը։ Խնդրում ենք փորձել կրկին կամ կապ հաստատել հեռախոսով։");
      }
    } catch (error) {
      showStatus("error", "Չհաջողվեց ուղարկել հաղորդագրությունը։ Խնդրում ենք ստուգել ինտերնետ կապը և փորձել կրկին։");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Ուղարկել";
    }
  });
});















































/* Stable SPA transition fixed relative assets */
(function () {
  const navOrder = [
    "index.html",
    "team.html",
    "services.html",
    "therapies.html",
    "problems.html",
    "corporate.html",
    "contact.html"
  ];

  let isTransitioning = false;

  function basePath() {
    const path = window.location.pathname;

    if (path.startsWith("/mindful/")) {
      return "/mindful";
    }

    return "";
  }

  function normalizeUrl(value, baseUrl) {
    const url = new URL(value, baseUrl || window.location.href);
    const base = basePath();

    if (url.origin !== window.location.origin) {
      return url.href;
    }

    if (!base) {
      return url.href;
    }

    if (url.pathname.startsWith(base + "/")) {
      return url.href;
    }

    if (
      url.pathname.startsWith("/am/") ||
      url.pathname.startsWith("/en/") ||
      url.pathname.startsWith("/assets/")
    ) {
      url.pathname = base + url.pathname;
      return url.href;
    }

    return url.href;
  }

  function absolutizeLinks(scope, documentUrl) {
    const root = scope || document;

    root.querySelectorAll("a[href], img[src], script[src], link[href], source[src], video[src]").forEach(function (el) {
      const attr = el.hasAttribute("href") ? "href" : "src";
      const value = el.getAttribute(attr);

      if (!value) return;

      if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("mailto:") ||
        value.startsWith("tel:") ||
        value.startsWith("tg:") ||
        value.startsWith("whatsapp:") ||
        value.startsWith("sms:") ||
        value.startsWith("#") ||
        value.startsWith("javascript:") ||
        value.startsWith("data:")
      ) {
        return;
      }

      el.setAttribute(attr, normalizeUrl(value, documentUrl));
    });
  }

  function pageName(value) {
    const url = new URL(normalizeUrl(value), window.location.href);
    let page = url.pathname.split("/").pop();

    if (!page || page === "am" || page === "en" || page === "mindful") {
      page = "index.html";
    }

    return page;
  }

  function directionTo(targetHref) {
    const currentPage = pageName(window.location.href);
    const targetPage = pageName(targetHref);

    const currentIndex = navOrder.indexOf(currentPage);
    const targetIndex = navOrder.indexOf(targetPage);

    if (currentIndex === -1 || targetIndex === -1) {
      return "forward";
    }

    return targetIndex > currentIndex ? "forward" : "backward";
  }

  function isAllowedLink(link) {
    if (!link || !link.href) return false;
    if (link.classList && link.classList.contains("lang-switch")) return false;
    if (link.target === "_blank") return false;
    if (link.hasAttribute("download")) return false;

    const url = new URL(normalizeUrl(link.href), window.location.href);

    if (url.origin !== window.location.origin) return false;
    if (url.href === window.location.href) return false;
    if (url.hash && url.pathname === window.location.pathname) return false;

    return navOrder.includes(pageName(url.href));
  }

  function bindLinks() {
    document.querySelectorAll(".main-nav a").forEach(function (link) {
      if (link.dataset.stableSpaAssetsBound === "1") return;

      link.dataset.stableSpaAssetsBound = "1";

      link.addEventListener("click", function (event) {
        if (!isAllowedLink(link)) return;

        event.preventDefault();
        transitionTo(link.href);
      });
    });
  }

  function setActiveNav(targetHref) {
    const targetPage = pageName(targetHref);

    document.querySelectorAll(".main-nav a").forEach(function (link) {
      link.classList.toggle("active", pageName(link.href) === targetPage);
    });
  }

  function cleanupFreeze() {
    isTransitioning = false;
    document.body.classList.remove("spa-slide-running");

    document.querySelectorAll(".spa-slide-stage").forEach(function (stage) {
      stage.remove();
    });
  }

  function syncHeader(nextDoc, targetHref) {
    const currentHeader = document.querySelector(".site-header");
    const nextHeader = nextDoc.querySelector(".site-header");

    if (!currentHeader || !nextHeader) return;

    absolutizeLinks(nextHeader, targetHref);
    currentHeader.innerHTML = nextHeader.innerHTML;
  }

  function runPageScripts() {
    
    if (typeof window.mindfulReloadVideos === "function") {
      window.mindfulReloadVideos();
    }

    absolutizeLinks(document, window.location.href);
    bindLinks();

    if (typeof window.initContactForm === "function") {
      window.initContactForm();
    }
  }

  async function transitionTo(targetHref) {
    targetHref = normalizeUrl(targetHref);

    if (isTransitioning) return;
    isTransitioning = true;

    const currentMain = document.querySelector("main");
    const header = document.querySelector(".site-header");

    if (!currentMain) {
      window.location.href = targetHref;
      return;
    }

    let nextDoc;
    let nextMain;

    try {
      const response = await fetch(targetHref, {
        credentials: "same-origin",
        cache: "no-cache"
      });

      if (!response.ok) throw new Error("fetch failed");

      const text = await response.text();
      nextDoc = new DOMParser().parseFromString(text, "text/html");

      absolutizeLinks(nextDoc, targetHref);

      nextMain = nextDoc.querySelector("main");

      if (!nextMain) throw new Error("next main missing");
    } catch (error) {
      cleanupFreeze();
      window.location.href = targetHref;
      return;
    }

    const direction = directionTo(targetHref);
    const headerBottom = header ? Math.round(header.getBoundingClientRect().bottom) : 147;
    const width = window.innerWidth;

    const oldEnd = direction === "forward" ? -width : width;
    const newStart = direction === "forward" ? width : -width;

    const stage = document.createElement("div");
    stage.className = "spa-slide-stage";
    stage.style.setProperty("--spa-slide-top", headerBottom + "px");

    const oldPanel = document.createElement("div");
    oldPanel.className = "spa-slide-panel";
    oldPanel.style.transform = "translate3d(0, 0, 0)";
    oldPanel.appendChild(currentMain.cloneNode(true));

    const newPanel = document.createElement("div");
    newPanel.className = "spa-slide-panel";
    newPanel.style.transform = "translate3d(" + newStart + "px, 0, 0)";
    newPanel.appendChild(nextMain.cloneNode(true));

    stage.appendChild(oldPanel);
    stage.appendChild(newPanel);
    document.body.appendChild(stage);
    document.body.classList.add("spa-slide-running");

    const safetyTimer = window.setTimeout(function () {
      cleanupFreeze();
      window.location.href = targetHref;
    }, 2600);

    await new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(resolve);
      });
    });

    const options = {
      duration: 720,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards"
    };

    try {
      const oldAnim = oldPanel.animate(
        [
          { transform: "translate3d(0, 0, 0)" },
          { transform: "translate3d(" + oldEnd + "px, 0, 0)" }
        ],
        options
      );

      const newAnim = newPanel.animate(
        [
          { transform: "translate3d(" + newStart + "px, 0, 0)" },
          { transform: "translate3d(0, 0, 0)" }
        ],
        options
      );

      await Promise.all([
        oldAnim.finished.catch(function () {}),
        newAnim.finished.catch(function () {})
      ]);
    } catch (error) {
      window.clearTimeout(safetyTimer);
      cleanupFreeze();
      window.location.href = targetHref;
      return;
    }

    window.clearTimeout(safetyTimer);

    currentMain.replaceWith(nextMain.cloneNode(true));
    syncHeader(nextDoc, targetHref);

    if (nextDoc.title) {
      document.title = nextDoc.title;
    }

    history.pushState({}, "", targetHref);
    setActiveNav(targetHref);

    stage.remove();
    document.body.classList.remove("spa-slide-running");

    window.scrollTo(0, 0);
    runPageScripts();

    if (typeof window.mindfulReloadVideos === "function") {
      window.mindfulReloadVideos();
    }

    isTransitioning = false;
  }

  window.addEventListener("popstate", function () {
    window.location.reload();
  });

  document.addEventListener("DOMContentLoaded", function () {
    absolutizeLinks(document, window.location.href);
    bindLinks();
    setActiveNav(window.location.href);
  });
})();


/* Strict contact form validation */
(function () {
  function isContactForm(form) {
    if (!form) return false;

    return (
      form.id === "contactForm" ||
      form.matches('form[action*="formspree"], form[data-contact-form], form.contact-form')
    );
  }

  function setFieldError(field, message) {
    if (!field) return;

    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");

    let error = field.parentElement ? field.parentElement.querySelector(".field-error") : null;

    if (!error && field.parentElement) {
      error = document.createElement("div");
      error.className = "field-error";
      field.parentElement.appendChild(error);
    }

    if (error) {
      error.textContent = message;
    }
  }

  function clearErrors(form) {
    form.querySelectorAll(".is-invalid").forEach(function (field) {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
    });

    form.querySelectorAll(".field-error").forEach(function (error) {
      error.textContent = "";
    });
  }

  function validateContactForm(form) {
    clearErrors(form);

    const lang = document.documentElement.lang === "en" ? "en" : "am";

    const messages = {
      am: {
        name: "Անունը պարտադիր է։",
        phone: "Հեռախոսահամարը պարտադիր է։",
        email: "Էլ․ հասցեն պարտադիր է։",
        emailInvalid: "Խնդրում ենք գրել ճիշտ էլ․ հասցե։",
        message: "Հաղորդագրությունը պարտադիր է։"
      },
      en: {
        name: "Name is required.",
        phone: "Phone number is required.",
        email: "Email address is required.",
        emailInvalid: "Please enter a valid email address.",
        message: "Message is required."
      }
    };

    const m = messages[lang];

    const nameField = form.querySelector('[name="name"], #name');
    const phoneField = form.querySelector('[name="phone"], #phone');
    const emailField = form.querySelector('[name="email"], #email');
    const messageField = form.querySelector('[name="message"], #message, textarea');

    const name = nameField ? nameField.value.trim() : "";
    const phone = phoneField ? phoneField.value.trim() : "";
    const email = emailField ? emailField.value.trim() : "";
    const message = messageField ? messageField.value.trim() : "";

    let valid = true;

    if (!name) {
      setFieldError(nameField, m.name);
      valid = false;
    }

    if (!phone) {
      setFieldError(phoneField, m.phone);
      valid = false;
    }

    if (!email) {
      setFieldError(emailField, m.email);
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError(emailField, m.emailInvalid);
      valid = false;
    }

    if (!message) {
      setFieldError(messageField, m.message);
      valid = false;
    }

    if (!valid) {
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: false });
      }
    }

    return valid;
  }

  document.addEventListener("submit", function (event) {
    const form = event.target;

    if (!isContactForm(form)) return;

    if (!validateContactForm(form)) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      return false;
    }
  }, true);

  document.addEventListener("input", function (event) {
    const field = event.target;
    const form = field && field.form;

    if (!isContactForm(form)) return;

    if (field.value && field.value.trim()) {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");

      const error = field.parentElement ? field.parentElement.querySelector(".field-error") : null;
      if (error) {
        error.textContent = "";
      }
    }
  }, true);
})();


/* Floating contact scroll animation */
(function () {
  let lastY = window.scrollY || 0;
  let ticking = false;
  let resetTimer = null;

  function updateFloatingContactDirection() {
    const currentY = window.scrollY || 0;
    const diff = currentY - lastY;

    if (Math.abs(diff) > 4) {
      document.body.classList.toggle("floating-contact-scroll-down", diff > 0);
      document.body.classList.toggle("floating-contact-scroll-up", diff < 0);
      lastY = currentY;

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        document.body.classList.remove("floating-contact-scroll-down");
        document.body.classList.remove("floating-contact-scroll-up");
      }, 650);
    }

    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateFloatingContactDirection);
      ticking = true;
    }
  }, { passive: true });
})();


/* SPA video reload fix */
(function () {
  function reloadAndPlayVideos(scope) {
    const root = scope || document;

    root.querySelectorAll("video").forEach(function (video) {
      try {
        video.muted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("autoplay", "");
        video.setAttribute("loop", "");

        video.querySelectorAll("source").forEach(function (source) {
          const src = source.getAttribute("src");
          if (!src) return;

          const cleanSrc = src.split("?")[0];
          const version = Date.now();

          if (cleanSrc.endsWith(".mp4")) {
            source.setAttribute("src", cleanSrc + "?v=" + version);
          }
        });

        video.load();

        const playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      } catch (e) {}
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    reloadAndPlayVideos(document);
  });

  window.addEventListener("pageshow", function () {
    reloadAndPlayVideos(document);
  });

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (node) {
        if (!node || node.nodeType !== 1) return;

        if (node.matches && node.matches("video")) {
          reloadAndPlayVideos(node.parentElement || document);
        }

        if (node.querySelectorAll && node.querySelectorAll("video").length) {
          reloadAndPlayVideos(node);
        }
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.mindfulReloadVideos = function () {
    reloadAndPlayVideos(document);
  };
})();

















/* Home FAQ reliable one open final */
(function () {
  function bindReliableFaq() {
    document.querySelectorAll(".home-faq-item").forEach(function (item) {
      const summary = item.querySelector("summary");
      const answer = item.querySelector(".home-faq-answer");

      if (!summary || !answer) return;

      answer.style.maxHeight = "";
      answer.style.height = "";
      answer.style.overflow = "";

      if (item.dataset.reliableFaqBound === "true") return;
      item.dataset.reliableFaqBound = "true";

      summary.addEventListener("click", function () {
        setTimeout(function () {
          if (!item.open) return;

          document.querySelectorAll(".home-faq-item").forEach(function (other) {
            if (other !== item) {
              other.open = false;

              const otherAnswer = other.querySelector(".home-faq-answer");
              if (otherAnswer) {
                otherAnswer.style.maxHeight = "";
                otherAnswer.style.height = "";
                otherAnswer.style.overflow = "";
              }
            }
          });

          answer.style.maxHeight = "";
          answer.style.height = "";
          answer.style.overflow = "";
        }, 0);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", bindReliableFaq);
  window.addEventListener("pageshow", bindReliableFaq);

  const observer = new MutationObserver(function () {
    bindReliableFaq();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();

/* THERAPY_SIDE_NAV_V2_START */

(function () {
  const navSelector = ".therapy-detail-side-nav";
  const linkSelector = navSelector + ' a[href^="#"]';

  let scrollTicking = false;
  let mutationTimer = null;

  function getHeaderOffset() {
    const header = document.querySelector(".site-header");

    if (!header) {
      return 28;
    }

    const position = window.getComputedStyle(header).position;

    if (position === "fixed" || position === "sticky") {
      return Math.ceil(header.getBoundingClientRect().height) + 28;
    }

    return 28;
  }

  function getNavigationLinks() {
    return Array.from(
      document.querySelectorAll(linkSelector)
    );
  }

  function getLinkTarget(link) {
    if (!link) {
      return null;
    }

    let hash = "";

    try {
      hash = new URL(
        link.getAttribute("href"),
        window.location.href
      ).hash;
    } catch (error) {
      return null;
    }

    if (!hash || hash === "#") {
      return null;
    }

    const id = decodeURIComponent(
      hash.slice(1)
    );

    return document.getElementById(id);
  }

  function setActiveLink(sectionId) {
    getNavigationLinks().forEach(function (link) {
      const target = getLinkTarget(link);
      const active = Boolean(
        target && target.id === sectionId
      );

      link.classList.toggle(
        "is-active",
        active
      );

      if (active) {
        link.setAttribute(
          "aria-current",
          "location"
        );
      } else {
        link.removeAttribute(
          "aria-current"
        );
      }
    });
  }

  function updateActiveLink() {
    const links = getNavigationLinks();

    if (!links.length) {
      return;
    }

    const targets = links
      .map(getLinkTarget)
      .filter(Boolean);

    if (!targets.length) {
      return;
    }

    const activationLine = getHeaderOffset() + 64;
    let activeTarget = targets[0];

    targets.forEach(function (target) {
      if (
        target.getBoundingClientRect().top
        <= activationLine
      ) {
        activeTarget = target;
      }
    });

    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );

    const viewportBottom =
      window.scrollY + window.innerHeight;

    if (
      viewportBottom
      >= documentHeight - 8
    ) {
      activeTarget = targets[targets.length - 1];
    }

    setActiveLink(activeTarget.id);
  }

  function scheduleActiveUpdate() {
    if (scrollTicking) {
      return;
    }

    scrollTicking = true;

    window.requestAnimationFrame(function () {
      updateActiveLink();
      scrollTicking = false;
    });
  }

  function smoothScrollToTarget(target) {
    if (!target) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targetTop =
      window.scrollY
      + target.getBoundingClientRect().top
      - getHeaderOffset();

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: reduceMotion ? "auto" : "smooth"
    });

    setActiveLink(target.id);
  }

  document.addEventListener(
    "click",
    function (event) {
      const link = event.target.closest(
        linkSelector
      );

      if (!link) {
        return;
      }

      if (
        event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return;
      }

      const target = getLinkTarget(link);

      if (!target) {
        return;
      }

      event.preventDefault();

      smoothScrollToTarget(target);

      const hash = "#" + encodeURIComponent(
        target.id
      );

      history.replaceState(
        history.state,
        "",
        hash
      );
    },
    false
  );

  window.addEventListener(
    "scroll",
    scheduleActiveUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    scheduleActiveUpdate,
    { passive: true }
  );

  window.addEventListener(
    "pageshow",
    function () {
      window.setTimeout(
        scheduleActiveUpdate,
        40
      );
    }
  );

  document.addEventListener(
    "DOMContentLoaded",
    function () {
      if (window.location.hash) {
        const id = decodeURIComponent(
          window.location.hash.slice(1)
        );

        const target = document.getElementById(id);

        if (target) {
          window.setTimeout(function () {
            const targetTop =
              window.scrollY
              + target.getBoundingClientRect().top
              - getHeaderOffset();

            window.scrollTo({
              top: Math.max(0, targetTop),
              behavior: "auto"
            });

            setActiveLink(target.id);
          }, 40);

          return;
        }
      }

      scheduleActiveUpdate();
    }
  );

  const observer = new MutationObserver(
    function () {
      window.clearTimeout(
        mutationTimer
      );

      mutationTimer = window.setTimeout(
        scheduleActiveUpdate,
        30
      );
    }
  );

  observer.observe(
    document.documentElement,
    {
      childList: true,
      subtree: true
    }
  );
})();

/* THERAPY_SIDE_NAV_V2_END */
