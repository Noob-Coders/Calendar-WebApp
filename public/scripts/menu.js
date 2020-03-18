var username = document.querySelector(".username");
var menu = document.querySelector("#menu");
var body = document.querySelector(".whole");

function addMenuEvent(){

    body.addEventListener("click", () => {
        menu.classList.add("nodisplay");
    });

    $(".username").click((e) => {
        menu.classList.toggle("nodisplay");
        e.stopPropagation();
    })

   
}

export { addMenuEvent };