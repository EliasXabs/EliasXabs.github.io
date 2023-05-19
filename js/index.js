window.addEventListener("scroll", stickytoggle);

function stickytoggle(){
    var header = document.getElementById("nav");
    header.classList.toggle("sticky", window.scrollY > 0);
}
  