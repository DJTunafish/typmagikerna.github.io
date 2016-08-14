---
---
menu = document.getElementById "menu"
open_button = document.getElementById "navbar-open-button"
close_button = document.getElementById "navbar-close-button"
not_menu = document.getElementById "not-menu"
mask = document.getElementById "mask"

controller = new slidebars();

show_menu = () ->
    controller.toggle("id-1")
    #mask.classList.add("visible")

hide_menu = () ->
    controller.toggle("id-1")
    #mask.classList.remove("visible")
    

open_button.onclick = show_menu
close_button.onclick = hide_menu
controller.init();