---
---
menu = document.getElementById "menu"
open_button = document.getElementById "navbar-open-button"
close_button = document.getElementById "navbar-close-button"
not_menu = document.getElementById "not-menu"
mask = document.getElementById "mask"

show_menu = () ->
    not_menu.classList.add("translated")
    menu.classList.add("translated")
    mask.classList.add("visible")

hide_menu = () ->
    not_menu.classList.remove("translated")
    menu.classList.remove("translated")
    mask.classList.remove("visible")

open_button.onclick = show_menu
close_button.onclick = hide_menu