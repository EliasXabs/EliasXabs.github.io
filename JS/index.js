window.addEventListener("scroll", stickytoggle);

function stickytoggle(){
    var header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
}