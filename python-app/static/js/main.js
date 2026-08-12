(function () {
  "use strict";

  // ---- studio public nav: shrink/solidify on scroll ----------------------
  var nav = document.querySelector(".studio-nav");
  if (nav) {
    var onScroll = function () {
      var threshold = window.innerHeight * 0.7;
      nav.classList.toggle("scrolled", window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- portfolio category filter ------------------------------------------
  var filterBar = document.querySelector("[data-portfolio-filters]");
  if (filterBar) {
    var items = document.querySelectorAll("[data-photo-category]");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-category]");
      if (!btn) return;

      filterBar.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("active", b === btn);
      });

      var category = btn.getAttribute("data-category");
      items.forEach(function (item) {
        var show = category === "All" || item.getAttribute("data-photo-category") === category;
        item.style.display = show ? "" : "none";
      });
    });
  }

  // ---- delete confirmation -------------------------------------------------
  document.querySelectorAll("form[data-confirm]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (!window.confirm(form.getAttribute("data-confirm"))) {
        e.preventDefault();
      }
    });
  });

  // ---- studio-form palette presets -----------------------------------------
  document.querySelectorAll("[data-palette]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var primary = btn.getAttribute("data-primary");
      var accent = btn.getAttribute("data-accent");
      var canvas = btn.getAttribute("data-canvas");

      var primaryInput = document.getElementById("primaryColor");
      var accentInput = document.getElementById("accentColor");
      var canvasInput = document.getElementById("canvasColor");
      if (primaryInput) primaryInput.value = primary;
      if (accentInput) accentInput.value = accent;
      if (canvasInput) canvasInput.value = canvas;
      syncColorLabels();

      document.querySelectorAll("[data-palette]").forEach(function (b) {
        b.classList.toggle(
          "active",
          b.getAttribute("data-primary") === primary &&
            b.getAttribute("data-accent") === accent &&
            b.getAttribute("data-canvas") === canvas
        );
      });
    });
  });

  function syncColorLabels() {
    document.querySelectorAll(".color-field").forEach(function (field) {
      var input = field.querySelector("input[type=color]");
      var label = field.querySelector("[data-color-value]");
      if (input && label) label.textContent = input.value;
    });
  }

  document.querySelectorAll(".color-field input[type=color]").forEach(function (input) {
    input.addEventListener("input", syncColorLabels);
  });
  syncColorLabels();

  // ---- signup plan picker ----------------------------------------------
  document.querySelectorAll(".plan-option input[type=radio]").forEach(function (radio) {
    radio.addEventListener("change", function () {
      document.querySelectorAll(".plan-option").forEach(function (label) {
        label.classList.toggle("checked", label.contains(radio) && radio.checked);
      });
      document.querySelectorAll('.plan-option input[type=radio]').forEach(function (r) {
        r.closest(".plan-option").classList.toggle("checked", r.checked);
      });
    });
  });

  // ---- chat widget --------------------------------------------------------
  var chatRoot = document.querySelector("[data-chat-widget]");
  if (chatRoot) {
    var studio = {
      brandName: chatRoot.getAttribute("data-brand-name") || "",
      email: chatRoot.getAttribute("data-email") || "",
      phone: chatRoot.getAttribute("data-phone") || "",
      location: chatRoot.getAttribute("data-location") || "",
    };

    var panel = chatRoot.querySelector(".chat-panel");
    var toggleBtn = chatRoot.querySelector(".chat-toggle");
    var closeBtn = chatRoot.querySelector(".chat-panel-close");
    var messagesEl = chatRoot.querySelector(".chat-messages");
    var input = chatRoot.querySelector(".chat-input-row input");
    var sendBtn = chatRoot.querySelector(".chat-input-row button");

    function addMessage(from, text) {
      var el = document.createElement("div");
      el.className = "chat-message " + from;
      el.textContent = text;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function answerFor(question) {
      var q = question.toLowerCase();
      if (/(price|cost|rate|how much)/.test(q)) {
        return "Pricing depends on the session type — send a booking request below with what you have in mind and " + studio.brandName + " will follow up with a quote.";
      }
      if (/(book|availab|schedule|date)/.test(q)) {
        return "You can request a booking using the form in the Contact section — include your preferred date and details.";
      }
      if (/(where|location|based)/.test(q)) {
        return studio.location ? studio.brandName + " is based in " + studio.location + "." : "Check the Contact section for location details.";
      }
      if (/(contact|email|phone|call)/.test(q)) {
        var parts = [studio.email, studio.phone].filter(Boolean).join(" or ");
        return parts ? "You can reach " + studio.brandName + " at " + parts + "." : "See the Contact section below for details.";
      }
      if (/(hi|hello|hey)/.test(q)) {
        return "Hi! I'm the " + studio.brandName + " assistant. Ask me about pricing, booking, or location.";
      }
      return "I'm not sure about that yet — try asking about pricing, booking, or location, or use the contact form below.";
    }

    function send() {
      var text = input.value.trim();
      if (!text) return;
      addMessage("user", text);
      input.value = "";
      addMessage("bot", answerFor(text));
    }

    toggleBtn.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
    closeBtn.addEventListener("click", function () {
      panel.classList.remove("open");
    });
    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") send();
    });
  }
})();
