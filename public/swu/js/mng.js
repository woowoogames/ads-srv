/** @jsx React.DOM */

'use strict';

var SWU = React.createClass( {

    getInitialState : function () {
        return {
        	offersData : [],
        	searchTerms : []
        }
    },

    // adsrv.js    
    renderOffers : function (data) {
    	if(!data || !data.length){
    		return;
    	}
    	
    	console.log("re-render offers " + data[0].desc.short + "   " + data);
    	var newData = this.state.offersData;
    	for(var d in data){
    		newData.push(data[d]);
    	}

    	this.setState({ offersData : newData });
    },
    
    // sbx.js
    search : function (st) {
    	
    	debugger;
    	var strms = this.state.searchTerms;
    	if($.inArray(st, strms) < 0){
    		strms.push(st);
    	}
    	
    	this.setState({ searchTerms : strms, offersData : [] });

        adsrv.gt(st, this);
    },

    render: function () {
    	return <div class="container-fluid">
                    <TopBar></TopBar>
                    <SBX hndlr={this}></SBX>
					<Searched hndlr={this} terms={this.state.searchTerms}></Searched>
                    <ContentArea offers={this.state.offersData}></ContentArea>
                    <Footer></Footer>
                </div>
    }
});

//window.onload = function () {
React.renderComponent(<SWU />, 
    document.getElementById('main'));
//};



$(function () {
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

	try{
		// initialize WOW for element animation
		new WOW().init();
	}
	catch (e) {
		alert(e);
	}

	// parallax scrolling with stellar.js
	$(window).stellar();
});