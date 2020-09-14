(function () {
  /* =================== HELPERS =================== */
  function _(x) {
    return document.querySelector(x);
  }
  function __(x) {
    return document.querySelectorAll(x);
  }

  /* =================== HEADER =================== */
  var headroom = new Headroom(_("#navbar"));
  headroom.init();

  /* =================== THEME =================== */
  var light = true;

  _("#theme-button").addEventListener("click", function () {
    if (light) {
      _("body").classList.add("dark-mode");
      _("#sun").style.display = "inline";
      _("#moon").style.display = "none";
      light = false;
    } else {
      _("body").classList.remove("dark-mode");
      _("#sun").style.display = "none";
      _("#moon").style.display = "inline";
      light = true;
    }
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
})();
