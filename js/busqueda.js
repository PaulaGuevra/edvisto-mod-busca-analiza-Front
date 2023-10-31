//BUSQUEDA CON IA

document.addEventListener("DOMContentLoaded", function () {
  const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
  const PROJECT_ID = "intrepid-period-401518";
  const MODEL_ID = "text-bison";
  const ACCESS_TOKEN = "";

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
  const saveContainer = document.getElementById('save_container');

  definitionCard.style.display = "none";
  suggestionCard.style.display = "none";
  saveContainer.style.display = "none";

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
              const suggestionContainer = document.createElement("div");
              suggestionContainer.classList.add("suggestion-container");

              const suggestion = document.createElement("span");
              suggestion.className = "text_to_copy";
              suggestion.setAttribute("data-index", index)
              suggestion.textContent = respuestaSalto;

              const copyButton = document.createElement("button");
              copyButton.classList.add("copy-btn");
              copyButton.setAttribute("data-index", index);

              const icon = document.createElement("img");
              icon.classList.add("copy_icon");
              icon.src = "../assets/img/icons/copy.svg";

              copyButton.appendChild(icon);

              copyButton.addEventListener("click", () => {

                const dataIndex = copyButton.getAttribute("data-index");
                const textToCopy = document.querySelector(`.text_to_copy[data-index="${dataIndex}"]`).textContent;

                const tempTextArea = document.createElement("textarea");
                tempTextArea.value = textToCopy;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);

                copyButton.title = "El texto ha sido copiado al portapapeles";

                console.log("Texto copiado al portapapeles");
                console.log("Copy button clicked");
              });

              suggestionContainer.appendChild(suggestion);
              suggestionContainer.appendChild(copyButton);
              suggestionCard.appendChild(suggestionContainer);
            }

          });

          document.getElementById("definicion").innerHTML = `<h3 id="card_title">${topic.toUpperCase()}</h3>` + parte1 + `<button type="button" id="download_btn"><img src="../assets/img/icons/download.svg" class="download_icon"></button>`;

          const downloadBtn = document.getElementById('download_btn');

          downloadBtn.addEventListener('click', () => {

            console.log('hiciste click en descargar');
          });

        } else if (topic == '') {
          document.getElementById("definicion").innerHTML = '';
          document.getElementById("ideas").innerHTML = '';
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

//BÚSQUEDA VIDEOS Y ARTICULOS

const searchButton = document.querySelector(".search_btn");

searchButton.addEventListener('click', () => {
  const inputBuscador = document.querySelector(".busqueda").value.toLowerCase();
  const searchTerm = inputBuscador.replace(/ /g, "+");

  if (searchTerm.length === 0) {
    alert('Debes escribir una palabra en la barra de búsqueda');
    return;
  }

  //TABS
    const tabButtons = document.getElementById("tab_btn");
    if (searchTerm !== ""){
    
      tabButtons.innerHTML = `<div id="api1_btn">
    <button class="tabButton active" id="search_videos" aria-label="Resultados de videos" data-target="#videos">
    <img class="active-image" src="../assets/img/icons/ph_video.svg"></button></div>
    <div id="api2_btn"><button class="tabButton" id="search_articles" aria-label="Resultado de articulos" data-target="#articles">
    <img class="active-image" src="../assets/img/icons/tab_articulos.svg"></button></div>`;
  
    const targets = document.querySelectorAll('[data-target]');
    const content = document.querySelectorAll('[data-content]');
    targets.forEach(target => {
      target.addEventListener('click', function () {
        content.forEach(c => {
          c.classList.remove("activo")
        })
  
        const t = document.querySelector(target.dataset.target)
        t.classList.add("activo")
      })
    })
  } else if (searchTerm === ""){
    const tabVideos = document.getElementById('videos');
    const tabArticulos = document.getElementById('articles');
    tabButtons.innerHTML = "";
    tabVideos.innerHTML= "";
    tabArticulos.innerHTML=="";
  }

  const buttons_tab = document.querySelectorAll('.tabButton');
  buttons_tab.forEach(b => {
    b.addEventListener('click', () => {
      buttons_tab.forEach(btn => {
        btn.classList.remove('active');
      });
      b.classList.add('active');
    });
  });

  


  //BUSQUEDA YOUTUBE
  const youtubeApi = "http://localhost:5000/youtube/buscar/" + searchTerm;
  fetch(youtubeApi, {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })
    .then(responseData => {

      let tabBox1 = document.querySelector(".tab_api1");

      tabBox1.innerHTML = '';
      const videoContainer = document.createElement('div');
      videoContainer.classList.add('video_container');

      responseData.forEach(item => {
        const videoTitle = item.titulo;
        const videoThumbnail = item.miniatura;
        const videoId = item.enlace;
        const resultElement = document.createElement('div');
        resultElement.classList.add('video_card');
        resultElement.innerHTML = `
        <div clas="video_content">
        <img class="video_img" src="${videoThumbnail}" alt="${videoTitle}">
        <h3>${videoTitle}</h3>
        <div/>
        <a href=${videoId}" target="_blank">Ver en YouTube</a>
        
      `;
        const saveButton = document.createElement("button");
        saveButton.classList.add("save-button");

        const icon = document.createElement("img");
        icon.classList.add("save_icon");
        icon.src = "../assets/img/icons/icono_guardar.svg";

        saveButton.appendChild(icon);

        saveButton.addEventListener("click", () => {
          const container = document.getElementById('save_container');
          container.style.display = "block";
          let div = `<div class="save_div">
                       <ul>
                          <li><button type="button" id="c1"> Carpeta 1 </button> </li>
                          <li><button type="button" id="c2"> Carpeta 2 </button> </li>
                          <li><button type="button" id="new_folder"> Nuevo </button> </li>
                        </ul>
                     </div>`

          container.innerHTML = div;
          console.log("Save button clicked");
        });
        resultElement.appendChild(saveButton);
        videoContainer.appendChild(resultElement);
        tabBox1.appendChild(videoContainer);
      });
      const api1Btn = document.getElementById("api1_btn");
      api1Btn.appendChild(tabBox1);
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
    });

  //GOOGLE ACADEMICS
  function rearrangeTitle(title) {
    const regex = /\[(.*?)\]/g;
    const matches = [];
    let match;

    while ((match = regex.exec(title)) !== null) {
      matches.push(match[0]);
    }

    const cleanedTitle = title.replace(/\[(.*?)\]/g, '').trim();
    const modifiedTitle = cleanedTitle + ' ' + matches.join(' ');

    return modifiedTitle;
  }


  const googleAcademicsApi = "http://localhost:3000/search/scholar?q=" + searchTerm;
  fetch(googleAcademicsApi, {
    method: 'GET',
    credentials: 'include',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      return response.json();
    })

    .then(responseData => {

      const tabBox2 = document.querySelector(".tab_api2");

      tabBox2.innerHTML = '';

      responseData.results.forEach(result => {
        const card = document.createElement("div");
        card.classList.add("card");

        const cardContent = document.createElement("div");
        cardContent.classList.add("card-content");

        const modifiedTitle = rearrangeTitle(result.title);

        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = modifiedTitle;

        const link = document.createElement("a");
        link.href = result.link;
        link.textContent = `${result.link}`

        const snippet = document.createElement("p");
        snippet.classList.add("card-text");
        snippet.textContent = result.snippet;

        const saveButton = document.createElement("button");
        saveButton.classList.add("save-button");

        const icon = document.createElement("img");
        icon.classList.add("save_icon");
        icon.src = "../assets/img/icons/icono_guardar.svg";

        saveButton.appendChild(icon);

        saveButton.addEventListener("click", () => {
          const container = document.getElementById('save_container');
          container.style.display = "block";
          let div = `<div class="save_div">
                       <ul>
                          <li><button type="button" id="c1"> Carpeta 1 </button> </li>
                          <li><button type="button" id="c2"> Carpeta 2 </button> </li>
                          <li><button type="button" id="new_folder"> Nuevo </button> </li>
                        </ul>
                     </div>`

          container.innerHTML = div;
          console.log("Save button clicked");
        });


        cardContent.appendChild(title);
        cardContent.appendChild(link);
        cardContent.appendChild(snippet);
        cardContent.appendChild(saveButton)


        card.appendChild(cardContent);

        tabBox2.appendChild(card);
      });

      const api2Btn = document.getElementById("api2_btn");
      api2Btn.appendChild(tabBox2);

    })
    .catch(error => {
      console.error("Error en la búsqueda: ", error);
    });

  //BORRAR BUSQUEDA



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
  const inputBuscador = document.getElementById('tema');
  inputBuscador.value = recognizedText;
}





