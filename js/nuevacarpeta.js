document.getElementById('EditButton').addEventListener('click', function() {
    const campos = document.querySelectorAll('.InputNewFolder1');
    const uploadInput = document.getElementById('UploadImageInput');
    const editButton = document.getElementById('EditButton');
    const backButton = document.getElementById('BackButton');

   

    if(editButton.dataset.estado ==='editando'){
        for (var i = 0; i < campos.length; i++) {
        campos[i].readOnly = true;
        campos[i].style.borderColor = 'var(--tech30)';
    }
        uploadInput.setAttribute('disabled', 'true');
    
        editButton.style.backgroundImage = 'url("../images/edit.svg")'; 
        editButton.value = 'Editar';
        backButton.style.color = 'var(--orange)';
        backButton.style.borderColor = 'var(--orange)';
        backButton.style.backgroundImage = 'url("../images/arrow-back.svg")';
        backButton.style.cursor = 'pointer'
        backButton.style.boxShadow ='6px 6px 6px -1px rgba(11, 0, 51, 0.4)'

        editButton.dataset.estado = 'no editando'; 

    } else{
        for (var i = 0; i < campos.length; i++) {
            campos[i].readOnly = false;
            campos[i].style.borderColor = 'var(--tech)';
        }
        uploadInput.removeAttribute('disabled');
        
        editButton.style.backgroundImage = 'url("../images/check.svg")'; 
        editButton.value = 'Guardar';
        backButton.style.color = 'hsla(0, 0%, 85%, 1)';
        backButton.style.borderColor = 'hsla(0, 0%, 85%, 1)';
        backButton.style.backgroundImage = 'url("../images/arrow-back2.svg")';
        backButton.style.cursor = 'none'
        backButton.style.boxShadow ='none'
    
        editButton.dataset.estado = 'editando';

        backButton.addEventListener('click', function(event) {
                event.preventDefault();

    });
    
}  
    
        
    
});

const buttons_tab = document.querySelectorAll(".tabButton");
const messagebuttons = document.getElementById('Save-videos');

    buttons_tab.forEach((b) => {
      b.addEventListener("click", () => {
        buttons_tab.forEach((btn) => {
          btn.classList.remove("active");
          const activeImg = btn.querySelector(".active-image");
          const defaultImg = btn.querySelector(".default-img");
          activeImg.style.display = "none";
          defaultImg.style.display = "block";
          
          
        });
        b.classList.add("active");
        const activeImg = b.querySelector(".active-image");
        const defaultImg = b.querySelector(".default-img");
        activeImg.style.display = "block";
        defaultImg.style.display = "none";
        messagebuttons.textContent = "¡Ouch! Aún no tienes Artículos Guardados";
     
      });
      const targets = document.querySelectorAll("[data-target]");
      const content = document.querySelectorAll("[data-content]");
      targets.forEach((target) => {
        target.addEventListener("click", function () {
          content.forEach((c) => {
            c.classList.remove("activo");
            
          });
          const t = document.querySelector(target.dataset.target);
          t.classList.add("activo");
        
        });
    });
});

