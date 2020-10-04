import SmoothScroll from "smooth-scroll";
import axios from "axios";
import "@material/mwc-snackbar";

/* =================== HELPERS =================== */
const q = (x) => document.querySelector(x);

const qA = (x) => document.querySelectorAll(x);

// const log = (msg, lvl = 1, info = null) => {
//   /* msg: debugging message
//      lvl: 1 = info, 2 = warning, 3 = error, 4 = fatal
//   */
//   switch (lvl) {
//     case 1:
//       var color = "color:green";
//       break;
//     case 2:
//       var color = "color:yellow";
//       break;
//     case 3:
//       var color = "color:orange";
//       break;
//     case 4:
//       var color = "color:red";
//       break;
//     default:
//       var color = "color:green";
//       break;
//   }
//   console.log("[Debug-Log] =========== START ==========");
//   console.log("[Debug-Log] Message: %c%s", color, msg);
//   if (!!info) {
//     console.log("[Debug-Log] Additional information: ", info);
//   }
//   console.log("[Debug-Log] =========== END ==========");
// };

window.addEventListener("DOMContentLoaded", () => {
  /* ================= CUSTOM SCROLL ============== */
  OverlayScrollbars(qA("body"), {
    callbacks: {
      onScroll: function () {
        if (
          this.scroll() &&
          (this.scroll().position.y > 35 ||
            this.scroll().handleOffset.y > 10 ||
            this.scroll().snappedHandleOffset.y > 10)
        ) {
          q("#navbar").classList.add("scrolled");
        } else {
          q("#navbar").classList.remove("scrolled");
        }
      },
    },
  });

  /* ============ SMOOTH SCROLL =================== */
  new SmoothScroll('a[href*="#"]', {
    easing: "easeInOutQuad",
    // header: "[navbar]",
    offset: (anchor, toggle) => {
      const a = toggle.getAttribute("href");

      switch (a) {
        case "#home":
          return 0;
        case "#service":
          return 60;
        default:
          return 50;
      }
    },
  });

  /* =================== THEME =================== */
  let _light = true;

  function theme() {
    const theme = localStorage.getItem("theme");

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
    q(".navbar").style.transition = "none";
    q("body").classList.add("dark-mode");
    qA(".sun").forEach(function (element) {
      element.style.display = "inline";
    });
    qA(".moon").forEach(function (element) {
      element.style.display = "none";
    });
    qA(".svg-dark").forEach(function (element) {
      element.style.display = "block";
    });
    qA(".svg-light").forEach(function (element) {
      element.style.display = "none";
    });
    localStorage.setItem("theme", "dark");
    setTimeout(() => {
      q(".navbar").style.transition =
        "background-color 0.2s ease, padding 0.2s ease, box-shadow 0.2s ease";
    }, 0.5); // Wait for animation to complete
  }

  function light() {
    q(".navbar").style.transition = "none";
    q("body").classList.remove("dark-mode");
    qA(".sun").forEach(function (element) {
      element.style.display = "none";
    });
    qA(".moon").forEach(function (element) {
      element.style.display = "inline";
    });
    qA(".svg-dark").forEach(function (element) {
      element.style.display = "none";
    });
    qA(".svg-light").forEach(function (element) {
      element.style.display = "block";
    });
    localStorage.setItem("theme", "light");
    setTimeout(() => {
      q(".navbar").style.transition =
        "background-color 0.2s ease, padding 0.2s ease, box-shadow 0.2s ease";
    }, 0.5); // Wait for animation to complete
  }

  theme();

  document.defaultView.addEventListener("storage", theme); // LocalStorage event listener

  qA(".theme-button").forEach((el) =>
    el.addEventListener("click", () => {
      if (_light) {
        dark();
        _light = false;
      } else {
        light();
        _light = true;
      }
    })
  );

  /* =================== MOBILE NAVBAR =================== */
  let isNavOpen = false;

  function toggleNav() {
    if (isNavOpen) {
      isNavOpen = false;

      q("#side-bar").style.right = "-85vw";
      setTimeout(() => {
        q("#side-bar").style.display = "none";
      }, 300);

      q("#burger").style.display = "block";
      q("#close").style.display = "none";
    } else {
      isNavOpen = true;

      q("#side-bar").style.display = "block";
      setTimeout(() => {
        q("#side-bar").style.right = "0px";
      }, 10);

      q("#close").style.display = "block";
      q("#burger").style.display = "none";
    }
  }

  qA("#side-bar div ul li").forEach((el) => {
    el.addEventListener("click", toggleNav);
  });

  q("#menu").addEventListener("click", toggleNav);

  /* ============== TOOLTIP ============== */
  function tip() {
    let t = this.querySelector(".tt");
    if (t === null) {
      t = document.createElement("div");
      t.classList.add("tt");
      t.style.zIndex = "99999999";
      this.append(t);
    }

    // Optional direction
    const dir = this.getAttribute("tt-dir");
    if (dir && dir === "bottom") {
      t.classList.add("tt-bottom");
    }

    // Optional event call
    const onHover = this.getAttribute("onhover");
    const hasOnHover = onHover && onHover in window;
    if (hasOnHover && typeof window[onHover] === "function") {
      window[onHover].call(this);
    }

    t.innerHTML = this.getAttribute("tt") || "";

    const width = t.offsetWidth;
    const halfWidth = width / 2;
    // t.setAttribute('radius', halfWidth);
    t.style.marginLeft = `${-halfWidth}px`;
  }

  qA(".tipped").forEach(function (el) {
    el.addEventListener("mouseenter", tip);
    el.addEventListener("touchstart", tip);
  });
});

window.snackbar = q("#snackbar");

window.sendContact = function () {
  const value = (name, type = "input") => {
    const element = q(`${type}[name = "${name}"]`);
    return !!element ? element.value : "";
  };

  const send = (obj) => {
    axios
      .post("/.netlify/functions/contact_us/contact_us", obj)
      .then(function (response) {
        console.log(response);
        if (response && response.data) {
          if (response.data.success) {
            snackbar.setAttribute(
              "labelText",
              "Your message has been submitted"
            );
            q("#contact-form").reset();
          } else {
            snackbar.setAttribute(
              "labelText",
              "Something went wrong please try again later"
            );
          }
        }
        snackbar.show();
      })
      .catch(function (error) {
        console.log(error);
        snackbar.setAttribute(
          "labelText",
          "Something went wrong please try again later"
        );
        snackbar.show();
      });
  };

  const obj = {
    fname: value("fname"),
    lname: value("lname"),
    email: value("email"),
    phone: value("phone"),
    message: value("message", "textarea"),
    date: new Date().toString(),
    ip: "",
    loc: "",
    uag: "",
  };

  axios
    .get("https://www.cloudflare.com/cdn-cgi/trace") // Get IP, Location, Browser/OS
    .then(function (response) {
      if (
        typeof response.data === "string" ||
        response.data instanceof String
      ) {
        const userInfo = response.data.split(/\r?\n/);
        obj.ip = userInfo.length > 0 ? userInfo[2].match(/\=(.*)/)[1] : "";
        obj.loc = userInfo.length > 0 ? userInfo[8].match(/\=(.*)/)[1] : "";
        obj.uag = userInfo.length > 0 ? userInfo[5].match(/\=(.*)/)[1] : "";
      }
      send(obj); // Send new object
    })
    .catch(function (error) {
      console.log("CloudFlare response error", error);
      send(obj); // Send object anyway
    });

  return false;
};
