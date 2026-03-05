const btnPublicar = document.getElementById("btnPublicar");
const postInput = document.getElementById("postInput");
const feed = document.getElementById("feedPosts");

btnPublicar.addEventListener("click", function(){

    const texto = postInput.value.trim();

    if(texto === ""){
        alert("Escreva algo antes de publicar.");
        return;
    }

    const post = document.createElement("article");
    post.classList.add("card-post");

    post.innerHTML = `
        <div class="user-info">
            <img src="../../../static/img/perfil/perfil_default.png" class="avatar">
            <strong>Você</strong>
        </div>

        <p>${texto}</p>

        <button class="btn-excluir">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    feed.prepend(post);

    postInput.value = "";
});

feed.addEventListener("click", function(e){

    if(e.target.closest(".btn-excluir")){
        e.target.closest(".card-post").remove();
    }

});