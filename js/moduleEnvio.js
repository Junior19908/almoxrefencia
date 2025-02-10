
      import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
      import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
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

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const storage = getStorage(app);

      // Função para processar o CSV
      document.getElementById("uploadCSV").addEventListener("click", function () {
          const fileInput = document.getElementById("csvFile");
          const file = fileInput.files[0];

          if (!file) {
              alert("Por favor, selecione um arquivo CSV.");
              return;
          }

          const reader = new FileReader();
          reader.onload = async function (event) {
              const csvText = event.target.result;
              const linhas = csvText.split("\n").map(linha => linha.trim()).filter(linha => linha);
              const cabecalho = linhas[0].split(",");

              // Garantindo que temos os campos necessários
              if (!cabecalho.includes("cod_material") || !cabecalho.includes("descricao") || !cabecalho.includes("marca") || !cabecalho.includes("referencia")) {
                  alert("O arquivo CSV precisa ter as colunas: cod_material, descricao, marca, referencia.");
                  return;
              }

              for (let i = 1; i < linhas.length; i++) {
                  let colunas = linhas[i].split(",");
                  let material = {
                      cod_material: colunas[cabecalho.indexOf("cod_material")].trim(),
                      descricao: colunas[cabecalho.indexOf("descricao")].trim(),
                      marca: colunas[cabecalho.indexOf("marca")].trim(),
                      referencia: colunas[cabecalho.indexOf("referencia")].trim(),
                  };

                  if (!material.cod_material) {
                      console.warn(`Linha ${i + 1} ignorada por falta de código de material.`);
                      continue;
                  }

                  const docRef = doc(db, "materiais_ref", material.cod_material);
                  const docSnap = await getDoc(docRef);

                  if (docSnap.exists()) {
                      console.warn(`Material com código ${material.cod_material} já existe. Pulando...`);
                      continue;
                  }

                  await setDoc(docRef, material);
                  console.log(`Material ${material.cod_material} adicionado com sucesso.`);
              }

              alert("Todos os materiais foram processados!");
          };

          reader.readAsText(file);
      });
