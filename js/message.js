 $(window).load(function() {
 	/* timedCount(); */
	conButtonsInit();
	
});

function conButtonsInit() {
	var w;	
		$(".connect-over").click(function(){
			$('.is-success').fadeIn("slow");
			$('.is-cancle').hide();
			
		});
		$(".connect-cancle").click(function(){
			$('.is-success').hide();
			$('.is-cancle').fadeIn("slow");
		});
}