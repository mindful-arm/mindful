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
