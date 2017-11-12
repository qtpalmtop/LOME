(function($) {

	// 初始化Loading
	function initExmayLoading(target) {
		var $target = $(target);
		var opts = $target.data("exmayLoading").options;
		var $loading = $('<div class="exmayui-loading" title="点击我进行关闭!!!"><span class="exmayui-loading-msg">'+opts.msg+'</span></div>');
		$loading.bind("click",function(){
			exmayHideLoading(target);	
		});
		
		if(opts.width!=0 && opts.height!=0){
			$loading.css({width:opts.width,height:opts.height,"marginLeft":"-"+opts.width/2});
		}
		
		//$loading.css({"background":opts.background,"top":getBodyScrollSize().height/2-200});
		$loading.appendTo($target);
		if(opts.timeout!=0){
			window.setTimeout(function(){
			 	exmayHideLoading(target);
			},opts.timeout);
		}
		$target.data("exmayLoading", {
			options : opts,
			exmayLoading : $loading
		});
	};

	// 事件绑定
	function bindExmayLoadingEvents(target, options) {
		var $target = $(target);

	};

	// 显示
	function exmayShowLoading(target, options) {
		var $target = $(target);
		var $exmayLoading = $(target).data("exmayLoading").exmayLoading;
		$(".exmayui-loading-msg",$exmayLoading).html(options.msg);
		var opts = options;
		if(opts.timeout!=0){
			window.setTimeout(function(){
			 	exmayHideLoading(target);
			},opts.timeout);
		}
		$exmayLoading.show();
	};
	
	// 隐藏Loading
	function exmayHideLoading(target) {
		var $exmayLoading = $(target).data("exmayLoading").exmayLoading;
		$exmayLoading.hide();
	};
	
	// 隐藏Loading
	function exmayRemoveLoading(target) {
		var $exmayLoading = $(target).data("exmayLoading").exmayLoading;
		$exmayLoading.remove();
	};
	
	// 提示
	$.fn.exmayLoading = function(options, data) {

		// 方法调用
		if (typeof options == "string") {
			return $.fn.exmayLoading.methods[options](this, data);
		}
		
		this.each(function() {
			var $this = $(this);
			var opts = null;
			var cache = $this.data("exmayLoading");
			if (cache) {
				opts = $.extend(cache.options, options);
				cache.options = opts;
				if(opts.show) {
					exmayShowLoading(this,opts);
				}
			} else {
				opts = $.extend( {}, $.fn.exmayLoading.defaults, $.fn.exmayLoading.parseOptions($this), options);
				$this.data("exmayLoading", {
					options : opts
				});
				initExmayLoading(this);
			}
			// 支持多重事件绑定
			bindExmayLoadingEvents(this, opts);
		});

	};

	// 插件方法
	$.fn.exmayLoading.methods = {
		show : function(target, data){
			exmayShowLoading(target);
		},
		hide :  function(target, data) {
			exmayHideLoading(target);
		},
		remove:function(target, data) {
			exmayRemoveLoading(target);
		}
		
	};

	// 解析插件属性
	$.fn.exmayLoading.parseOptions = function(target) {
		var $target = $(target);
		return {
			//width : $target.outerWidth(),
			//height : $target.outerHeight(),
			left : $target.offset().left,
			top : $target.offset().top			
		}
	};

	$.fn.exmayLoading.defaults = {
		event : "mouseover",
		theme : "blue",
		tip : "em",
		msg : "数据加载中...",
		show : true,
		border : 5,
		width : 0,
		height: 0,
		background: "#f1f1f1", 
		left : null,
		top : null,
		timeout:0,
		maxWidth : 300,
		maxHeigh : 600,
		corner : true
	};

})(jQuery);