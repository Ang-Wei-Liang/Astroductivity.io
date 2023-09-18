
document.addEventListener("DOMContentLoaded", function() {

const showModalSvg = document.getElementById("showModalSvg");
    const modal = new bootstrap.Modal(document.getElementById("exampleModal"));

    showModalSvg.addEventListener("click", () => {
        modal.show();
    });

/* Typewriter Animation */

var typed = new Typed(".auto-type", {
    strings: ["Venus", "Mars", "Uranus", "Jupiter", "Saturn"],
    typeSpeed: 150,
    backSpeed: 150,
    loop: true
  })

  


/*End*/

});