import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyAmKIovuYNOJ_mYcR7ui8SkBNpD05ZtU1w",
    authDomain: "referenciacat.firebaseapp.com",
    projectId: "referenciacat",
    storageBucket: "referenciacat.firebasestorage.app",
    messagingSenderId: "369889469803",
    appId: "1:369889469803:web:4b11edcfb16abccdc5d82e",
    measurementId: "G-8CS0L2MG2L"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app); // Adicionando a inicialização do Storage

export { db, storage, ref, uploadBytes, getDownloadURL, collection, addDoc };

document.addEventListener("DOMContentLoaded", async() => {
const materialData = sessionStorage.getItem("materialData");
const searchInput = sessionStorage.getItem("searchInput")

if (materialData) {
    const data = JSON.parse(materialData);

    // Preencher os campos da página com os dados recuperados
    document.querySelector(".item-info h2").innerHTML = `<strong>CÓDIGO: ${searchInput}</strong>`;
    document.querySelector(".item-info p").textContent = data.descricao;
    document.querySelector(".item-info h4 strong").textContent = `Marca: ${data.marca}`;
    document.querySelector(".item-info p strong").textContent = `Referência: ${data.referencia}`;

    // Se houver imagem, atualiza a exibição
    const mainItemImage = document.querySelector(".main-item img");

    if (data.fotos && Array.isArray(data.fotos)) {
        mainItemImage.src = data.fotos[0];
        mainItemImage.alt = `Imagem de ${data.descricao}`;
        mainItemImage.onclick = () => openModal(data.fotos); // Passa todas as imagens para o modal
    }


    // Buscar referências dentro da coleção `referencia`
    const referenceList = document.querySelector(".reference-list");
    referenceList.innerHTML = ""; // Limpar a lista antes de carregar os dados

    try {
        const referenciaRef = collection(db, "materiais_ref", searchInput, "referencia_kt");
        const querySnapshot = await getDocs(referenciaRef);
        if(querySnapshot.empty){
            referenceList.innerHTML = "<p>Nenhuma referência similar encontrada.</p>";
        } else {
            querySnapshot.forEach((doc) => {
                const referenciaData = doc.data();
                const referenceItem = document.createElement("div");
                referenceItem.classList.add("reference-item");
                referenceItem.innerHTML = `
                    <img src="${referenciaData.imagens || 'https://firebasestorage.googleapis.com/v0/b/referenciacat.firebasestorage.app/o/materiais_fotos%2FCaptura_de_tela_2025-02-09_190155-removebg-preview.png?alt=media&token=cf5d44b2-df71-4daf-ad32-4503260e0360'}" alt="Imagem do Material" class="item-image">
                    <div>
                        <p><strong>Referência:</strong> ${referenciaData.referencia_mat}</p>
                        <p><strong>Marca:</strong> ${referenciaData.marca || "Sem marca"}</p>
                    </div>
                `;
                referenceItem.onclick = () => openModal(referenciaData.imagens || 'https://firebasestorage.googleapis.com/v0/b/referenciacat.firebasestorage.app/o/materiais_fotos%2FCaptura_de_tela_2025-02-09_190155-removebg-preview.png?alt=media&token=cf5d44b2-df71-4daf-ad32-4503260e0360');
                referenceList.appendChild(referenceItem);

                if (querySnapshot.empty) {
                    referenceList.innerHTML = "<p>Nenhuma referência encontrada.</p>";
                }
            });
        }
    } catch (error) {
        console.error("Erro ao buscar referências:", error);
        referenceList.innerHTML = "<p>Erro ao carregar referências.</p>";
    }
} else {
    alert("Nenhum material encontrado!");
    window.location.href = "index.html"; // Redireciona caso não tenha dados
}
});
