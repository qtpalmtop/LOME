function printWebInfo(info){if(window["console"]){window.console.log(info);}}
/*
 * Able player 3.0 VideoJS  依赖 ableplayer-2.0-beta.js
 * Author: WEISHOUBO
 * Date: 2015-7-10
 */
(function( window, undefined ){
	var $ = window.$,
		jQuery = window.jQuery,
		_swf_url = __base_url + _VideoJS_path,
		__ablePlayerManager,
		$global_div = $("<div></div>").appendTo($(window.document));
	var DEBUG = false;
	var DB_DURATION_TIME = 9*60 +Math.floor(Math.random()*100); //默认的九分钟
	var IS_CHANGING_PLAYER = false;
	/********/
	function ablePlayerManager(){
		this.players = {};
		this.has = function(playerid){
			return this.players && this.players[playerid];
		};
		this.get = function(playerid){
			return this.has(playerid) ? this.players[playerid] : null;
		};
		this.add = function(playerid,player,autostart){
			var oldPlayer = this.get(playerid);
			if(oldPlayer){
				oldPlayer.destroy();
			}
			this.players[playerid] = player;
			if(autostart)
				player.start();
		};
		this.remove = function(playerid){
			var player = this.get(playerid);
			if(player){
				player.destroy();
				this.players[playerid]=undefined;
			}
		};
		this.removeAll = function(){
			if(this.players)
				for(var playerid in this.players){
					this.remove(playerid);
				}
		};
	}
	__ablePlayerManager = new ablePlayerManager();
		
	var callbackJs = function (playerid , plusEvents){
		this.init(playerid, plusEvents);
	};
	
	callbackJs.prototype = {
			_playerid : null,
			_plusEvents:null, //客户注入的事件,对象的格式：{onClick:function(){},onError:function(){}}
			init :function (playerid , plusEvents){
				this._playerid = playerid;
				this._plusEvents = plusEvents;
				return this;
			},
			firePlayerEvents:function(eventType, value, undoDefaultEvent){
				var player = __ablePlayerManager.get(this._playerid);
				if(player){
					var hasPlusEvent = this._plusEvents && this._plusEvents[eventType];
					if(!(undoDefaultEvent && hasPlusEvent)){
						if(this[eventType]){
							this[eventType](value);
						}
					}
					if(hasPlusEvent){
						this._plusEvents[eventType](value);
					}
				}
			},
			doCallbackEvent: function(type, value){
					if(DEBUG && type!="onTime"){
						printWebInfo(this._playerid +" doCallbackEvent  "+type);
					}						
					var eventValue = "";
					if(typeof(value) == "object"){
						for(var t in value) {
							if(typeof(value[t])!= "function"){
								eventValue += t +"="+value[t] + "; ";
							}
						}
					}else if(typeof(value) == "string" || !isNaN(value)){
						eventValue = value;
					}
					switch(type)
					{
						/**初始**/
						case "playerInit":
							this.firePlayerEvents("onReady", eventValue);break;
						case "errorInConfig":
							if(value && value.errorCode){
								this.firePlayerEvents("onError", eventValue);
							}
							break;
						/**播放**/
						case "videoResume":
							this.firePlayerEvents("onPlay", eventValue);break;
						case "videoReplay":
							this.firePlayerEvents("onPlay", eventValue);break;
						case "videoPause":
							this.firePlayerEvents("onPause", eventValue);break;
						case "videoEmpty":
							this.firePlayerEvents("onBuffer", eventValue);break;
						case "videoStop":
							this.firePlayerEvents("onComplete", eventValue);
							this.firePlayerEvents("onPlaylistComplete", eventValue);break;
						case "errorInLoadPlugins":
							this.firePlayerEvents("onError", eventValue);break;
						case "errorInKernel":
							this.firePlayerEvents("onError", eventValue);break;
						case "videoStopping":
							this.firePlayerEvents("videoStopping", eventValue);break;
						//case "undefined":
							//this.firePlayerEvents("onIdle", eventValue);break;
						case "videoAuthValid":
							//this.firePlayerEvents("undefined", eventValue);break;
						case "adHeadPlayNone":
							//this.firePlayerEvents("undefined", eventValue);break;
						case "videoStartReady":
							//this.firePlayerEvents("undefined", eventValue);break;
						case "videoStart":
							//this.firePlayerEvents("undefined", eventValue);break;
						case "playerStart":
							//this.firePlayerEvents("undefined", eventValue);break;
						case "showRecommend":
							//this.firePlayerEvents("undefined", eventValue);break;
						case "videoAutoReplay":
							//this.firePlayerEvents("undefined", eventValue);break;
						case "displayInfotip":
							//this.firePlayerEvents("undefined", eventValue);break;
						/**缓冲**/
						case "videoFull":
							this.firePlayerEvents("onBufferChange", eventValue);break;
						/**定位播放**/
						case "onTrackChange":
							this.firePlayerEvents("onSeek", eventValue);break;
						case "onSeek":
							this.firePlayerEvents("onSeek", eventValue);break;
						case "onTime":
							this.firePlayerEvents("onTime", eventValue);break;
						/**音量	**/
						case "onVolumeChange":
							if(value==0){
								this.firePlayerEvents("onMute", eventValue);
							}else{
								this.firePlayerEvents("onVolume", eventValue);
							}
							break;
						/**窗口尺寸**/
						case "onScreen":
							if(value == "fullScreen"){
								this.firePlayerEvents("onFullscreen", eventValue);
							}else{
								this.firePlayerEvents("onFullscreen", eventValue);
							}
							break;
						case "onResize":
							var strs = value.split("=");
							var height = strs[1].split(";");
							var width = strs[2].split(";");
							eventValue = width[0] +"+"+height[0];
							this.firePlayerEvents("onResize", eventValue);
							break;
						/**画质**/
//						case "swapDefinition":
//							this.firePlayerEvents("onQualityLevels", eventValue);
//							break;
						case "swapDefinition":
							this.firePlayerEvents("onQualityChange", eventValue);
							break;
						/**字幕**/
						/**控制台**/
						/**播放列表**/
						/**广告**/
						case "onCommentSend":
							this.firePlayerEvents("onCommentSend", eventValue);
							break;
//						case "onCommentViewAll"://查看全部评论事件，若有用户自定的事件，则不会执行默认的全部评论事件
//							this.firePlayerEvents("onCommentViewAll", eventValue, true);
//							break;
						case "changeBubbleStatu":
							this.firePlayerEvents("onChangeBubbleStatu", eventValue, true);
							break;
						case "videoNotFound":
						case "notSupportedMode":
							this.firePlayerEvents("onStreamError", eventValue, true);
							break;
						case "changeVideoPlayer":
							this.firePlayerEvents("onChangeVideoPlayer", eventValue, true);
							break;
					}
					return {"status":"error"};
			},
			doLogHandler :function(funcName,eventValue){
				var player = __ablePlayerManager.get(this._playerid);
				if(player){
					var logger = player._log2base_handler;
					if(logger && funcName &&logger[funcName])
						logger[funcName](eventValue);
				}
				if(DEBUG)
					printWebInfo(this._playerid +" doLogHandler  "+funcName);
			},
			doCommentHandler :function(funcName,eventValue){
				var player = __ablePlayerManager.get(this._playerid);
				if(player){
					var comment = player.comment;
					if(comment && funcName &&comment[funcName])
						comment[funcName](eventValue);
				}
				if(DEBUG)
					printWebInfo(this._playerid +" doCommentHandler  "+funcName);
			},
			/**初始**/
			onReady: function (eventValue) {//初始化完毕
				this.doLogHandler("readyHandler", eventValue);
		    },
		    onSetupError: function (eventValue) {//
		    	this.doLogHandler("setupErrorHandler", eventValue);
		    },
		    /**播放**/
		    onPlay: function (eventValue) {//
		    	this.doLogHandler("playHandler", eventValue);
		    },
		    onPause: function (eventValue ) {//
		    	this.doLogHandler("pauseHandler", eventValue);
		    },
		    onBuffer: function (eventValue ) {//
		    	this.doLogHandler("bufferHandler", eventValue);
		    },
		    onIdle: function (eventValue ) {//
		    	this.doLogHandler("idleHandler", eventValue);
		    },
		    onComplete: function (eventValue) {//
		    	this.doLogHandler("completeHandler", eventValue);
		    },
		    onError: function (eventValue ) {//
		    	this.doLogHandler("errorHandler", eventValue);
		    },
		    videoStopping: function (eventValue) {//拓展事件: 视频即将结束
		    },
		    /**缓冲**/
		    onBufferChange: function (eventValue) {//
		    	this.doLogHandler("bufferChangeHandler", eventValue);
		    },
		    /**定位播放**/
		    onSeek: function (eventValue) {//
		    	this.doLogHandler("seekHandler", eventValue);
		    },
		    onTime: function (eventValue) {//
		    	this.doCommentHandler("onTimeComments", eventValue);
		    	this.doLogHandler("timeHandler", eventValue);
		    },
		    /**音量	**/
		    onMute: function (eventValue) {//
		    	this.doLogHandler("muteHandler", eventValue);
		    },
		    onVolume: function (eventValue) {//
		    	this.doLogHandler("volumeHandler", eventValue);
		    },
		    /**窗口尺寸**/
		    onFullscreen: function (eventValue) {//
		    	this.doLogHandler("fullscreenHandler", eventValue);
		    },
		    onResize: function (eventValue) {//
		    	this.doLogHandler("resizeHandler", eventValue);
		    },
		    /**画质**/
		    onQualityLevels: function (eventValue) {//
		    	this.doLogHandler("qualityLevelsHandler", eventValue);
		    },
		    onQualityChange : function (eventValue) {//
		    	this.doLogHandler("qualityChangeHandler", eventValue);
		    },
		    /**字幕**/
		    onCaptionsList: function (eventValue) {//
		    },
		    onCaptionsChange: function (eventValue) {//
		    },
		    /**控制台**/
		    onControls: function (eventValue) {//
		    },
		    onDisplayClick: function (eventValue) {//
		    },
		    /**播放列表**/
		    onPlaylist: function (eventValue) {//
		    },
		    onPlaylistItem: function (eventValue) {//
		    },
		    onPlaylistComplete: function (eventValue) {//
		    	this.doLogHandler("playlistCompleteHandler", eventValue);
		    },
		    /**广告**/
		    onAdClick: function () {//
		    },
		    onAdCompanions: function () {//
		    },
		    onAdComplete: function () {//
		    },
		    onAdError: function () {//
		    },
		    onAdImpression: function () {//
		    },
		    onAdTime: function () {//
		    },
		    onAdSkip: function () {//
		    },
		    onBeforePlay: function () {//
		    },
		    onBeforeComplete: function () {//
		    },
		    onCommentSend:function(msgObj){
		    	this.doCommentHandler("sendCommentJson", msgObj);
       		},
       		onStreamError : function(){
       			var player = __ablePlayerManager.get(this._playerid);
       			if(player){
	       			changeDomObject2Div(this._playerid);
	       			initPlayerStyle(this._playerid, player._options);
					showMsg(this._playerid, "您好！当前视频正在转码中，请等待一段时间后尝试重新播放。", false, "loading");
       			}
       		},
       		onChangeBubbleStatu:function(eventValue){
       			this.doCommentHandler("toChangeBubbleStatu", eventValue);
       		},
       		onChangeVideoPlayer:function(eventValue){
       			 ALLWAYS_USE_THIS_PLAY_TYPE = PLAYER_TYPE["letv_player"];
       			 var player = __ablePlayerManager.get(this._playerid);
       			 $("#"+this._playerid).Ableplayer(player._options, this._plusEvents);
       		}
	};
	
	/********/
	function ablePlayerOne(id,options,events){
		this.createPlayer(id,options,events);
		//return this.init(id,options,events);
		return this;
	}
	
	ablePlayerOne.fn = ablePlayerOne.prototype = {
			_this : this,
			_id   : null,
			_dom  : null,
			createPlayer: null,   //will defined in after codes.
			_callbackJsName:null,
			_callbackJs:null,
			comment : null,
			_options: null,	
			_log2base_options:{
	            id: "",//id: $id
	            message: 'bili',
	            buffer: "",//options.buffer,
	            getIpServer: __base_log_url,
	            sendUrl: __base_log_url + '/p/l',
	            bandwidth: 0,
	            rate: 30,
	            checkRate: 3,
//	            checkUrl: "http://image.zhihuishu.com/download/upload/zhsmanage/content/1031/10470384eb9e4793b371adcbc340b36b.png",
	            uid: "",//options.userid,
	            vid: ""//options.id
	        },
			_log2base_handler:null,
			_init : function(options,events) {
				//this._dom = document.getElementById(this._id);
				this._options = options;
				if(typeof options === "object" && options){
					//log2base
					this._log2base_options.id = this._id;
					this._log2base_options.buffer = options.buffer;
					this._log2base_options.uid = options.userid;
					this._log2base_options.vid = options.id;
					this._log2base_handler = new ableplayer_log2base(this,this._log2base_options, document.getElementById(this._id));
				}
				this.comment = new ablePlayerComment(this,events);
				return this;
		    },
		    destroy :function(){
		    	this.remove();
		    	changeDomObject2Div(this._id);
	    		this._dom = null;
	    		this._callbackJsName = null;
	    		this._callbackJs = null;
	    		this._options = null;
		    	if(this._log2base_handler){
		    		this._log2base_handler.stop();
		    		this._log2base_handler = null;
		    	}
		    	if(this.comment){
		    		this.comment.stop();
		    		this.comment = null;
		    	}
		    },
		    show : function(player) {  
		    	alert(this._id);
		    	return this;
		    },// IS
		    state : function( ) { 
				if(this._dom && this._dom["vjs_getProperty"]){
					return this._dom.vjs_getProperty("metadata");
				}
		    },// GOOD
		    update : function( content ) {  
		        //var l = jwplayer(this.attr("id")).getCurrentQuality();
		    	return this;
		    },// !!!
		    resize : function( width, height ) {  
		       // jwplayer(this.attr("id")).resize(width, height);
		    	return this;
		    },// resize
		  //start - 配置
		    setup : function(){
		    	//**
		    },
		    remove : function(){
		    	if(this._dom && this._dom["shutDown"])
		    		this._dom.shutDown();
		    	return this;
		    },
		    getPlaylist : function(){
		    	return "";
		    },
		    getPlaylistIndex : function(){
		    	return 0;
		    },
		    getPlaylistItem : function(){
		    	//**
		    },
		    load : function(playlist){
		    	//**
		    },
		    playlistItem : function(index){
		    	//**
		    },//返回当前视频的索引,如没有返回视频对象
		    getBuffer : function(){
		    	if(this._dom && this._dom["getLoadPercent"])
		    		return this._dom.getLoadPercent();
		    	else
		    		return 0;
		    },//得到当前已经缓冲的视频的比例0~1
		    //播放
		    getState : function(){
		    	if(this._dom && this._dom["vjs_getProperty"]){
			    	var hasEnded =  this._dom.vjs_getProperty("hasEnded");
			    	if(hasEnded){//空闲
			    		return "IDLE";
			    	}
			    	var paused =  this._dom.vjs_getProperty("paused");
			    	if(paused){
			    		return "PAUSED";
			    	}else{
			    		return "PLAYING";
			    	}
		    	}else
		    		return "";
		    },//得到当前视频状态: 空闲、缓冲、播放中、暂停
		    play : function(state){
		    	if(this._dom && this._dom["vjs_play"])
		    		this._dom.vjs_play();
		    },
		    pause : function(state){
		    	if(this._dom && this._dom["vjs_pause"])
		    		this._dom.vjs_pause();
		    },
		    resume : function(state){
		    	if(this._dom && this._dom["vjs_resume"])
		    		this._dom.vjs_resume();
		    },
		    
		    stop : function(){
		    	if(this._dom && this._dom["vjs_stop"])
		    		this._dom.vjs_stop();
		    },
		    replayVideo : function (){
		    	if(this._dom && this._dom["vjs_play"]) //暂时适配
		    		this._dom.vjs_play();
		    },
		    //跳转进度
		    seek : function(number){
		    	if(this._dom && this._dom["vjs_seekBySeconds"])
		    		this._dom.vjs_seekBySeconds(number);
		    },
		    getPosition : function(){
		    	if(this._dom && this._dom["vjs_getVideoTime"])
		    		return this._dom.vjs_getVideoTime();
		    	else
		    		return 0;
		    },
		    getDuration : function(){
	    		var durationTime = 0;
		    	if(this._dom && this._dom["vjs_getProperty"])
		    		durationTime = this._dom.vjs_getProperty("duration");
		    	if(durationTime <= 0 && DB_DURATION_TIME)
		    		durationTime = DB_DURATION_TIME;
		    	return durationTime;
		    },
		    //音量
		    getMute : function(){
		    	if(this._dom && this._dom["vjs_getProperty"])
			    	if(this._dom.vjs_getProperty("muted")){
			    		return true;
			    	}else{
			    		return false;
			    	}
		    	else
		    		return false;
		    },
		    getVolume : function(){
		    	if(this._dom && this._dom["vjs_getProperty"])
		    		return this._dom.vjs_getProperty("volume")*20/100; //0~100
		    	return 0;
		    },
		    setMute : function(state){
		    	if(state){
		    		if(this._dom && this._dom["vjs_setProperty"])
		    			this._dom.vjs_setProperty("muted", "true");
		    	}
		    },
		    setVolume : function(volume){
		    	if(this._dom && this._dom["vjs_setProperty"])
		    		this._dom.vjs_setProperty("volume", volume);
		    },
		    //尺寸
		    getFullscreen : function(){
		    	if(this._dom && this._dom["getVideoSetting"])
			    	return this._dom.getVideoSetting().fullscreen;
		    	else
		    		return false;
		    },
		    setFullscreen : function(fullSate){
		    	if(this._dom && this._dom["setFullscreen"])
		    		this._dom.setFullscreen(fullSate);
		    },
		    getHeight : function(){
//		    	var setting  = this._dom.getVideoSetting();
//		    	return setting.height;
		    	if(this._dom && this._dom["height"])
		    		return this._dom.height;
		    	else
		    		return -1;
		    },
		    getWidth : function(){
//		    	var setting  = this._dom.getVideoSetting();
//		    	return setting.width;
		    	if(this._dom && this._dom["width"])
		    		return this._dom.width;
		    	else
		    		return -1;
		    },
		    resize : function(width, height){
		    	if(this._dom && this._dom["height"] && this._dom["width"]){
		    		this._dom.height = height;
		        	this._dom.width = width;
		    	}
		    },
		    //画质
		    getQualityLevels : function(){
		    	var qualityArray=[];
		    	if(this._dom && this._dom["getDefinitionList"]){
			    	var list = this._dom.getDefinitionList();
			    	for ( var t in list) {
			    		var item = {};
						if(t!="testurl" && typeof t != "function" && list[t] == true){
							item.label = t;
							qualityArray.push(item);
						}
					}
		    	}
		    	return qualityArray;
		    },
		    getCurrentQuality : function(){
		    	if(this._dom && this._dom["getVideoSetting"]){
		    		var setting = this._dom.getVideoSetting();
		    		return setting.defaultDefinition;
		    	}else{
		    		return "";
		    	}
		    },
		    setCurrentQuality : function(index){
		    	if(this._dom && this._dom["setDefinition"]){
			    	var array = this.getQualityLevels();
			    	 if(!isNaN(index) && index < 100){//索引
			    		 if(index < array.length){
			    			 this._dom.setDefinition(array[index].label);
			    		 }
					 }else{//清晰度
						 this._dom.setDefinition(index);
					 }
		    	}
		    },
		    //音轨
		    getAudioTracks : function(){
		    	//****
		    },
		    getCurrentAudioTrack : function(index){
		    	//***
		    },
			setCurrentAudioTrack : function(index){
		    	//****
		    },
		    //字幕
		    getCaptionsList : function(){
		    	//****
		    },
		    getCurrentCaptions : function(){
		    	//****
		    },
		    setCurrentCaptions : function(){
		    	//****
		    },
		    //控制台
		    getControls : function(){
		    	//****
		    },
		    getSafeRegion : function(){
		    	//****
		    },//控制台显示区域如: { x:0, y:30, width:480, height:200 }
		    addButton : function(icon, label, handler, id){
		    	//***
		    },
		    removeButton : function(id){
		    	//***
		    },
		    setControls : function(controls){
		    	//***
		    },
		    //广告
		    playAd : function(tag){
		    	//***
		    },
		    //刷新最新评论气泡
		    showBubbleInfo: function(msgObject){
		    	if(this._dom && this._dom["showBubbleInfo"]){
		    		 this._dom.showBubbleInfo(msgObject);
		    	}
		    },
		    //显示气泡发送后的结果信息
		    showSendBackInfo: function(msgObject){
		    	if(this._dom && this._dom["showSendBackInfo"]){
		    		 this._dom.showSendBackInfo(msgObject);
		    	}
		    }
		};
	
	function changeDomObject2Div(domId){
		var jqDom = $("#"+domId);
		var domObject = jqDom[0];
		if(domObject.tagName=="OBJECT" ){
    		var paNode = jqDom.parent();
    		var oralClass = jqDom.attr("oralClass");
    		var newDiv = $("<div/>", {"id":domId, "class":oralClass});
			domObject.outerHTML="";  
			paNode.append(newDiv);
    		return true;
    	}
		return false;
	}
	/*-------------------------------------------创建播放器 swf-----------------------------------------*/
	ablePlayerOne.fn.createPlayer = function(id,aoptions, events,cb){
		this._id = id;
		var thisPlayer = this;
		var $jquerythis =  $("#"+id);
		var _jquerythis = $jquerythis[0];
		
		var defaultOptions = {
			letvVideoGetUrl: __base_url + "/letvvideo/getVideo?",
            image: "default",
            userid: "default",				//发送气泡时、播放器记录日志时，需要记录userid，默认是default
            username:"",					//发送气泡时，传入用户名真名，用于气泡时显示谁发的，默认是空
            enablecommentshow:false,		//播放器里:是否可以发送气泡，默认是false
            enablecommentsend:false,		//播放器里:是否显示气泡，默认是false
            enablecommentenable:false,     //播放器里:默认是否开启弹幕, 当气泡开关可见(enablecommentsend为true)的时候, 此属性默认为false 根据cookies改变.
            enableChangePlayerButton: false, //是否显示 切换播放器 按扭 
            commentposttype:"602",    //气泡类型：点播 602， 直播 502，默认是602
            defaltplayertype: "",				// 配置初始使用的播放器类型. 1: 乐视播放器, 2: jwplayer播放器
            width: -1,
            height: -1,
            mute: false,
            host: __base_url,
            buffer:5,
            mp3mode: false,					//播放器里:是否是mp3播放模式，默认是false。 mp3mode为true时，播放器界面是精简模式，通过设置一个小的高度值，即可将界面只显示一个播放进度条的效果  
            autostart: false,				//播放器里:是否自动播放，默认是false
            id:"",							//视频id，默认是空，必填
            videosource : ""
	    };
		
		main(aoptions, events,cb);
		
	    function setMsg(msg){
	    	$jquerythis.attr("__msg",escape(msg));
	    }
	  
	    function installedFlash(){
	    	// check flash version
            if(!FlashDetect.installed){
                showMsg(id, "未安装flash，点击<a style='font-weight:bold; font-size:11px; color: #008573' target='_blank' href='http://www.adobe.com/go/getflash'>这里</a>安装",false,"error",true);
                return false;
            }
            else if(FlashDetect.versionAtLeast(10) == false) {
            	showMsg(id, "flash版本太低，点击<a style='font-weight:bold; font-size:11px; color: #008573' target='_blank' href='http://www.adobe.com/go/getflash'>这里</a>更新",false,"error",true);
                return false;
            }
            return true;
	    }
	   
	    function main(aoptions, events,cb){
	        var options = $.extend(defaultOptions, aoptions);
	        var tempCommonEnable = $.cookie("enablecommentenable"); // 查看气泡是否开启的 cookies
			var tempCommonEnable_userId = $.cookie("enablecommentenable_userId");
			if(tempCommonEnable!="" && tempCommonEnable_userId == options.userid){
				options["enablecommentenable"] = (tempCommonEnable==true);
			}
	        initPlayerStyle(id, options);
	        if(!installedFlash())
	    		return;
	        if(options.id){
	        	$jquerythis.attr("_videoid",options.id);
	        	if(reload_timer != -1)
	    			clearInterval(reload_timer);
	        	return load(options, events);
	        }else{
	        	showMsg(id, "缺少视频id!",true,"error");
	        }
		}
		
		function reload(options, events,cb,reloadTime){
			var DEFAULT_RELOAD_TIME = 20*1000; //20秒
			reload_timer = setInterval(function(){
				if(DEBUG){
					msgln("尝试重新获取视频信息");
				}
				clearInterval(reload_timer);
				$jquerythis.Ableplayer(options, events);
			},20000);
		}
		function load(options, events,cb,reloadTime){
			if(reloadTime === undefined){
				$jquerythis.attr("_videoid",options.id);
				$jquerythis = showMsg(id, "玩命加载中…", false,"loading");
				_jquerythis = $jquerythis[0];
			}
			var url = "cdn/media/ableplayerV2";
            var host = options.host;
            if(host.substring(host.length-1)!="/") {
                host = host + "/";
            }
            url = host + url;
            
            $.getJSON(url + "?d=a&jsoncallback=?", options, function(result, status) {
//            	$.each(result.sources, function(index, item){
//	            	options.videosource = result.sources[0]["file"];
            		if(result.sources[1].status == "10"){
		            	options.videosource = result.sources[1]["file"];
		            	if(result.sources[1]["db_duration"] != 0){
			            	DB_DURATION_TIME = result.sources[1]["db_duration"];
		            	}
            		}
            		//智慧树一节课 正常
//	            	options.videosource = "http://112.90.72.67/video.zhihuishu.com/Video/upload/createcourse/video/158892812/e0eb2cb0-4398-4840-b072-bbf8d7b33479.mp4";
            		//阿狸转的 阿狸上的
//	            	options.videosource = "http://testvideo.zhihuishu.com/CreateCourse/video/1009/05963d91-0d8d-45cf-9971-bf6b3d0c5a86_500.mp4";
//	            	options.videosource = "http://testvideo.zhihuishu.com/question_upload/video/16bd9348-cbf0-4e88-a287-efb66933bc40_500.mp4";
            		//自己的 阿狸转的
//	            	options.videosource = "http://testvideo.zhihuishu.com/CreateCourse/video/1009/05963d91-0d8d-45cf-9971-bf6b3d0c5a86.mp4";
//	            	options.videosource = "http://112.90.72.66/video.zhihuishu.com/Video/upload/afteross/2a46fcd8-dda9-4f34-be3f-3097283e682e.mp4";
//            	});
            	if(options.videosource != ""){ //有木有获取到正确的 视频URL
	            	loadComplete(options, events);
            	}else{
            		showMsg(id, "您好！当前视频正在转码中，请等待一段时间后尝试重新播放。", false, "loading");
            		reload(options, events,cb,reloadTime);
            	}
            }); // End getJSON
	            
		}
		
		function loadComplete(options, events){
	        var $id = thisPlayer._id;//$jquerythis.attr("id");
	        
	        var callbackJsName = "callbackJs_ableplayer_1_"+$id;
	        thisPlayer._callbackJsName = callbackJsName;
	        window[callbackJsName] = thisPlayer._callbackJs = function(type,value){
	        	if(!thisPlayer.callbackJsHandler){
	        		thisPlayer.callbackJsHandler = new callbackJs(thisPlayer._id,events);
	        	}
	        	thisPlayer.callbackJsHandler.doCallbackEvent(type, value);
	        };
	        var xiSwfUrlStr = _swf_url + "playerProductInstall.swf";
	        var swfVersionStr = "11.1.0";
	        var flashvars = {
//	            "uu":options.vuu,
//	            "vu":options.vuid,
	        	"videosource": options.videosource,
	            "mp3mode":options.mp3mode? 1:0,
	            "autoplay":options.autostart? 1:0,
	            "enablecommentshow" : options.enablecommentshow? 1:0,
	            "enablecommentsend": options.enablecommentsend? 1:0,
	            "enablecommentenable": options.enablecommentenable? 1:0,
	            "enablecommentviewall" : (options.enablecommentshow && options.enablecommentviewall)? 1:0,
	            enableChangePlayerButton: (options.enableChangePlayerButton && options.enableChangePlayerButton)? 1:0,
	            "base_url":__base_url,
	            "source_url": __base_url + _LETV_path +"source/",
	            "video_init_pic":options.image!="default"?options.image:options.video_img,
	            "streamid":"hz_zhihuishu_800","ark":92,
	            "callbackJs":callbackJsName
	        };

	        var params = {};
	        params.quality = "high";
	        params.bgcolor = "#000000";
	        params.allowscriptaccess = "always";
	        params.allowFullScreen = "true";
	        params.allowFullScreenInteractive = "true";
	        params.wmode = "opaque";
	        var attributes = {};
	        attributes.id = $id;
	        attributes.name = $id;
	        attributes.align = "middle";
	        attributes.oralClass = $jquerythis.attr("class");
	        attributes._videoid = options.id;
	        var swfWidth = options.width == -1 ? "100%" : options.width;
	        var swfHeight = options.height == -1 ? "100%" : options.height;
	        swfobject.embedSWF(
	    		_swf_url + "AblePlayerVideoJs.swf", $id, //
	    		swfWidth, swfHeight, 
	            swfVersionStr, xiSwfUrlStr, 
	            flashvars, params, attributes, function(){
	    			thisPlayer._dom = document.getElementById($id);
//	    			var player = __ablePlayerManager.get(this._playerid);
//					if(player){
//						
//					}
	        	});
	        
	       	return thisPlayer._init(options,events);
	    }
	};
	
	/*初始播放器背景*/
	function initPlayerStyle(id, options){
		var $jquerythis = $("#" + id);
    	$jquerythis.css("width",options.width);
        $jquerythis.css("height",options.height);
    	$jquerythis.css("background-color","black");
        $jquerythis.css("color","white");
    }
	/* 显示提示信息*/
	function showMsg(id, message,withMsg,level,noTitle){
		var $jquerythis = $("#" + id);
		var videoId = $jquerythis.attr("_videoid");
    	var title = noTitle ? "" : message;
    	var imgsrc;
    	var img = "";
    	var msgtext="";
    	if(level == 'error'){
    		imgsrc = __base_url + _LETV_path + "/image/error.png";
    		msgtext = message;
    	}else if(level == 'warn' || level == 'loading' || level == 'info'){
    		imgsrc = __base_url + _LETV_path + "/image/loading1.gif";
    		msgtext = message;
    	}else{
    		msgtext = message;
    		if(withMsg){
    			msgtext = ($jquerythis.attr("__msg")?unescape($jquerythis.attr("__msg")):"") +"		"+msgtext;
	    	}
    	}
    	title = videoId ? videoId : "";//($jquerythis.attr("__msg")?unescape($jquerythis.attr("__msg")):"") +"		"+title;
    	var boxHeight = $jquerythis.height();
    	var boxWidth = $jquerythis.width();
    	var pt = boxHeight - 32;
		var w1 = 64;
		var maxW = 300;
		var minW = 100;
     	var  fs = 16;
    	pt = pt > 0 ? (pt -w1 )/2 : 0;
        if(imgsrc)
    		img = "<img style='width:"+w1+"px; height:"+w1+"px;' src='"+imgsrc+"'/>";
    	var msgHtml= "<div style='clear:both;color:white;text-align:center;padding-top:"+pt+"px;' title='"+title+"'>"+img+"<div style='margin: 0 auto;text-indent: 1px;font-size: "+fs+"px; color:white;text-align:center;max-width:"+maxW+"px;min-width:"+minW+"px;'>"+msgtext+"</div></div>";
    	$jquerythis.html(msgHtml);
    	return $jquerythis;
    }
	
	/*********/
	var AbleplayerVideoJS = function(id, methodOrOptions, events ) {
		if(typeof id === 'string'){
			var player;
			if(typeof methodOrOptions === 'object' || ! methodOrOptions ){
				if(__ablePlayerManager.has(id)){
					player = __ablePlayerManager.get(id);
					//不重新创建播放器
				}else{
					player = new ablePlayerOne(id,methodOrOptions, events);
					__ablePlayerManager.add(id, player);
					if(typeof _playInitManager != "undefined"){
						_playInitManager.add(id, PLAYER_TYPE["letv_player"], player);
					}
				}
				return player;
			}else if(typeof methodOrOptions === 'string'){
				player = __ablePlayerManager.get(playerid);
				if(player && player[methodOrOptions])
					player[methodOrOptions](Array.prototype.slice.call(arguments, 2 ));
			}
		}
	};
	
	/** 字符串去除script标签 **/
	function stripscript(s) {
		return !s ? '': s.replace(/<script.*?>.*?<\/script>/ig, '') ;   
	}
	
	/*-------------------------------------------播放器  弹幕功能-----------------------------------------*/
	var ablePlayerComment = function(player, events,cb){
		var _this = this;
		this.player = player;
		this._plusEvents = events; 
		this.sendCommentUrl = _barrageUrl +'/saveVideoComment';
		this.loadCommentsUrl = _barrageUrl +'/getVideoComments';
		this.loadAllCommentsUrl = _barrageUrl +'/getVideoAllComments';
		this.commentPageIndex = 1;
		this.commentAllLoadComplete = false;
		this.commentAllLoading = false;
		this.PAGE_SIZE_OF_5MIN = 300;
		this.LIMIT_SIZE_OF_1SEC = 20;
		this.alowBubbleEnable = true;
		var tempCommonEnable = $.cookie("enablecommentenable");
		if(tempCommonEnable==false){
			alowBubbleEnable = false;
		}
		
	    this.commentList = [];
	    this.commentTimeType = 1; //1,2,3... 1===0-300, 2===301-600, 3===601-900秒 以此类推
		//评论 key  value
	    function ArrayMap() {
			this.keys = new Array();
			this.data = new Array();
			 //添加键值对
			this.add = function (key, value) {
				if (this.data[key] == null) {//如键不存在则身【键】数组添加键名
					this.keys.push(value);
					this.data[key] = new Array();
//					msgln("addkey  "+key);
				}
				if(this.data[key].length < _this.LIMIT_SIZE_OF_1SEC){
					this.data[key].push(value);//给键赋值
				}else if(this.data[key].length >= _this.LIMIT_SIZE_OF_1SEC){
					this.data[key].shift();
					this.data[key].push(value);//超过限制条数就先移除最前的一条然后 往后添加..
				}
				if(DEBUG)
				printWebInfo(key+ "秒的弹幕长度: " +this.data[key].length +"   当前内容: "+ unescape(value.comment));
			};
			//获取键对应的值
			this.getValue = function (key) {
				return this.data[key];
			};
			 //去除键值，(去除键数据中的键名及对应的值)
			this.remove = function (key) {
				this.keys[key] = null;
				this.data[key] = null;
			};
			 //清空
			this.removeAll = function () {
				this.keys = null;
				this.data = null;
				this.keys = new Array();
				this.data = new Array();
			};
			 //判断键值元素是否为空
			this.isEmpty = function () {
				return this.keys.length == 0;
			};
			 //获取键值元素大小
			this.size = function () {
				return this.keys.length;
			};
		 }
		this.commentMap = new ArrayMap();
	    this.messgeid = 0;
	    this.currentid = 0;
	    
	    
        function sendComment(msgObj,cb){
	    	var msg = undefined;
	    	if(typeof msgObj === 'string'){
	    		msg =  msgObj ? escape(msgObj) : "";
	    	}else if(typeof msgObj === 'object'){
	    		msg =  msgObj ? msgObj["comment"] : "";//escape(msgObj["comment"]) : "";
	    	}
	    	msg = stripscript(unescape(msg));
	    	msg = escape(msg);
	    	if(msg){
	    		_this.messgeid++;
				//{id:1,userId:1,userName:'wang',duration:3,comment:'hello'}
	    		var userid = _this.player._options.userid;
	    		userid = "default" == userid ? "" : userid;
	    		var username = _this.player._options.username;
//	    		_this.commentList.push({"id":_this.messgeid,"userId":userid, "currentSend":"1",
//	    			"myself": userid == _this.player._options.userid ? "1":"0" ,"userName":username,"comment":msg});
//	    		_this.refresh();
	    		var duration = parseInt( _this.player.getPosition());
	    		
	    		var mySendMsgObject = {"id":_this.messgeid,"userId":userid, "currentSend":"1",
	    				"myself": userid == _this.player._options.userid ? "1":"0" ,"userName":username,"comment":msg}
				_this.player.showBubbleInfo(mySendMsgObject);
				setTimeout(function(){
					mySendMsgObject["currentSend"] = "0";
	    			_this.commentMap.add(duration, mySendMsgObject);
				}, 2000);
	    		if(DEBUG)
	    			printWebInfo(msg);
				if(cb){
					cb(msg);
				}
				var usernameEs = escape(username);
				var commentData = {"userId":userid,"userName": usernameEs, "postId":_this.player._options.id,"comment":msg,"duration":duration,"postType":_this.player._options.commentposttype,"jsonp":"?"};
				$.ajax( {
					dataType : "jsonp",  
		    		jsonp: "jsonp", 
		            async: true,
		            cache: false,
	                url: _this.sendCommentUrl,
	                type: 'GET',
	                data: commentData,
	                success:function(data){
	                	if(DEBUG)
	    	    			printWebInfo(data);
	                	if(data){
	                		if(data.code != "1"){//数据返回成功
	                			if(DEBUG)
	    	                		printWebInfo(data.msg);
	                			_this.player.showSendBackInfo({"code":"0","msg":data.msg});
	    	            	}else{
	    	            		_this.player.showSendBackInfo({"code":"1","msg":"发送成功!"});	
	    	            	}
	                	}
	                	
	                },
	                error:function(e){
	                	printWebInfo(e);
	                	_this.player.showSendBackInfo({"code":"0","msg":"发送失败!"});
	                }
	            });
	    	}
		}
        this.sendComment = sendComment;
        this.sendCommentJson = function(msgObj,cb){
        	if(_this._plusEvents["onBeforeCommentSend"]){
        		_this._plusEvents["onBeforeCommentSend"](function(data){
	    			if(data){
		    			if(data["code"]=="1"){
		    				msgObj && _this.sendComment(eval('('+msgObj+')'),cb);
		    			}else{
		    				var msg = data["msg"] ? data["msg"] : "您无权发送!";
		    				//alert(msg);
		    				_this.player.showSendBackInfo({"code":"0","msg":msg});
		    			}
		    		}else{
		    			//alert("您无权限发送气泡!");
		    			_this.player.showSendBackInfo({"code":"0","msg":"您无权限发送!"});
		    		}
	    		});
	    	}else{
	    		msgObj && _this.sendComment(eval('('+msgObj+')'),cb);
	    	}
        };
        
	    this.callback = events && events["commentCallBack"] ? events["commentCallBack"] : null ;
	    this.sendBarrageToFlex = function(currentDuration){
	    	var time = parseInt(currentDuration);
	    	if(!isNaN(time)){
    			var msgObjects = _this.commentMap.getValue(time);
//    			msgln("msgObjects::"+msgObjects.length + "  time:"+time);
    			for (var key in msgObjects) {
    				var msgObject = msgObjects[key];
		    		if(msgObject){
		    			if(_this.currentid != msgObject.id && msgObject["comment"]){
		    				var msg = stripscript(unescape(msgObject["comment"]));
		    				msgObject["comment"] = escape(msg);
		    				if(_this.callback)
		    					_this.callback(msgObject.id+" "+msg, msgObject);
		    				_this.currentid = msgObject.id;
		    				_this.player.showBubbleInfo(msgObject);
		    			}
		    		}
    			}
	    	}
	    }
	    this.onTimeComments = function(duration){ //get Comments for 5 mins
	    	var timetype = parseInt(duration/_this.PAGE_SIZE_OF_5MIN) + 1;
	    	if(_this.alowBubbleEnable){
		    	if(timetype != _this.commentTimeType){
		    		_this.commentTimeType = timetype;
		    		_this.commentMap.removeAll();
		    		_this.loadComments(timetype);
		    	}else{
		    		_this.sendBarrageToFlex(duration);
		    	}
	    	}
	    }
	    this.toChangeBubbleStatu = function (statuValue){
	  		if(statuValue == "open"){
				statuValue = "1";
				_this.alowBubbleEnable = true;
			}else{
				statuValue = "0";
				_this.alowBubbleEnable = false;
			}
			$.cookie("enablecommentenable", statuValue, {expires: 30, path: '/'});	
			$.cookie("enablecommentenable_userId", _this.player._options.userid, {expires: 30, path: '/'});	
	    }
	    this.loadComments = function(timeType){
	    	if(_this.player["_options"] && _this.player._options["enablecommentshow"]){
	    		var queryData = {"postId":_this.player._options.id,"timeType":timeType,"pageSize": _this.PAGE_SIZE_OF_5MIN,  "postType":_this.player._options.commentposttype,"jsonp":"?"};
				$.ajax( {
					 url: _this.loadCommentsUrl,
		            dataType : "jsonp",  
		    		jsonp: "jsonp", 
		            async: true,
		            cache: false,
	                type: 'GET',
	                data: queryData,
	                success:function(data){
	                	if(data){
	                		if(data.code != "1"){//数据返回成功
	                			if(DEBUG)
	    	                		printWebInfo(data.message);
	    	            	}else{
	    	            		var commentDatas = data.data;
	    	            		if(commentDatas){
    	            				if(commentDatas["comment"]){
    	            					var comments = commentDatas["comment"];
    	            					if(comments && comments.length>0){
    	            						printWebInfo("加载到评论总数:"+ comments.length + " timeType:"+timeType)
    	            						for(var i = 0; i < comments.length; i++){
    	            							var commentD1i = comments[i];
    	            							if(commentD1i){
    	            								_this.messgeid++;
			    	            					var userid = commentD1i.uSERID;
					    	        	    		var username = commentD1i.uSERNAME;
					    	        	    		var comment = escape(stripscript(commentD1i.cOMMENT));
					    	        	    		var duration = commentD1i.vIDEOSIZE;
					    	        	    		if(comment){
			    	        	    					_this.commentMap.add(duration, {"id":_this.messgeid,"userId":userid, "currentSend":"0",
					    	        	    				"myself": userid == _this.player._options.userid ? "1":"0" ,"userName":username,"comment":comment});
					    	        	    		}
    	            							}
    	            						}
    	            					}
    	            				}
	    	            		}
	    	            	}
	                	}
	                },
	                error:function(err){
	                	if(DEBUG)
	                		printWebInfo("评论数据加载出错:"+err);
	                }
	            });
	    	}
	    };
	    _this.loadComments(_this.commentTimeType);// 1 === 0-300秒的评论的意思
	    this.stop = function(){
	    	_this.alowBubbleEnable = false;
	    };
//	    this.start();
	};
	
	/*********/
	//重构不同版本的播放器  自动、1LETVPLAYER 2JWPLAYER
	var ___changePlayerType = function(type,cb){
		if($.PlayerType == type)
			return;
		$.PlayerType = type;
		var scriptUrl = __base_url + "/letvvideo/getAblePlayer?type=file&player=" + type;
		IS_CHANGING_PLAYER = true; //正在转换播放器中.
		AbleplayerVideoJS.changePlayerType = undefined;
		window.jwplayer = window.AbleplayerVideoJS = undefined;
		__ablePlayerManager.removeAll();
		$.getScript(scriptUrl,function(){
			IS_CHANGING_PLAYER = false;
			if(cb){
				cb();
			}
		});
	};
	if($.AbleplayerVJS == undefined)
		$.AbleplayerVJS = {changePlayerType:___changePlayerType};
	else
		$.extend($.AbleplayerVJS,{changePlayerType:___changePlayerType});
	AbleplayerVideoJS.changePlayerType = ___changePlayerType;

	/*********/
	// Expose AbleplayerVJS to the jQuery object
	$.fn.AbleplayerVJS = function(methodOrOptions, events){
		var $id = $(this).attr("id");
        if(typeof methodOrOptions === "object"){
        	__ablePlayerManager.remove($id);//移除已有元素
        }
		return AbleplayerVideoJS($id,methodOrOptions,events);//Array.prototype.slice.call(arguments, 1 ));
	};
	
	// Expose AbleplayerVideoJS to the global object
	window.AbleplayerVideoJS = $.AbleplayerVJS = AbleplayerVideoJS;
	 if(typeof IS_VJS_SCRIPT_READY != "undefined"){IS_VJS_SCRIPT_READY = true;}
})( window );
