Titanium.include('/constants.js', '/utils.js', 'db.js');

function isAuthenticated() {
    var login = Titanium.App.Properties.getString("login");
    return login;
}

function showLogin(callback) {     
    var win = Titanium.UI.currentWindow;
    var w = Ti.UI.createWindow({});
    var data = [];
    w.backgroundColor = '#111';
    var top = 0;
    data[0] = Titanium.UI.createTableViewSection({headerTitle:'Login'});
        
        var row = Ti.UI.createTableViewRow();
        //row.selectedBackgroundColor = '#385292';
        row.height = 65;
        var label = Titanium.UI.createLabel({
            text:"Usuario",
            textAlign:'center',
            font:{fontSize:16,fontWeight:'bold'},
            left:2,
            color:'#336699',
            width:'100',
            height:'auto'
        });
        row.add(label);
        username = Titanium.UI.createTextField({
                    color:'#000',
                    font:{fontSize:16,fontWeight:'bold'},
                    height:45,
                    left:110,
                    width:150,
                    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
                    returnKeyType:Titanium.UI.RETURNKEY_NEXT,
                    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
                });
        row.add(username);
        username.addEventListener('return', function(){pass.focus();});
        data.push(row);
        top = 65;
        var row = Ti.UI.createTableViewRow();
        //row.selectedBackgroundColor = '#385292';
        row.height = 65;
        var label = Titanium.UI.createLabel({
            text:"Password",
            textAlign:'center',
            font:{fontSize:16,fontWeight:'bold',fontFamily:'Helvetica Neue'},
            left:2,
            //color:'#336699',
            color:'#336699',
            width:'100',
            height:'auto'
        });
        row.add(label);
        pass = Titanium.UI.createTextField({
                    color:'#000',
                    height:45,
                    left:110,
                    width:150,
                    font:{fontSize:16,fontWeight:'bold'},
                    keyboardType:Titanium.UI.KEYBOARD_DEFAULT,
                    returnKeyType:Titanium.UI.RETURNKEY_GO,
                    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
                });
        pass.passwordMask = true;        

        row.add(pass); 
        data.push(row);
        top += 65;
        
        var btn = Ti.UI.createButton({
            title:'Entrar',
            width:100,
            height:30
        });


        var isAndroid = Ti.Platform.osname == 'android';
        var labelError;
        if (isAndroid) {
            var root = Ti.UI.createView({});
            var view = Ti.UI.createView({
                width : 300, height: '100'
            });
            root.add(view);
            var labelError = Ti.UI.createLabel({
                text : '',
                top: 10, left: 10, bottom: 10, right: 10,
                borderRadius : 10,
                text:"Usuario o password incorrectos."    
            }); 
            view.add(labelError);   

            var dialog = Titanium.UI.createOptionDialog({
                options:null,
                buttonNames: ['Ok'],
                destructive:2,
                cancel:1,
                title:'Información',
                androidView:root
            });
        }
        pass.addEventListener('return', function(){do_login();});
        function do_login() {
            btn.enabled = false;
            Titanium.App.Properties.setString("login",'Basic ' + Ti.Utils.base64encode(username.value + ':' + pass.value));
            getJSON(Constants.DO_LOGIN, 
                function() {
                        var db = new DB();
                        db.saveSession();
                        w.close();
                        callback();
                }, 
                function(e) {
                    if (this.status == 401) {
                        alert("Usuario o password incorrectos.");
                    }
                    btn.enabled = true;
                }
            );
        }
        btn.addEventListener('click',do_login);
        row = Ti.UI.createTableViewRow();
        row.add(btn);
        data.push(row);
       
    var tableview = Titanium.UI.createTableView({data:data,
                        style: Titanium.UI.iPhone.TableViewStyle.GROUPED});      
    w.add(tableview);                    
    //w.add(btn);
    w.open({modal:true});
}
