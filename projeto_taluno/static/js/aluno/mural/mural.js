const btnPublicar = document.getElementById("btnPublicar");
const postInput = document.getElementById("postInput");
const feed = document.getElementById("feedPosts");

btnPublicar.addEventListener("click", () => {
    const texto = postInput.value.trim();

    if (texto === "") {
        alert("Escreva algo antes de publicar.");
        return;
    }

    const post = document.createElement("article");
    post.classList.add("card-post");

    post.innerHTML = `
        <div class="user-info">
            <img src="../../../static/img/perfil/perfil_default.png" class="avatar" alt="Avatar">
            <strong>Você</strong>
        </div>
        <p>${texto}</p>
        <button class="btn-excluir" aria-label="Excluir publicação">
    🗑️
</button>
    `;

    feed.prepend(post);
    postInput.value = "";

    post.querySelector(".btn-excluir").addEventListener("click", () => {
        post.remove();
    });
});