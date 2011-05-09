Titanium.include('request/json.js', 'utils.js','constants.js', 'photo_gallery.js');
/* TODO:  DRY this forms is quite similar to preferences.js*/
var data = [];
/*
* TYPES of field in the form
*/    

var TEXT_FIELD = 1;
var LABEL_FIELD = 2;
var TEXTAREA_FIELD = 3;
var tableview;
var win = Ti.UI.createWindow({});
var imageView;
var image_data;
/* Fields, check validations.....
* It gets the field where the value is from the id. 
*/
function getField(id) {
    for (i = 0; i < data.length; i++) {
        if (data[i].children[0].text == id) {
            return data[i].children[2];
        }
    }
}      
var fieldNonValidated = [];
var mandatory = {name:1, description:1};
function checkFocus(e) {
    var field = e.source;
    if (e.type == 'blur' && field.id in mandatory) {
        var field = e.source;
        if (!trim(field.value)) {
            field.borderColor = 'red';
            addElement(fieldNonValidated,field);
        } else if (field.borderColor == 'red') {                
            if (Titanium.Platform.name.indexOf('iPhone')>-1) {
               if (field.id == 'body') {
                   field.borderWidth = 2;
                   field.borderColor ='#bbb';
               } else {
                   field.borderColor ='';
                   field.borderWidth = 0;
               }
            }else {
                field.borderWidth = 0;
                field.borderColor ='#000';
            }
            deleteElement(fieldNonValidated, field);
        }
    }
}
/* Creates the fields of the row//{{{
* IT creates a row as follows:
*  label ----- textfield/label
* 
* name : Text of the label
* type_filed : if the element in the second column it's a label or a textfield
* value: for the element in the second column
*/
function createStandardRow(id, name, type_field, value) {
    type_field = type_field || TEXT_FIELD; // by default
    var row = Ti.UI.createTableViewRow();
    //row.selectedBackgroundColor = '#385292';
    row.height = 65;
    var label_id = Titanium.UI.createLabel({ //store in order to get it later
        text:id,
        visible:false,
        width:'1',
        height:'1'
    });
    row.add(label_id);
    
    var label = Titanium.UI.createLabel({
        text:name,
        textAlign:'center',
        font:{fontSize:16,fontWeight:'bold'},
        left:2,
        color:'#336699',
        width:'100',
        height:'auto'
    });
    row.add(label);
    var field;
    switch (type_field) {
        case TEXT_FIELD:
            field = Titanium.UI.createTextField({
                color:'#000',
                height:45,
                left:110,
                font:{fontSize:16,fontWeight:'bold'},
                width:150,
                value:value,
                id:id,
                keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
                returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
                borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
            });

            field.addEventListener('blur', checkFocus);
            break;
        case TEXTAREA_FIELD:
            field = Titanium.UI.createTextArea({
                color:'#000',
                height:145,
                left:110,
                width:150,
                value:value,
                id:id,
                font:{fontSize:16, fontWeight:'bold'},  
                textAlign:'left',
                appearance:Titanium.UI.KEYBOARD_DEFAULT,	
                keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
                returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
                borderWidth:2,
                borderColor:'#bbb',
                borderRadius:5,
                suppressReturn:false
            });
            row.height = 155;
            field.addEventListener('blur', checkFocus);
            break;
               
    };    
    row.add(field);
    return row;
}
//}}}
/*
* <!-- Creating rows -->
*/

function showForm(latitude, longitude) {
    Ti.Geolocation.purpose = "GEt your ";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
    Titanium.Geolocation.distanceFilter = 10;
    tableview = Titanium.UI.createTableView({
                    top:0, left:0, bottom:0, right:0, //backgroundColor:'#f8f8f8',
                style: Titanium.UI.iPhone.TableViewStyle.GROUPED});                                      

    win.title = 'Manda tu iniciativa';
    var row = createStandardRow('name', 'Name', TEXT_FIELD, "");
    row.header="Información obligatoria";
    row.children[2].borderColor = 'red';
    fieldNonValidated.push(row.children[2]);
    data.push(row);

    row = createStandardRow('description', 'Description', TEXT_FIELD, "");
    row.children[2].borderColor = 'red';
    fieldNonValidated.push(row.children[2]);
    data.push(row);

    imageView = Titanium.UI.createImageView({
        top:10,
        height:150,
        width:150,
        backgroundColor:'#999'
    });
    var choose_photo = Titanium.UI.createButton({
        title:'Get photo',
        top:170,
        width:100,
        height:30
    });
    choose_photo.addEventListener('click',function(e) {
        var window = Titanium.UI.createWindow({
            url:'photo_gallery.js',
        });
        //window.open({fullscreen:true});
        openPhotoGallery(function(image) {
            image_data = image;
            imageView.image = image;
        });
    });
    row = Ti.UI.createTableViewRow({height:210});

    row.add(imageView); 
    row.add(choose_photo);
    data.push(row);
    
    var tb2 = Titanium.UI.createButton({
        title:'Enviar',
        width:100,
        height:30
    });
    tb2.addEventListener('click',function(e) {
            save(latitude, longitude);
    });
    row = Ti.UI.createTableViewRow();
    row.add(tb2);
    data.push(row);
    tableview.setData(data);
    win.add(tableview);
    win.open({modal:false, modalTransitionStyle:Ti.UI.iPhone.MODAL_TRANSITION_STYLE_PARTIAL_CURL,modalStyle:Ti.UI.iPhone.MODAL_PRESENTATION_CURRENT_CONTEXT});
}

/* SAVE
* It saves the form.
*/   
function save(latitude, longitude) {
    if (fieldNonValidated.length > 0) {
        tableview.scrollToIndex(0);
        return;
    }
    var labelError;
    function showMsg(text) {
            alert(text);
            if (win) {
               win.close();
            }
    }
    var obj = {name:getField('name').value,
                description:getField('description').value,
                latitude:latitude,
                longitude:longitude,
                photo:image_data
        }
    sendPoint(obj, 
        function() {
           var msg =  "Ha ocurrido un error en el servidor. Inténtalo más tarde.";
            if (this.status == 200) {
                msg = "Has participado con éxito.";
            }
            showMsg(msg);
        },
        function(e) {
            var msg = "Ha ocurrido un error en el servidor. Inténtalo más tarde.";
            if (this.status == 401) {
                msg = "Usuario o password incorrectos.";
            }
            showMsg(msg);
        }
    );
}
