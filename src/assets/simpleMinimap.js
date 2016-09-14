/*
    Vipul Limbachiya
    http://vipullimbachiya.com
*/
/*
 * This program is free software. It comes without any warranty, to the extent permitted by applicable law.
 * You can redistribute it and/or modify it without any terms.
 * Save developers!! Use Chrome  http://www.google.co.in/chrome  Or Firefox http://www.mozilla.com/firefox/
*/


(function($){
    $.simpleMiniMap = function(el, options){
        var base = this;
        base.$el = $(el);
        base.el = el;
        base.$el.data("simpleMiniMap", base);
        base.init = function(){
            base.options = $.extend({}, $.simpleMiniMap.defaultOptions, options);
            if(base.$el.parent().parent().find(".minimapWrapper").length==0)
            {
                var _parent = base.$el.parent().parent();
                _parent.append('<div class="minimapWrapper"><div class="toTop vtip" title="Scroll to top">&and;</div><div class="miniMap ui-corner-all"></div><div class="toBottom vtip" title="Scroll to bottom">&or;</div></div>');
                base.miniMapWrapper = _parent.find(".minimapWrapper");
                base.miniMap = _parent.find(".miniMap");
                if(!base.options.showScrollButtons)
                {
                    base.miniMapWrapper.find(".toTop, .toBottom").remove();
                    base.miniMap.css("height", base.$el.parent().height());
                }
                else
                {
                    base.miniMap.css("height", base.$el.parent().height() - 30);
                    $(".toTop, .toBottom", base.miniMapWrapper).click(function(){
                        if($(this).is(".toTop"))
                            base.$el.parent().scrollTo(base.$el.find(":first"), 500);
                        else
                            base.$el.parent().scrollTo(base.$el.find(":last"), 500);
                        return false;
                    });
                }
            }
        };
        base.init();
    };
    $.simpleMiniMap.defaultOptions = {
        filterElem : ".highlight", //Can be filtered by any possible jquery selector
        showScrollButtons : true, //To show/hide scroll to top/bottom buttons
        noTitleOnMarker : false, //No title/tooltip for markers
        titleBuilder : false, //If you want to customize title of marker, this is function, function(marker)
        beforeBuildMap : false, //method to call before building maf, function(mainElement, miniMapWrapper)
        afterBuildMap : false, //method to call after building maf, function(mainElement, miniMapWrapper)
        markerCSSClass : "marker", //CSS class for marker on minimap
        highlightBGColor : "#574E4E", //After scrolling to marker reference it highlights the parent item of it, this color will be used to highlight(as background color)
        highlightItemDuration : 1000 //0 will disable highlighting, duration of animation
    };

    $.fn.buildMap = function()
    {
        var base = this.data("simpleMiniMap");
        var matches = base.$el.find(base.options.filterElem);
        base.miniMap.empty();
        var logArea = base.$el;
        var parentPos = logArea.offset();
        if(base.options.beforeBuildMap)
            base.options.beforeBuildMap(base.$el, base.minimapWrapper);
        if(matches.length>0)
        {
            var h = logArea.height();
            var h2 = base.miniMap.height();
            var markerClass = base.options.markerCSSClass || "marker";
            matches.each(function(){
                var match = $(this);
                var childPos = $(this).offset();
                var t = childPos.top - parentPos.top;
                var markerTop = (h2 * t) / h;
                markerTop = Math.round(markerTop);
                var marker;
                if(!base.options.noTitleOnMarker)
                {
                    var title = match.parent().text();
                    if(base.options.titleBuilder)
                    {
                        title = base.options.titleBuilder(match);
                    }
                    marker = $("<span class='"+markerClass+" vtip' style='top:"+markerTop+"px;' title='"+title+"'></span>");
                }
                else
                    marker = $("<span class='"+markerClass+"' style='top:"+markerTop+"px;'></span>");
                base.miniMap.append(marker);
                marker.data("relem", match);
                marker.click(function(){
                    var relem = $(this).data("relem");
                    if(relem)
                    {
                        logArea.parent().scrollTo(relem, 500, function(){
                            if(base.options.highlightItemDuration>0)
                                relem.parent().highlightItem(base.options.highlightBGColor, base.options.highlightItemDuration);
                        });
                    }
                    return false;
                });
            });
        }
        if(base.options.afterBuildMap)
            base.options.afterBuildMap(base.$el, base.minimapWrapper);
    };

    $.fn.highlightItem = function(highlightColor, duration) {
        var that = this;
        var highlightBg = highlightColor || "#574E4E";
        var animateMs = duration || 1000;
        that.stop(true,true);
        var originalBg = that.css("backgroundColor");
        that.css("background-color", highlightBg).fadeOut(500).fadeIn(500);
        setTimeout(function(){
            $(that).css("backgroundColor", originalBg);
        }, animateMs);
    };

    $.fn.simpleMiniMap = function(options){
        return this.each(function(){
            (new $.simpleMiniMap(this, options));
        });
    };
})(jQuery);