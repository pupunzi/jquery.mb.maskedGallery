/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2010. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: info@pupunzi.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * Name:jquery.mb.maskedGallery
 * Version: 1.9.1
*/

(function($){
  jQuery.fn.mbMaskGallery = function (options){
    return this.each (function (){
    $(this).hide();
    var thisGallery = this;

      this.options = {
        galleryMask:"mask/monitor.png",
        loader:false,
        showDescription:true,
        galleryLoader:"loader/loader.gif",
        galleryColor:"white",
        type:"normal", //or "random"
        transition:"crossfade", // or "normal"
        fadeTime: 500,
        loaderOpacity:.3,
        changeOnClick:false,
        navId:"",
        nextPath:"",
        prevPath:"",
        imagePosition:"center center",
        slideTimer: 2000
      };
      $.extend (this.options, options);

      var loader="<table id='loader' cellpadding='0' cellspacing='0' width='100%' height='100%'><tr><td valign='middle' align='center'><img src='"+this.options.galleryLoader+"' alt='loading'></td></tr></table>";

      // get the images
      var images = $ (this).find ("img");
      $ (thisGallery).empty ();

      var idx=(this.options.type =="random")?Math.floor(Math.random()*$(images).size()):0;


      // container
      $(thisGallery).append("<div class='container'></div>");
      var galleryContainer=$ (this).find(".container");

      if (thisGallery.options.loader){
        // loader
        $(galleryContainer).append(loader);
        var galleryloader=$ (thisGallery).find("#loader");
        $(galleryloader).css({
          position: "absolute",
          top: 0,
          left:0
        });
        if(!$.browser.msie) {
          $(galleryloader).css({
            opacity:thisGallery.options.loaderOpacity
          });
        }
      }

      //image
      $(galleryContainer).append("<div class='galleryImage'></div>");
      var galleryImage=$ (thisGallery).find(".galleryImage");

      //mask
      $(galleryContainer).append("<image class='galleryMask' src='"+this.options.galleryMask+"'>");
      var galleryMask=$ (thisGallery).find(".galleryMask");
      if ($.metadata){
        $.metadata.setType("class");
      }
      $(thisGallery).mouseover(
              function(){
                if ($.metadata){
                  $.metadata.setType("class");
                  if ($(images[idx]).metadata().url) $(images[idx]).attr("url",$(images[idx]).metadata().url);
                  if ($(images[idx]).metadata().script) $(images[idx]).attr("script",$(images[idx]).metadata().script);
                }

                $(this).css({
                  cursor: $(images[idx]).attr("url") || $(images[idx]).attr("script") ?"pointer":"default"
                });
              });

      $(galleryMask).click(
              function(){
                if ($(images[idx]).attr("url")) self.location.href=$(images[idx]).attr("url");
                if ($(images[idx]).attr("script")) eval($(images[idx]).attr("script"));
              });

      $(galleryContainer).css({
        position:"relative",
        overflow:"hidden",
        opacity:0,
        backgroundColor: thisGallery.options.galleryColor
      });

      $(galleryImage).css({
        position: "relative",
        top: 0,
        left:0
      });

      $(galleryMask).css({
        position: "absolute",
        top: 0,
        left:0
      });

      var changePhoto = function (u){
        if (thisGallery.options.transition=="crossfade"){
          var actualImg=$(galleryImage).find("div");
          $(actualImg).removeClass("newImg");
          var newImg=$("<div class='newImg' style='background: url("+u+") "+thisGallery.options.imagePosition+" ;width:"+$(galleryMask).outerWidth()+"px;height:"+$(galleryMask).outerHeight()+"px'>").css({
            position: "absolute",
            top: 0,
            left:0,
            opacity:0
          });
          $(galleryImage).append(newImg);
          $(newImg).fadeTo(thisGallery.options.fadeTime, 1, function(){
            $(actualImg).remove();
          });
        }else{
          $ (galleryImage).fadeTo (thisGallery.options.fadeTime, 0, function (){
            //replacing the image
            $ (galleryImage).find("div").remove();
            $ (galleryImage).append("<div style='background: url("+u+") "+thisGallery.options.imagePosition+" ;width:"+$(galleryMask).outerWidth()+"px;height:"+$(galleryMask).outerHeight()+"px'>");
            //showing the new image
            setTimeout (function ()
            {
              $ (galleryImage).fadeTo (thisGallery.options.fadeTime, 1);
            }, (thisGallery.options.fadeTime/2));
          });
        }
      };

      function preloadImg(u){
        var o = new Image ();
        o.onload = function (){changePhoto (u);};
        o.onerror = function (){alert ("can't load " + u);};
        o.src = u+"?rnd="+Math.floor (Math.random () * 1000);
      }

      function startGallery(){

        setTimeout(function(){
          preloadImg($(images[idx]).attr("src"));
          $(galleryContainer).fadeTo (thisGallery.options.fadeTime, 1);
          if (!thisGallery.options.changeOnClick){
            if ($(images).size()>1){
              setInterval(function(){
                var rnd = Math.floor(Math.random()*$(images).size());
                idx= (thisGallery.options.type =="random")? rnd: ((idx>=$(images).size()-1)?0:idx+1);
                preloadImg($(images[idx]).attr("src"));
              },thisGallery.options.slideTimer);
            }else{
              preloadImg($(images[0]).attr("src"));
            }
          }else if ($(images).size()>1){

            var cont=thisGallery.options.navId!=""?$("#"+thisGallery.options.navId):"";
            if (thisGallery.options.changeOnClick && thisGallery.options.navId=="" ){
              $(thisGallery).append("<div class='cont'></div>");
              cont=$(thisGallery).find(".cont");
              cont.css({
                position:"relative",
                zIndex:10000,
                bottom:0,
                textAlign:"center",
                cursor:"pointer"
              }).html("<img class='prev' src='"+thisGallery.options.prevPath+"' alt='prev'>&nbsp;<img class='next' src='"+thisGallery.options.nextPath+"' alt='next'>");
            }
            if (thisGallery.options.navId!="" ){
              cont.css({
                width: $(galleryMask).width(),
                cursor:"pointer"
              });
            }

            var next= cont.find(".next");
            next.click(function(){
              var rnd = Math.floor(Math.random()*$(images).size());
              idx= (thisGallery.options.type =="random")? rnd: ((idx>=$(images).size()-1)?0:idx+1);
              preloadImg($(images[idx]).attr("src"));
            });
            var prev= cont.find(".prev");
            prev.click(function(){
              var rnd = Math.floor(Math.random()*$(images).size());
              idx= (thisGallery.options.type =="random")? rnd:(idx<1?$(images).size()-1:idx-1);
              preloadImg($(images[idx]).attr("src"));
            });
          }
          if($.browser.msie && ($.browser.version.indexOf("6")>-1)) correctPNG();

        },200);
      }
      function loadMask(u){
        var o = new Image ();
        o.onload = function (){
          var w = thisGallery.options.galleryWidth ? thisGallery.options.galleryWidth : $(galleryMask).width();
          var h = thisGallery.options.galleryHeight ? thisGallery.options.galleryHeight : $(galleryMask).height();
          $(thisGallery).css({
            width: w,
            height: h
          });
          $(galleryContainer).css({
            width: w,
            height:h
          });
          startGallery();
        };
        o.onerror = function (){alert ("can't load mask: " + u);};
        o.src = u+"?rnd="+Math.floor (Math.random () * 1000);
      }

      function correctPNG() // correctly handle PNG transparency in Win IE 5.5 or higher.
      {
        alert("correcting");
        for(var i=0; i<document.images.length; i++)
        {
          var img = document.images[i];
          var imgName = img.src.toUpperCase();
          if (imgName.substring(imgName.length-3, imgName.length) == "PNG")
          {
            var imgID = (img.id) ? "id='" + img.id + "' " : "";
            var imgClass = (img.className) ? "class='" + img.className + "' " : "";
            var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' ";
            var imgStyle = "display:inline-block;" + img.style.cssText;
            if (img.align == "left") imgStyle = "float:left;" + imgStyle;
            if (img.align == "right") imgStyle = "float:right;" + imgStyle;
            if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle;
            img.outerHTML = "<span " + imgID + imgClass + imgTitle
                    + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
                    + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
                    + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
            i = i-1;
          }
        }
      }
      loadMask(this.options.galleryMask);
      $(this).fadeIn();
    });
  };
})(jQuery);