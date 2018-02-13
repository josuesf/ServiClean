'use strict';
//const {server, socket} = require('../../config/init');

(function () {
       
    function init() {

        //------------------- begin button form ------------------------------------
        const remote = require('electron').remote; 
        const win = remote.getCurrentWindow();
        //win.loadURL(__dirname+'/../../index.html');
       

         function clearRegister(){
          $("#txtUserRegister").val("");
          $("#txtEmailRegister").val("");
          $("#txtPasswordRegister").val("");
          $("#txtPasswordAgainRegister").val("");  
        }

        //---------- section login register

        $("#btnRegisterRegister").on("click",function(){
            var user=$("#txtUserRegister").val();
            var email=$("#txtEmailRegister").val();
            var pass=$("#txtPasswordRegister").val();
 

            if(flagConnect){
                socket.emit('login_register_in',{user:user,email:email,pass:pass});
            }else{
                swal(
                  'Estado de Conexión!', 
                  'Error en la conexión. Intentelo más tarde',
                  'error'
                )
            }
        });

        $("#btnLoginBefore").on("click",function(){
            win.loadURL(__dirname+'/../../views/login.html');
        });

        //---------- section login

         $("#btnRegister").on("click",function(){
            win.loadURL(__dirname+'/../../views/login_register.html');
        });

        $("#btnLogin").on("click",function(){
            if(flagConnect){
                swal({
                  title: 'Autentificando usuario...',
                  text: 'Espere un momento.',
                  allowOutsideClick: false, 
                  onOpen: () => {
                    swal.showLoading()
                  }
                });

                socket.emit('login_in',{user:$("#txtUser").val(),pass:$("#txtPassword").val()});

            }else{
                swal(
                  'Estado de Conexión!', 
                  'Error en la conexión. Intentelo más tarde',
                  'error'
                )
            }
        });
 
    }; 

  

      
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init(); 
        }
    };
})();

        