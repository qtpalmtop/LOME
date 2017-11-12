requirejs.config({
	paths:{
		jquery:'jquery.min'
	}
});

requirejs(['jquery'],function($){
	$('body').css('background-color','red');
});