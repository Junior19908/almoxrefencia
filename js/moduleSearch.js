import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Evento de envio do formulário de busca
document.getElementById("searchForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const codigo = document.getElementById("codigo").value;

    if (!codigo) {
        alert("Por favor, insira um código válido.");
        return;
    }

    try {
        // Verifique se o material existe
        const docRef = doc(db, "materiais_ref", codigo);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Redirecione para a tela de atualização com o código do material
            window.location.href = `../material/index.html?codigo=${codigo}`;
        } else {
            alert("Material não encontrado!");
        }
    } catch (error) {
        console.error("Erro ao buscar material:", error);
        alert("Erro ao buscar o material.");
    }
});