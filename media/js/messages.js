function createMsg(id, x, y) {
    var selector = "marker_div" + id
    var class_selector = "." + selector;
    $.ajax({
                url: "/points/get/" + id + "/",
                method: 'GET',
                dataType: 'json',
                data:'',
                success: onDataReceived
    });
    function onDataReceived(data) {
        if (data.success) {
            showPoint(data.id, data.html, x, y);
        }
    }
}
function showMsgoint(id, html, x, y) {    
   var selector = "marker_div" + id
   var class_selector = "." + selector;
   if (!$(class_selector).length > 0) { /* If it hasn't been added yet. */
        $("div:[class*='marker_div']").HideBubblePopup();            
        $("div:[class*='marker_div']").remove();
        $("#map_canvas").append("<div class='"+selector+"' style='position: absolute; left: "+(x -10)+"px; top: "+y+"px; z-index: 1;height:1px;width:1px'></div>");        
        $(class_selector).CreateBubblePopup({ innerHtml: html,
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
            openingSpeed: 900,
            distance:1000,
            openingDelay:'1000'
        });
        $(class_selector).ShowBubblePopup();
    }

}
