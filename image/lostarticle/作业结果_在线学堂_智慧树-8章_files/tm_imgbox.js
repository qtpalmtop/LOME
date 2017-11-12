/**
 * 只能在可见区域内拖动才有效。特别是在firefox中的可见高度是元素填充body的高度。如果
 * 仅仅$("body")绑定的话不会出现虚线框。其其他浏览器下不会出现此类情况。
 * 只要在firefox浏览器下加了元素方可自动出现.
 * 支持 ie6,7,8,9 google firefox  
 * @param {Object} $
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
(function($){
	$.fn.tmImgbox = function(options){
		return this.each(function(){
			var opts = null;
			var cache = $(this).data("tmImgbox");
			if(cache){
				opts = $.extend(cache.options,options);
				cache.options = opts;
			}else{
				var opts = $.extend({},$.fn.tmImgbox.defaults,$.fn.tmImgbox.parseOptions($(this)),options);
				$(this).data("tmImgbox",{options:opts});
				initImgbox($(this));
			}
			if(opts.imgClassName == ''){
				var src = $(this).attr("src");
				if(isEmpty(src))src = $(this).attr("_src");
				opts.imgArrs.push(src);	
			}else {
				var imgSrcs = [];
				$(opts.imgClassName).each(function(){
					imgSrcs.push($(this).attr('_src'));
				});
				opts.imgArrs = imgSrcs;
			}
		});
	};

	var imgboxTimer = null;
	function initImgbox($this){
		var opts = $this.data("tmImgbox").options;
		$this.on(opts.eventType,function(e){
			opts.callback($this);
			stopBubble(e);
			var title = $(this).attr("title");
			if(isEmpty(title))title="";
			$("body").append('<div class="tm-ui-overdisplay" title="点击关闭图集"></div><div id="tm-box-wrap" style="display: block;  height: 468px;">'+
				'<div id="tm-box-outer">'+
					'<div class="tm-box-bg" id="tm-box-bg-n"></div>'+
					'<div class="tm-box-bg" id="tm-box-bg-ne"></div>'+
					'<div class="tm-box-bg" id="tm-box-bg-e"></div>'+
					'<div class="tm-box-bg" id="tm-box-bg-se"></div>'+
					'<div class="tm-box-bg" id="tm-box-bg-s"></div>'+
					'<div class="tm-box-bg" id="tm-box-bg-sw"></div>'+
					'<div class="tm-box-bg" id="tm-box-bg-w"></div>'+
					'<div class="tm-box-bg" id="tm-box-bg-nw"></div>'+
					'<div id="tm-box-content">'+
						'<img id="tm-box-imgs"  title="'+title+'"/>'+
					'</div>'+
					'<a id="tm-box-close" style="display: inline;"></a>'+
					'<div id="tm-box-title" style=""><span id="tm-box-tit">'+title+'</span><span id="tm-box-timer" style="margin:5px;"><a href="javascript:void(0)" id="tm-auto-play">自动播放</a></span></div>' +
					'<a href="javascript:;" id="tm-box-left" style="display: block;"><span class="tm-box-ico" id="tm-box-left-ico"></span></a>'+
					'<a href="javascript:;" id="tm-box-right" style="display: block;"><span class="tm-box-ico" id="tm-box-right-ico"></span></a>'+
				'</div>'+
			'</div>');
			$("#tm-box-imgs").css({height:0,width:0});
			var src = $(this).attr("src");
			if(isEmpty(src))src = $(this).attr("_src");
			tmImgBoxLoading(src,opts);
			$("#tm-box-wrap").width(opts.width);
			$("#tm-box-content").width(opts.width-20).height(opts.height);
			var vheight = $(window).height();
			if(document.body.scrollHeight>$(window).height()){
				vheight = document.body.scrollHeight-20;
			}
			
			$(".tm-ui-overdisplay").height(vheight);
			if(opts.drag)$(".tm-box-bg").tmDrag({to:$("#tm-box-wrap"),ghsot:true});
			$(".tm-ui-overdisplay").click(function(){
				$("#tm-box-loading").remove();
				$("#tm-box-wrap").fadeIn("fast",function(){
					$(this).remove();
				});
				$(".tm-ui-overdisplay").fadeIn("fast",function(){
					$(this).remove();
				});
				clearInterval(imgboxTimer);
			});
			
			$.fn.tmImgbox.methods.resizeImgbox($this);
			if(isNotEmpty(opts.top)){
				$("#tm-box-wrap").css("top",opts.top);
			}
			
			/*翻页控制*/
			var index = opts.imgArrs.indexOf($(this).attr("src"));
			var imgArr = opts.imgArrs;
			$("#tm-box-left").click(function(){
				clearInterval(imgboxTimer);
				if(index==0)index = imgArr.length;
				index--;
				tmImgBoxLoading(imgArr[index],opts,1);
			});
			
			$("#tm-box-right").click(function(){
				clearInterval(imgboxTimer);
				index++;
				if(index== imgArr.length)index = 0;
				tmImgBoxLoading(imgArr[index],opts);
			});
			
			$("#tm-auto-play").click(function(){
				var text = $(this).text();
				if(text=='自动播放')$(this).text("暂停播放");
				if(text=='暂停播放'){
					clearInterval(imgboxTimer);
					$(this).text("自动播放");
					return;
				}
				/*定时轮播*/
				imgboxTimer = setInterval(function(){
					index++;
					if(index == imgArr.length)index = 0;
					tmImgBoxLoading(imgArr[index],opts);
				},opts.time*1000);
			});
			/*翻页控制*/
		});
	};
	
	function tmImgBoxLoading(src,opts,dtype){
		var img = new Image();
		img.src = src;
		if(img.complete){
			tmImgBoxLoadingProxy(img,opts,dtype);
		}else{
			img.onreadystatechange = function () {
			}
			img.onload = function () {
				tmImgBoxLoadingProxy(img,opts,dtype);
			}
			img.onerror = function () {
				//alert("图片加载失败...");
				if(dtype==1){
					$("#tm-box-left").click();
				}else{
					$("#tm-box-right").click();
				}
			}
		}
	};
	
	function tmImgBoxLoadingProxy(img,opts){
		$("#tm-box-loading").remove();
		var top = (getClientHeight() - opts.height) / 2
		$("#tm-box-wrap").append('<div id="tm-box-loading" style="display:none; "><div style="top: -80px; "></div></div>');	
		var title = $("img[src='"+img.src+"']").attr("title")
		if(isEmpty(title)){
			title = $("*[_src='"+img.src+"']").attr("title");
		}
		$("#tm-box-loading").fadeIn(200,function(){
			$(this).hide();
			$("#tm-box-imgs").attr("src",img.src);
			$("#tm-box-tit").html(title);
			var width = img.width;
			var height = img.height;
			var bodyWidth = opts.width;
			var bodyHeight = opts.height;
			var box = $.fn.tmImgbox.methods.resizeImg(img,760,550);
			$("#tm-box-imgs").width(box.width).height(box.height);
			var width = $("#tm-box-imgs").width();
			var height = $("#tm-box-imgs").height();
			var left = (bodyWidth - width)/2-10;
			var top = (bodyHeight - height)/2 ;
			$("#tm-box-imgs").css({left:left,top:top});
		});
	}
	
	$.fn.tmImgbox.parseOptions = function($target) {
		return {
		}
	};
	
	$.fn.tmImgbox.methods = {
		loadImg : function(src,$img){
		      var o= new Image();
		      o.src = src;
		      if(o.complete){
		    	  $("#tm-box-loading").remove();
		    	  $img.attr("src",src);
		    	  $img.show();
		      }else{
		        o.onload = function(){
		          $("#tm-box-loading").remove();
		          $img.attr("src",src);
		          $img.show();
		        };
		        o.onerror = function(){
		        	//myHomeInitLoading("图片加载失败")
		        };
		    }
		},
		
		resizeImg:function (img,iwidth,iheight){ 
		    var image= img;  
		    var boxWH = {};
		    if(image.width>0 && image.height>0){
		     	boxWH.width=image.width;
		     	boxWH.height=image.height;	    
		        if(boxWH.width>iwidth){    
		          	boxWH.height = (boxWH.height*iwidth)/boxWH.width;  
		            boxWH.width = iwidth;
		                 
		        }
		        if(boxWH.height>iheight){    
		          	boxWH.width = (boxWH.width*iheight)/boxWH.height;;   
		            boxWH.height = iheight;	             	 
		         }    	           
		    }   
		    return boxWH;
		} ,
		
		resizeImgbox:function($this){
			var bodyWidth = $(window).innerWidth() ;
			var bodyHeight = getClientHeight();
			var offset =$this.offset();
			var width = $("#tm-box-wrap").width();
			var height = $("#tm-box-wrap").height();
			var left = (bodyWidth - width)/2;
			var top = (bodyHeight - height)/2 - 30;
			$("#tm-box-wrap").css({left:left,top:top});
			$("#tm-box-close").click(function(){
				$("#tm-box-wrap").fadeOut('slow',function(){
					$(this).remove();
				});
					
				$(".tm-ui-overdisplay").fadeIn("fast",function(){
					$(this).remove();
				});
				clearInterval(imgboxTimer);
			});
		}
	}
	
	
	$.fn.tmImgbox.defaults ={
		imgArrs:[],
		imgClassName:'', //预览图片
		drag:false,
		width:760,
		height:420,
		eventType:"click",
		time:2,
		callback:function(){
			
		}
	}
})(jQuery)
