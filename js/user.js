window.onload = function(){
	$(document).ready(function(){
		
		$(".left-nav").click(function(){
		
			$(".left-nav").css({"backgroundColor":"#1B1C2D","color":"#fff"});
			$(".page-1").css({"display":"block","opacity":"1"});
			!function(){
				for (var i=2;i<4;i++){
					$('.page-'+i).css({"display":"none","opacity":"0"});
				}
				$(".mid-nav").css({"backgroundColor":"#C0C0C0","color":"#000"});
				$(".right-nav").css({"backgroundColor":"#C0C0C0","color":"#000"});
			}();
		});
		
		$(".mid-nav").click(function(){
			$(".mid-nav").css({"backgroundColor":"#1B1C2D","color":"#fff"});
			$(".page-2").css({"display":"block","opacity":"1"});
			!function(){
				for (var i=1;i<4;i+=2){
					$('.page-'+i).css({"display":"none","opacity":"0"});
				}
				$(".left-nav").css({"backgroundColor":"#C0C0C0","color":"#000"});
				$(".right-nav").css({"backgroundColor":"#C0C0C0","color":"#000"});
			}();
		});		
		
		$(".right-nav").click(function(){
			$(".right-nav").css({"backgroundColor":"#1B1C2D","color":"#fff"});
			$(".page-3").css({"display":"block","opacity":"1"});
			!function(){
				for (var i=1;i<3;i++){
					$('.page-'+i).css({"display":"none","opacity":"0"});
				}
				$(".mid-nav").css({"backgroundColor":"#C0C0C0","color":"#000"});
				$(".left-nav").css({"backgroundColor":"#C0C0C0","color":"#000"});
			}();
		});	

		$(".close").click(function(){
			$("#menu-section").css({"display":"block","transform":"translate(240px,0px)","opacity":"0"});
			$("#menu").show(500);
		});
	});
}
