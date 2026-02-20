document.addEventListener("DOMContentLoaded", function () {

    const botao = document.querySelector(".btn-paginacao");

    if (botao) {
        botao.addEventListener("click", function () {

            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = "../inicio/inicio.html";
            }

        });
    }

});
