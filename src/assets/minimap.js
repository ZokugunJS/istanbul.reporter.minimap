$(function(){
	if($('.console-wrapper').length) {
		$('.console-wrapper').height($(window).height() - 116).width($(window).width() - 30);
		
		$.simpleMiniMap.defaultOptions.filterElem = ".cstat-no,.fstat-no,.cbranch-no";
		$.simpleMiniMap.defaultOptions.noTitleOnMarker = true;
		$.simpleMiniMap.defaultOptions.highlightItemDuration = 0;
		$.simpleMiniMap.defaultOptions.showScrollButtons = false;
		
		$(".console").simpleMiniMap().buildMap();
	}
});