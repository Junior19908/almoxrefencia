import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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
const storage = getStorage(app);

document.querySelector("form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const referencia = document.getElementById("referencia").value;
    const marca = document.getElementById("marca").value;
    const fotosInput = document.getElementById("fotos");
    const searchInput = sessionStorage.getItem("searchInput");

    if (!referencia || !marca || fotosInput.files.length === 0) {
        alert("Preencha todos os campos e selecione pelo menos uma foto!");
        return;
    }

    if (!searchInput) {
        alert("Erro: Nenhum valor de pesquisa encontrado.");
        return;
    }

    try {
        const fotosURLs = [];

        for (const file of fotosInput.files) {
            const storageRef = ref(storage, `materiais_fotos/${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            fotosURLs.push(url);
        }

        const referenciaRef = collection(db, "materiais_ref", searchInput, "referencia_kt");
        await addDoc(referenciaRef, {
            referencia_mat: referencia,
            marca: marca,
            imagens: fotosURLs
        });

        alert("Referência adicionada com sucesso!");
        closeInsertModal();
        location.reload();
    } catch (error) {
        console.error("Erro ao salvar referência:", error);
        alert("Erro ao salvar a referência!");
    }
});
