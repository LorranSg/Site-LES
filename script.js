let indicador = document.querySelector(".indicador");

let body = document.querySelector("body");

let les = document.querySelector(".LES");

let cabecalho = document.querySelector(".cabecalho");

let header = document.querySelector("header");

let contLES = document.querySelector(".containerLES");

let inputPesquisa = document.querySelector(".input-pesquisa");

let menuLink = document.querySelectorAll(".menu-link");

indicador.addEventListener("click", () => {
    indicador.classList.toggle("dark");
    body.classList.toggle("dark");
    les.classList.toggle("dark");
    cabecalho.classList.toggle("dark");
    header.classList.toggle("dark");
    contLES.classList.toggle("dark");
    inputPesquisa.classList.toggle("dark");
    menuLink.forEach(link => {
        link.classList.toggle("dark");
    });

})

localStorage.setItem("tema", "dark");
    if (localStorage.getItem("tema") === "dark"){
        indicador.classList.add("dark");
        body.classList.add("dark");
        les.classList.add("dark");
        cabecalho.classList.add("dark");
        header.classList.add("dark");
        contLES.classList.add("dark");
        inputPesquisa.classList.add("dark");
    }


const prefereDark = window.matchMedia("(prefers-color-scheme: dark)").matches;




