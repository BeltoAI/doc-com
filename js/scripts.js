(function($){
	$(document).ready(function() {	

		// Scroll to Top
		jQuery('.scrolltotop').click(function(){
			jQuery('html').animate({'scrollTop' : '0px'}, 400);
			return false;
		});
		
		jQuery(window).scroll(function(){
			var upto = jQuery(window).scrollTop();
			if(upto > 500) {
				jQuery('.scrolltotop').fadeIn();
			} else {
				jQuery('.scrolltotop').fadeOut();
			}
		});

		$(".nav-wrpper ul li a").on("click", function (event) {
			event.preventDefault();
	
			var targetId = $(this).attr("href");
			var targetSection = $(targetId);
	
			if (targetSection.length) {
				$("html, body").animate(
					{
						scrollTop: targetSection.offset().top - 50,
					},
					1000
				);
			}
		});

		$(".accordion-content").css("display", "none");
		// Open the first accordion content by default
		$(".accordion-title").first().addClass("open");
		$(".accordion-content").first().slideDown(300);
		$(".accordion-title").click(function() {
			$(".accordion-title").not(this).removeClass("open");
			$(".accordion-title").not(this).next().slideUp(300);
			$(this).toggleClass("open");
			$(this).next().slideToggle(300);
		});

		//Animation Handler
		new WOW().init();	
		
		// Counter Handler
		$('.counter').counterUp({
			delay: 10,
			time: 1000
		});

		$('.accordion-header').click(function () {
			$(this).next('.setup-guide-content').slideToggle(300);
			$(this).parent().siblings().find('.setup-guide-content').slideUp(300);
		});
	});
})(jQuery);