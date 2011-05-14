Titanium.include('request/json.js', 'send_point.js', 'login.js', '/constants.js');
Ti.Geolocation.purpose = "GEt your ";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
var map;    


function loadPoints() {
    loadLastPoints(function(points) {
        for (point in points) {
            the_point = points[point];
            var dest_img = Titanium.UI.createImageView({height:30, width:30});             
            getImage(Constants.base_url + the_point.photo, dest_img);
            var annotation = Titanium.Map.createAnnotation({
                latitude:the_point.latitude,
                longitude:the_point.longitude,
                pincolor:Titanium.Map.ANNOTATION_RED,
                title: the_point.description,
                leftView:dest_img,
                photo:the_point.photo,
                animate:true
            });        
            
            map.addAnnotation(annotation);
            map.selectAnnotation(annotation);
        }
        
        var region = { latitude:points[0].latitude,
                   longitude:points[0].longitude,
                   latitudeDelta:0.005,
                   longitudeDelta:0.005};
        map.setLocation(region);
    });
}

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
        showForm(latitude, longitude);
    });
});
Titanium.UI.currentWindow.rightNavButton = infolight;

Ti.UI.currentWindow.add(map);
var login = Titanium.App.Properties.getString("login");
if (login) {
    loadPoints();    
} else {
    showLogin(loadPoints);
}

