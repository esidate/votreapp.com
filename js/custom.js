/* =================== HELPERS =================== */

function _(x) {
  return document.querySelector(x);
}

function __(x) {
  return document.querySelectorAll(x);
}

function dirname(path) {
  return path.match(/.*\//);
}

/* ============ SMOOTH SCROLL =================== */
var scroll = new SmoothScroll('a[href*="#"]', {
  easing: "easeInOutQuad",
  // header: "[navbar]",
  offset: function (anchor, toggle) {
    var anchor = toggle.getAttribute("href");

    switch (anchor) {
      case "#home":
        return 0;
      case "#service":
        return 60;
      default:
        return 50;
    }
  },
});

(function () {
  /* =================== HEADER =================== */
  var headroom = new Headroom(_("#navbar"));
  headroom.init();

  /* =================== THEME =================== */
  var _light = true;

  function theme() {
    var theme = localStorage.getItem("theme");

    if (theme === "dark") {
      _light = false;
      dark();
    } else if (theme === "light") {
      _light = true;
      light();
    } else {
      localStorage.setItem("theme", "light"); // Set default theme
      _light = true;
      light();
    }
  }

  function dark() {
    _("body").classList.add("dark-mode");
    __(".sun").forEach(function (element) {
      element.style.display = "inline";
    });
    __(".moon").forEach(function (element) {
      element.style.display = "none";
    });
    __(".svg-dark").forEach(function (element) {
      element.style.display = "block";
    });
    __(".svg-light").forEach(function (element) {
      element.style.display = "none";
    });
    localStorage.setItem("theme", "dark");
  }

  function light() {
    _("body").classList.remove("dark-mode");
    __(".sun").forEach(function (element) {
      element.style.display = "none";
    });
    __(".moon").forEach(function (element) {
      element.style.display = "inline";
    });
    __(".svg-dark").forEach(function (element) {
      element.style.display = "none";
    });
    __(".svg-light").forEach(function (element) {
      element.style.display = "block";
    });
    localStorage.setItem("theme", "light");
  }

  theme();

  document.defaultView.addEventListener("storage", theme); // LocalStorage event listener

  __(".theme-button").forEach(function (element) {
    element.addEventListener("click", function () {
      if (_light) {
        dark();
        _light = false;
      } else {
        light();
        _light = true;
      }
    });
  });

  /* =================== MOBILE NAVBAR =================== */
  var isNavOpen = false;

  function toggleNav() {
    if (isNavOpen) {
      isNavOpen = false;

      _("#side-bar").style.right = "-85vw";
      setTimeout(() => {
        _("#side-bar").style.display = "none";
      }, 300);

      _("#burger").style.display = "block";
      _("#close").style.display = "none";
    } else {
      isNavOpen = true;

      _("#side-bar").style.display = "block";
      setTimeout(() => {
        _("#side-bar").style.right = "0px";
      }, 10);

      _("#close").style.display = "block";
      _("#burger").style.display = "none";
    }
  }

  __("#side-bar div ul li").forEach(function (el) {
    el.addEventListener("click", toggleNav);
  });

  _("#menu").addEventListener("click", toggleNav);

  /* ============== TOOLTIP ============== */
  function tip() {
    let t = this.querySelector(".tt");
    if (t === null) {
      t = document.createElement("div");
      t.classList.add("tt");
      this.append(t);
    }

    // Optional direction
    let dir = this.getAttribute("tt-dir");
    if (dir && dir === "bottom") {
      t.classList.add("tt-bottom");
    }

    // Optional event call
    let onHover = this.getAttribute("onhover");
    let hasOnHover = onHover && onHover in window;
    if (hasOnHover && typeof window[onHover] === "function") {
      window[onHover].call(this);
    }

    t.innerHTML = this.getAttribute("tt") || "";
    let width = t.offsetWidth;
    let halfWidth = width / 2;
    // t.setAttribute('radius', halfWidth);
    t.style.marginLeft = `${-halfWidth}px`;
  }

  __(".tipped").forEach(function (element) {
    element.addEventListener("mouseenter", tip);
    element.addEventListener("touchstart", tip);
  });
})();
