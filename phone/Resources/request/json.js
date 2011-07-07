var SECOND = 1000;
var MINUTE = 60 * SECOND;
var FIVE_MINUTE = 5 * 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;

String.prototype.escapeSpecialChars = function() {
     return this.replace(/\\/g, "\\\\") 
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/\t/g, "\\t")
                .replace(/\f/g, "\\f")
                .replace(/"/g,"\\\"")
                .replace(/'/g,"\\\'")
                .replace(/\&/g, "\\&");
};
function isNetworkAvailable() {
    if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE){
        var alertDialog = Titanium.UI.createAlertDialog({
              title: 'Atención!',
              message: 'No tienes conexión. Para usar la aplicación es necesaria.' ,
              buttonNames: ['OK']
            });
        alertDialog.show();
        return false;    
    }
    return true;
}
function getJSON(url, callback, onerror_op) {
    if (isNetworkAvailable()) {
        onerror_op = onerror_op ||  function(e) {
            alert("Ha ocurrido un error. Puede que no tenga conexión.");
        };
        var req = Ti.Network.createHTTPClient(); 
        req.open('GET', url);
        req.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        req.onreadystate = function(){};
        req.onload = callback;
        req.onerror = onerror_op;
        req.setTimeout(0);
        var login = Titanium.App.Properties.getString("login");
        if (login) {
            req.setRequestHeader('Authorization', login);
        }
        req.send();
    }
}
function sendPoint(point, onload, onerror_op) {
    var login = Titanium.App.Properties.getString("login");
    if (login) {
        onerror_op = onerror_op ||  function(e) {
            Ti.API.debug('GET returned error:' + e.error);
        };
        var req = Ti.Network.createHTTPClient(); 
        req.open('POST', Constants.POINT_URL);
        req.setRequestHeader('Content-Type', 'application/json');

        req.onreadystate = function(){};
        req.onload = onload;
        req.onerror = onerror_op;
        req.setRequestHeader('Authorization', login);
        req.send(point);
    } else {
        alert("Tienes que estar registrado para participar.");
    }
}
/*
* Get the last ten points and call the function callback
*/
function loadLastPoints(callback, onerror_op) {        
    getJSON(Constants.POINT_URL,function() { 
        var parsedData = JSON.parse(this.responseText);                    
        callback(parsedData);
    }, onerror_op);
}
/*
* Get an image and cached in a directory.
* use the time
*/
function getImage(url, view) {
    var now = new Date().getTime();
    var UPDATE_CACHE = true;                
    names = url.split('/');
    name =  names[names.length-4] + names[names.length-3] + names[names.length-2] + names[names.length-1];

    //name_txt = name.split(".")[0];
    var newDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'images');
    newDir.createDirectory();

    var f = Titanium.Filesystem.getFile (newDir.nativePath, name);

    if (f.exists()) {//if (f_timestamp.exists()) {
        var time = new Date(f.createTimestamp()).getTime();
        UPDATE_CACHE = (now - time > DAY);
    }
    if (UPDATE_CACHE) {
        var adxhr = Titanium.Network.createHTTPClient();
        adxhr.onload = function()
        {
            f.write(this.responseData);
            view.image = f.nativePath;
        };
        adxhr.onerror = function () {
        setTimeout(function() {
            getImage(url,view);    
            }, 15000);
        };
        adxhr.open('GET',url);
        adxhr.send();
    } else {
        view.image = f.nativePath;
    }
}