(function($){
$.fn.tmTip = function(options){
	return this.each(function(){
		var opts = $.extend({},$.fn.tmTip.defaults,$.fn.tmTip.parseOptions($(this)),options);
		
		if(opts.event=='click'){
			$(this).click(function(){
				var result=true;
				if(opts.clickBeforeCallback){
					result=opts.clickBeforeCallback();
				}
				if(result)
					tipInit($(this),opts);
			});
		}
		
		if(opts.event=='hover'){
			$(this).hover(function(){
				tipInit($(this),opts);
			},function(){
				$('.tm-tips').remove();
			});
		}
		
		if(opts.event=='focus'){
			$(this).click(function(){
				tipInit($(this),opts);
			});
		}
		
		$(this).blur(function(){
			$('.tm-tips').remove();
		}).mouseleave(function(){
			$('.tm-tips').remove();
		});
		
		
	});
	
	function tipInit($this,opts){
		$('.tm-tips').remove();
		var content = opts.tip;
		if(content=="")content = opts.title;
		$("body").append('<div class="tm-tips"><div class="tm-window-tip tooltip-nightly" style="width:'+opts.width+'px;"><div id="tm-tip-content"></div></div><div class="tooltip-nightly-arrow"></div><div>');
		$('#tm-tip-content').html(content);//设置内容
		if(opts.height!=0){$(".tm-window-tip").css({height:opts.height});}/*设置高度如果高度设置为0：则为自动高度*/
		var _selfWidth = $(".tm-window-tip").width();//tip框的宽度
		var _selfHeight = $(".tm-window-tip").height();//tip框的高度
		var height = $this.height();/*元素自身高度*/
		var width = $this.width();/*元素自身宽度*/
		var offsetLeft = $this.offset().left;/*元素的相对左边距*/
		var offsetTop = $this.offset().top;/*元素的相对顶部距离*/
		var bodyWidth = $("body").innerWidth();
		var bodyHeight = $("body").innerHeight();
		var fixWidth = offsetLeft+_selfWidth+width;
		var fixHeight = offsetTop+_selfHeight+height;
		var left = 0
		var top = 0;
		var arrowLeft = 0
		var arrowTop = 0;
		
		/*如果offsetLeft=0的情况下*/
		if(offsetLeft==0 || offsetLeft<_selfWidth){
			if(opts.arrow=='rightTop')opts.arrow = "leftTop";
			if(opts.arrow=='rightMiddle')opts.arrow = "leftMiddle";
			if(opts.arrow=='rightBottom')opts.arrow = "leftBottom";
			if(opts.arrow=='topRight')opts.arrow = "topLeft";
			if(opts.arrow=='topMiddle')opts.arrow = "topLeft";
			if(opts.arrow=='bottomMiddle')opts.arrow = "bottomLeft";
			if(opts.arrow=='bottomRight')opts.arrow = "bottomLeft";
		}
		/*
		if(offsetTop==0 || offsetTop < _selfHeight){
			opts.arrow = "topMiddle";
		}*/
		
		if(fixWidth > bodyWidth ){
			if(opts.arrow=='topLeft')opts.arrow = "topRight";
			if(opts.arrow=='topMiddle')opts.arrow = "topRight";
			if(opts.arrow=='bottomMiddle')opts.arrow = "bottomRight";
			if(opts.arrow=='bottomLeft')opts.arrow = "bottomRight";
			if(opts.arrow=='leftTop')opts.arrow = "rightTop";
			if(opts.arrow=='leftMiddle')opts.arrow = "rightMiddle";
			if(opts.arrow=='leftBottom')opts.arrow = "rightBottom";
		}
		/*
		if(fixHeight > bodyHeight){
			opts.arrow = "bottomMiddle";
		}	*/
		
		
		if(opts.arrow=='topMiddle'){
			left = offsetLeft - _selfWidth/2+width/2  ;
			top = offsetTop+height+10;
			arrowLeft = offsetLeft+width/2-5 ;
			arrowTop = offsetTop +height;
		}
		
		if(opts.arrow=='topLeft'){
			left = offsetLeft + width/2;
			top = offsetTop+height+12;
			arrowLeft = offsetLeft+(width/2)+5
			arrowTop = offsetTop +height+2;
		}
		
		if(opts.arrow=='topRight'){
			left = offsetLeft - _selfWidth+width/2;
			top = offsetTop+height+10;
			arrowLeft = offsetLeft+width/2-12;
			arrowTop = offsetTop +height ;
		}
		
		if(opts.arrow=='bottomLeft'){
			top = offsetTop-_selfHeight-18 ;
			left = offsetLeft +width/2
			arrowLeft = offsetLeft+width/2+12 ;
			arrowTop = offsetTop -8;
		}
		
		if(opts.arrow=='bottomMiddle'){
			top = offsetTop-_selfHeight-18 ;
			left = offsetLeft - _selfWidth/2 +width/2 ;
			arrowLeft = offsetLeft+width/2-4 ;
			arrowTop = offsetTop -8;
		}
		
		if(opts.arrow=='bottomRight'){
			top = offsetTop-_selfHeight-18 ;
			left = offsetLeft -_selfWidth+width/2;
			arrowLeft = offsetLeft+width/2-12
			arrowTop = offsetTop - 8;
		}
		if(opts.arrow=='leftTop'){
			left = offsetLeft +width+12;
			top = offsetTop;
			arrowLeft = offsetLeft+width;
			arrowTop = offsetTop+5;
		}
		if(opts.arrow=='leftMiddle'){
			left = offsetLeft +width+34;
			top = offsetTop - _selfHeight/2+2;
			arrowLeft = offsetLeft+width+22;
			arrowTop = offsetTop;
		}
		if(opts.arrow=='leftBottom'){
			left = offsetLeft +width+12;
			top = offsetTop-_selfHeight+12;
			arrowLeft = offsetLeft+width;
			arrowTop = offsetTop;
		}
		
		if(opts.arrow=='rightTop'){
			left = offsetLeft -_selfWidth-18;
			top = offsetTop;
			arrowLeft = offsetLeft-10;
			arrowTop = offsetTop+5;
		}
		if(opts.arrow=='rightMiddle'){
			left = offsetLeft -_selfWidth-18;
			top = offsetTop - _selfHeight/2+2;
			arrowLeft = offsetLeft-10;
			arrowTop = offsetTop;
		}
		if(opts.arrow=='rightBottom'){
			left = offsetLeft -_selfWidth-18;
			top = offsetTop - _selfHeight
			arrowLeft = offsetLeft-10;
			arrowTop = offsetTop-8;
		}
		if(!opts.hideArrow){
			$(".tooltip-nightly-arrow").addClass("tooltip-nightly-"+opts.arrow);
		}
		if(isEmpty(opts.arrow))opts.arrow = "bottomMiddle";
		var st = 2;
		if(opts.color=='ccc'){
			opts.border = "4px solid #CCC";
			opts.background = "#c9c9c9";
			$(".tooltip-nightly-arrow").addClass("tooltip-nightly-"+opts.arrow+"-ccc");
		}else if(opts.color=='black'){
			opts.border = "4px solid #444";
			opts.background = "#2B2B2B";
			$(".tooltip-nightly-arrow").addClass("tooltip-nightly-"+opts.arrow+"-black");
		}
		
		$(".tooltip-nightly-arrow").css({left:(arrowLeft+opts.offLeft),top:(arrowTop+opts.offTop)});
		$(".tm-window-tip").css({left:left+"px",top:(top+st),opacity:1,border:opts.border,background:opts.background});
	}	
};

$.fn.tmTip.parseOptions = function($target) {
	return {
		width : $target.attr("width"),
		height : $target.attr("height"),
		tip : $target.attr("tip"),
		title:$target.attr("title"),
		event:$target.attr("event"),
		arrow:$target.attr("arrow"),
		offLeft:$target.attr("offLeft"),
		offTop:$target.attr("offTop"),
		background:$target.attr("background"),
		border:$target.attr("border"),
		color:$target.attr("color")
	}
};
$.fn.tmTip.defaults ={
	width : 200,//宽度
	height : 0,//高度如果为0则为自动高度
	title:"提示",//如果tip为空用title
	event:"hover",//触发的事件类型
	arrow:"bottomMiddle",
	hideArrow:false,//是否隐藏方向箭头
	background:"#f8f8f8",//设置背景
	border:"4px solid #00f",
	tip : "",//内容
	offLeft:0,//左部偏移
	offTop:0,//顶部移动
	color:"ccc"
}
})(jQuery)