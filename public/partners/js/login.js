﻿

$(function () {

	$("#submit").click(function () {



		var email = $("#email").val();
		var pass = $("#pass").val();

		// $.ajax ... 

		location.href = "./home.html";
	});

	$(window).on("load resize", function () {
		$(".fill-screen").css("height", window.innerHeight);
	});

	// add Bootstrap's scrollspy
	$('body').scrollspy({
		target: '.navbar',
		offset: 160
	});

	// smooth scrolling
	$('nav a, .down-button a').bind('click', function () {
		$('html, body').stop().animate({
			scrollTop: $($(this).attr('href')).offset().top - 100
		}, 1500, 'easeInOutExpo');
		event.preventDefault();
	});

	try {
		// initialize WOW for element animation
		new WOW().init();
	}
	catch (e) {
		alert(e);
	}

	// parallax scrolling with stellar.js
	$(window).stellar();
});