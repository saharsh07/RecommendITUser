const toggleHide = () => {
    // cuando hacemos click, se abre un nuevo formulario
    document.getElementById('myForm').classList.toggle('hide')
}


const notifyMe = (pname) => {
  
    var product = pname;
    // Let's check whether notification permissions have already been granted
    if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(`Product ${pname} added successfully`);
    }
  
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification("Product added successfully");
        }
      });
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  const askPermission = () => {
    if (Notification.permission !== "denied") {
        Notification.requestPermission();
      }
  }
// scroll



    