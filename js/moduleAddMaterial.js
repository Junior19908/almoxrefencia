import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
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

    let codMaterial = document.querySelector("[name='cod_material']").value;
    let descMaterial = document.querySelector("[name='desc_material']").value;
    let marcaMaterial = document.querySelector("[name='marca_material']").value;
    let referenciaMaterial = document.querySelector("[name='referencia_material']").value;
    let imagens = document.getElementById("foto_material").files;

    if (!codMaterial) {
        alert("O Código do Material é obrigatório!");
        return;
    }

    const docRef = doc(db, "materiais_ref", codMaterial);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        alert("Esse Código de Material já existe!");
        return;
    }

    let imagensURLs = [];

    for (let i = 0; i < imagens.length; i++) {
        let imagemRef = ref(storage, `materiais/${codMaterial}/${imagens[i].name}`);
        await uploadBytes(imagemRef, imagens[i]);
        let url = await getDownloadURL(imagemRef);
        imagensURLs.push(url);
    }

    await setDoc(docRef, {
        cod_material: codMaterial,
        descricao: descMaterial,
        marca: marcaMaterial,
        referencia: referenciaMaterial,
        fotos: imagensURLs
    });

    alert("Material adicionado com sucesso!");
    location.reload();
});
