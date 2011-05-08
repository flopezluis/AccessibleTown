
var popoverView;
var arrowDirection;

function openPhotoGallery(success_callback) {
    Titanium.Media.openPhotoGallery({

        success:function(event)
        {
            var cropRect = event.cropRect;
            var image = event.media;

            // set image view
            Ti.API.debug('Our type was: '+event.mediaType);
            if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
            {
                success_callback(image);
            }
            else
            {

            }

            Titanium.API.info('PHOTO GALLERY SUCCESS cropRect.x ' + cropRect.x + ' cropRect.y ' + cropRect.y  + ' cropRect.height ' + cropRect.height + ' cropRect.width ' + cropRect.width);

        },
        cancel:function()
        {

        },
        error:function(error)
        {
        },
        allowEditing:true,
        popoverView:popoverView,
        arrowDirection:arrowDirection,
        mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
    });
}