const header = $('#header');

$(window).on('load', function () {
	WebFont.load({
		google: {
			families: ["Roboto:100,300,400,700"]
		}
	});
	setTimeout(function () {
		$(window).scroll(function () {
			let scrolled = $(window).scrollTop();
			if (scrolled > 350) {
				header.addClass('scrolled');
			} else {
				header.removeClass('scrolled');
			}
		});
	}, 2000);
	AOS.init();
});