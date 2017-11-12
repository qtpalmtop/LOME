var switchDrag = true;
(function($){
$.fn.tmDrag = function(options) {
	return this.each(function() {
		var cache = $(this).data("tmDrag");
		var opts = null;
		if (cache) {
			opts = $.extend(cache.options, options);
			cache.options = opts;
		} else {
			var opts = $.extend({},$.fn.tmDrag.defaults, options);
			$(this).data("tmDrag", {options : opts});
			tmDragInit($(this));
		}
	});
};
		
/**
 * 事件初始化
 * @param {Object} $this
 */
var dragFlag = false;
function tmDragInit($this){
	var opts = $this.data("tmDrag").options;
	/*容器的高度和宽度*/
	$this.mousedown(function(e){
		//$(document).scrollTop(0);
		var ghsotDiv ;
		var dragFix = {};
		var dragFlag = true;
		switchDrag = true;
		$this.css({"cursor":"move"});
		if(opts.to!=undefined){
			$this = opts.to;
		}
		$this.css({"position":"absolute"});//改变鼠标指针的形状
		//$this.fadeTo(20, 0.5);//点击后开始拖动并透明显示
		var $offset = $this.position();
		var x = tm_posXY(e).x - $offset.left;
		var y = tm_posXY(e).y - $offset.top;
		var containerHeight =getClientHeight()-3;
		var containerWidth = getClientWidth()-3;
		if(isNotEmpty(opts.parent)){
			containerHeight = $(opts.parent).innerHeight();
			containerWidth = $(opts.parent).innerWidth();
		}
		var selfHeight = $this.outerHeight(true);//容器自身的高度加border
		var selfWidth = $this.outerWidth(true);//容器自身的宽度加border
		var fixY = containerHeight - selfHeight;
		var fixX = containerWidth - selfWidth;
		var fix = opts.fix;
		var fiy = opts.fiy;
		/*是否启用代理*/
		tm_forbiddenSelect();
		if(!switchDrag)return;
		if(opts.ghsot){ghsotDiv = opts.ghsotEvent($this);}
		$(document).mousemove(function(e){
			if(!switchDrag)return;
			if(!dragFlag)return;
			$this.stop();//加上这个之后
			var _left = tm_posXY(e).x - x;
			var _top = tm_posXY(e).y - y ;
			if(_left<=0)_left=0;
			if(_top<=0)_top=0;
			//if(_left >=fixX)_left = fixX+fix;
			//if(_top >=fixY)_top = fixY+fiy;
			if(isNotEmpty(opts.arrow)){
				if(opts.arrow=='left'){
					_top = $this.position().top;
				}
				if(opts.arrow=='top'){
					_left = $this.position().left;
				}
			}
			/*镜像处理*/
			if(opts.ghsot){
				ghsotDiv.css({left:_left+"px",top:_top+"px"});
			}else{
			/*普通处理*/
				$this.css({left:_left,top:_top});
			}
			dragFix.left  = _left;
			dragFix.top  = _top;
			opts.move($this,dragFix);
		}).mouseup(function(){
			//$this.fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
			$this.css({"cursor":""});
			if(opts.ghsot && switchDrag){
				ghsotDiv.remove();
				$this.css({left:dragFix.left +"px",top:dragFix.top+"px"});
			}
			tm_autoSelect();
			opts.callback(dragFix);
			dragFlag = false;
		});
	});
	
};

$.fn.tmDrag.defaults = {
	parent:"",
	arrow:"",
	ghsot:false,
	proxy:false,
	fix:0,
	fiy:0,
	ghsotEvent:function($this){
		var ghsotDiv = $("<div class='ghsot'><div>");
		var selfHeight = $this.outerHeight(true);//容器自身的高度加border
		var selfWidth = $this.outerWidth(true);//容器自身的宽度加border
		var $offset = $this.offset();
		ghsotDiv.css({zIndex:100001,border:"1px dotted #4684B2",background:"#ccc",opacity:0.35,position:"absolute",width:selfWidth,height:selfHeight,left:$offset.left,top:$offset.top});
		$("body").append(ghsotDiv);
		return ghsotDiv;
	},
	move:function($this,dragFix){
		
	},
	callback:function(dragFix){}
};
})(jQuery)

