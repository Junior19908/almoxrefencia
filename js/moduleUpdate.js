import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

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
const storage = getStorage(app);

// Obtenha o código do material da URL
const urlParams = new URLSearchParams(window.location.search);
const codigo = urlParams.get('codigo'); // Exemplo: update.html?codigo=12345

if (!codigo) {
    alert("Erro: Código do material não encontrado.");
    window.location.href = "../buscar/"; // Redireciona para a tela de busca
}

// Busque os dados atuais do material
async function carregarDados() {
    try {
        const docRef = doc(db, "materiais_ref", codigo);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("referencia").value = data.referencia;
            document.getElementById("marca").value = data.marca;
        } else {
            alert("Material não encontrado!");
            window.location.href = "../buscar/"; // Redireciona para a tela de busca
        }
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar os dados do material.");
    }
}

// Atualize os dados no Firestore
async function atualizarDados(referencia, marca, fotos) {
    try {
        const docRef = doc(db, "materiais_ref", codigo);
        const updateData = {
            referencia: referencia,
            marca: marca,
        };

        // Se novas fotos forem enviadas, faça o upload e atualize as URLs
        if (fotos && fotos.length > 0) {
            const fotosURLs = [];
            for (const file of fotos) {
                const storageRef = ref(storage, `materiais_fotos/${file.name}`);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                fotosURLs.push(url);
            }
            updateData.fotos = fotosURLs;
        }

        await updateDoc(docRef, updateData);
        alert("Material atualizado com sucesso!");
        window.location.href = "../buscar/"; // Redireciona para a tela de busca
    } catch (error) {
        console.error("Erro ao atualizar material:", error);
        alert("Erro ao atualizar o material.");
    }
}

// Evento de envio do formulário
document.getElementById("updateForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const referencia = document.getElementById("referencia").value;
    const marca = document.getElementById("marca").value;
    const fotosInput = document.getElementById("fotos");

    if (!referencia || !marca) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    const fotos = fotosInput.files.length > 0 ? Array.from(fotosInput.files) : null;
    await atualizarDados(referencia, marca, fotos);
});

// Função para voltar à tela de busca
function voltarParaLista() {
    window.location.href = "../buscar/";
}

// Carregue os dados ao abrir a página
carregarDados();
