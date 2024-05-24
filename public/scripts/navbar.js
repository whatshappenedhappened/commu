window.onscroll = function() {
    navbarColorShift();
};

let navbar = document.getElementById('main-header');
let logo = document.getElementsByTagName('#logo a');
let logoDot = document.getElementById('logo-dot');

let sticky = navbar.offsetTop;

function navbarColorShift() {
    if(window.scrollY > sticky) {
        navbar.classList.add("color-shift-1");
        // logo.classList.add("color-shift-2");
        // logoDot.classList.add("color-shift-3");
    } else {
        navbar.classList.remove("color-shift-1");
        // logo.classList.remove("color-shift-2");
        // logoDot.classList.remove("color-shift-3");
    }
}