document.addEventListener("DOMContentLoaded", function() {
    const slides = document.querySelectorAll("#carrossel-inicio .banner-slide");
    const progressBar = document.getElementById("progress-bar");
    let slideAtual = 0;
    const tempoTroca = 5000; // 5000ms = 5 segundos

    function animarBarra() {
        // 1. Zera a barra instantaneamente, cortando qualquer animação anterior
        progressBar.style.transition = "none";
        progressBar.style.width = "0%";
        
        // 2. O "Reflow Hack": Força o navegador a recalcular a tela e aceitar o 0%
        void progressBar.offsetWidth;

        // 3. Aplica a transição linear de 0 a 100% no tempo exato da troca
        progressBar.style.transition = `width ${tempoTroca}ms linear`;
        progressBar.style.width = "100%";
    }

    function proximoSlide() {
        // Esconde o atual
        slides[slideAtual].classList.remove("ativo");
        
        // Pula pro próximo
        slideAtual = (slideAtual + 1) % slides.length;
        
        // Mostra o novo
        slides[slideAtual].classList.add("ativo");
        
        // Reseta e enche a barra de novo
        animarBarra();
    }

    if (slides.length > 0) {
        animarBarra(); // Dá o play na barra logo que a tela carrega
        setInterval(proximoSlide, tempoTroca); // Inicia o ciclo infinito
    }
});