import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
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

// Busque os dados atuais do material principal
async function carregarDados() {
    try {
        // Buscar o material principal
        const docRef = doc(db, "materiais_ref", codigo);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("referencia").value = data.referencia;
            document.getElementById("marca").value = data.marca;

            // Buscar os produtos similares (subcoleção referencia_kt)
            const produtosSimilaresRef = collection(db, "materiais_ref", codigo, "referencia_kt");
            const produtosSimilaresSnap = await getDocs(produtosSimilaresRef);

            const produtosSimilares = [];
            produtosSimilaresSnap.forEach((doc) => {
                produtosSimilares.push({ id: doc.id, ...doc.data() });
            });

            // Exibir os produtos similares
            exibirProdutosSimilares(produtosSimilares);
        } else {
            alert("Material não encontrado!");
            window.location.href = "../buscar/"; // Redireciona para a tela de busca
        }
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        alert("Erro ao carregar os dados do material.");
    }
}

// Exibir os produtos similares na tela
function exibirProdutosSimilares(produtos) {
    const container = document.getElementById("produtosSimilares");
    container.innerHTML = ""; // Limpa o conteúdo anterior

    produtos.forEach((produto) => {
        const produtoDiv = document.createElement("div");
        produtoDiv.className = "produto-similar";

        produtoDiv.innerHTML = `
            <p><strong>Referência:</strong> ${produto.referencia_mat}</p>
            <p><strong>Marca:</strong> ${produto.marca}</p>
            <button type="button" class="button_editar" onclick="editarProduto('${produto.id}')">Editar</button>
            <button type="button" class="button_excluir" onclick="excluirProduto('${produto.id}')">Excluir</button>
        `;
        container.appendChild(produtoDiv);
    });
}

// Atualize os dados do material principal
async function atualizarDados(referencia, marca, fotos) {
    try {
        const docRef = doc(db, "materiais_ref", codigo);
        const updateData = {
            referencia_mat: referencia,
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
            updateData.imagens = fotosURLs;
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


// Função para editar um produto similar
function editarProduto(produtoId) {
    window.location.href = `editarProduto.html?codigo=${codigo}&produtoId=${produtoId}`;
}

// Função para excluir um produto similar
async function excluirProduto(produtoId) {
    try {
        const confirmacao = confirm("Tem certeza que deseja excluir este produto?");
        if (!confirmacao) return;

        const produtoRef = doc(db, "materiais_ref", codigo, "referencia_kt", produtoId);
        await deleteDoc(produtoRef);
        alert("Produto excluído com sucesso!");
        carregarDados(); // Recarrega os dados após a exclusão
    } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir o produto.");
    }
}
// Carregue os dados ao abrir a página
carregarDados();
