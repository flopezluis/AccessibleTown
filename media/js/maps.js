/*
 * In the callback we return the object which you can interact.
 * We don't return the object as the normal practice with module pattern because
 * it's better to wait until the map is fully load.
 */
function Maps(callback, callback_mouse_pressed) {
    var map;
    var messagesOverlay;
    var mouse_pressed = false;

    function MessagesOverlay(map) {
        this.setMap(map);
    }
    MessagesOverlay.prototype = new google.maps.OverlayView();
    MessagesOverlay.prototype.draw = function() {
        if (!this.ready) { 
            this.ready = true; 
            google.maps.event.trigger(this, 'ready'); 
        } 
    }
    MessagesOverlay.prototype.onAdd = function(){
                callback({
                    fromLatLngToContainerPixel:fromLatLngToContainerPixel,
                    addMarker:addMarker,
                    fromContainerPixelToLatLng:fromContainerPixelToLatLng,
                    showMsg:showMsg
                });
    }
    if (document.getElementById("map_canvas")) {
            var latlng = new google.maps.LatLng(39.3, -6.3);
            var options = {
            zoom: 7,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.TERRAIN
            };
            map = new google.maps.Map(document.getElementById("map_canvas"), options);
            messagesOverlay = new MessagesOverlay(map);
            
        google.maps.event.addListener(map, "click",function(e) {
             $("div:[class*='marker_div']").HideBubblePopup();
             $("div:[class*='welcome']").HideBubblePopup();
             $("div:[class*='marker_div']").remove();
        });
        
        google.maps.event.addListener(map, "mouseup",function(e) {
            mouse_pressed = false;
        });
        google.maps.event.addListener(map, "mousedown",function(e) {
              mouse_pressed = true; 
              setTimeout(function() {
                 if (mouse_pressed) {
                    callback_mouse_pressed(e);                 
                 }
              }, 1000);
        });
    } 

    function addMarker(pointLaLo, point_id) {
        var icon_url = "http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|DCDCDC|000000";
        var shadow_url = "http://chart.apis.google.com/chart?chst=d_map_pin_shadow";
        var shadow_image = new google.maps.MarkerImage(shadow_url,
        // size width x height
        new google.maps.Size(40, 37),
        // origin
        new google.maps.Point(0,0),
        // anchor
        new google.maps.Point(12, 37));
    
        var overed = false;
        var marker = new google.maps.Marker({
            position: pointLaLo, //new google.maps.LatLng(lat,lon), 
            map: map,
            animation: google.maps.Animation.DROP
        });
        if (point_id) {
             google.maps.event.addListener(marker, "mouseover",function(e) {
                point = fromLatLngToContainerPixel(this.getPosition());
                $.ajax({
                    url: "/point/get_details/" + point_id + "/",
                    method: 'GET',
                    dataType: 'json',
                    data:'',
                    success: function(data) {
                        if (data.success) {
                            showMsg( point_id,data.html, point.x, point.y, true);
                        }
                    } 
                });
            });
         }                
         return marker;
    
    }

    function fromContainerPixelToLatLng(point) {
        return messagesOverlay.getProjection().fromContainerPixelToLatLng(point);
    }
    function fromLatLngToContainerPixel(latLng) {
        return messagesOverlay.getProjection().fromLatLngToContainerPixel(latLng);
    }


    function showMsg(id, html, x, y, immediate) {    
        var selector = "marker_div" + id
        var class_selector = "." + selector;
        if (!$(class_selector).length > 0) { /* If it hasn't been added yet. */
            $("div:[class*='marker_div']").HideBubblePopup();            
            $("div:[class*='marker_div']").remove();
            $("#map_canvas").append("<div class='"+selector+"' style='position: absolute; left: "+(x -10)+"px; top: "+y+"px; z-index: 1;height:1px;width:1px'></div>");        
            options = { innerHtml: html,
                position:   'left',
                align:      'center',
                tail:       {align:'center', hidden: false},
                innerHtmlStyle: {
                    color:'#FFFFFF', 
                    'text-align':'center',
                    'font-size':'14px',
                    'padding':' 20px'},
                themeName: 	'all-black',
                themePath: 	'/media/css/jquerybubblepopup-theme',
                alwaysVisible: false,
                distance:100,
            };
            if (!immediate) {
                options.openingSpeed =  900;
                options.openingDelay = '1000';
                options.distance = '1000';
            }
            $(class_selector).CreateBubblePopup(options);
            $(class_selector).ShowBubblePopup();
        }

    }

}
