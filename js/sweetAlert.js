document.addEventListener('textCopied', function (event) {
    Swal.fire({
      title: "Texto copiado al portapapeles",
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
      },
    });
  });
  
