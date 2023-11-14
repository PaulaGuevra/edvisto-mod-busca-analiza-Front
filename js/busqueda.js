
//CONSTANTES
const definitionCard = document.getElementById("definition_card");
const suggestionCard = document.getElementById("suggestion_card");
const saveContainer = document.getElementById('save_container');
const searchAvatar = document.getElementById("search_avtr");
const searchGreeting = document.getElementById("search_title");
const searchContainer = document.getElementById("search_sec");
const blackMicrophone = document.getElementById('alter-micro');
const microphone = document.getElementById('default-micro');





document.addEventListener("DOMContentLoaded", function () {
  definitionCard.style.display = "none";
  suggestionCard.style.display = "none";
  saveContainer.style.display = "none";
  blackMicrophone.style.display = "none";

  document.getElementById("buttonAdd").addEventListener("click", performSearch);
  //BÚSQUEDA CON IA
  function performSearch() {
    const topic = document.getElementById("tema").value;

    if (topic === '') {
      clearSearchResults()
      return;
    }

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

    fetchDefinitionAndSuggestions(data, topic);
  }

  //descarga definition card
  function captureAndDownloadScreenshot() {
    const targetElement = document.getElementById('capture-area');
    const topicInput = document.getElementById('tema');
    const downloadBtn = document.getElementById('download_btn');


    const topicValue = topicInput.value;

    downloadBtn.style.visibility = 'hidden';

    html2canvas(targetElement).then(function (canvas) {
      const dataUrl = canvas.toDataURL('image/jpeg');

      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;

      downloadLink.download = `${topicValue}_screenshot.jpeg`;

      document.body.appendChild(downloadLink);

      downloadLink.click();

      document.body.removeChild(downloadLink);

      downloadBtn.style.visibility = 'visible';
    });
  }




  //Definiciones y sugerencias de la IA
  function fetchDefinitionAndSuggestions(data, topic) {

    const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
    const PROJECT_ID = "intrepid-period-401518";
    const MODEL_ID = "text-bison";
    const ACCESS_TOKEN = "ya29.a0AfB_byAxuNil3oyWojLGcqww0yygGuT_wCT_G1yaK41kI3CLMdkZ-mGOW3lgbxdpLsS6S-X4d4TCQkuXaYkLmJ1H5GYC0goDZAeaXP6hIJ8gquL1TyE2Ir4dTRvWhsMfDebNIuNfAHyVy2AYY2yCWd6tTW2GwheL5ZP8eVK1ngCQ4NuLqnMm_ZuvJtw5kX-Lg19JysQg6Wq7eWFRopkZ6srkpE54uNR2wY4FVgkiF8_UxaSaLakAcZVcYClDQtudGIeF3YtN5B1lgVsd3o7juNFD2Ya9tjfaf3t0ycbgfv2SZzGjxm8ZKEfwu9QSJhPJc_sV310-7VVsSJQ-xNEBnT9ZIfkqn8SKnVJltiDrsid9woNeXFkR8Rpq1uymFnl5MZ7iHRCkjjXr-DCpxipHx6AEz9jjPYGsaCgYKAY4SARISFQHGX2MiOiJZX0HxjlT0QWh3xfXxQw0423";

    const url = `https://${API_ENDPOINT}/v1/projects/${PROJECT_ID}/locations/us-central1/publishers/google/models/${MODEL_ID}:predict`;

    const headers = {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
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
          microphone.style.display = "none";
          blackMicrophone.style.display = "block";

          const parte1 = respuestaSaltos.substring(0, indice).trim();
          const parte2 = respuestaSaltos.substring(indice).trim().split("*");

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
               //sweet alert here
              
              copyButton.title = "El texto ha sido copiado al portapapeles";
            });

          suggestionContainer.appendChild(suggestion);
          suggestionContainer.appendChild(copyButton);
          suggestionCard.appendChild(suggestionContainer);
        }
      });



    document.getElementById("definicion").innerHTML = `<h3 id="card_title">${topic.toUpperCase()}</h3>` + parte1 + `<div><img src="../assets/img/icons/definition_card_logo.svg" alt="logo EdVisto" class="logo_card" height=50><button type="button" id="download_btn"><img src="../assets/img/icons/download.svg" class="download_icon"></button></div>`;

    document.getElementById('download_btn').addEventListener('click', captureAndDownloadScreenshot)
  }
})
  .catch((error) => {
    console.error(error);
  });
  }


});




//BÚSQUEDA VIDEOS Y ARTICULOS

const searchButton = document.querySelector(".search_btn");
const searchInput = document.querySelector(".busqueda");

searchButton.addEventListener('click', search)

//FUNCIÓN DE BÚSQUEDA
function search() {
  const inputBuscador = searchInput.value.toLowerCase();
  const searchTerm = inputBuscador.replace(/ /g, "+");
  if (searchTerm != ""){
    clearTabsContent();
    createTabButtons();
    searchYouTube(searchTerm);
    searchGoogleAcademics(searchTerm);
  }
}

//TABS
function createTabButtons() {
  const tabButtons = document.getElementById("tab_btn");
  if (tabButtons) {

    tabButtons.innerHTML = `<div id="api1_btn">
      <button class="tabButton active" id="search_videos" aria-label="Resultados de videos" data-target="#videos">
      <img class="default-img" src="../assets/img/icons/videos_tab_white.svg" alt="icono video">
      <img class="active-image" src="../assets/img/icons/ph_video.svg" alt="icono video">
      </button></div>
      <img src="./assets/img//icons/separadorTabs.svg" alt="linea divisora" class="line">
      <div id="api2_btn"><button class="tabButton" id="search_articles" aria-label="Resultado de articulos" data-target="#articles">
      <img class="default-img" src="../assets/img/icons/art_tab_white.svg" alt="icono articulo">
      <img class="active-image" src="../assets/img/icons/tab_articulos.svg" alt="icono articulo"></button></div>`;
  }

  const buttons_tab = document.querySelectorAll('.tabButton');
  buttons_tab.forEach(b => {
    b.addEventListener('click', () => {
      buttons_tab.forEach(btn => {
        btn.classList.remove('active');
        const activeImg = btn.querySelector('.active-image');
        const defaultImg = btn.querySelector('.default-img');
        activeImg.style.display = "none";
        defaultImg.style.display = "block";
      });
      b.classList.add('active');
      const activeImg = b.querySelector('.active-image');
      const defaultImg = b.querySelector('.default-img');
      activeImg.style.display = "block";
      defaultImg.style.display = "none";
    });
    const targets = document.querySelectorAll('[data-target]');
    const content = document.querySelectorAll('[data-content]');
    targets.forEach(target => {
      target.addEventListener('click', function () {
        content.forEach(c => {
          c.classList.remove("activo")
        })
        const t = document.querySelector(target.dataset.target)
        t.classList.add("activo")
      });
    });
  });
}

//BORRAR TABS
function clearTabsContent() {
  const tabBox1 = document.querySelector(".tab_api1");
  const tabBox2 = document.querySelector(".tab_api2");

  if (tabBox1) {
    tabBox1.innerHTML = '';
  }

  if (tabBox2) {
    tabBox2.innerHTML = '';
  }

  // Restablece la pestaña activa si es necesario
  const buttons_tab = document.querySelectorAll('.tabButton');
  buttons_tab.forEach(b => {
    b.classList.remove('active');
    const activeImg = b.querySelector('.active-image');
    const defaultImg = b.querySelector('.default-img');
    activeImg.style.display = "none";
    defaultImg.style.display = "block";
  });
  const firstTabButton = document.querySelector('.tabButton');
  if (firstTabButton) {
    firstTabButton.classList.add('active');
    const activeImg = firstTabButton.querySelector('.active-image');
    const defaultImg = firstTabButton.querySelector('.default-img');
    activeImg.style.display = "block";
    defaultImg.style.display = "none";
  }
}

//BOTÓN DE GUARDADO
function createSaveButton(parentElement) {
  const saveButton = document.createElement("button");
  saveButton.classList.add("save-button");
  const icon = document.createElement("img");
  icon.classList.add("save_icon");
  icon.src = "../assets/img/icons/icono_guardar.svg";
  saveButton.appendChild(icon);

  saveButton.addEventListener("click", () => {
    const container = document.getElementById('save_container');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    container.style.display = "block";
    let div = `
        <div class="save_div">
            <h3>Guardar en Biblioteca del Explorador</h3>
            <ul>
                <li><button type="button" id="c1"><img src="../assets/img/icons/white_save_icon.svg" alt="icono guardar"> Carpeta 1 </button> </li>
                <li><button type="button" id="c2"><img src="../assets/img/icons/white_save_icon.svg" alt="icono guardar">  Carpeta 2 </button> </li>
                <li><button type="button" id="new_folder"><img src="../assets/img/icons/newproject.svg" alt="icono nueva carpetar"> Nuevo </button> </li>
            </ul>
        </div>`;
    container.innerHTML = div;

    console.log("Save button clicked");
    // You can add a sweet alert or any other functionality here

    overlay.addEventListener('click', () => {
      container.style.display = "none";
      overlay.remove();
    });
  });


  parentElement.appendChild(saveButton);
}

//BÚSQUEDA CON YOUTUBE
function searchYouTube(searchTerm) {
  const youtubeApi = "http://localhost:3000/videos/youtube?q=" + searchTerm;
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
      const tabBox1 = document.querySelector(".tab_api1");
      tabBox1.innerHTML = '';
      const videoContainer = document.createElement('div');
      videoContainer.classList.add('video_container');
      responseData.forEach(channel => {
        const channelName = channel.channelId;
        let nombreCanal;

        if (channelName === "UCnmlG_YzRYzWzJbW2oDn_ow") {
          nombreCanal = "National Geographic";
        } else {
          nombreCanal = "Khan Academy";
        }

        channel.videos.forEach(video => {
          const videoTitle = video.title;
          const videoThumbnail = video.thumbnail;
          const videoUrl = video.videoLink;
          const resultElement = document.createElement('div');
          resultElement.classList.add('video_card');
          resultElement.innerHTML = `
          <div class="video_content">
          <img class="video_img" src="${videoThumbnail}" alt="${videoTitle}">
          <a href=${videoUrl}" target="_blank" class="video_link"><h3>${videoTitle} <img src="../assets/img/icons/ir_icono.svg" alt="icono ir" height=30></h3></a>
          <p>${nombreCanal}<p>
          <div/>
        `;
          createSaveButton(resultElement);
          videoContainer.appendChild(resultElement);
          tabBox1.appendChild(videoContainer);
        })
      });
      const api1Btn = document.getElementById("api1_btn");
      api1Btn.appendChild(tabBox1);
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
    });
}

//BÚSQUEDA CON GOOGLE ACADEMICS
function searchGoogleAcademics(searchTerm) {
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
      if (responseData.results !== "" && responseData.results !== undefined) {
        responseData.results.forEach(result => {
          const card = document.createElement("div");
          card.classList.add("card");
          const cardContent = document.createElement("div");
          cardContent.classList.add("card-content");
          const modifiedTitle = rearrangeTitle(result.title);
          const title = document.createElement("h2");
          title.innerText = modifiedTitle;
          const link = document.createElement("a");
          link.href = result.link;
          link.target = "_blank";
          link.appendChild(title);

          const snippet = document.createElement("p");
          snippet.classList.add("card-text");
          snippet.textContent = result.snippet;

          cardContent.appendChild(link);
          cardContent.appendChild(snippet);
          createSaveButton(cardContent)

          card.appendChild(cardContent);

          tabBox2.appendChild(card);
        });
      }
      const api2Btn = document.getElementById("api2_btn");
      api2Btn.appendChild(tabBox2);
    })
    .catch(error => {
      console.error("Error en la búsqueda: ", error);
    });
}

//BORRAR BUSQUEDA
function clearSearchResults() {
  const searchHtml = document.getElementById('search_result_section');
  if (searchHtml) {
    searchHtml.innerHTML = ` <div id="capture-area">
                <div id="definition_card" style="display:none">
                    <p id="definicion"></p>
                </div>
            </div>
            <div id="suggestion_card" style="display:none">
                
            </div>
            <div id="result_section" style="display:none">
                <div id="tab_btn"></div>
                <div class="tab_api1 activo" id="videos" data-content></div>
                <div class="tab_api2" id="articles" data-content></div>
                <div id="save_container"></div>
            </div>`;
  }
  if (definitionCard) {
    definitionCard.style.display = "none";
  }
  if (suggestionCard) {
    suggestionCard.style.display = "none";
  }
  if (saveContainer) {
    saveContainer.style.display = "none";
  }
  if (blackMicrophone) {
    blackMicrophone.style.display = "none";
  }
  if (microphone) {
    microphone.style.display = "block";
  }
  if (searchAvatar) {
    searchAvatar.style.display = "flex";
  }
  if (searchGreeting) {
    searchGreeting.style.display = "inline-flex";
  }
  if (searchContainer) {
    searchContainer.style.backgroundColor = "#0B0033";
  }
  if (searchInput) {
    searchInput.value = "";
  }
  clearTabsContent();
  search();
}



document.getElementById('tema').addEventListener('keydown', function (event) {
  if (event.key === 'Backspace' && this.value === '') {
    clearSearchResults();
  }
});



//MICROPHONE
const compatibleBrowser = () => {
  if (navigator.userAgent.indexOf("Chrome") !== -1 || navigator.userAgent.indexOf("Edge") !== -1 || navigator.userAgent.indexOf("Safari") !== -1) {
    return true;
  }
  console.log("el navegador no es compatible con el reconocimiento de voz");
  return false;
}

if (compatibleBrowser()) {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
  recognition.lang = "es-US";

  const microphoneIcons = document.querySelectorAll('.mic_btn');
  microphoneIcons.forEach(microphoneIcon => {
    microphoneIcon.addEventListener('click', () => {
      recognition.start();
    });
  });

  recognition.onresult = resultado => { manejarResultado(resultado) };
}

const manejarResultado = resultado => {
  const recognizedText = resultado.results[0][0].transcript;
  console.log("Recognized Text:", recognizedText);
  const inputBuscador = document.getElementById('tema');
  inputBuscador.value = recognizedText;
}






