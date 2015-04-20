var layout = function() {
	jQuery('body').css({
		width: window.innerWidth,
		height: window.innerHeight
	});

	jQuery('#horizon').css('margin-top', '-'+(jQuery('#horizon').height()/2)+'px');
};

jQuery(layout);
jQuery(window).resize(layout);