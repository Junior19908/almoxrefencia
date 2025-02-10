 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
 import { getAuth, signOut, signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
 import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
 import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyAmKIovuYNOJ_mYcR7ui8SkBNpD05ZtU1w",
   authDomain: "referenciacat.firebaseapp.com",
   projectId: "referenciacat",
   storageBucket: "referenciacat.firebasestorage.app",
   messagingSenderId: "369889469803",
   appId: "1:369889469803:web:4b11edcfb16abccdc5d82e",
   measurementId: "G-8CS0L2MG2L"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);
 const storage = getStorage(app);



 document.addEventListener('DOMContentLoaded', () => {
   onAuthStateChanged(auth, async(user)=>{
     if(user){
       try{
           const usersRef = collection(db, "users");
           const q = query(usersRef, where("email", "==", user.email));
           const querySnapshot = await getDocs(q);
           if(!querySnapshot.empty){
               const userDoc = querySnapshot.docs[0].data();
               if(!userDoc.status === true){
                   await signOut(auth);
                   alert('Acesso negado: Usuário não autorizado');
                   window.location.href = "erro.html";
               }
           }
       }catch(error){
           console.error("Erro ao buscar status do usuário: ", error);
           window.location.href='erro.html';
       }
       document.getElementById('findCodSection').classList.remove('hidden');
       document.getElementById('add_button').classList.remove('hidden');
     }else{
       //document.getElementById('findCodSection').classList.add('hidden');
       //document.getElementById('add_button').classList.add('hidden');
       location.href = "login/";
     }
   });
   document.getElementById("searchForm").addEventListener("submit", async function(event) {
     event.preventDefault();
     const searchInput = document.getElementById("buscar_cod").value.trim();
     if (!searchInput) {
         alert("Por favor, insira um código/material.");
         return;
       }
       try {
           const docRef = doc(db, "materiais_ref", searchInput);
           const docSnap = await getDoc(docRef);

           if (docSnap.exists()) {
               const data = docSnap.data();
               sessionStorage.setItem("materialData", JSON.stringify(data));
               sessionStorage.setItem("searchInput", searchInput);
               window.location.href = "find_cod.html";
           } else {
               alert("Material não encontrado.");
           }
       } catch (error) {
           console.error("Erro ao buscar o material:", error);
       }
   });
 });