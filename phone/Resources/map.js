Titanium.include('request/json.js', 'send_point.js', 'login.js');
Ti.Geolocation.purpose = "GEt your ";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
var map;    

Titanium.Geolocation.distanceFilter = 10;


map = Titanium.Map.createView({
    mapType           : Titanium.Map.STANDARD_TYPE,
    region : {
        latitude      : 37.3317,
        longitude     : -122.0307,
        latitudeDelta : 0.5,
        longitudeDelta: 0.5
    },
    animate           : true,
    regionFit         : true,
    userLocation      : true
});


var infolight = Ti.UI.createButton({
    title:'Add point'
});
infolight.addEventListener('click', function() {
    Titanium.Geolocation.getCurrentPosition(function(e) {
        if (!e.success || e.error) {
           alert('error ' + JSON.stringify(e.error));
           return;
        }
        var longitude = e.coords.longitude;
        var latitude = e.coords.latitude;
        var login = Titanium.App.Properties.getString("login");
        if (login) {
            showForm(latitude, longitude);
        } else {
            showLogin();
        }
    });
});
Titanium.UI.currentWindow.rightNavButton = infolight;

Ti.UI.currentWindow.add(map);

showLogin();