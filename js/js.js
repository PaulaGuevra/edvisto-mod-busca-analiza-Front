    const seccionbiblioteca = document.getElementById('seccionbiblioteca');
    const savebutton = document.getElementById('save');
    const abrirPopUp = document.getElementById('CrearNewFolder');
    const cerrarPopUp = document.getElementById('CancelButton');
    const PopUp = document.getElementById('Form1');
    const formulario = document.querySelector('.Formulario');
    const abrirConfirmacionCarpeta = document.getElementById('AcceptButton');
    const cerrarConfirmacionCarpeta = document.getElementById('CloseButton');
    const ConfirmacionCrearCarpeta = document.getElementById('ConfirmacionCrearCarpeta');


                abrirPopUp.addEventListener("click",()=>{
                    console.log('Abriendo formulario');
                    PopUp.showModal();
                    formulario.reset();

                }) 
                cerrarPopUp.addEventListener("click",()=>{
                    console.log('Cerrando formulario');
                    PopUp.close();
                    formulario.reset();
                       
                })

                formulario.addEventListener('submit', function(event){
                    event.preventDefault();

                
                    if(validarFormulario()){
                        console.log('Formulario válido. Enviar formulario...');
                        ConfirmacionCrearCarpeta.style.display = 'block';
                        ConfirmacionCrearCarpeta.showModal();
                                               
                    } else{
                        console.log('Formulario no válido. Verifica los campos.');
                    }
                   
                });
                function validarFormulario(){
                    const NombreProyecto = document.getElementById('NombreProyecto');
                    const Objetivo = document.getElementById('Objetivo');

                    if(NombreProyecto.value.trim()===''){
                        alert('El campo Nombre del Proyecto no puede estar vacío.');
                        return false;
                    }

                    if(Objetivo.value.trim()===''){
                        alert('El campo Objetivo no puede estar vacío.');
                        return false;
                    }

                    return true
                }          

                    cerrarConfirmacionCarpeta.addEventListener("click",()=>{
                        ConfirmacionCrearCarpeta.close();
                        PopUp.close();
                        ConfirmacionCrearCarpeta.style.display = 'none';
                    }) 
                     
            
                
                
                console.log('Le diste click al botón biblioteca')

   
                       
            
            


   

       

     