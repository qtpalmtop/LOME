/***
 * @author 徐成飞
 * @date : 2012-12-12 09:53:12
 * TmDialog参数说明:
 * 
 * 基础参数有:
 * title :标题
 * content ：内容
 * value, 只适合用于prompt弹出框
 * callback 回调函数
 * 
 * options参数包括有:
 * width：宽度
 * height：高度
 * arrow：显示位置，十二个方位
 * timeout：是否定时关闭，写数字就行
 * overlay：是否显示阴影层，默认为:show 不显示:hide
 * icon:图标显示：之适用于alert,sure弹出框,它有:warm(警告)tip(提示)question(疑问)success(成功)error(错误)
 * drag:"true",是否可以拖动 在message弹出框中,drag是为"false".
 * animate:"true", 是否用特效关闭弹出层 是："true" 否："false"
 * msg icon timer 只适用于tipSuccess
 * 
 * 
 * example
 * //$(function(){
////	$("#alert").live("click",function(){
////		$.tmDialog.alert({target:$(this),title:"你好",content:"圣达菲圣达菲圣达菲",callback:function(ok){
////			if(ok){
////			}else{
////			}
////		}});
////	});
//	
////	$.tmDialog.confirm({title:"删除",content:"你确定删除吗?",callback:function(ok){
////			if(ok){
////				alert("success");
////			}else{
////				alert("fail");
////			}
////		
////	}});
//	
////	$.tmDialog.sure({title:"删除",icon:"warm",content:"你确定删除吗?",callback:function(ok){
////			if(ok){
////				alert("success");
////			}else{
////				alert("fail");
////			}
////		
////	}});
//	
////	$.tmDialog.prompt({title:"删除",content:"请输入：",value:"11111",callback:function(ok){
////			if(ok){
////				alert(ok);
////			}else{
////				alert("fail");
////			}
////		
////	}});
//	
////	$.tmDialog.html({title:"删除",content:"请输入：",callback:function(ok){
////			if(ok){
////				alert(ok);
////			}else{
////				alert("fail");
////			}
////		
////	}});
////	$("#alert").live("click",function(){
////		$.tmDialog.iframe({title:"删除",target:$(this),url:"http://www.xunlei.com",width:640,height:480,timeout:0,callback:function($iframe,$dialog,$parent){
////				if($iframe && $dialog && $parent){
////					alert($dialog);
////				}
////		}});
////	});
//	
//})
 */
(function($){
	var dialogTimerInterval2 = null;
	var dialogTimerInterval = null;
	$.fn.tmDialog = function(options){
		return this.each(function(){
			var opts = null;
			var cache = $(this).data("tmDialog");
			if(cache){
				opts = $.extend(cache.options,options);
				cache.options = opts;
			}else{
				opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.parseOptions($(this)),$.fn.tmDialog.methods,options);
				$(this).data("tmDialog",{options:opts});
				tmDialogInit($(this));
			}
		});
	}
	
	/*方法初始化*/
	var zindex = 101;
	function tmDialogInit($this){
		var opts = $this.data("tmDialog").options;
		$this.on("click",function(){
			zindex++;
			var $dialog = opts.data(opts);
			$dialog.click(function(){
				zindex++;
				$(this).css("zIndex",zindex);
			});
			/*参数控制*/
			if(opts.drag)opts._drag($dialog);
			opts._overlay(opts.overlay);//阴影层
			opts.showType($dialog,opts,$this);//图标控制
			//是否采用特效
			if(opts.animate){
				$dialog.hide();
				opts._positionTarget($dialog,opts,$this);
			}
			if(opts.appendBtn!="")opts._appendBtn($dialog,$this);
			if(opts.appendTitle!="")opts._appendTitle($dialog,$this);
			if(opts.timeout!="" && opts.timeout!=0)opts._timer($dialog,$this);
			opts._btnArrow($dialog,$this);
			opts._position("true",$dialog,opts,$this);
			opts._resizePosition(true,$dialog,opts,$this);
			opts.before($dialog,$this,opts);
		});
	}
	
	/*事件方法定义*/
	$.fn.tmDialog.methods = {
		data:function (opts){
			clearInterval(dialogTimerInterval);	
			clearInterval(dialogTimerInterval2);	
			if(opts.single)$(".wrap_popboxes").remove();
			var rid = tmRandom();
			 var $popbox = $('<div id="tm_dialog_'+opts.opid+"_"+rid+'" class="wrap_popboxes  '+opts.appendClass+'" style="position:'+opts.pos+';z-index:'+zindex+';width:'+opts.width+'px;'+opts.dialogStyle+'">'+
				'<h4 class="popboxes_tit" style="'+opts.titleStyle+'"><strong id="popbox_title" name="popbox_title">'+opts.title+'</strong></h4>'+
				'<div class="box_popboxes">'+
					'<div class="popboxes_main">'+
						'<span class="tm_box_icon ico_'+opts.icon+' tmui_txt_hidd"></span>'+
						'<div class="popboxes_con">'+
							'<p>'+opts.content+'</p>'+
						'</div>'+
					'</div>'+
					'<div class="popboxes_btn">'+
						'<a href="javascript:void(0)" class="popbtn_yes"><span>'+opts.sureButton+'</span></a>'+
						'<a href="javascript:void(0)" class="popbtn_cancel"><span>'+opts.cancleButton+'</span></a>'+
					'</div>'+
				'</div>'+
				'<div style="position:absolute;top:10px;right:0px;"><a href="javascript:void(0);" id="close_windowa" class="popboxes_close tmui_txt_hidd" title="关闭"></a></div>'+
			'</div>');
			 
			 if(opts.sureButton=="关闭"){
				 $popbox = $('<div id="tm_dialog_'+opts.opid+"_"+rid+'" class="wrap_popboxes  '+opts.appendClass+'" style="position:'+opts.pos+';z-index:'+zindex+';width:'+opts.width+'px;'+opts.dialogStyle+'">'+
							'<h4 class="popboxes_tit" style="'+opts.titleStyle+'"><strong id="popbox_title" name="popbox_title">'+opts.title+'</strong></h4>'+
							'<div class="box_popboxes">'+
								'<div class="popboxes_main">'+
									'<span class="tm_box_icon ico_'+opts.icon+' tmui_txt_hidd"></span>'+
									'<div class="popboxes_con">'+
										'<p>'+opts.content+'</p>'+
									'</div>'+
								'</div>'+
								'<div class="popboxes_btn">'+
									'<a href="javascript:void(0)" class="popbtn_yes"><span>'+opts.sureButton+'</span></a>'+
									
								'</div>'+
							'</div>'+
							'<div style="position:absolute;top:10px;right:0px;"><a href="javascript:void(0);" id="close_windowa" class="popboxes_close tmui_txt_hidd" title="关闭"></a></div>'+
						'</div>');
			 }
			 
			$("body").append($popbox);
			/*事件绑定*/
			return $popbox;
		},
		_setTitle:function($dialog,$this,titleHtml){
			$dialog.find("#popbox_title").html(titleHtml);
		},
		_appendTitle:function($dialog,$this){
			var opts = $this.data("tmDialog").options;
			$dialog.find("#popbox_title").css("position","absolute");
			$dialog.find("#popbox_title").html(opts.appendTitle);
			$dialog.find(".tm_apptit").click(function(){
				$(this).siblings().removeClass("popbox_apptit_selected");
				$(this).addClass("popbox_apptit_selected");
			});
		},
		_appendBtn:function($dialog,$this){
			var opts = $this.data("tmDialog").options;
			$dialog.find(".popboxes_btn").append(opts.appendBtn);
		},
		_btnArrow:function($dialog,$this){
			var opts = $this.data("tmDialog").options;
			$dialog.find(".popboxes_btn").css("textAlign",opts.btnArrow);
		},
		showType:function($dialog,opts,$this){
			var opts = $this.data("tmDialog").options;
			switch(opts.type){
				case "alert":
					if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
					$dialog.find(".popbtn_cancel").remove();
					this._sure($dialog,opts,$this);
					this._close($dialog,opts,$this);
					break;
				case "confirm":
					if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
					this._sure($dialog,opts,$this);
					this._close($dialog,opts,$this);
					this._cancle($dialog,opts,$this);
					break;
				case "sure":
					if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
					$dialog.find(".popbtn_cancel").remove();
					$dialog.find(".popboxes_close").remove();
					this._sure($dialog,opts,$this);
					break;
				case "html":
					if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
					//$dialog.find(".popboxes_main").css({overflow:"auto"});
					$dialog.find(".popboxes_main").empty();
					if(opts.content instanceof jQuery){
						$dialog.find(".popboxes_main").append(opts.content.show());
						opts.content = opts.content.clone();
					}else{
						$dialog.find(".popboxes_main").html(opts.content);
					}
					$dialog.find(".tm_box_icon").remove();
					$dialog.find(".popbtn_yes").click(function(){
						if(opts.validator()){
							if(opts.callback){
								opts.callback(true,$dialog,$this,opts);
							}
							
							if(opts.content instanceof jQuery){
								if(opts.source){
									opts.source.html(opts.content.hide());	
								}else{
									$("body").append(opts.content.hide());
								}
							}
						}else{
							//可能验证不通过也执行一个回调函数
						}
					});
					
					$dialog.find(".popbtn_cancel").click(function(){
						$.tmDialog._remove($dialog,opts,$this);
						if(opts.callback){
							opts.callback(false);
						}
						
						if(opts.content instanceof jQuery){
							if(opts.source){
								opts.source.html(opts.content.hide());	
							}else{
								$("body").append(opts.content.hide());
							}
						}
					});	
					
					$dialog.find(".popboxes_close").click(function(){
						$.tmDialog._remove($dialog,opts,$this);
						if(opts.callback){
							opts.callback(false);
						}
						if(opts.content instanceof jQuery){
							if(opts.source){
								opts.source.html(opts.content.hide());	
							}else{
								$("body").append(opts.content.hide());
							}
						}
					});	
					break;
				case "page":
					if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
					$dialog.find(".popboxes_main").css({overflow:"hidden"});
					$dialog.find(".popboxes_main").empty();
					if(opts.ajax){
						$dialog.hide();
						$.ajax({
							type:"post",
							url:opts.content,
							beforeSend:function(){tmWaitLoading("请等待");},
							error:function(){tmClearLoading();},
							success:function(data){
								tmClearLoading();
								$dialog.show(function(){
									$.fn.tmDialog.methods._sure($dialog,opts,$this);
									$.fn.tmDialog.methods._close($dialog,opts,$this);
									$.fn.tmDialog.methods._cancle($dialog,opts,$this);
								});
								opts.loadSuccess($dialog,opts,$this,data)
							}
						});
					}else{
						$dialog.find(".popboxes_main").load(opts.content,function(){
							$.fn.tmDialog.methods._sure($dialog,opts,$this);
							$.fn.tmDialog.methods._close($dialog,opts,$this);
							$.fn.tmDialog.methods._cancle($dialog,opts,$this);
						});
					}
					break;
				case "iframe":
					$dialog.find(".popboxes_main").empty();
					if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
					$dialog.find(".popboxes_main").html("<div id='tmDialog_loading' style='position:absolute;top:50%;left:40%;'><img src='/onlineExam/web/images/loading.gif'><label style='font-size:12px;'>数据马上就来...</label></div>");
					var iframe=document.createElement("iframe");
					iframe.id = "tmDialog_iframe";
					iframe.width="100%";
					iframe.height=(opts.height);
					iframe.scrolling="auto";
					iframe.frameborder ="0";
					if(opts.url.indexOf("?")==-1){
						opts.url+="?dialog=true";
					}else{
						opts.url+="&dialog=true";
					}
					if($this.attr("opid")!=undefined){
						opts.url = opts.url.replace(/#opid/,$this.attr("opid"));
					}
					if($this.attr("to")!=undefined){
						opts.url = opts.url.replace(/#to/,$this.attr("to"));
					}
					iframe.src=opts.url;
					iframe.style.display ="none";
					$(iframe).attr("frameborder","0");
					$dialog.find(".popboxes_main").append(iframe);
					$(iframe).load(function(){
						iframe.style.display ="block";
						$("#tmDialog_loading").hide();
					});
					$dialog.find(".popboxes_main").css({overflow:"hidden"});
					$dialog.find(".popbtn_yes").click(function(){
						$.fn.tmDialog.methods._remove($dialog,opts,$this);
						if(opts.callback)opts.callback($.fn.tmDialog.methods._dialogIframeObject("tmDialog_iframe"),$dialog,$.fn.tmDialog.methods._parentIframe());
						$.fn.tmDialog.methods._remove($dialog,opts,$this);
					});
					$dialog.find(".popbtn_cancel").click(function(){
						$.fn.tmDialog.methods._remove($dialog,opts,$this);
						if(opts.callback)opts.callback(null,null,null);
					});
					$dialog.find(".popboxes_close").click(function(){
						$.fn.tmDialog.methods._remove($dialog,opts,$this);
						if(opts.callback)opts.callback(null,null,null);
					});
					break;
				case "prompt":
					$dialog.find(".popboxes_con").append("<input type='text' style='width:100%' value='"+opts.value+"' class='popbox_input'/>");
					$dialog.find(".popboxes_con").css("padding",20);
					$dialog.find(".popbox_input").focus();
					$dialog.find(".popbtn_yes").click(function(){
						var promptVal = $dialog.find(".popbox_input").val();
						if(isEmpty(promptVal)){
							$dialog.find(".popbox_input").focus();
							return;
						}
						if(!opts.validator(promptVal)){
							$dialog.find(".popbox_input").focus();
							return;
						}
						$.fn.tmDialog.methods._remove($dialog,opts,$this);
						if(opts.callback)opts.callback(promptVal);
					});
					$dialog.find(".popbtn_cancel").click(function(){
						$.fn.tmDialog.methods._remove($dialog,opts,$this);
						if(opts.callback)opts.callback(null);
					});
					$dialog.find(".popboxes_close").click(function(){
						$.fn.tmDialog.methods._remove($dialog,opts,$this);
						if(opts.callback)opts.callback(null);
					});
					$dialog.find(".tm_box_icon").remove();
					break;
			}
		},
	
		_dialogIframeObject:function(iframeId){
			return document.getElementById(iframeId).contentWindow;
		},
		_parentIframe:function(){
			return $(parent.document);
		},
		_cancle:function($dialog,opts,$this){
			$dialog.find(".popbtn_cancel").click(function(){
				if(opts.callback){
					opts.callback(false);
				}
				if(opts.content instanceof jQuery){
					if(opts.source){
						opts.source.html(opts.content.hide());	
					}else{
						$("body").append(opts.content.hide());
					}
				}
				$.fn.tmDialog.methods._remove($dialog,opts,$this);
			});
		},
		
		_sure:function($dialog,opts,$this){
			$dialog.find(".popbtn_yes").click(function(){
				if(opts.callback){
					opts.callback(true);
				}
				if(opts.content instanceof jQuery){
					if(opts.source){
						opts.source.html(opts.content.hide());	
					}else{
						$("body").append(opts.content.hide());
					}
				}
				$.fn.tmDialog.methods._remove($dialog,opts,$this);
			});
		},
		
		_close:function($dialog,opts,$this){
			$dialog.find(".popboxes_close").click(function(){
				if(opts.callback){
					opts.callback(false);
				}
				if(opts.content instanceof jQuery){
					if(opts.source){
						opts.source.html(opts.content.hide());	
					}else{
						$("body").append(opts.content.hide());
					}
				}
				$.fn.tmDialog.methods._remove($dialog,opts,$this);
			});	
		},
		
		_drag:function($dialog){
			$dialog.find(".popboxes_tit").tmDrag({to:$dialog,ghsot:true,callback:function(dragFix){
				$dialog.next(".tm_resizable").css({left:dragFix.left,top:dragFix.top});	
			}});
		},
		
		_overlay:function(status){
	    	if(status){
		    	$("#popbox_overlay").remove();
		    	var height = $(window).outerHeight(true);
	    		var overLayObj = $('<div id="popbox_overlay" style="width:100%; height:100%; background-color:#000; position:fixed; top:0; left:0; z-index:99;"></div>');
	    		$("body").append(overLayObj);
	    		overLayObj.css("opacity","0.42");
    		}else{
    			$("#popbox_overlay").remove();
    		}	
	    },
	    
	    _resizePosition: function(status,$dialog,opts,$this) {
			switch(status) {
				case true:
				$(window).bind('resize', function(){
					$.fn.tmDialog.methods._position(status,$dialog,opts,$this);
				});
				break;
				case false:
				$(window).unbind('resize',function(){
					$.fn.tmDialog.methods._position(status,$dialog,opts,$this);
				});
				break;
			}
		},
		_position:function(status,$dialog,opts,$this){
			if(status){
				var top = this._fix($dialog).top - opts.offsetTop ;
				var left = this._fix($dialog).left ;
				$dialog.css({left:left,top:top});
				$dialog.next(".tm_resizable").css({left:left,top:top});
			}
		},
		
		_fix:function($dialog){
			var bodyHeight = getClientHeight();
			var bodyWidth = getClientWidth();
			var dialogWidth = $dialog.width();
			var dialogHeight = $dialog.height();
			var top = (bodyHeight - dialogHeight)/2;
			var left = (bodyWidth - dialogWidth)/2 ;
			return {left:left,top:top};
		},
		_positionTarget:function($dialog,opts,$this){
			zindex++;
			var $resizeProxy = $("<div class='tm_resizable' style='position:absolute;z-index:"+zindex+";border:2px dotted #4684b2;'></div>");
			var $thisPos  = $this.offset(); 
			var width = $dialog.width();
			var height = $dialog.height();
			var $bodyPos = this._fix($dialog);
			$dialog.after($resizeProxy);
			$dialog.next(".tm_resizable").css({left:($thisPos.left+$this.width()/2),top:($thisPos.top+$this.height()/2)}).show();
			$dialog.next(".tm_resizable").animate({opacity:1,width:width+"px",height:height+"px",top:($bodyPos.top+windowPosition.scrollTop()-opts.offsetTop)+"px",left:$bodyPos.left+"px"},300,function(){
				$(this).hide();
				$.fn.tmDialog.methods._show($dialog);
			});
		},
		_remove:function($dialog,opts,$this){
			this._overlay(false);
			clearInterval(dialogTimerInterval);
			if(opts.animate){
				var t = $this.offset().top;
    			var l = $this.offset().left;
    			var width =  $this.width();
    			var height = $this.height();
    			var left = $dialog.offset().left;
    			var top = $dialog.offset().top;
	    		this._hide($dialog);
	    		$dialog.next(".tm_resizable").show();
    			$dialog.next(".tm_resizable").animate({left:l+"px",top:t+"px",width:width+"px",height:height+"px",opacity:0},400,function(){
    				$(this).remove();
    				$dialog.remove();
	    		});
			}else{
				this._fadeout($dialog,opts,$this);
				
			}
			
			
		},
		_fadeout:function($dialog,opts,$this){
			clearInterval(dialogTimerInterval);
			if(opts.fadeout){
				$dialog.fadeOut('fast',function(){
					$(this).remove();
				});
			}else{
				$dialog.remove();
			}
		},
		_timer:function($dialog,opts,$this){
			var count = opts.timeout * 1;
			var title = $dialog.find("#popbox_title").text();
			dialogTimerInterval= setInterval(function(){
				$dialog.find("#popbox_title").text(title);
				count--;
				if(count<0){
					$.fn.tmDialog.methods._remove($dialog,$this);
					clearInterval(dialogTimerInterval);
				}
			}, 900);
		},
		_hide:function($dialog){
			clearInterval(dialogTimerInterval);
			$dialog.hide();
			this._overlay(false);
		},
		_show:function($dialog){
			$dialog.show();
		},
		setContentHTML:function($dialog,html){
			$dialog.find(".popboxes_main").html(html);
		}
	}
	
	$.fn.tmDialog.parseOptions = function(target) {
		var $target = $(target);
		return {
			opid : $target.attr("id"),
			icon:$target.attr("icon"),
			title:$target.attr("title"),
			drag:$target.attr("drag"),
			animate:$target.attr("animate"),
			type:$target.attr("type"),
			offsetLeft:$target.attr("offsetLeft"),
			offsetTop:$target.attr("offsetTop"),
			sureButton:$target.attr("sureButton"),
			cancleButton:$target.attr("cancleButton")
		}
	};
	
	/*默认参数设置*/
	$.fn.tmDialog.defaults = {
		dialogStyle:"",	
		pos:"fixed",/*默认定位*/
		appendClass:"wrap_popchapter",/*追加样式*/
		url:"http://www.baidu.com",/*只适用于iframe形式*/
		opid:"win",//追加ID
		title:"提示",//标题
		icon:"success",//图标
		content:"请输入",//内容
		sureButton:"确定",//确定按钮字
		cancleButton:"取消",//取消按钮字
		width:400,//宽度
		height:"100%",//高度
		offsetLeft:0,//左偏移
		offsetTop:40,//顶部偏移
		overlay:true,/*是否显示阴影层*/
		manyOverlay:false,/*是否显示阴影层*/
		drag:false,//是否可以拖动
		timeout:0,//几秒关闭
		showTime:false,//是否显示倒计时数字
		type:"alert",
		value:"",//用于prompt
		animate:true,//是否采用动画
		source:"",
		fadeout:false,//是否使用淡入淡出的小狗狗
		scrolling:"no",
		msg:"保存成功!",
		zindex : 102,
		time:1,
		btnArrow:"center",//按钮居右
		target:"",//来源目标
		showBtn:true,//是否显示按钮
		titleStyle:"",//追加标题style
		PtitleStyle:"",//标题外层的样式
		titleClass:"",//追加标题class
		single:false,//是否单列显示
		textarea : false,
		extraHTML:"",
		validator:function(ok){return true;},//是否验证用于prompt
		finish:function(){},//定时关闭后执行的回调函数
		success:function(){},
		before:function(){},//弹出层加载完毕后执行的回调函数
		proxySubmit:function($dialog,opts){},//用于html和loadPage形式的代理按钮的回调
		callback:function(ok){//弹出层的所有回调
			
		},
		loadSuccess:function($dialog,opts,data){
			
		}
	}
	
	
	/*单列模式*/
	$.tmDialog = {
		tipSuccess:function(options){
			clearInterval(dialogTimerInterval2);
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			$(".box_savetip").remove();
			if(opts.icon=='success')opts.icon="succ";
			$("body").append('<strong class="box_savetip"><span class="savetip_'+opts.icon+'">'+opts.msg+'<span style="display:none;" id="popbox_title"></span></span></strong>');
			$(".box_savetip").css({position:"fixed",zIndex:999999});
			var self = $(".box_savetip");
			var pos = opts._fix(self);
			this._overlay(opts.manyOverlay);
			$(".box_savetip").css({position:"fixed",top:pos.top,left:pos.left});
			$("#popbox_overlay").css("zIndex",opts.zindex).click(function(){
				$(".box_savetip").fadeOut('slow',function(){
					$(this).remove();	
					$.tmDialog._overlay(opts.manyOverlay);
					clearInterval(dialogTimerInterval2);
				});
			});
			if(isNotEmpty(opts.time)){
				this._tipTimer(opts);
			}
		},
		_tipTimer:function(opts){
			var count = opts.time * 1;
			var title = $("#popbox_title").text();
			dialogTimerInterval2= setInterval(function(){
				$("#popbox_title").text(title);
				count--;
				if(count<=0){
					$(".box_savetip").remove();
					$.tmDialog._overlay(opts.manyOverlay);
					opts.success();
					count==0;
					clearInterval(dialogTimerInterval2);
				}
			}, 1000);
		},
		alert:function(options){
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			var $dialog = opts.data(opts);
			if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
			this._position("true",$dialog,opts);
			this._resizePosition(true,$dialog,opts);
			if(opts.animate && isNotEmpty(opts.target)){
				$dialog.hide();
				this._positionProxy($dialog,opts);
			}

			if(!opts.manyOverlay)this._overlay(opts.overlay);
			if(opts.manyOverlay)this._manyOverlay($dialog,opts.overlay);
			if(isNotEmpty(opts.zindex))this._zindex($dialog,opts);
			if(opts.drag)opts._drag($dialog);
			if(isNotEmpty(opts.top))this._settingPosTop($dialog, opts);
			if(!opts.showBtn)this._showBtn($dialog,opts);
			if(opts.timeout!="" && opts.timeout!=0)$.tmDialog._timer($dialog,opts);
			$dialog.find(".popbtn_cancel").remove();
			this._btnArrow($dialog,opts);
			this._sure($dialog,opts);
			this._close($dialog,opts);
		},
		
		_zindex : function($dialog,opts){
			$dialog.css("zIndex",opts.zindex);
			if(!opts.manyOverlay)$("#popbox_overlay").css("zIndex",(opts.zindex-1));
			if(opts.manyOverlay)$dialog.next(".popbox_overlay").css("zIndex",(opts.zindex-1));
		},
		confirm:function(options){
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			var $dialog = opts.data(opts);	
			if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
			this._position("true",$dialog,opts);
			this._resizePosition(true,$dialog,opts);
			if(opts.animate && isNotEmpty(opts.target)){
				$dialog.hide();
				this._positionProxy($dialog,opts);
			}
			if(!opts.manyOverlay)this._overlay(opts.overlay);
			if(opts.manyOverlay)this._manyOverlay($dialog,opts.overlay);
			if(isNotEmpty(opts.zindex))this._zindex($dialog,opts);
			if(opts.drag)opts._drag($dialog);
			if(isNotEmpty(opts.top))this._settingPosTop($dialog, opts);
			if(opts.timeout!="" && opts.timeout!=0)$.tmDialog._timer($dialog,opts);
			if(!opts.showBtn)this._showBtn($dialog,opts);
			this._btnArrow($dialog,opts);
			this._sure($dialog,opts);
			this._close($dialog,opts);
			this._cancle($dialog,opts);   
		},
		
		prompt:function(options){
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			var $dialog = opts.data(opts);	
			if(opts.height<140)opts.height = 140;
			if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
			this._position("true",$dialog,opts);
			this._btnArrow($dialog,opts);
			this._resizePosition(true,$dialog,opts);
			if(opts.animate && isNotEmpty(opts.target)){
				$dialog.hide();
				this._positionProxy($dialog,opts);
			}
			if(!opts.showBtn)this._showBtn($dialog,opts);
			if(!opts.manyOverlay)this._overlay(opts.overlay);
			if(opts.manyOverlay)this._manyOverlay($dialog,opts.overlay);
			if(isNotEmpty(opts.zindex))this._zindex($dialog,opts);
			if(opts.drag)opts._drag($dialog);
			if(isNotEmpty(opts.top))this._settingPosTop($dialog, opts);
			if(opts.timeout!="" && opts.timeout!=0)$.tmDialog._timer($dialog,opts);
			if(opts.textarea){
				$dialog.find(".popboxes_con").append("<textarea style='width:97%;height:80px;' class='popbox_input'>"+opts.value+"</textarea>"+opts.extraHTML);
			}else{
				$dialog.find(".popboxes_con").append("<input type='text' style='width:100%' value='"+opts.value+"' class='popbox_input'/>"+opts.extraHTML);
			}
			$dialog.find(".popboxes_con").css({"padding":"20","margin":"8px 35px 0 30px","border":"none"});
			$dialog.find(".popbox_input").focus();
			$dialog.find(".popbtn_yes").click(function(){
				var promptVal = $dialog.find(".popbox_input").val();
				if(isEmpty(promptVal)){
					$dialog.find(".popbox_input").focus();
					return;
				}
				
				if(!opts.validator(promptVal)){
					$dialog.find(".popbox_input").focus();
					return;
				}
				$.tmDialog._remove($dialog,opts);
				if(opts.callback)opts.callback(promptVal);
			});
			$dialog.find(".popbtn_cancel").click(function(){
				$.tmDialog._remove($dialog,opts);
				if(opts.callback)opts.callback(null);
			});
			$dialog.find(".popboxes_close").click(function(){
				$.tmDialog._remove($dialog,opts);
				if(opts.callback)opts.callback(null);
			});
			$dialog.find(".tm_box_icon").remove();
		},
		
		sure:function(options){
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			var $dialog = opts.data(opts);
			if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
			this._position("true",$dialog,opts);
			this._resizePosition(true,$dialog,opts);
			if(opts.animate && isNotEmpty(opts.target)){
				$dialog.hide();
				this._positionProxy($dialog,opts);
			}
			if(!opts.showBtn)this._showBtn($dialog,opts);
			if(!opts.manyOverlay)this._overlay(opts.overlay);
			if(opts.manyOverlay)this._manyOverlay($dialog,opts.overlay);
			if(isNotEmpty(opts.zindex))this._zindex($dialog,opts);
			if(opts.drag)opts._drag($dialog);
			if(isNotEmpty(opts.top))this._settingPosTop($dialog, opts);
			if(opts.timeout!="" && opts.timeout!=0)$.tmDialog._timer($dialog,opts);
			$dialog.find(".popbtn_cancel").remove();
			$dialog.find(".popboxes_close").remove();
			this._btnArrow($dialog,opts);
			this._sure($dialog,opts);
		},
		sureProxy:function(options){
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			var $dialog = opts.data(opts);
			if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
			this._position("true",$dialog,opts);
			this._resizePosition(true,$dialog,opts);
			if(opts.animate && isNotEmpty(opts.target)){
				$dialog.hide();
				this._positionProxy($dialog,opts);
			}
			if(!opts.showBtn)this._showBtn($dialog,opts);
			if(!opts.manyOverlay)this._overlay(opts.overlay);
			if(opts.manyOverlay)this._manyOverlay($dialog,opts.overlay);
			if(isNotEmpty(opts.zindex))this._zindex($dialog,opts);
			if(opts.drag)opts._drag($dialog);
			if(isNotEmpty(opts.top))this._settingPosTop($dialog, opts);
			if(opts.timeout!="" && opts.timeout!=0)$.tmDialog._timer($dialog,opts);
			//$dialog.find(".popbtn_cancel").remove();
			$dialog.find(".tm_box_icon").remove();
			$dialog.find(".popboxes_close").remove();
			this._btnArrow($dialog,opts);
			this._sure($dialog,opts);
			this._cancle($dialog,opts);
		},
		message:function(options){
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			var $dialog = opts.data(opts);
			if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
			/*this._position("true",$dialog,opts);
			this._resizePosition(true,$dialog,opts);
			if(opts.animate && isNotEmpty(opts.target)){
				$dialog.hide();
				this._positionProxy($dialog,opts);
			}*/
			if(!opts.showBtn)this._showBtn($dialog,opts);
			if(!opts.manyOverlay)this._overlay(opts.overlay);
			if(opts.manyOverlay)this._manyOverlay($dialog,opts.overlay);
			if(isNotEmpty(opts.zindex))this._zindex($dialog,opts);
			if(opts.drag)opts._drag($dialog);
			if(opts.timeout!="" && opts.timeout!=0)$.tmDialog._timer($dialog,opts);
			$dialog.find(".popboxes_main").empty();
			$dialog.find(".popboxes_main").html(opts.content);
			$dialog.find(".popbtn_yes").hide();
			$dialog.find(".popboxes_btn").hide();
			$dialog.find(".popbtn_cancel").hide();
			$dialog.find(".tm_box_icon").remove();
			this._btnArrow($dialog,opts);
			this._close($dialog,opts);
			this._messagePosition($dialog, opts);
		},
		_messagePosition:function($dialog,opts){
			$dialog.css({left:getClientWidth()-$dialog.width()-3,top:$(window).height()-$dialog.height()-3});
		},
		
		html:function(options){
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			var $dialog = opts.data(opts);	
			if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
			this._position("true",$dialog,opts);
			this._resizePosition(true,$dialog,opts);
			this._btnArrow($dialog,opts);
			if(isNotEmpty(opts.top))this._settingPosTop($dialog, opts);
			if(opts.animate && isNotEmpty(opts.target)){$dialog.hide();this._positionProxy($dialog,opts);}
			if(!opts.showBtn)this._showBtn($dialog,opts);
			if(!opts.manyOverlay)this._overlay(opts.overlay);
			if(opts.manyOverlay)this._manyOverlay($dialog,opts.overlay);
			if(isNotEmpty(opts.zindex))this._zindex($dialog,opts);
			if(opts.drag)opts._drag($dialog);
			if(opts.timeout!="" && opts.timeout!=0)$.tmDialog._timer($dialog,opts);
			$dialog.find(".tm_box_icon").remove();
			//$dialog.find(".popboxes_main").css({overflow:"auto"});
			$dialog.find(".popboxes_main").empty();
			if(opts.content instanceof jQuery){
				$dialog.find(".popboxes_main").append(opts.content.show());
				opts.content = opts.content.clone();
			}else{
				$dialog.find(".popboxes_main").html(opts.content);
			}
			$dialog.find(".popbtn_yes").click(function(){
				if(opts.validator()){
					if(opts.callback){
						opts.callback(true,$dialog,opts);
					}
				}else{
					//可能验证不通过也执行一个回调函数
				}
			});
			
			$dialog.find(".popbtn_cancel").click(function(){
				$.tmDialog._remove($dialog,opts);
				if(opts.callback){
					opts.callback(false,$dialog,opts);
				}
				
				if(opts.content instanceof jQuery){
					if(opts.source){
						opts.source.html(opts.content.hide());	
					}else{
						$("body").append(opts.content.hide());
					}
				}
			});	
			
			$dialog.find(".popboxes_close").click(function(){
				$.tmDialog._remove($dialog,opts);
				if(opts.callback){
					opts.callback(false,$dialog,opts);
				}
				if(opts.content instanceof jQuery){
					if(opts.source){
						opts.source.html(opts.content.hide());	
					}else{
						$("body").append(opts.content.hide());
					}
				}
			});
			if(opts.loadSuccess){
				opts.loadSuccess();
			}
			
		},
		loadPage:function(options){
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			var $dialog = opts.data(opts);	
			if(opts.height)$dialog.find(".popboxes_main").height(opts.height);
			this._position("true",$dialog,opts);
			this._resizePosition(true,$dialog,opts);
			if(opts.animate && isNotEmpty(opts.target)){
				$dialog.hide();
				this._positionProxy($dialog,opts);
			}
			if(isNotEmpty(opts.zindex))this._zindex($dialog,opts);
			if(!opts.showBtn)this._showBtn($dialog,opts);
			this._overlay(opts.overlay);
			if(opts.drag)opts._drag($dialog);
			if(opts.timeout!="" && opts.timeout!=0)$.tmDialog._timer($dialog,opts);
			$dialog.find(".popboxes_main").css({overflow:"hidden"});
			$dialog.find(".tm_box_icon").remove();
			$dialog.find(".popboxes_main").empty();
			if(opts.ajax){
				$dialog.hide();
				$.ajax({
					type:"post",
					url:opts.content,
					beforeSend:function(){tmWaitLoading("请等待");},
					error:function(){tmClearLoading();},
					success:function(data){
						tmClearLoading();
						$dialog.slideDown('slow',function(){
							$.tmDialog._sure($dialog,opts);
							$.tmDialog._close($dialog,opts);
							$.tmDialog._cancle($dialog,opts);
						});
						opts.loadSuccess($dialog,opts,data)
					}
				});
			}else{
				$dialog.find(".popboxes_main").load(opts.content,function(){
					$.tmDialog._sure($dialog,opts);
					$.tmDialog._close($dialog,opts);
					$.tmDialog._cancle($dialog,opts);
				});
			}
		},
		
		iframe:function(options){
			var opts = $.extend({},$.fn.tmDialog.defaults,$.fn.tmDialog.methods,options);
			opts.pos = "absolute";
			var $dialog = opts.data(opts);	
			if(!opts.manyOverlay)this._overlay(opts.overlay);
			if(opts.manyOverlay)this._manyOverlay($dialog,opts.overlay);
			if(isNotEmpty(opts.zindex))this._zindex($dialog,opts);
			if(opts.drag)opts._drag($dialog);
			if(isNotEmpty(opts.timeout) && opts.timeout!=0)$.tmDialog._timer($dialog,opts);
			$dialog.find(".popboxes_main").empty();
			$dialog.find(".popboxes_main").height(opts.height);
			$dialog.find(".popboxes_main").html("<div id='tmDialog_loading' class='tm-dialog-loading' style='position:absolute;top:50%;left:40%;'><img src='/onlineExam/web/images/loading.gif'><label style='font-size:12px;'>数据马上就来...</label></div>");
			this._position("true",$dialog,opts);
			this._resizePosition(true,$dialog,opts);
			if(isNotEmpty(opts.top))this._settingPosTop($dialog, opts);
			if(opts.animate && isNotEmpty(opts.target)){
				$dialog.hide();
				this._positionProxy($dialog,opts);
			}
			if(!opts.showBtn)this._showBtn($dialog,opts);
			this._btnArrow($dialog,opts);
			var iframe=document.createElement("iframe");
			iframe.id = "tmDialog_iframe";
			iframe.width="100%";
			iframe.height=(opts.height);
			iframe.scrolling=opts.scrolling||"no";
			iframe.frameborder ="0";
			iframe.src=opts.url;
			iframe.style.display ="none";
			$(iframe).attr("frameborder","0");
			$dialog.find(".popboxes_main").append(iframe);
			var clearInterval = null;	
			$(iframe).load(function(){
				iframe.style.display ="block";
				$dialog.find("#tmDialog_loading").remove();
				opts.loadSuccess($.tmDialog._dialogIframeObject("tmDialog_iframe"),$dialog,opts);
				var childrenHeight = $(iframe).contents().find("body").height()+50;
				$(iframe).contents().find(".tm_dialog_proxy_close").click(function(){
					$.tmDialog._remove($dialog,opts);
				});
				/*
				clearInterval = setInterval(function(){
					var cheight = $(iframe).contents().find("body").height();
					$dialog.find(".popboxes_main").height(cheight+50);
					$("#popbox_overlay").height(cheight+300);
					$(iframe).height(cheight+20);
				}, 10);*/
			});
			$dialog.find(".popboxes_main").css({overflow:"hidden"});
			$dialog.find(".popbtn_yes").click(function(){
				if(clearInterval)clearInterval(clearInterval);
				if(opts.callback)opts.callback($.tmDialog._dialogIframeObject("tmDialog_iframe"),$dialog,$.tmDialog._parentIframe(),opts);
			});
			$dialog.find(".popbtn_cancel").click(function(){
				$.tmDialog._remove($dialog,opts);
				if(clearInterval)clearInterval(clearInterval);
				if(opts.callback)opts.callback(null,null,null,null);
			});
			$dialog.find(".popboxes_close").click(function(){
				$.tmDialog._remove($dialog,opts);
				if(clearInterval)clearInterval(clearInterval);
				if(opts.callback)opts.callback(null,null,null,null);
			});
			
			
		},
		_settingPos : function($dialog,opts){
			$dialog.css({top:opts.top,left:opts.left});
		},
		_settingPosTop : function($dialog,opts){
			$dialog.css({top:opts.top});
		},
		_dialogIframeObject:function(iframeId){
			return document.getElementById(iframeId).contentWindow;
		},
		_parentIframe:function(){
			return $(parent.document);
		},
		_sure:function($dialog,opts){
			$dialog.find(".popbtn_yes").click(function(event){
				$.tmDialog._remove($dialog,opts);
				if(opts.callback){
					opts.callback(true,$dialog,opts,event);
				}
			});
		},
		
		_cancle:function($dialog,opts){
			$dialog.find(".popbtn_cancel").click(function(){
				$.tmDialog._remove($dialog,opts);
				if(opts.callback){
					opts.callback(false);
				}
			});
		},
		
		_close:function($dialog,opts){
			$dialog.find(".popboxes_close").click(function(){
				$.tmDialog._remove($dialog,opts);
				if(opts.callback){opts.callback(false);}
			});	
		},
		
		_position:function(status,$dialog,opts){
			if(status){
				var top = this._fix($dialog).top - opts.offsetTop ;
				var left = this._fix($dialog).left - opts.offsetLeft ;
				if(top<30)top=35;
				$dialog.css({left:left,top:top});
				$dialog.next(".tm_resizable").css({left:left,top:top});
			}
		},
		_showBtn:function($dialog,opts){
			$dialog.find(".popboxes_btn").remove();
		},
		_positionProxy:function($dialog,opts){
			if(isNotEmpty(opts.target)){
				var $this = opts.target;
				zindex++;
				var $resizeProxy = $("<div class='tm_resizable' style='position:absolute;z-index:"+zindex+";border:1px dotted #4684b2;'></div>");
				var $thisPos  = $this.offset(); 
				var width = $dialog.width();
				var height = $dialog.height();
				var $bodyPos = this._fix($dialog);
				$dialog.after($resizeProxy);
				$dialog.next(".tm_resizable").css({left:($thisPos.left+$this.width()/2),top:($thisPos.top+$this.height()/2)}).show();
				$dialog.next(".tm_resizable").animate({opacity:1,width:width+"px",height:height+"px",top:($bodyPos.top+windowPosition.scrollTop()-opts.offsetTop)+"px",left:$bodyPos.left+"px"},300,function(){
					$(this).hide();
					$dialog.show();
				});
			}
		},
		_fix:function($dialog){
			var bodyHeight = getClientHeight();
			//var bodyHeight = $(window).height();
			var bodyWidth = getClientWidth();
			var dialogWidth = $dialog.width();
			var dialogHeight = $dialog.height();
			var top = (bodyHeight - dialogHeight)/2;
			var left = (bodyWidth - dialogWidth)/2 ;
			return {left:left,top:top};
		},
		
		_resizePosition: function(status,$dialog,opts) {
			switch(status) {
				case true:
				$(window).bind('resize', function(){
					$.tmDialog._position(status,$dialog,opts);
				});
				break;
				case false:
				$(window).unbind('resize',function(){
					$.tmDialog._position(status,$dialog,opts);
				});
				break;
			}
		},
		_btnArrow:function($dialog,opts){
			$dialog.find(".popboxes_btn").css("textAlign",opts.btnArrow);
		},
		_remove:function($dialog,opts){
			clearInterval(dialogTimerInterval);
			if(opts.animate && isNotEmpty(opts.target)){
				var $this = opts.target;
				$this.show();
				var t = $this.offset().top;
    			var l = $this.offset().left;
    			var width =  $this.width();
    			var height = $this.height();
    			var left = $dialog.offset().left;
    			var top = $dialog.offset().top;
	    		this._hide($dialog);
	    		$dialog.next(".tm_resizable").show();
    			$dialog.next(".tm_resizable").animate({left:l+"px",top:t+"px",width:width+"px",height:height+"px",opacity:0},300,function(){
    				$(this).remove();
    				if(opts.manyOverlay){
    					$.tmDialog._manyOverlay($dialog,false);
    					$dialog.remove();
    				}else{
    					$dialog.remove();
    					$.tmDialog._overlay(false);
    				}
	    		});
			}else{
				if(opts.fadeout){
					$dialog.fadeOut(400,function(){
						if(opts.manyOverlay){
							$.tmDialog._manyOverlay($(this),false);
							$(this).remove();
						}else{
							$(this).remove();
							$.tmDialog._overlay(false);
						}
					})
				}else{
					if(opts.manyOverlay){
						$.tmDialog._manyOverlay($dialog,false);
						$dialog.remove();
					}else{
						try{
							
							$dialog.remove();
						}catch(e){
							
							try{
								var children = $('[id^=tm_dialog_win_]').get(0);
								children.parentNode.removeChild(children);
								$('#popbox_overlay').remove();
							} catch(e){
								
							}
						}
						$.tmDialog._overlay(false);
					}
				}
			}
		},
		_hide:function($dialog){
			clearInterval(dialogTimerInterval); 
			$dialog.hide();
			$.tmDialog._overlay(false);
		},
		_timer:function($dialog,opts){
			var count = opts.timeout * 1;
			var title = $dialog.find("#popbox_title").text();
			dialogTimerInterval= setInterval(function(){
				if(opts.showTime){
					$dialog.find("#popbox_title").text(title);
				}
				count--;
				if(count<0){
					$.tmDialog._remove($dialog,opts);
					opts.finish();
					clearInterval(dialogTimerInterval);
				}
			}, 700);
		},
		_overlay:function(status){
			if(status){
		    	$("#popbox_overlay").remove();
		    	var height = $(document).height();
		    	var vheight = $(document).height();
		    	if(document.body.scrollHeight>$(window).height()){
		    		height = document.body.scrollHeight-20;
		    	}
	    		var overLayObj = $('<div id="popbox_overlay" style="width:100%; height:'+(vheight)+'px; background-color:#000; position:fixed; top:0; left:0; z-index:100;"></div>');
	    		$("body").append(overLayObj);
	    		overLayObj.hide();
	    		overLayObj.stop().fadeTo("slow","0.38");

			}else{
    			$("#popbox_overlay").fadeOut('slow',function(){
    				$(this).remove();
    			});
	    	}
	    },
	    _manyOverlay:function($dialog,status){
			if(status){
				$dialog.next(".popbox_overlay").remove();
				var height = $(window).height();
		    	if(document.body.scrollHeight>$(window).height()){
		    		height = document.body.scrollHeight-20;
		    	}
	    		var zIndexC=$("body").find(".popbox_overlay").length+101;
	    		var overLayObj = $('<div class="popbox_overlay" style="width:100%; height:'+(height+150)+'px; background-color:#000; position:fixed; top:0; left:0; z-index:'+zIndexC+';"></div>');
	    		$("body").append(overLayObj);
	    		overLayObj.hide();
	    		overLayObj.stop().fadeTo("slow","0.38");

			}else{
				$dialog.next(".popbox_overlay").fadeOut('slow',function(){
    				$(this).remove();
    			});
	    	}
	    }
	}
})(jQuery)

/*弹出框*/
function tmAlert(title,content,callback){
	$.tmDialog.alert({title:title,content:content,callback:callback});
};

/*确认框*/
function tmConfirm(title,content,callback){
	$.tmDialog.confirm({title:title,content:content,callback:callback});
};

/*输入框*/
function tmPrompt(title,content,callback){
	$.tmDialog.prompt({title:title,value:content,callback:callback});
};

/*确认框*/
function tmSure(title,content,callback){
	$.tmDialog.sure({title:title,content:content,callback:callback});
};

/*确认框*/
function tmLoad(title,content,width,height,callback){
	$.tmDialog.loadPage({title:title,width:width,height:height,content:content,offsetTop:-5,callback:callback});
};
/*close*/
function tmAlertClose($dialog,opts,$this){
	if(opts.content instanceof jQuery){
		if(opts.source){
			opts.source.html(opts.content.hide());	
		}else{
			$("body").append(opts.content.hide());
		}
	}
	if($this){
		$.fn.tmDialog.methods._remove($dialog,opts,$this);
	}else{
		$.tmDialog._remove($dialog,opts);
	}
};