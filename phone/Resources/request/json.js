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
        req.open('POST', Constants.SEND_POINT_URL);
        req.setRequestHeader('Content-Type', 'application/json');

        req.onreadystate = function(){};
        req.onload = onload;
        req.onerror = onerror_op;
        req.setRequestHeader('Authorization', login);
        var json_post ='{"title":"' + title + '", "body":"' + text.escapeSpecialChars() + '", "user_comment":"' + suggestion.escapeSpecialChars() + '","youtube_video":"' +youtube +'"}';
        //alert(json_post.escapeSpecialChars());
        alert(JSON.stringify(point));
        req.send(JSON.stringify(point));
                //'{"title":"' + title + '", "body":"' + text + '", "user_comment":"' + suggestion + '","youtube_video":"' +youtube +'"}');//'[{"mobile_phone":"64222"}]');
    } else {
        alert("Tienes que estar registrado para participar.");
    }
}
