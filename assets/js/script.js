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









































/* Real page-to-page transition */
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

  let transitionIsRunning = false;

  function pageName(urlValue) {
    const url = new URL(urlValue, window.location.href);
    let page = url.pathname.split("/").pop();

    if (!page || page === "am") {
      page = "index.html";
    }

    return page;
  }

  function directionTo(targetHref) {
    const current = pageName(window.location.href);
    const target = pageName(targetHref);

    const currentIndex = navOrder.indexOf(current);
    const targetIndex = navOrder.indexOf(target);

    if (currentIndex === -1 || targetIndex === -1) {
      return "forward";
    }

    return targetIndex > currentIndex ? "forward" : "backward";
  }

  function isMainNavLink(link) {
    if (!link || !link.href) return false;
    if (link.target === "_blank") return false;
    if (link.hasAttribute("download")) return false;

    const url = new URL(link.href, window.location.href);

    if (url.origin !== window.location.origin) return false;
    if (url.href === window.location.href) return false;
    if (url.hash && url.pathname === window.location.pathname) return false;

    return navOrder.includes(pageName(url.href));
  }

  function bindRealTransitionLinks() {
    document.querySelectorAll(".main-nav a").forEach(function (link) {
      if (link.dataset.realPageTransitionBound === "1") return;

      link.dataset.realPageTransitionBound = "1";

      link.addEventListener("click", function (event) {
        if (!isMainNavLink(link)) return;

        event.preventDefault();
        realPageTransition(link.href);
      });
    });
  }

  function syncActiveNav(targetHref) {
    const targetPage = pageName(targetHref);

    document.querySelectorAll(".main-nav a").forEach(function (link) {
      link.classList.remove("active");

      if (pageName(link.href) === targetPage) {
        link.classList.add("active");
      }
    });
  }

  function rebindContactDropdown() {
    const countryPicker = document.getElementById("countryPicker");
    const countryButton = document.getElementById("countryPickerButton");
    const countryCurrent = document.getElementById("countryPickerCurrent");
    const countryCode = document.getElementById("countryCode");
    const phoneInput = document.getElementById("phone");
    const countryOptions = document.querySelectorAll(".country-option");

    if (!countryPicker || !countryButton || !countryCurrent || !countryCode || !phoneInput) return;
    if (countryPicker.dataset.dropdownBound === "1") return;

    countryPicker.dataset.dropdownBound = "1";

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
  }

  async function realPageTransition(targetHref) {
    if (transitionIsRunning) return;
    transitionIsRunning = true;

    const currentMain = document.querySelector("main");
    const header = document.querySelector(".site-header");
    const direction = directionTo(targetHref);

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
      nextMain = nextDoc.querySelector("main");

      if (!nextMain) throw new Error("next main missing");
    } catch (error) {
      window.location.href = targetHref;
      return;
    }

    const headerBottom = header ? Math.max(0, Math.round(header.getBoundingClientRect().bottom)) : 0;

    const stage = document.createElement("div");
    stage.className = "real-page-transition-stage";
    stage.style.setProperty("--transition-top", headerBottom + "px");

    const oldPanel = document.createElement("div");
    oldPanel.className = "real-page-transition-panel";
    oldPanel.appendChild(currentMain.cloneNode(true));

    const newPanel = document.createElement("div");
    newPanel.className = "real-page-transition-panel";
    newPanel.appendChild(nextMain.cloneNode(true));

    const distance = window.innerWidth;
    const oldEnd = direction === "forward" ? -distance : distance;
    const newStart = direction === "forward" ? distance : -distance;

    oldPanel.style.transform = "translate3d(0, 0, 0)";
    newPanel.style.transform = "translate3d(" + newStart + "px, 0, 0)";

    stage.appendChild(oldPanel);
    stage.appendChild(newPanel);
    document.body.appendChild(stage);

    document.body.classList.add("real-page-transition-running");

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

    currentMain.replaceWith(nextMain.cloneNode(true));

    document.title = nextDoc.title || document.title;
    history.pushState({}, "", targetHref);

    syncActiveNav(targetHref);

    stage.remove();
    document.body.classList.remove("real-page-transition-running");

    window.scrollTo(0, 0);

    bindRealTransitionLinks();
    rebindContactDropdown();

    transitionIsRunning = false;
  }

  window.addEventListener("popstate", function () {
    window.location.reload();
  });

  document.addEventListener("DOMContentLoaded", function () {
    bindRealTransitionLinks();
    rebindContactDropdown();
  });
})();
