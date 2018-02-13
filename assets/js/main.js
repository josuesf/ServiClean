'use strict';
const {server, socket} = require('../../config/init');

window.navigation = window.navigation || {},
function(n) {
    navigation.menu = {
      constants: {
        sectionTemplate: '.section-template',
        contentContainer: '#wrapper',
        startSectionMenuItem: '#home-menu',
        startSection: '#home'
      },

      importSectionsToDOM: function() {
        const links = document.querySelectorAll('link[rel="import"]')
        Array.prototype.forEach.call(links, function (link) {
          let template = link.import.querySelector(navigation.menu.constants.sectionTemplate)
          let clone = document.importNode(template.content, true)
          document.querySelector(navigation.menu.constants.contentContainer).appendChild(clone)
        })
      },

      setMenuOnClickEvent: function () {
        document.body.addEventListener('click', function (event) {
          if (event.target.dataset.section) {
            console.log(event);
            navigation.menu.hideAllSections()
            navigation.menu.showSection(event)
          }
        })
      },

      showSection: function(event) {
        const sectionId = event.target.dataset.section
        $('#' + sectionId).show()
        $('#' + sectionId + ' section').show()
      },

      showStartSection: function() {
        navigation.menu.hideAllSections() 
        $(navigation.menu.constants.startSection).show()
        $(navigation.menu.constants.startSection + ' section').show() 
      },

      hideAllSections: function() {
        $(this.constants.contentContainer + ' section').hide()
      },

      init: function() {
        this.importSectionsToDOM()
        this.setMenuOnClickEvent()
        this.showStartSection()
      }
    };

    n(function() {
        navigation.menu.init()
    })

}(jQuery);


(function () {
       
    function init() {

        var arrayDetailProducts=[];
        var arrayDetailTables=[];

        //------------------- begin button form ------------------------------------
        const remote = require('electron').remote; 
      
        document.getElementById("min-btn").addEventListener("click", function (e) {
          const window = remote.getCurrentWindow();
          window.minimize(); 
        });
        
        document.getElementById("max-btn").addEventListener("click", function (e) {
          const window = remote.getCurrentWindow();
          if (!window.isMaximized()) {
            window.maximize();
          } else {
            window.unmaximize();
          }  
        });
        
        document.getElementById("close-btn").addEventListener("click", function (e) {
          const window = remote.getCurrentWindow();
          window.close();
        });   
      
      //---------------------- end button form -----------------------------------

        //---- variable de conexion al socket
        var flagConnect=false;
        //---- mediante los eventos nativos cambiamos el valor de la variable flagConnect
        socket.on("connect",function(){
            flagConnect=true
        });

        socket.on("disconnect",function(){
            flagConnect=false
        }); 

        socket.emit('get_tables_in',{});

        $('select').material_select();

        $('.chips-placeholder').material_chip({
          placeholder: 'Ingredientes',
          secondaryPlaceholder: 'Ingredientes',
        });

        //-- evento para cambiar el estado del menu al ser seleccionado

        $("li").on("click",function(){
            $("ul>li").removeClass("active");
            $(this).addClass("active")
        });

        //====================begin section tables ==================================

        $("#btnCleanTable").on("click", function (e) {
          clearFormTables();
        });

        $("#btnSaveTable").on("click", function (e) {
            
             swal({
              title: 'Se procederá a guardar la mesa. ¿Desea continuar?',
              text: "Verifique los datos antes de guardar el registro!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33', 
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Aceptar',
              showLoaderOnConfirm: true
            }).then((result) => {
              if (result.value) {
                try{ 
                //------- send data socket io ------------------
                socket.emit('register_tables_in',{  'nombre': $("#txtNameTable").val(),
                                                    'capacidad': $("#txtStockTable").val(), 
                                                    'estado':$("#selectStatusTable").val() 
                                                });
                
                }catch(err){
                    alert(err.message)
                } 
              }
            });

        });


        //========================= begin section list tables =================

        $("#btnSearchTable").on("click", function (e){
            swal({
              title: 'Buscando mesa...',
              text: 'Espere un momento.',
              allowOutsideClick: false, 
              onOpen: () => {
                swal.showLoading()
              }
            });
            socket.emit('search_tables_in',{param:$("#txtParamTable").val()});
        });  


        $("#btnCloseDetailsTable").on("click", function (e){
            $('#modalDetailsTable').modal('close');
        });

        $("#btnEditDetailsTable").on("click", function (e){
            socket.emit('update_tables_in',{id_mesa:$("#txtIdMesa").val(),nombre:$("#txtNameDetailsTable").val(),capacidad:$("#txtStockDetailsTable").val(),estado:$("#selectStatusDetailsTable").val()});
        });

         //========================= end section list tables =================

         //---------------- event listener socket io --------------------------

        socket.on("get_tables_ou",function(data){ 
            console.log(data);
            $("#divTables").html('');
            var htmlTables='<div class="col s12 m12">';
            for(var i=0;i<data.length;i++){
                htmlTables=htmlTables+'<div class="col s2 m2">'+
                              '<div class="card">'+
                                '<div class="card-image waves-effect waves-block waves-light">'+
                                    '<img class="activator" src="assets/img/table1.png" >'+
                                    '<div class="row" style="position: absolute;top: 10px;left: 70px">'+
                                        '<div class="col s4"> <a class="btn btn-floating btn-medium pulse" id="'+data[i]._id+'"><strong style="font-size: 25px;">'+(i+1)+'</strong></a></div>'+ 
                                    '</div>'+
                                '</div>'+
                                '<div class="card-content">'+
                                  '<span class="card-title activator grey-text text-darken-4">'+data[i].nombre+'<i class="material-icons right">view_headline</i></span>'+
                                '</div>'+
                                '<div class="card-reveal col s12 m12">'+
                                  '<span class="card-title grey-text text-darken-4">Detalle<i class="material-icons right">close</i></span>'+ 
                                  '<ul class="collection" id="collectionProducts">'+
                                     '<span class="title">No hay pedidos para esta mesa</span>'+
                                  '</ul>'+
                                  '<div class="card-action center">'+
                                    '<a href="#" id="priceTotal"></a>'+ 
                                  '</div>'+
                                '</div>'+

                                '<div class="card-action center">'+
                                  '<a href="#">Historial de Pedidos</a>'+ 
                                '</div>'+
                              '</div>'+
                                '</div>';
            }
            htmlTables=htmlTables+'</div>'
            $("#divTables").html(htmlTables);
        }); 

         socket.on("update_tables_ou",function(data){ 
            swal(
              'Registro actualizado!', 
              'Presione el boton para proseguir',
              'success'
            );
            $("#tableListTables").html('');
            $('#modalDetailsTable').modal('close');
        }); 

        socket.on("register_tables_ou",function(data){ 
            swal(
              'Registro guardado!', 
              'Presione el boton para proseguir',
              'success'
            )
            clearFormTables();
        }); 


        socket.on("search_tables_ou",function(data){ 
            console.log(data);
            $("#tableListTables").html('');
            if(data.length!=0){
              var htmlTables='';
              arrayDetailTables=data;
              for(var i=0;i<data.length;i++){
                htmlTables=htmlTables+'<tr><th scope="row">'+(i+1)+'</th><td>'+data[i].nombre+'</td><td>'+data[i].capacidad+'</td><td>'+data[i].estado+'</td><td><button data-value='+i+' data-target="modalDetailsTable" class="btn btn-floating modal-trigger btnDetailsTable"><i class="large material-icons">mode_edit</i></button></td></tr>';
              }
              $("#tableListTables").html(htmlTables);
              swal.close();

              $(".btnDetailsTable").on("click", function (e){
                $("#txtIdMesa").val(arrayDetailTables[$(this).attr("data-value")]._id);
                $("#txtTitleDetailTable").text(arrayDetailTables[$(this).attr("data-value")].nombre);
                $("#txtNameDetailsTable").val(arrayDetailTables[$(this).attr("data-value")].nombre);
                $("#txtStockDetailsTable").val(arrayDetailTables[$(this).attr("data-value")].capacidad);
                $("#selectStatusDetailsTable").val(arrayDetailTables[$(this).attr("data-value")].estado);
                $('#modalDetailsTable').modal();
                Materialize.updateTextFields();
              });
            }else{
                swal.close();
                swal(
                  'Mesa no se encuentró', 
                  'Presione el boton para intentarlo de nuevo la búsqueda',
                  'warning'
                )
            } 

        });



        //====================end section tables ==================================
        
        //====================begin section products ==================================

        $("#btnClean").on("click", function (e) {
          clearFormProducts();
        });
 
        $("#btnSave").on("click", function (e) {

            swal({
              title: 'Se procederá a guardar el producto. ¿Desea continuar?',
              text: "Verifique los datos antes de guardar el registro!",
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33', 
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Aceptar',
              showLoaderOnConfirm: true
            }).then((result) => {
              if (result.value) {
                try{ 
                //------- send data socket io ------------------
                socket.emit('register_products',{   'nombre': $("#txtNameProduct").val(),
                                                    'descripcion': $("#txtDescription").val(),
                                                    'tipoProducto':$("#selectTypeProduct").val(),
                                                    'ingredientes':$('.chips-placeholder').material_chip('data'),
                                                    'precio':$("#txtPrice").val(),
                                                    'estado':$("#selectStatusProduct").val(),
                                                    'moneda':$("#txtSelectMoney").val(),
                                                    'nameFile': $('input[type=file]').val().replace(/C:\\fakepath\\/i, '')
                                                });
                //-------------------------------------------------
                swal({
                  title: 'Procesando...',
                  text: 'Espere un momento.',
                  allowOutsideClick: false, 
                  onOpen: () => {
                    swal.showLoading()
                  }
                });
                }catch(err){
                    alert(err.message)
                } 
              }
            });
        });


        //---------------- event listener socket io --------------------------

        socket.on("register_ou",function(data){
            $('#formSubmit').ajaxSubmit({
                type: 'post',
                url: server.urlServerImage+'/api/photo',
                data: $('#formSubmit').serialize(),
                success: function () {
                    swal.close();
                    swal(
                      'Registro guardado!', 
                      'Presione el boton para proseguir',
                      'success'
                    )
                }
            });
            clearFormProducts();
        }); 

    
        //========================= end section products ======================

        //========================= begin section home ========================

        socket.on("producto_mesa",function(data){ 
            //$("#collectionProducts").html('');
            var htmlCollectionProducto='';
            var subtotal=0;

            if(data.producto.length>0){
              for(var i=0;i<data.producto.length;i++){
                subtotal=subtotal+(parseFloat(data.producto[i].precio)*parseInt(data.cantidad))
                htmlCollectionProducto+='<li class="collection-item avatar">'+
                                            '<img src='+data.producto[i].fotoPortada+' alt="" class="circle responsive-img">' +
                                            '<span class="title">'+data.producto[i].nombre+'</span>'+
                                            '<p>'+data.producto[i].descripcion+'<br>'+data.cantidad+
                                            '</p>'+
                                            '<a href="#!" class="secondary-content">'+data.producto[i].precio+' '+data.producto[i].moneda+'</a>'+
                                          '</li>';
              } 
            }else{
                 htmlCollectionProducto+='<li class="collection-item avatar">'+ 
                                            '<span class="title">No hay pedidos para esta mesa</span>'+
                                          '</li>';
            }

            $("#collectionProducts").after(htmlCollectionProducto);
            $("#priceTotal").text("Total :"+subtotal.toFixed(2)+" soles");
            $("#00002").removeClass('red');
            $("#00002").addClass('orange');

        });

        socket.on("producto_mesa_confirmado",function(data){  
            $("#00002").removeClass('orange');
            $("#00002").addClass('red');
            $("#collectionProducts").html('');
        });


        //========================= end section home ======================== 



        //========================= begin section list products =================

        $("#btnSearch").on("click", function (e){
            swal({
              title: 'Buscando producto...',
              text: 'Espere un momento.',
              allowOutsideClick: false, 
              onOpen: () => {
                swal.showLoading()
              }
            });
            socket.emit('search_products_in',{type:$("#txtSelectSearch").val(),param:$("#txtParamProduct").val()});
        });  


        $("#txtParamProduct").keyup(function(e){ 
              var code = e.which; // recommended to use e.which, it's normalized across browsers
              if(code==13){
                swal({
                  title: 'Buscando producto...',
                  text: 'Espere un momento.',
                  allowOutsideClick: false, 
                  onOpen: () => {
                    swal.showLoading()
                  }
                });
                socket.emit('search_products_in',{type:$("#txtSelectSearch").val(),param:$("#txtParamProduct").val()});
              }
        });

        $("#btnCloseDetailsProduct").on("click", function (e){
            $('#modalDetailsProduct').modal('close');
        });

        $("#btnEditDetailsProduct").on("click", function (e){
             
        });

        socket.on("search_products_ou",function(data){ 
            console.log(data);
            $("#tableListProducts").html('');
            if(data.length!=0){
              var htmlProduct='';
              arrayDetailProducts=data;
              for(var i=0;i<data.length;i++){
                htmlProduct=htmlProduct+'<tr><th scope="row">'+(i+1)+'</th><td>'+data[i].nombre+'</td><td>'+data[i].descripcion+'</td><td>'+data[i].tipo_alimento+'</td><td><img src='+data[i].fotoPortada+' alt="" class="circle" style="height: 80px; width: 80px;"></td><td><button data-value='+i+' data-target="modalDetailsProduct" class="btn btn-floating modal-trigger btnDetails"><i class="large material-icons">mode_edit</i></button></td></tr>';
              }
              $("#tableListProducts").html(htmlProduct);
              swal.close();

              $(".btnDetails").on("click", function (e){
                $("#txtTitleDetailProduct").text(arrayDetailProducts[$(this).attr("data-value")].nombre);
                $("#txtNameDetailsProduct").val(arrayDetailProducts[$(this).attr("data-value")].nombre);
                $("#txtDetailsDescription").val(arrayDetailProducts[$(this).attr("data-value")].descripcion);
                $("#selectTypeDetailsProduct").val(arrayDetailProducts[$(this).attr("data-value")].tipo_alimento);
                $("#selectStatusDetailsProduct").val(arrayDetailProducts[$(this).attr("data-value")].estado);
                $("#txtPriceDetails").val(arrayDetailProducts[$(this).attr("data-value")].precio);
                $("#txtSelectDetailsMoney").val(arrayDetailProducts[$(this).attr("data-value")].moneda);
                $("#txtIngredientes").material_chip({data:arrayDetailProducts[$(this).attr("data-value")].ingredientes});
                $("#imgDetailsProduct").attr("src",arrayDetailProducts[$(this).attr("data-value")].fotoPortada);  
                $('#modalDetailsProduct').modal();
                Materialize.updateTextFields();
              });
            }else{
                swal.close();
                swal(
                  'Producto no se encuentró', 
                  'Presione el boton para intentarlo de nuevo la búsqueda',
                  'warning'
                )
            } 

        });


        //========================= end section list products ===================




        //========================= begin form clean ================================

        function clearFormProducts(){
          $("#txtNameProduct").val("");
          $("#txtDescription").val("");
          $("#selectTypeProduct").val("Comida");
          $('.chips-placeholder').material_chip({
              placeholder: 'Ingredientes',
              secondaryPlaceholder: 'Ingredientes',
              data: [{} ],
          });
          $("#txtPrice").val(""); 
          $("#txtSelectMoney").val("soles");
        }

         function clearFormTables(){
          $("#txtNameTable").val("");
          $("#txtStockTable").val("");
          $("#selectTypeProduct").val("Comida");
          $("#selectStatusTable").val("activo");
        }


        //===================== end form clean ======================================
    }; 

  

      
    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init(); 
        }
    };
})();

        