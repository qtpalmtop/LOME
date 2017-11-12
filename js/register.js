 $(window).load(function() {
 	/* timedCount(); */
	conButtonsInit();
	
});

function conButtonsInit() {
	var w;	

		$('.mark').mouseover(function(){
		
			$(this).find('.block').stop().animate({
				'opacity': 1,
				'top': '30%'
			},300,'swing');
		});
		
		
		$('.mark').mouseout(function(){
		
			$(this).find('.block').stop().animate({
				'opacity': 0,
				'top': 0
			},300,'swing');
		});
		
		//鼠标移入图片图片时间暂停
		/* 
		$('.slider-page').find('.right').click(function(){
			w = $('.con_button').width();
			$('.con_button').find('.con_button_text').stop().animate({
				marginLeft: -w,
				paddingRight: w + 20
			 }, 600);
			$('.con_button').find('.con_button_arrow').stop().animate({
				left: "0"

			}, 600);
			$('.con_button').find('.slider-page').show();
		});
			
		$('.slider-page').find('.left').click(function(){
			w = $('.con_button').width();
			$('.con_button').find('.con_button_arrow').stop().animate({
				left: w
			}, 500);
			$('.con_button').find('.con_button_text').stop().animate({
				marginLeft: 0,
				paddingRight: 20
			}, 500);	
			$('.con_button').find('.slider-page').hide();			
		}); */
	//利用animate，点击左右导航标签切换图片
}