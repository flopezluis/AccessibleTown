// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
var tabGroup = Titanium.UI.createTabGroup();


//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'AccessibleTown',
    backgroundColor:'#fff',
    url:'map.js',
    tabBarHidden:true
});

var tab0 = Titanium.UI.createTab({  
    title:'AccessibleTown',
    window:win1
});
tabGroup.addTab(tab0);  


tabGroup.open({
   transition:Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
});
