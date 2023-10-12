//BUSQUEDA CON IA

document.addEventListener("DOMContentLoaded", function () {
  const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
  const PROJECT_ID = "intrepid-period-401518";
  const MODEL_ID = "text-bison";
  const ACCESS_TOKEN = "ya29.a0AfB_byAOMWUgr8EvNM9GENvq-rEg5FeuaiTc0OXMjKY5zAGPKa2r892FwvL67LGtns_YB4ASX2JeF000XZwiuDnwpljWSz5CIdYhCc7X-ZSopg73vAO1CcReLYmdALq_I2qUnypO_9KrkGCLabxwzWy652cZTi4QAuHDl-BxhEwJ7jd3YeEJ14Zu-TWZRBt7TAXqmoBq9ARskuxQtJB9e_Z_Ug1dG1nv-eq2X50-UqYK1SGisEaGQSIl6ZvHKDfki1K8JtnXMzW54V_rooCnqkDrCts6sPcycyCwNSgWM8K0jfWKCrkwNt9mxfA4il1jyx8oYFfaEML8dOfhA3fa2OMgZ0cCAAQZd_TsD2l0EYjXuyJpz_js8ACN5ZI0_zXOTkjIKbaaSV12cN2tmzPBhpXjQDEjIk0aCgYKAYASARISFQGOcNnCCYk4Gt0ebjBgSpHFjNzwxQ0422";

  const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${MODEL_ID}:predict`;

  const headers = {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const definitionCard = document.getElementById("definition_card");
  const suggestionCard = document.getElementById("suggestion_card");
  const searchAvatar = document.getElementById("search_avtr");
  const searchGreeting = document.getElementById("search_title");
  const searchContainer = document.getElementById("search_sec");


  definitionCard.style.display = "none";
  suggestionCard.style.display = "none";

  document.getElementById("buttonAdd").addEventListener("click", function () {
    const topic = document.getElementById("tema").value;
    console.log("Valor de topic:", topic);

    const busqueda = `Dame una breve definición de no más de 250 caracteres del tema entre comillas, el lenguaje utilizado debe ser simple para que un niño de 8 años pueda entenderlo, si tiene palabras muy complejas entonces puedes utilizar analogías, pero apégate creativamente a un entorno académico, evita en todo momento el uso de lenguaje ofensivo y contenido que no sea apto para un niño menor de 12 años. Por último, dame una lista de tres recomendaciones de títulos de temas para seguir investigando del tema que estén ligadas a un rango de edad 8-12 años y a esa lista llámala "Sugerencias de búsqueda: " "${topic}"`;

    const data = {
      instances: [
        {
          content: busqueda,
        },
      ],
      parameters: {
        candidateCount: 1,
        maxOutputTokens: 1024,
        temperature: 0,
        topP: 0.8,
        topK: 40,
      },
    };

    fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        let respuesta = responseData.predictions[0].content;
        document.getElementById("definicion").innerHTML = respuesta;
        let respuestaSaltos = respuesta;

        let indice = respuestaSaltos.indexOf("Sugerencias de ");

        if (indice !== -1) {
          searchAvatar.style.display = "none";
          searchGreeting.style.display = "none";
          searchContainer.style.backgroundColor = "#fff";
          definitionCard.style.display = "block";
          suggestionCard.style.display = "block";


          const parte1 = respuestaSaltos.substring(0, indice).trim();
          const parte2 = respuestaSaltos.substring(indice).trim().split("*");
          console.log("parte2")
          console.log("Parte 1:", parte1);
          console.log("Parte 2:", parte2);

          suggestionCard.innerHTML = "";
          const titulo = document.createElement("h2");
          titulo.className = "suggestion_title";
          titulo.textContent = "Sugerencias de búsqueda";
          suggestionCard.appendChild(titulo);

          parte2.forEach((respuestaSalto, index) => {
            if (index !== 0) {
              const parrafo = document.createElement("p");
              parrafo.textContent = respuestaSalto;
              suggestionCard.appendChild(parrafo);
            }
          });

          document.getElementById("definicion").innerHTML = `<h3 id="card_title">${topic.toUpperCase()}</h3>` + parte1;


        } else {
          document.getElementById("definicion").innerHTML = respuesta;
          document.getElementById("ideas").innerHTML = "";
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

//BÚSQUEDA GOOGLE ACADEMICS
const searchButton = document.querySelector(".search_btn");
searchButton.addEventListener('click', () => {
  const inputBuscador = document.querySelector(".busqueda").value.toLowerCase();
  const searchTerm = inputBuscador.replace(/ /g, "+");

  if (searchTerm.length === 0) {
    alert('Debes escribir una palabra en la barra de búsqueda');
    return;
  }
  const googleAcamedicsApi = "http://localhost:3000/search/scholar?q=" + searchTerm;
  // const khanAcademyApi = " "";

const googleAcPromise =  fetch(googleAcamedicsApi)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .then(responseData => {
      console.log(responseData);
      displayTabsByCat(responseData);
    })
    .catch(error => {
      console.error("Error en la búsqueda: ", error);
    });
});
    

//const khanAcPromise = fetch(khanAcademyApi)
//    .then(response => {
  //     if(!response.ok){
    //        throw new Error(`Error in the request: ${response.status}`)
    //     }
    //    return response.json();
    //   });

/* 
    Promise.all([googleAcPromise, khanAcPromise])

    .then(responses => {
      const [googleData, khanData] = responses;
      const combinedData = {
        articles: googleData,
        videos: khanData
      };
      console.log(combinedData);
      displayTabsByCat(combinedData);
    })
    .catch(error => {
      console.error("Error en la búsqueda: ", error);
    }); 
});

/* function searchByTerm(searchTerm, data) {
  return data.filter(item =>
    item.title.toLowerCase().includes(searchTerm)
  );
} */

let tabSection = document.getElementById("result_section");
function displayTabsByCat(data) {
  let tabHtml = "";
  let tabCategory = "";
  const tabBox = document.querySelector(".tab_box");
  const tabContent = document.querySelector(".tab_content");

  tabCategory += `<div class="tabs"><button type="button" class="tab_btn" id="tab1">
      <img class="video_icon" src="../assets/img/icons/ph_video.svg" alt="icono videos"></button>`;
  tabCategory += `<button type="button" class="tab_btn" id="tab2">
      <img class="article_icon" src="../assets/img/icons/ph_read-cv-logo.svg" alt="icono articulos"></button></div>`;
  searchResults.forEach(result => {
    if (result.category === "Videos") {

      tabHtml += `<div class="video_card">
      <img src="${result.image}" alt="${result.title}" class="card_img">
      <div class="video-card_text">
        <h3>${result.title}</h3>
        <span><img src="../assets/img/icons/Icon.svg" alt="icono de vistas">${result.views}</span>
        <span><img src="../assets/img/icons/Comments_Icon.svg" alt="icono de comentarios">${result.comments}</span>
      </div>
    </div>`;
    } else if (result.category === "Artículos") {


      tabHtml += `<div class="article_card">
      <div class="article_info">
        <h3>${responseData.title}</h3>
        <p>${responseData.link}</p>
        <p>${responseData.snippet}</p>
      </div>
    </div>`;
    }
  });

  tabBox.innerHTML = tabCategory;
  tabContent.innerHTML = tabHtml;

  tabSection.appendChild(tabBox);
  tabSection.appendChild(tabContent);
}



//TABS
function selectTab(tabIndex) {
  document.getElementById("tab1_content").style.display = "none";
  document.getElementById("tab2_content").style.display = "none";
  document.getElementById("tab" + tabIndex + "Content").style.display = "block";
}



//MICROPHONE
const compatibleBrowser = () => {
  if (navigator.userAgent.indexOf("Chrome") || navigator.userAgent.indexOf("Edge") || navigator.userAgent.indexOf("Safari")) return true;
  console.log("el navegador no es compatible con el reconocimiento de voz");
  return false;
}

if (compatibleBrowser()) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = "es-US";

  const microphoneIcon = document.querySelector('.mic_btn');
  microphoneIcon.addEventListener('click', () => {
    recognition.start();
  });

  recognition.onresult = resultado => { manejarResultado(resultado) };
}

const manejarResultado = resultado => {
  const recognizedText = resultado.results[0][0].transcript;
  console.log("Recognized Text:", recognizedText);
  inputBuscador.value = recognizedText;
}







