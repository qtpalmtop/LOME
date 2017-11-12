/*
 * Able player 2.0 入口 js库
 * Author: WANGSIHONG, WEISHOUBO
 * Date: 2014-12-03
 */
(function( window, undefined ){
	var $ = window.$,
		jQuery = window.jQuery;
		window.__base_url = "http://base1.zhihuishu.com/able-commons/";
		window._LETV_path = "resources/cdn/ableplayer/2.0/";
		window._VideoJS_path = "resources/cdn/ableplayer/3.0/";
		window._barrageUrl = "http://barrage.base1.zhihuishu.com/able-barrage/reg/";
		window.__base_log_url = "http://other.base1.zhihuishu.com/able-videolog"; //视频日志服务器----------新上线
		window._school_ips_url = "http://www.zhihuishu.com/upload/ipserver/serverVideos.json"
		
//		window.__base_url = "http://127.0.0.1:8080/able-commons/";
		
//		window._barrageUrl = "http://127.0.0.1:8080/able-barrage/reg/";
//		window.__base_log_url = "http://192.168.40.113:8080/able-videolog/"; //视频日志服务器
//		window._school_ips_url = "http://127.0.0.1:8080/able-commons/resources/cdn/ableplayer/2.0/serverVideos.json.json";
		
	window.printWebInfo = function(info){if(window["console"]){window.console.log(info);}}
	window.PLAYER_TYPE = { "ablePlayer":1,  "videoJS": 2, "letv_player": 3 };
	window.IS_CURRENT_PLAYER_READY = true;
	window.IS_LETV_SCRIPT_READY = false; //检测乐视 js 库有没有加载完成
	window.IS_VJS_SCRIPT_READY = false; //检测 自主播放器 VideoJS 库有没有加载完成
	window.ALLWAYS_USE_THIS_PLAY_TYPE = ""; //PLAYER_TYPE[X] <==> [1,2,3]
	window.CURRENT_PLAYER_TYPE = ""; // 当前使用的播放器类型. [1,2,3]
	window.reload_timer = -1; //attemp to reload ;
	window.DEBUG = false;
	
	function playInitManager(){
		this.players = {}; this.ptypes = [];
		this.has = function(playerid){
			return this.players && this.players[playerid];
		};
		this.get = function(playerid){
			return this.has(playerid) ? this.players[playerid] : null;
		};
		this.add = function(playerid, ptype, player){
			var oldPlayer = this.get(playerid);
			if(oldPlayer){
				oldPlayer = undefined;
			}
			this.players[playerid] = player;
			this.ptypes[playerid] = ptype;
		};
		this.remove = function(playerid){
			var player = this.get(playerid);
			if(player){
				if(player.destroy){
					player.destroy();
				}else{
					try { player.stop(); //changeJWDomObject2Div(player.id);
					} catch (e) {
					}
				}
				player = undefined;
				this.players[playerid]=undefined;
				this.ptypes[playerid]=undefined;
			}
		};
		this.removeAll = function(){
			if(this.players)
				for(var playerid in this.players){
					this.remove(playerid);
					this.ptypes[playerid]=undefined;
				}
		};
	}
	window._playInitManager = new playInitManager();
	
	function changeDomObject2Div(domId){
		var jqDom = $("#"+domId);
		var domObject = jqDom[0];
		if(domObject.tagName=="OBJECT" ){
    		var paNode = jqDom.parent();
    		var oralClass = jqDom.attr("oralClass");
    		var newDiv = $("<div/>", {"id":domId, "class":oralClass});
			domObject.outerHTML="";  
			paNode.append(newDiv);
    		return newDiv;
    	}
		return domObject;
	}
	/** 判断IP是否在指定的IP段中*/
	function checkIsInSchoolIps(ip){
		var status = false;
        if (window.$schooliplist && window.$schooliplist != ""){
        	$.each(window.$schooliplist, function(i, ipjson){
        		var ipSection = ipjson["schoolIps"];
		        var REGX_IP=/^(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))(\.(([01]?[\d]{1,2})|(2[0-4][\d])|(25[0-5]))){3}$/;
		        if (!REGX_IP.test(ip))
		            return;
		        var idx = ipSection.indexOf('-');
		        var sips = ipSection.substring(0, idx).split(".");
		        var sipe = ipSection.substring(idx + 1).split(".");
		        var sipt = ip.split(".");
		        var ips = 0, ipe = 0, ipt = 0;
		        for (var i = 0; i < 4; ++i) {
		            ips = ips << 8 | sips[i];
		            ipe = ipe << 8 | sipe[i];
		            ipt = ipt << 8 | sipt[i];
		        }
		        if (ips > ipe) {
		            var  t = ips;
		            ips = ipe;
		            ipe = t;
		        }
		        if(ips <= ipt && ipt <= ipe){
		        	status = true;
					return;
	        	}
        	});
        }
        if( DEBUG && status )
			printWebInfo("校内加速开启, 使用videoJS播放器");
        return status;
	}
	/*-------------------------------------------创建播放器 swf-----------------------------------------*/
	function ablePlayerOne(id,options,events){
		this.createPlayer(id,options,events);
		return this;
	}
	ablePlayerOne.fn = ablePlayerOne.prototype = {
		_this : this,
		_id   : null,
		_dom  : null,
		_options: null,	
		_events:{},
		_load:null
	};
	ablePlayerOne.fn.createPlayer = function(divId,aoptions, events,cb){
		IS_CURRENT_PLAYER_READY = false;
		this._id = divId;
		var thisPlayer = this;
		var $jquerythis =  $("#"+ divId);
		var _jquerythis = $jquerythis[0];
		
		var defaultOptions = {
			letvVideoGetUrl: __base_url + "/letvvideo/getVideo?",
            image: "default",
            userid: "default",				//发送气泡时、播放器记录日志时，需要记录userid，默认是default
            username:"",					//发送气泡时，传入用户名真名，用于气泡时显示谁发的，默认是空
            enablecommentshow:false,		//播放器里:是否可以发送气泡，默认是false
            enablecommentsend:false,		//播放器里:是否显示气泡，默认是false
            enableChangePlayerButton: false, //是否显示 切换播放器 按扭 
            commentposttype:"602",    //气泡类型：点播 602， 直播 502，默认是502
            defaltplayertype: "",				// 配置初始使用的播放器类型. 1: 乐视播放器, 2: videoJS播放器
            width: -1,
            height: -1,
            mute: false,
            host: __base_url,
            mp3mode: false,					//播放器里:是否是mp3播放模式，默认是false。 mp3mode为true时，播放器界面是精简模式，通过设置一个小的高度值，即可将界面只显示一个播放进度条的效果  
            autostart: false,				//播放器里:是否自动播放，默认是false
            vuu:"2b686d84e3",//LETV Start
            id:"",							//视频id，默认是空，必填
            vuid:""
	    };
		main(aoptions, events,cb);
		
	    function initPlayerStyle(options){
	    	$jquerythis.css("width",options.width);
	        $jquerythis.css("height",options.height);
	    	$jquerythis.css("background-color","black");
	        $jquerythis.css("color","white");
	    }
	    
	    function main(aoptions, events,cb){
	        var options = $.extend(defaultOptions, aoptions);
	        initPlayerStyle(options);
	        if(options.id){
	        	$jquerythis.attr("_videoid",options.id);
        		return loadPlayerByType(divId, options, events);
	        }else{
	        	IS_CURRENT_PLAYER_READY = true;
	        }
		}
  	};
  	/****根据类型 加载乐视播放器*****/
  	function loadPlayerByType(divId, options, events){
		if(options.defaltplayertype == PLAYER_TYPE["videoJS"] || ALLWAYS_USE_THIS_PLAY_TYPE == PLAYER_TYPE["videoJS"]){//配置固定使用videoJS 便加载videoJS播放器
				changeVideoJS(divId, options, events);
		}else if(options.defaltplayertype == PLAYER_TYPE["letv_player"] || ALLWAYS_USE_THIS_PLAY_TYPE == PLAYER_TYPE["letv_player"]){//配置固定使用乐视 便加载乐视播放器
				changeLetvPlayer(divId, options, events);
		}else{ //if(options.defaltplayertype == "" ||  options.defaltplayertype == null||  options.defaltplayertype == "1"){
			//如果没有配置 或使用默认配置 默认加载乐视播放器 如果失败或转码中就加载videoJS播放器
			$.ajax({
	            type: "get",
	            data: {},
	            url: options.letvVideoGetUrl+"id="+options.id+"&jsonp=?",
	            dataType : "jsonp",  
	    		jsonp: "jsonp", 
	            async: true,
	            cache: false,
	            success: function (data) {
	            	var needUsevideoJS = true; //只有当 乐视 status == 10的时候为false
	            	if(checkIsInSchoolIps(data["clientIp"])){ //首先数据返回后判断是否在校内ip列表中.
	            		needUsevideoJS = true;
	            	}else{
		            	if(data.code == "1"){//数据返回成功
		            		if(data["reload"]!="1"){
			            		var letvData = data["data"];
		            			if(letvData && letvData["code"] == "0"){//乐视接口返回状态代码，为0表示数据加载成功
		            				var videoData = letvData.data;
		            				var videoStatus = videoData.status;
		            				if("10"==videoStatus){//视频状态：10表示可以正常播放；20表示处理失败；30表示正在处理过程中
		                				needUsevideoJS = false;
		            				}
		            			}
		            		}
		            	}
	            	}
	            	if(needUsevideoJS){
						changeVideoJS(divId, options, events);
					}else{
						changeLetvPlayer(divId, options, events);
					}
	            },
	            error: function (err) {
	            	var msg = "Um， 音/视频加载失败鸟…";
	            },
	            complete:function(XMLHttpRequest, textStatus){
	            	if(DEBUG)
	            		printWebInfo("complete::readyState="+XMLHttpRequest.readyState+"  status="+XMLHttpRequest.status+" textStatus="+textStatus);
	            }
			});
		}
	}
  	/****加载乐视播放器*****/
  	function  changeLetvPlayer(divId, options, events){
  		if(IS_LETV_SCRIPT_READY){
  			CURRENT_PLAYER_TYPE = PLAYER_TYPE["letv_player"];
  			$("#"+ divId).AbleLETVplayer(options, events);
		}else{
			setTimeout(function(){
				changeLetvPlayer(divId, options, events);
			},200);
		}
  	}
  	/****加载videoJS播放器*****/
	function  changeVideoJS(divId, options, events){
		if(IS_VJS_SCRIPT_READY){ //;已加载videoJS js库
			options.image = ""; //因为乐视的默认是default jw会去请求.
			CURRENT_PLAYER_TYPE = PLAYER_TYPE["videoJS"];
			$("#"+ divId).AbleplayerVJS(options, events);
		}else{
			setTimeout(function(){
				changeVideoJS(divId, options, events);
			},200);
		}
	}
	
	/**** 生成播放器 或者 调用方法入口 ****/
	var ablePlayerX = function(id, methodOrOptions, events ) {
		if(typeof id === 'string'){
			var player;
			if(typeof methodOrOptions === 'object' || ! methodOrOptions ){
				if(_playInitManager.has(id)){
					player = _playInitManager.get(id); //不重新创建播放器
				}else{
					new ablePlayerOne(id,methodOrOptions, events);
				}
				return player;
			}else if(typeof methodOrOptions === 'string'){
				player = _playInitManager.get(playerid);
				if(player && player[methodOrOptions])
					player[methodOrOptions](Array.prototype.slice.call(arguments, 2 ));
			}
		}
	};
	
	//同时加载两个播放器js
	function LoadJS( id, fileUrl , callback)  { 
		var scriptTag = document.getElementById( id ); 
		var oHead = document.getElementsByTagName('HEAD').item(0); 
		var oScript= document.createElement("script"); 
		if ( scriptTag ) oHead.removeChild( scriptTag ); 
		oScript.id = id; 
		oScript.type = "text/javascript"; 
		oScript.src=fileUrl ; 
		oHead.appendChild( oScript); 
		oScript.onload=oScript.onreadystatechange = function(){
			if(callback)callback();
		};
	}
	//预加载好了 两个播放器js库
	var scriptUrl = __base_url + "letvvideo/getAblePlayer?type=file&player=";
	LoadJS("letvPlayerjs", __base_url + _LETV_path + "ableplayer-2.0-change.js", $.noop);
	LoadJS("videoJSjs", scriptUrl + PLAYER_TYPE["videoJS"], $.noop );
	//预加载 校内加速ip段
	$.ajax({
		url : _school_ips_url, 
		dataType:"jsonp",
		jsonp: "callback" ,
		jsonpCallback: "videos", 
		async: false,
		success : function (schooliplist) {
	        window.$schooliplist = schooliplist;
		}, error : function(e){
	        window.$schooliplist = "";
		}	
	}) ;
	
	//重构不同版本的播放器  自动、1LETVPLAYER 2videoJS
	var _changePlayerType = function(type,cb){
		ALLWAYS_USE_THIS_PLAY_TYPE = type;// PLAYER_TYPE["videoJS"]
		if(cb){
			cb();
		}
	};
	if($.Ableplayer == undefined)
		$.Ableplayer = {changePlayerType:_changePlayerType};
	else
		$.extend($.Ableplayer,{changePlayerType:_changePlayerType});
	ablePlayerX.changePlayerType = _changePlayerType;
	
	
	/*****入口****/
	// Expose Ableplayer to the jQuery object
	$.fn.Ableplayer = function(methodOrOptions, events){
		var $id = $(this).attr("id");
        if(typeof methodOrOptions == "object"){
        	_playInitManager.remove($id);//移除已有元素
        }
		return ablePlayerX($id,methodOrOptions,events);//Array.prototype.slice.call(arguments, 1 ));
	};
	// Expose ablePlayerX to the global object
	window.ablePlayerX = $.Ableplayer = ablePlayerX;
})( window );

/**!
 * jQuery Cookie Plugin v1.4.1
 */
(function(factory){if(typeof define==="function"&&define.amd){define(["jquery"],factory)}else{if(typeof exports==="object"){factory(require("jquery"))}else{factory(jQuery)}}}(function($){var pluses=/\+/g;function encode(s){return config.raw?s:encodeURIComponent(s)}function decode(s){return config.raw?s:decodeURIComponent(s)}function stringifyCookieValue(value){return encode(config.json?JSON.stringify(value):String(value))}function parseCookieValue(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")}try{s=decodeURIComponent(s.replace(pluses," "));return config.json?JSON.parse(s):s}catch(e){}}function read(s,converter){var value=config.raw?s:parseCookieValue(s);return $.isFunction(converter)?converter(value):value}var config=$.cookie=function(key,value,options){if(value!==undefined&&!$.isFunction(value)){options=$.extend({},config.defaults,options);if(typeof options.expires==="number"){var days=options.expires,t=options.expires=new Date();t.setTime(+t+days*86400000)}return(document.cookie=[encode(key),"=",stringifyCookieValue(value),options.expires?"; expires="+options.expires.toUTCString():"",options.path?"; path="+options.path:"",options.domain?"; domain="+options.domain:"",options.secure?"; secure":""].join(""))}var result=key?undefined:{};var cookies=document.cookie?document.cookie.split("; "):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split("=");var name=decode(parts.shift());var cookie=parts.join("=");if(key&&key===name){result=read(cookie,value);break}if(!key&&(cookie=read(cookie))!==undefined){result[name]=cookie}}return result};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)===undefined){return false}$.cookie(key,"",$.extend({},options,{expires:-1}));return !$.cookie(key)}}));

/**! SWFObject v2.2 <http://code.google.com/p/swfobject/> 
 * is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
 */
var swfobject=function(){var UNDEF="undefined",OBJECT="object",SHOCKWAVE_FLASH="Shockwave Flash",SHOCKWAVE_FLASH_AX="ShockwaveFlash.ShockwaveFlash",FLASH_MIME_TYPE="application/x-shockwave-flash",EXPRESS_INSTALL_ID="SWFObjectExprInst",ON_READY_STATE_CHANGE="onreadystatechange",win=window,doc=document,nav=navigator,plugin=false,domLoadFnArr=[main],regObjArr=[],objIdArr=[],listenersArr=[],storedAltContent,storedAltContentId,storedCallbackFn,storedCallbackObj,isDomLoaded=false,isExpressInstallActive=false,dynamicStylesheet,dynamicStylesheetMedia,autoHideShow=true,ua=function(){var w3cdom=typeof doc.getElementById!=UNDEF&&typeof doc.getElementsByTagName!=UNDEF&&typeof doc.createElement!=UNDEF,u=nav.userAgent.toLowerCase(),p=nav.platform.toLowerCase(),windows=p?/win/.test(p):/win/.test(u),mac=p?/mac/.test(p):/mac/.test(u),webkit=/webkit/.test(u)?parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,ie=!+"\v1",playerVersion=[0,0,0],d=null;if(typeof nav.plugins!=UNDEF&&typeof nav.plugins[SHOCKWAVE_FLASH]==OBJECT){d=nav.plugins[SHOCKWAVE_FLASH].description;if(d&&!(typeof nav.mimeTypes!=UNDEF&&nav.mimeTypes[FLASH_MIME_TYPE]&&!nav.mimeTypes[FLASH_MIME_TYPE].enabledPlugin)){plugin=true;ie=false;d=d.replace(/^.*\s+(\S+\s+\S+$)/,"$1");playerVersion[0]=parseInt(d.replace(/^(.*)\..*$/,"$1"),10);playerVersion[1]=parseInt(d.replace(/^.*\.(.*)\s.*$/,"$1"),10);playerVersion[2]=/[a-zA-Z]/.test(d)?parseInt(d.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0;}}else if(typeof win.ActiveXObject!=UNDEF){try{var a=new ActiveXObject(SHOCKWAVE_FLASH_AX);if(a){d=a.GetVariable("$version");if(d){ie=true;d=d.split(" ")[1].split(",");playerVersion=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10)];}}}catch(e){}}return{w3:w3cdom,pv:playerVersion,wk:webkit,ie:ie,win:windows,mac:mac};}(),onDomLoad=function(){if(!ua.w3){return;}if((typeof doc.readyState!=UNDEF&&doc.readyState=="complete")||(typeof doc.readyState==UNDEF&&(doc.getElementsByTagName("body")[0]||doc.body))){callDomLoadFunctions();}if(!isDomLoaded){if(typeof doc.addEventListener!=UNDEF){doc.addEventListener("DOMContentLoaded",callDomLoadFunctions,false);}if(ua.ie&&ua.win){doc.attachEvent(ON_READY_STATE_CHANGE,function(){if(doc.readyState=="complete"){doc.detachEvent(ON_READY_STATE_CHANGE,arguments.callee);callDomLoadFunctions();}});if(win==top){(function(){if(isDomLoaded){return;}try{doc.documentElement.doScroll("left");}catch(e){setTimeout(arguments.callee,0);return;}callDomLoadFunctions();})();}}if(ua.wk){(function(){if(isDomLoaded){return;}if(!/loaded|complete/.test(doc.readyState)){setTimeout(arguments.callee,0);return;}callDomLoadFunctions();})();}addLoadEvent(callDomLoadFunctions);}}();function callDomLoadFunctions(){if(isDomLoaded){return;}try{var t=doc.getElementsByTagName("body")[0].appendChild(createElement("span"));t.parentNode.removeChild(t);}catch(e){return;}isDomLoaded=true;var dl=domLoadFnArr.length;for(var i=0;i<dl;i++){domLoadFnArr[i]();}}function addDomLoadEvent(fn){if(isDomLoaded){fn();}else{domLoadFnArr[domLoadFnArr.length]=fn;}}function addLoadEvent(fn){if(typeof win.addEventListener!=UNDEF){win.addEventListener("load",fn,false);}else if(typeof doc.addEventListener!=UNDEF){doc.addEventListener("load",fn,false);}else if(typeof win.attachEvent!=UNDEF){addListener(win,"onload",fn);}else if(typeof win.onload=="function"){var fnOld=win.onload;win.onload=function(){fnOld();fn();};}else{win.onload=fn;}}function main(){if(plugin){testPlayerVersion();}else{matchVersions();}}function testPlayerVersion(){var b=doc.getElementsByTagName("body")[0];var o=createElement(OBJECT);o.setAttribute("type",FLASH_MIME_TYPE);var t=b.appendChild(o);if(t){var counter=0;(function(){if(typeof t.GetVariable!=UNDEF){var d=t.GetVariable("$version");if(d){d=d.split(" ")[1].split(",");ua.pv=[parseInt(d[0],10),parseInt(d[1],10),parseInt(d[2],10)];}}else if(counter<10){counter++;setTimeout(arguments.callee,10);return;}b.removeChild(o);t=null;matchVersions();})();}else{matchVersions();}}function matchVersions(){var rl=regObjArr.length;if(rl>0){for(var i=0;i<rl;i++){var id=regObjArr[i].id;var cb=regObjArr[i].callbackFn;var cbObj={success:false,id:id};if(ua.pv[0]>0){var obj=getElementById(id);if(obj){if(hasPlayerVersion(regObjArr[i].swfVersion)&&!(ua.wk&&ua.wk<312)){setVisibility(id,true);if(cb){cbObj.success=true;cbObj.ref=getObjectById(id);cb(cbObj);}}else if(regObjArr[i].expressInstall&&canExpressInstall()){var att={};att.data=regObjArr[i].expressInstall;att.width=obj.getAttribute("width")||"0";att.height=obj.getAttribute("height")||"0";if(obj.getAttribute("class")){att.styleclass=obj.getAttribute("class");}if(obj.getAttribute("align")){att.align=obj.getAttribute("align");}var par={};var p=obj.getElementsByTagName("param");var pl=p.length;for(var j=0;j<pl;j++){if(p[j].getAttribute("name").toLowerCase()!="movie"){par[p[j].getAttribute("name")]=p[j].getAttribute("value");}}showExpressInstall(att,par,id,cb);}else{displayAltContent(obj);if(cb){cb(cbObj);}}}}else{setVisibility(id,true);if(cb){var o=getObjectById(id);if(o&&typeof o.SetVariable!=UNDEF){cbObj.success=true;cbObj.ref=o;}cb(cbObj);}}}}}function getObjectById(objectIdStr){var r=null;var o=getElementById(objectIdStr);if(o&&o.nodeName=="OBJECT"){if(typeof o.SetVariable!=UNDEF){r=o;}else{var n=o.getElementsByTagName(OBJECT)[0];if(n){r=n;}}}return r;}function canExpressInstall(){return!isExpressInstallActive&&hasPlayerVersion("6.0.65")&&(ua.win||ua.mac)&&!(ua.wk&&ua.wk<312);}function showExpressInstall(att,par,replaceElemIdStr,callbackFn){isExpressInstallActive=true;storedCallbackFn=callbackFn||null;storedCallbackObj={success:false,id:replaceElemIdStr};var obj=getElementById(replaceElemIdStr);if(obj){if(obj.nodeName=="OBJECT"){storedAltContent=abstractAltContent(obj);storedAltContentId=null;}else{storedAltContent=obj;storedAltContentId=replaceElemIdStr;}att.id=EXPRESS_INSTALL_ID;if(typeof att.width==UNDEF||(!/%$/.test(att.width)&&parseInt(att.width,10)<310)){att.width="310";}if(typeof att.height==UNDEF||(!/%$/.test(att.height)&&parseInt(att.height,10)<137)){att.height="137";}doc.title=doc.title.slice(0,47)+" - Flash Player Installation";var pt=ua.ie&&ua.win?"ActiveX":"PlugIn",fv="MMredirectURL="+encodeURI(window.location).toString().replace(/&/g,"%26")+"&MMplayerType="+pt+"&MMdoctitle="+doc.title;if(typeof par.flashvars!=UNDEF){par.flashvars+="&"+fv;}else{par.flashvars=fv;}if(ua.ie&&ua.win&&obj.readyState!=4){var newObj=createElement("div");replaceElemIdStr+="SWFObjectNew";newObj.setAttribute("id",replaceElemIdStr);obj.parentNode.insertBefore(newObj,obj);obj.style.display="none";(function(){if(obj.readyState==4){obj.parentNode.removeChild(obj);}else{setTimeout(arguments.callee,10);}})();}createSWF(att,par,replaceElemIdStr);}}function displayAltContent(obj){if(ua.ie&&ua.win&&obj.readyState!=4){var el=createElement("div");obj.parentNode.insertBefore(el,obj);el.parentNode.replaceChild(abstractAltContent(obj),el);obj.style.display="none";(function(){if(obj.readyState==4){obj.parentNode.removeChild(obj);}else{setTimeout(arguments.callee,10);}})();}else{obj.parentNode.replaceChild(abstractAltContent(obj),obj);}}function abstractAltContent(obj){var ac=createElement("div");if(ua.win&&ua.ie){ac.innerHTML=obj.innerHTML;}else{var nestedObj=obj.getElementsByTagName(OBJECT)[0];if(nestedObj){var c=nestedObj.childNodes;if(c){var cl=c.length;for(var i=0;i<cl;i++){if(!(c[i].nodeType==1&&c[i].nodeName=="PARAM")&&!(c[i].nodeType==8)){ac.appendChild(c[i].cloneNode(true));}}}}}return ac;}function createSWF(attObj,parObj,id){var r,el=getElementById(id);if(ua.wk&&ua.wk<312){return r;}if(el){if(typeof attObj.id==UNDEF){attObj.id=id;}if(ua.ie&&ua.win){var att="";for(var i in attObj){if(attObj[i]!=Object.prototype[i]){if(i.toLowerCase()=="data"){parObj.movie=attObj[i];}else if(i.toLowerCase()=="styleclass"){att+=' class="'+attObj[i]+'"';}else if(i.toLowerCase()!="classid"){att+=' '+i+'="'+attObj[i]+'"';}}}var par="";for(var j in parObj){if(parObj[j]!=Object.prototype[j]){par+='<param name="'+j+'" value="'+parObj[j]+'" />';}}el.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+att+'>'+par+'</object>';objIdArr[objIdArr.length]=attObj.id;r=getElementById(attObj.id);}else{var o=createElement(OBJECT);o.setAttribute("type",FLASH_MIME_TYPE);for(var m in attObj){if(attObj[m]!=Object.prototype[m]){if(m.toLowerCase()=="styleclass"){o.setAttribute("class",attObj[m]);}else if(m.toLowerCase()!="classid"){o.setAttribute(m,attObj[m]);}}}for(var n in parObj){if(parObj[n]!=Object.prototype[n]&&n.toLowerCase()!="movie"){createObjParam(o,n,parObj[n]);}}el.parentNode.replaceChild(o,el);r=o;}}return r;}function createObjParam(el,pName,pValue){var p=createElement("param");p.setAttribute("name",pName);p.setAttribute("value",pValue);el.appendChild(p);}function removeSWF(id){var obj=getElementById(id);if(obj&&obj.nodeName=="OBJECT"){if(ua.ie&&ua.win){obj.style.display="none";(function(){if(obj.readyState==4){removeObjectInIE(id);}else{setTimeout(arguments.callee,10);}})();}else{obj.parentNode.removeChild(obj);}}}function removeObjectInIE(id){var obj=getElementById(id);if(obj){for(var i in obj){if(typeof obj[i]=="function"){obj[i]=null;}}obj.parentNode.removeChild(obj);}}function getElementById(id){var el=null;try{el=doc.getElementById(id);}catch(e){}return el;}function createElement(el){return doc.createElement(el);}function addListener(target,eventType,fn){target.attachEvent(eventType,fn);listenersArr[listenersArr.length]=[target,eventType,fn];}function hasPlayerVersion(rv){var pv=ua.pv,v=rv.split(".");v[0]=parseInt(v[0],10);v[1]=parseInt(v[1],10)||0;v[2]=parseInt(v[2],10)||0;return(pv[0]>v[0]||(pv[0]==v[0]&&pv[1]>v[1])||(pv[0]==v[0]&&pv[1]==v[1]&&pv[2]>=v[2]))?true:false;}function createCSS(sel,decl,media,newStyle){if(ua.ie&&ua.mac){return;}var h=doc.getElementsByTagName("head")[0];if(!h){return;}var m=(media&&typeof media=="string")?media:"screen";if(newStyle){dynamicStylesheet=null;dynamicStylesheetMedia=null;}if(!dynamicStylesheet||dynamicStylesheetMedia!=m){var s=createElement("style");s.setAttribute("type","text/css");s.setAttribute("media",m);dynamicStylesheet=h.appendChild(s);if(ua.ie&&ua.win&&typeof doc.styleSheets!=UNDEF&&doc.styleSheets.length>0){dynamicStylesheet=doc.styleSheets[doc.styleSheets.length-1];}dynamicStylesheetMedia=m;}if(ua.ie&&ua.win){if(dynamicStylesheet&&typeof dynamicStylesheet.addRule==OBJECT){dynamicStylesheet.addRule(sel,decl);}}else{if(dynamicStylesheet&&typeof doc.createTextNode!=UNDEF){dynamicStylesheet.appendChild(doc.createTextNode(sel+" {"+decl+"}"));}}}function setVisibility(id,isVisible){if(!autoHideShow){return;}var v=isVisible?"visible":"hidden";if(isDomLoaded&&getElementById(id)){getElementById(id).style.visibility=v;}else{createCSS("#"+id,"visibility:"+v);}}function urlEncodeIfNecessary(s){var regex=/[\\\"<>\.;]/;var hasBadChars=regex.exec(s)!=null;return hasBadChars&&typeof encodeURIComponent!=UNDEF?encodeURIComponent(s):s;}var cleanup=function(){if(ua.ie&&ua.win){window.attachEvent("onunload",function(){var ll=listenersArr.length;for(var i=0;i<ll;i++){listenersArr[i][0].detachEvent(listenersArr[i][1],listenersArr[i][2]);}var il=objIdArr.length;for(var j=0;j<il;j++){removeSWF(objIdArr[j]);}for(var k in ua){ua[k]=null;}ua=null;for(var l in swfobject){swfobject[l]=null;}swfobject=null;});}}();return{registerObject:function(objectIdStr,swfVersionStr,xiSwfUrlStr,callbackFn){if(ua.w3&&objectIdStr&&swfVersionStr){var regObj={};regObj.id=objectIdStr;regObj.swfVersion=swfVersionStr;regObj.expressInstall=xiSwfUrlStr;regObj.callbackFn=callbackFn;regObjArr[regObjArr.length]=regObj;setVisibility(objectIdStr,false);}else if(callbackFn){callbackFn({success:false,id:objectIdStr});}},getObjectById:function(objectIdStr){if(ua.w3){return getObjectById(objectIdStr);}},embedSWF:function(swfUrlStr,replaceElemIdStr,widthStr,heightStr,swfVersionStr,xiSwfUrlStr,flashvarsObj,parObj,attObj,callbackFn){var callbackObj={success:false,id:replaceElemIdStr};if(ua.w3&&!(ua.wk&&ua.wk<312)&&swfUrlStr&&replaceElemIdStr&&widthStr&&heightStr&&swfVersionStr){setVisibility(replaceElemIdStr,false);addDomLoadEvent(function(){widthStr+="";heightStr+="";var att={};if(attObj&&typeof attObj===OBJECT){for(var i in attObj){att[i]=attObj[i];}}att.data=swfUrlStr;att.width=widthStr;att.height=heightStr;var par={};if(parObj&&typeof parObj===OBJECT){for(var j in parObj){par[j]=parObj[j];}}if(flashvarsObj&&typeof flashvarsObj===OBJECT){for(var k in flashvarsObj){if(typeof par.flashvars!=UNDEF){par.flashvars+="&"+k+"="+flashvarsObj[k];}else{par.flashvars=k+"="+flashvarsObj[k];}}}if(hasPlayerVersion(swfVersionStr)){var obj=createSWF(att,par,replaceElemIdStr);if(att.id==replaceElemIdStr){setVisibility(replaceElemIdStr,true);}callbackObj.success=true;callbackObj.ref=obj;}else if(xiSwfUrlStr&&canExpressInstall()){att.data=xiSwfUrlStr;showExpressInstall(att,par,replaceElemIdStr,callbackFn);return;}else{setVisibility(replaceElemIdStr,true);}if(callbackFn){callbackFn(callbackObj);}});}else if(callbackFn){callbackFn(callbackObj);}},switchOffAutoHideShow:function(){autoHideShow=false;},ua:ua,getFlashPlayerVersion:function(){return{major:ua.pv[0],minor:ua.pv[1],release:ua.pv[2]};},hasFlashPlayerVersion:hasPlayerVersion,createSWF:function(attObj,parObj,replaceElemIdStr){if(ua.w3){return createSWF(attObj,parObj,replaceElemIdStr);}else{return undefined;}},showExpressInstall:function(att,par,replaceElemIdStr,callbackFn){if(ua.w3&&canExpressInstall()){showExpressInstall(att,par,replaceElemIdStr,callbackFn);}},removeSWF:function(objElemIdStr){if(ua.w3){removeSWF(objElemIdStr);}},createCSS:function(selStr,declStr,mediaStr,newStyleBoolean){if(ua.w3){createCSS(selStr,declStr,mediaStr,newStyleBoolean);}},addDomLoadEvent:addDomLoadEvent,addLoadEvent:addLoadEvent,getQueryParamValue:function(param){var q=doc.location.search||doc.location.hash;if(q){if(/\?/.test(q)){q=q.split("?")[1];}if(param==null){return urlEncodeIfNecessary(q);}var pairs=q.split("&");for(var i=0;i<pairs.length;i++){if(pairs[i].substring(0,pairs[i].indexOf("="))==param){return urlEncodeIfNecessary(pairs[i].substring((pairs[i].indexOf("=")+1)));}}}return"";},expressInstallCallback:function(){if(isExpressInstallActive){var obj=getElementById(EXPRESS_INSTALL_ID);if(obj&&storedAltContent){obj.parentNode.replaceChild(storedAltContent,obj);if(storedAltContentId){setVisibility(storedAltContentId,true);if(ua.ie&&ua.win){storedAltContent.style.display="block";}}if(storedCallbackFn){storedCallbackFn(storedCallbackObj);}}isExpressInstallActive=false;}}};}();

/**! 判断flash是否安装 版本多少*/
var FlashDetect=new function(){var self=this;self.installed=false;self.raw="";self.major=-1;self.minor=-1;self.revision=-1;self.revisionStr="";var activeXDetectRules=[{"name":"ShockwaveFlash.ShockwaveFlash.7","version":function(obj){return getActiveXVersion(obj);}},{"name":"ShockwaveFlash.ShockwaveFlash.6","version":function(obj){var version="6,0,21";try{obj.AllowScriptAccess="always";version=getActiveXVersion(obj);}catch(err){}
return version;}},{"name":"ShockwaveFlash.ShockwaveFlash","version":function(obj){return getActiveXVersion(obj);}}];var getActiveXVersion=function(activeXObj){var version=-1;try{version=activeXObj.GetVariable("$version");}catch(err){}
return version;};var getActiveXObject=function(name){var obj=-1;try{obj=new ActiveXObject(name);}catch(err){obj={activeXError:true};}
return obj;};var parseActiveXVersion=function(str){var versionArray=str.split(",");return{"raw":str,"major":parseInt(versionArray[0].split(" ")[1],10),"minor":parseInt(versionArray[1],10),"revision":parseInt(versionArray[2],10),"revisionStr":versionArray[2]};};var parseStandardVersion=function(str){var descParts=str.split(/ +/);var majorMinor=descParts[2].split(/\./);var revisionStr=descParts[3];return{"raw":str,"major":parseInt(majorMinor[0],10),"minor":parseInt(majorMinor[1],10),"revisionStr":revisionStr,"revision":parseRevisionStrToInt(revisionStr)};};var parseRevisionStrToInt=function(str){return parseInt(str.replace(/[a-zA-Z]/g,""),10)||self.revision;};self.majorAtLeast=function(version){return self.major>=version;};self.minorAtLeast=function(version){return self.minor>=version;};self.revisionAtLeast=function(version){return self.revision>=version;};self.versionAtLeast=function(major){var properties=[self.major,self.minor,self.revision];var len=Math.min(properties.length,arguments.length);for(i=0;i<len;i++){if(properties[i]>=arguments[i]){if(i+1<len&&properties[i]==arguments[i]){continue;}else{return true;}}else{return false;}}};self.FlashDetect=function(){if(navigator.plugins&&navigator.plugins.length>0){var type='application/x-shockwave-flash';var mimeTypes=navigator.mimeTypes;if(mimeTypes&&mimeTypes[type]&&mimeTypes[type].enabledPlugin&&mimeTypes[type].enabledPlugin.description){var version=mimeTypes[type].enabledPlugin.description;var versionObj=parseStandardVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revisionStr=versionObj.revisionStr;self.revision=versionObj.revision;self.installed=true;}}else if(navigator.appVersion.indexOf("Mac")==-1&&window.execScript){var version=-1;for(var i=0;i<activeXDetectRules.length&&version==-1;i++){var obj=getActiveXObject(activeXDetectRules[i].name);if(!obj.activeXError){self.installed=true;version=activeXDetectRules[i].version(obj);if(version!=-1){var versionObj=parseActiveXVersion(version);self.raw=versionObj.raw;self.major=versionObj.major;self.minor=versionObj.minor;self.revision=versionObj.revision;self.revisionStr=versionObj.revisionStr;}}}}}();};FlashDetect.JS_RELEASE="1.0.4";

/**------------------------------日志记录系统 模块-----------------------*/
$global_div = $("<div></div>").appendTo($(window.document));
var ableplayer_log2base = function (player, config, div) {
	    var DEBUG = "F";
	    var SENDER = "on";
	    var SENDER_LAST_STATE = "";

	    var uuid, fileName;
	    var sendTimes = 0;
	    var checkRate = config.checkRate >= 0 ? 2 : config.checkRate;
	    // sender Interval
	    var sender = new Sender(function () {
	        // reload player
	        if (uuid != $global_div.data(config.id)) {
	            sender.stop();
	        }
	        sendTimes ++;
	        sendData(); // before if statement : send last data.
	        // < start check bandwidth
	        if (SENDER_LAST_STATE == "PAUSED" && player.getState() == "PAUSED") {
	            return;
	        }
	        if (SENDER_LAST_STATE == "IDLE" && player.getState() == "IDLE") {
	            return;
	        }
	        SENDER_LAST_STATE = player.getState();
	        
	        if (sendTimes%checkRate === 0) {
	            //checkBandwidth(config.checkUrl);
	        }
	        // end check bandwidth >
	    }, config.rate * 1000);
	    
	    var mobile = false;
	    if ((navigator.userAgent
	            .match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
	        mobile = true;
	    }

	    var oldIE = false;
		var myNav = navigator.userAgent.toLowerCase();
		if (myNav.indexOf('msie') != -1) {
			var ieVersion = parseInt(myNav.split('msie')[1]);
			if (ieVersion < 9) {
				oldIE = true;
			}
		}
	    
	    var separate = "+";
	    var cut = "|";
	    var $data_storage = $("<div></div>").appendTo($(window.document));//.appendTo($(div));
	    function record(event) {
	        var data = currentTime() +  event;
	        var cache = $data_storage.data("log");
	        
	        if (cache !== undefined) {
	            $data_storage.data("log", cache + cut + data);
	        }
	        else {
	            $data_storage.data("log", data);
	        }
	    }
	    
	/* var client_ip;
	    $.getJSON( config.getIpServer + "/getip?jsoncallback=?",
	        function (data) {
	            client_ip = data.ip;
	        }
	    ) ;
	    */
	    var action = {
	            // Setup
	            "onReady" : "a", "onSetupError" : "b",
	            // Playlist
	            "onPlaylist" : "c",  "onPlaylistItem" : "d",  "onPlaylistComplete" : "e",
	            // Buffer
	            "onBufferChange" : "f",
	            // Playback
	            "onPlay" : "g",  "onPause" : "h", "onBuffer" : "i",  "onIdle" : "j",   "onComplete" : "k",   "onError" : "l",
	            // Seek
	            "onSeek" : "m",  "onTime" : "n",
	            // Volume
	            "onMute" : "o",  "onVolume" : "p",
	            // Resize
	            "onFullscreen" : "q", "onResize" : "r",
	            // Quality
	            "onQualityLevels" : "s", "onQualityChange" : "t",
	            // Controls
	            "onControls" : "u",  "onDisplayClick" : "v",
	            // Check Bandwidth
	            "onCheckBandwidth1" : "Z",  "onCheckBandwidth2" : "Y"
	    } ;
	    
	    // Setup
	    this.readyHandler = function (event) {
	        /** init */
	        uuid = gen_uuid();
	        fileName = uuid + "_" + config.vid + "_" + config.uid;
	        
	        /** check 302 */
	        //var speedBps = config.bandwidth;
	        //var speedKbps = (speedBps / 1024).toFixed(2);
	        //var speedMbps = (speedKbps / 1024).toFixed(2);
	        var firstLine = uuid + "+" + config.uid + "+" + config.vid;
	        
	        if (SENDER == "on") {
//	            jQuery.ajax( {
//	                url: config.sendUrl,
//	                type: 'GET',
//	                dataType : "jsonp",  
//		    		jsonp: "jsonp", 
//	                data: {"d": firstLine, "f": fileName}
//	            } );
//	            printWebInfo("d"+ firstLine+ "f"+ fileName);
	            jQuery.ajax( {
	                url: config.sendUrl,
	                type: 'GET',
	                dataType : "jsonp",  
		    		jsonp: "jsonp", 
	                data: {"d": navigator.userAgent, "f": fileName}
	            } );
	        }
	        // start interval
	        sender.start();
	        // Fired when the player has initialized in either Flash or HTML5 and is ready for playback. Has no attributes.
	        record(action.onReady);
	    };
	    
	    this.start = function (){
	    	// start interval
	        sender.start();
	    };
	    
	    this.stop = function (){
	    	// start interval
	        sender.stop();
	    };

	    this.setupErrorHandler = function (eventValue) {
	        // fallback (Boolean): This is set true when a download fallback is rendered instead of just an error message.
	        // message (String): The error message that describes why the player could not be setup
	        record(action.onSetupError + eventValue);
	    };

	    this.playlistCompleteHandler = function (event) {
	        // if the repeat option is set true, this is never fired.
	        record(action.onPlaylistComplete);
	        
	        /* reset */
	        sender.stop();
	        debug("onComplete[ Sender status: " + sender.status + " ]");
	    };


	    // Buffer
	    this.bufferChangeHandler = function (eventValue) {
	        // bufferPercent (Number): Percentage between 0 and 100 of the current media that is buffered.
	        //record(action.onBufferChange + event.bufferPercent);
	    	if(isNaN(eventValue)){
	    		eventValue = "PLAYING";
	    	}
	    	limit_rate(action.onBufferChange, eventValue);
	    };

	    // Playback
	    this.playHandler = function (eventValue) {
	        // oldstate (String): the state the player moved from. Can be BUFFERING or PAUSED.
	    	if(eventValue && eventValue.toFixed){
	    		eventValue = eventValue.toFixed(2);
	    	}
	        record(action.onPlay + eventValue);
	    };

	    this.pauseHandler = function (eventValue) {
	        // oldstate (String): the state the player moved from. Can be BUFFERING or PLAYING.
	    	if(!isNaN(eventValue) && eventValue.toFixed){
	    		eventValue = eventValue.toFixed(2);
	    	}
	        record(action.onPause + eventValue);
	    };

	    this.bufferHandler = function (eventValue) {
	        // oldstate (String): the state the player moved from. Can be IDLE, PLAYING or PAUSED.
	        record(action.onBuffer + eventValue);
	    };

	    this.idleHandler = function (eventValue) {
	        // oldstate (String): the state the player moved from. Can be BUFFERING, PLAYING or PAUSED.
	        record(action.onIdle + eventValue);
	    };

	    this.completeHandler = function (eventValue) {
	        // no eventValue attributes.
	        record(action.onComplete);
	    };

	    this.errorHandler = function (eventValue) {
	        // message (String): The reason for the error.
	        record(action.onError + eventValue);
	        //var videoURL = player.getPlaylistItem().file;
	        //debug('Completed = ' + videoURL);
	        //debug(player);
	    };

	    // Seek
	    this.seekHandler = function (eventValue) {
	        // position (Number): The position of the player before the player seeks (in seconds).
	        // offset (Number): The user requested position to seek to (in seconds).
	        record(action.onSeek + eventValue);
	    };

	    this.timeHandler = function (eventValue) {
	        // duration (Number): Duration of the current item in seconds.
	        // position (Number): Playback position in seconds.
			//record(action.onTime + eventValue.position);
	    	limit_rate(action.onTime, eventValue);
	    };
	    
	    // Volume
	    this.muteHandler = function (eventValue) {
	        // mute (Boolean): New mute state.
	        record(action.onMute + eventValue=="true"?'t':'f');
	    };

	    this.volumeHandler = function (eventValue) {
	        // volume (Number): New volume percentage.
	    	if(eventValue && eventValue.toFixed){
	    		eventValue = eventValue.toFixed(2);
	    	}
	        record(action.onVolume + eventValue);
	    };

	    // Resize
	    this.fullscreenHandler = function (eventValue) {
	        // fullscreen (Boolean): new fullscreen state.
	        record(action.onFullscreen + eventValue=="true"?'t':'f');
	    };

	    this.resizeHandler = function (eventValue) {
	        // width (Number): The new width of the player.
	        // height (Number): The new height of the player.
	    	record(action.onResize + eventValue);
	        resize(player.getWidth(), player.getHeight());
	    };
	    
	    // Quality
	    this.qualityLevelsHandler = function (eventValue) {
	        // levels (Array): the full array with new quality levels.
	        record(action.onQualityLevels + JSON.stringify(eventValue.levels) + separate + player.getCurrentQuality());
	    };

	    this.qualityChangeHandler = function (eventValue) {
	        // currentQuality (Number): index of the new quality level in the getQualityLevels() array.
	        record(action.onQualityChange + eventValue);
	    };

	    function currentTime() {
	        var d = new Date();
	        //return d.getFullYear() + "-" + d.getMonth() + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + ',' + d.getMilliseconds();
	        var hou = d.getHours();
	        var min = d.getMinutes();
	        var sec = d.getSeconds();
	        var mil = d.getMilliseconds();
	        
	        return formatTime(hou) + '' + formatTime(min) + '' + formatTime(sec) + '' + mil;
	    }

	    function formatTime(t) {
	        if ((t+'').length==1) {
	            return "0" + t;
	        }
	        return t;
	    }
	    
	    function sendData() {
	        var data = $data_storage.data("log");
	        $data_storage.removeData("log");
	        if (data !== undefined && data.length > 0) {
	            request = {
	                url: config.sendUrl,
	                type: 'GET',
	                dataType : "jsonp",  
		    		jsonp: "jsonp", 
	                data: {"d": data, "f": fileName}
	            };
	            if (SENDER == "on") {
	                debug("sender : " + data.length);
	                jQuery.ajax( request );
	            } else {
	                debug("data.length : " + data.length + ", not sent.");
	            }
	        }
	    }
	    
	    function Sender (fn, ms) {
	        this.status = "init";
	        var $this = this;
	        this.start = function () {
	            debug("start Sender....");
	            $this.status = "on";
	            $this.id = window.setInterval(function () {
	                fn.call($this);
	            }, ms);
	        } ;
	        this.stop = function () {
	            if ($this.id) {
	                debug("stop Sender and flush data.");
	                window.clearInterval($this.id);
	                $this.id = 0;
	                $this.status = "off";
	                // flush
	                sendData();
	            }
	        }
	        ;
	        debug("init Sender OK.");
	    }

	    function gen_uuid(){
	        var random = "";
	        var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	        for(var i = 0; i < 7 ; i ++) {
	            var id = Math.ceil(Math.random()*35);
	            random += chars[id];
	        }
	        random += (new Date()).getTime();
	        $global_div.data(config.id, random);
	        
	        return random;
	    }
	    
	    function limit_rate(type, data) {
	        var prev_time = $data_storage.data(type);
	        var curr_time = (new Date()).getTime();

	        if (prev_time !== undefined && isNaN(prev_time) === false) {
	        	if (curr_time - prev_time >= 500) { // >=0.5s
	            	record(type + data);
	            	$data_storage.data(type, curr_time);
	        	}
	        } else {
	        	record(type + data);
	        	$data_storage.data(type, curr_time);
	        }
	    }
	    checkBandwidth = function (url) {
	        // A image host on video server
	        var imageAddr = url + "?n=" + Math.random();
	        var startTime, endTime;
	        var downloadSize = 114521;
	        var download = new Image();
	        download.onload = function () {
	            endTime = (new Date()).getTime();
	            showResults();
	        };
	        startTime = (new Date()).getTime();
	        download.src = imageAddr;
      	  function showResults() {
	            var duration = (endTime - startTime) / 1000;
	            var bitsLoaded = downloadSize * 8;
	            var speedBps = (bitsLoaded / duration).toFixed(2);
	            //var speedKbps = (speedBps / 1024).toFixed(2);
	            //var speedMbps = (speedKbps / 1024).toFixed(2);
	            record(action.onCheckBandwidth1 + speedBps);
	        }
	    };
	    function resize(width, height) {
//	        div.style.position = 'absolute';
//	        div.style.width = '70px';
//	        div.style.height = '50px';
//	        div.style.left = (width / 2 - 35) + 'px';
//	        div.style.top = (height / 2 - 25) + 'px';
	    }
	    function debug(message) {
	        if (DEBUG === "T" && window["console"]) {
	            console.log(message);
	        }
	    }
	    this.resize = function (width, height) {
	        resize(width, height);
	    };
	};

