import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Configuração do Firebase
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

// Carregar os dados do material
document.addEventListener("DOMContentLoaded", async () => {
    const materialData = JSON.parse(sessionStorage.getItem("materialData"));
    if (!materialData) {
        alert("Erro ao carregar o material.");
        window.location.href = "index.html";
        return;
    }

    // Preencher os dados principais na página
    document.querySelector(".item-info h2").innerHTML = `<strong>CÓDIGO: ${materialData.codigo}</strong>`;
    document.querySelector(".item-info p").textContent = materialData.DESCRICAO || "Descrição não disponível";
    document.querySelector(".item-info p strong").textContent = materialData.REFERENCIA || "Sem referência";

    // Buscar referências dentro da coleção `referencia`
    const referenceList = document.querySelector(".reference-list");
    referenceList.innerHTML = ""; // Limpar a lista antes de carregar os dados

    const referenciaRef = collection(db, "materiais_ref", materialData.codigo, "referencia_kt");
    const querySnapshot = await getDocs(referenciaRef);

    querySnapshot.forEach((doc) => {
        const referenciaData = doc.data();
        const referenceItem = document.createElement("div");
        referenceItem.classList.add("reference-item");
        referenceItem.innerHTML = `
            <img src="${referenciaData.imagem || 'https://via.placeholder.com/150'}" alt="Imagem do Material" class="item-image">
            <div>
                <p><strong>Referência:</strong> ${referenciaData.referencia}</p>
                <p><strong>Marca:</strong> ${referenciaData.marca || "Sem marca"}</p>
            </div>
        `;
        referenceItem.onclick = () => openModal(referenciaData.imagem || 'https://via.placeholder.com/150');
        referenceList.appendChild(referenceItem);
    });

    if (querySnapshot.empty) {
        referenceList.innerHTML = "<p>Nenhuma referência encontrada.</p>";
    }
});

// Função para exibir imagens no modal
window.openModal = function(imageSrc) {
    document.getElementById("modalImg").src = imageSrc;
    document.getElementById("imageModal").style.display = "block";
};

window.closeModal = function() {
    document.getElementById("imageModal").style.display = "none";
};
