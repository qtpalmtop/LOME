$(function(){
	$(".tm-search-keywords").focus(function(){
		var _title = $(this).attr("title");
		var _val = $(this).val();
		if(_val==_title){
			$(this).val("");
		}
	}).blur(function(){
		if($(this).val()==""){
			$(this).val($(this).attr("title"));
		}
	});
});

function tm_number_mode(){
	$(".tm-number").attr({"title":"请输入数字...","style":"ime-mode:disabled"});
	//$(".tm-number:enabled:first").focus();
	$("#tm_limitimer").attr("title","请输入数字...");
}
/*获取iframe弹出子窗体的对象*/
function tmChildrenObject(iframeName) {
	return document.getElementById(iframeName).contentWindow;
}; 
/*获取iframe弹出父窗体的对象*/
function tmParentObject() {
	return window.parent;
};

/*刷新当前页*/
function tmRefresh() {
	window.location.href = window.location.href;
};

/*根据URL刷新页面*/
function tmRefreshByUrl(url) {
	window.location.href = url;
};

/*返回上一页*/
function tmHistoryBack(url) {
	window.history.back(-1);
};

/*随机产生ID*/
var random = 0;
/*随机生成随机数*/
function tmRandom() {
	random++;
	return new Date().getTime() + "" + random;
};

/*自定义定时器 args是自定义多少个的.参数写在timer的后面*/
function jxtvSetTimeout(funcName,timer){
	var args=[];
	for(var i=2;i<arguments.length;i++){
		args.push(arguments[i]);
	}
	return window.setTimeout(function(){funcName.apply(this,args);},timer);
};

/*验证是否为图片*/
function tmCheckImage(fileName){
	return /(gif|jpg|jpeg|png|GIF|JPG|PNG)$/g.test(fileName);
};

/*验证是否为视频*/
function tmCheckVideo(fileName){
	return /(mp4|flv|wmv|avi|dat|asf|rm|rmvb|ram|mpg|mpeg|3gp|mov|m4v|dvix|dv|mkv|flv|vob|qt|divx|cpk|fli|flc|mod|wav|mp3)$/ig.test(fileName);
};

/*验证是否为文档*/
function tmCheckDocument(fileName){
	return /(doc|docx|xls|xlsx|pdf|txt|ppt|word|pptx|rar|zip)$/ig.test(fileName);
};



/*验证是否为图片文件*/
function tmCheckFileImage(fileName){
	return /\w+([.jpg|.png|.gif|.swf|.bmp|.jpeg]){1}$/ig.test(fileName); 
};

function tmClearLoading(){
	$("body").exmayLoading("hide");
};

function tmInitLoading(msg){
	$("body").exmayLoading( {msg : msg,show : true,timeout:3000});
	if(arguments!=null && arguments!=undefined && arguments[1]!=undefined && arguments[1]!=null && arguments[1]!="" && arguments.length >0 ){
		arguments[1].call(this);
	}
};

function tmWaitLoading(msg){
	$("body").exmayLoading( {msg : msg,show : true});
};

function tmInitLoadingT(msg,timeout){
	$("body").exmayLoading( {msg : msg,show : true,timeout:timeout});
};




/*文件大小转换为MB GB KB格式*/
function tmCountFileSize(size) {
	var fsize = parseFloat(size, 2);
	var fileSizeString;
	if (fsize < 1024) {
		fileSizeString = fsize.toFixed(2) + "B";
	} else if (fsize < 1048576) {
		fileSizeString = (fsize / 1024).toFixed(2) + "KB";
	} else if (fsize < 1073741824) {
		fileSizeString = (fsize / 1024 / 1024).toFixed(2) + "MB";
	} else if (fsize < 1024 * 1024 * 1024) {
		fileSizeString = (fsize / 1024 / 1024 / 1024).toFixed(2) + "GB";
	} else {
		fileSizeString = "0B";
	}
	return fileSizeString;
};

/*获取文件后缀*/
function getExt(fileName){
	if (fileName.lastIndexOf(".") == -1)return fileName;
	var pos = fileName.lastIndexOf(".") + 1;
	return fileName.substring(pos, fileName.length).toLowerCase();
}

function getFileName(fileName){
	if (fileName.lastIndexOf(".") != -1) {
		return fileName.substring(0, fileName.lastIndexOf("."));
	} else {
		return fileName;
	}
}


function tmToJson(o, flag, replace) {
	var arr_start = "ARRAY_S";
	var arr_end = "ARRAY_E";
	if (flag == null) {
		flag = "\"";
	}
	if (replace == null) {
		replace = true;
	}
	var r = [];
	if (typeof o == "string" || o == null) {
		return o;
	}
	
	if (typeof o == "object") {
		if (!o.sort) {
			r[0] = "{";
			for ( var i in o) {
				r[r.length] = flag;
				r[r.length] = i;
				r[r.length] = flag;
				r[r.length] = ":";
				r[r.length] = flag;
				r[r.length] = tmAarryToJson(o[i], flag, false);
				r[r.length] = flag;
				r[r.length] = ",";
			}
			r[r.length - 1] = "}";
		} else {
			r[0] = arr_start;
			for ( var i = 0; i < o.length; i++) {
				r[r.length] = flag;
				r[r.length] = tmAarryToJson(o[i], flag, false);
				r[r.length] = flag;
				r[r.length] = ",";
			}
			r[r.length - 1] = arr_end;
		}

		var str = r.join("");

		if (str == "}") {
			str = "{}";
		}

		if (str == arr_end) {
			str = arr_start + arr_end;
		}

		if (replace) {

			var reg = new RegExp(flag + "{", "g");
			str = str.replace(reg, "{");

			reg = new RegExp("}" + flag, "g");
			str = str.replace(reg, "}");

			reg = new RegExp(flag + arr_start, "g");
			str = str.replace(reg, "[");

			reg = new RegExp(arr_end + flag, "g");
			str = str.replace(reg, "]");

			if (str.indexOf(arr_start + "{") > -1) {
				reg = new RegExp(arr_start + "{", "g");
				str = str.replace(reg, "[{");
			}
			if (str.indexOf("}" + arr_end) > -1) {
				reg = new RegExp("}" + arr_end, "g");
				str = str.replace(reg, "}]");
			}
		}
		return str;
	}
	return o.toString();
};

/*转成json为对象*/
function tmEval(json) {
	return eval("(" + json + ")");
};

function tmToJson(o) {
	var r = [];
	if (typeof o == "string")
		return "\""
				+ o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n")
						.replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
	if (typeof o == "object") {
		if (!o.sort) {
			for ( var i in o)
				r.push("\"" + i + "\":" + tmToJson(o[i]));
			if (!!document.all
					&& !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/
							.test(o.toString)) {
				r.push("toString:" + o.toString.toString());
			}
			r = "{" + r.join() + "}"
		} else {
			for ( var i = 0; i < o.length; i++)
				r.push(tmToJson(o[i]))
			r = "[" + r.join() + "]"
		}
		return r;
	}
	return o.toString();
};

function tmToJsonStringify(obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {
		if (t == "string")
			obj = '"' + obj + '"';
		return String(obj);
	} else {
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		for (n in obj) {
			v = obj[n];
			t = typeof (v);
			if (t == "string")
				v = '"' + v + '"';
			else if (t == "object" && v !== null)
				v = tmToJsonStringify(v);
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};

//json转换成字符串
function jsonToString(obj) {
var THIS = this;
switch (typeof(obj)) {
case 'string':
  return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
case 'array':
  return '[' + obj.map(THIS.jsonToString).join(',') + ']';
case 'object':
  if (obj instanceof Array) {
    var strArr = [];
    var len = obj.length;
    for (var i = 0; i < len; i++) {
      strArr.push(THIS.jsonToString(obj[i]));
    }
    return '[' + strArr.join(',') + ']';
  } else if (obj == null) {
    return 'null';

  } else {
    var string = [];
    for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));
    return '{' + string.join(',') + '}';
  }
case 'number':
  return obj;
case false:
  return obj;
}
}

//字符串转换json
function stringToJSON(obj) {
return eval_r('(' + obj + ')');
}

/*转成json为对象*/
function ExmayEval(json) {
	return eval("(" + json + ")");
};

function isEmpty(val) {
	var $val = $.trim(val);
	if(val==null)return true;
	if (val == undefined || val == 'undefined')
		return true;
	if (val == "")
		return true;
	if (val.length == 0)
		return true;
	if (!/[^(^\s*)|(\s*$)]/.test(val))
		return true;
	return false;
};

/*
 * 检测对象是否是空对象(不包含任何可读属性)。
 * 方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使hasOwnProperty)。
 */
function isEmptyObject(obj){
    for (var name in obj) {
        return false;
    }
    return true;
};

/*
 * 检测对象是否是空对象(不包含任何可读属性)。
 * 方法只既检测对象本身的属性，不检测从原型继承的属性。
 */
function isOwnEmpty(obj){
    for(var name in obj){
        if(obj.hasOwnProperty(name)){
            return false;
        }
    }
    return true;
};

function isNotEmpty(val) {
	return !isEmpty(val);
};

/*获取鼠标的坐标*/
function tm_posXY(event) {
	event = event || window.event;
	var posX = event.pageX
			|| (event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
	var posY = event.pageY
			|| (event.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	return {
		x : posX,
		y : posY
	};
}

Array.prototype.removeItem = function(item) {
	for ( var i = 0; i < this.length; i++) {
		if (item == this[i])
			break;
	}
	if (i == this.length)
		return;
	for ( var j = i; j < this.length - 1; j++) {
		this[j] = this[j + 1];
	}
	this.length--;
};

/*找到元素的位置*/
Array.prototype.indexOf = function(val) {
	for ( var i = 0; i < this.length; i++) {
		if (this[i] == val)
			return i;
	}
	return -1;
};

/*根据元素删除*/
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};
/*如果数组中存在多个相同的元素都删除*/
Array.prototype.removeElement = function(element) {
	for ( var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			this.splice(i, 1);
		}
	}
};
/**
 * 删除json格式的数组
 * @param {Object} element
 * @memberOf {TypeName} 
 */
Array.prototype.removeObject = function(element) {
	for ( var i = 0; i < this.length; i++) {
		var jsonData = this[i];
		for ( var key in jsonData) {
			if (jsonData[key] == element) {
				this.splice(i, 1);
			}
		}
	}
};

/*数组唯一*/
Array.prototype.unique = function() {
	var o = new Object();
	for ( var i = 0, j = 0; i < this.length; i++) {
		if (typeof o[this[i]] == 'undefined') {
			o[this[i]] = j++;
		}
	}
	this.length = 0;
	for ( var key in o) {
		this[o[key]] = key;
	}
	return this;
};

Array.prototype.unique2 = function() {
	for ( var i = 0; i < this.length; i++) {
		for ( var j = i + 1; j < this.length;) {
			if (this[j] == this[i]) {
				this.splice(j, 1);
			} else {
				j++;
			}
		}
	}
	return this;
};

Array.prototype.orderBy = function(sortFlag) {
	if(sortFlag=='asc'){
		this.sort(NumAscSort);
	}else if(sortFlag=='desc'){
		this.sort(NumDescSort);
	}else{
		this.sort(NumAscSort);
	}
	return this;
};

function NumAscSort(a,b){
    return a-b;
};
function NumDescSort(a,b){
    return b-a;
}
function tmBooleanToString(booleanString) {
	if (booleanString == undefined || booleanString == 'undefined')
		return eval(booleanString);
	return booleanString.toString();
};

function tmBooleanToStr(booleanString) {
	if (booleanString == undefined || booleanString == 'undefined')
		return eval(booleanString);
	return String(booleanString);
};

function tmStringToBooleanEval(string) {
	if (string == undefined || string == 'undefined')
		return eval(string);
	return eval(string);
};

function tm_forbiddenSelect() {
	$(document).bind("selectstart", function() {
		return false;
	});
	document.onselectstart = new Function("event.returnValue=false;");
	$("*").css({"-moz-user-select" : "none"});
}

function tm_autoSelect() {
	$(document).bind("selectstart", function() {
		return true;
	});
	document.onselectstart = new Function("event.returnValue=true;");
	$("*").css({"-moz-user-select" : ""});
}

function tmBooleanParse(string) {
	if (string == undefined || string == 'undefined')
		return eval(string);
	switch (string.toLowerCase()) {
	case "true":
	case "yes":
	case "1":
		return true;
	case "false":
	case "no":
	case "0":
	case null:
		return false;
	default:
		return Boolean(string);
	}
};

/*获取剪切板中的内容*/
function tmGetClipboard() {
	if (window.clipboardData) {
		return (window.clipboardData.getData('text'));
	} else {
		if (window.netscape) {
			try {
				netscape.security.PrivilegeManager
						.enablePrivilege("UniversalXPConnect");
				var clip = Components.classes["@mozilla.org/widget/clipboard;1"]
						.createInstance(Components.interfaces.nsIClipboard);
				if (!clip) {
					return;
				}
				var trans = Components.classes["@mozilla.org/widget/transferable;1"]
						.createInstance(Components.interfaces.nsITransferable);
				if (!trans) {
					return;
				}
				trans.addDataFlavor("text/unicode");
				clip.getData(trans, clip.kGlobalClipboard);
				var str = new Object();
				var len = new Object();
				trans.getTransferData("text/unicode", str, len);
			} catch (e) {
				alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js");
				return null;
			}
			if (str) {
				if (Components.interfaces.nsISupportsWString) {
					str = str.value
							.QueryInterface(Components.interfaces.nsISupportsWString);
				} else {
					if (Components.interfaces.nsISupportsString) {
						str = str.value
								.QueryInterface(Components.interfaces.nsISupportsString);
					} else {
						str = null;
					}
				}
			}
			if (str) {
				return (str.data.substring(0, len.value / 2));
			}
		}
	}
	return null;
};

function tmSetClipboard(txt) {
	if (window.clipboardData) {
		window.clipboardData.clearData();
		window.clipboardData.setData("Text", txt);
	} else if (navigator.userAgent.indexOf("Opera") != -1) {
		window.location = txt;
	} else if (window.netscape) {
		try {
			netscape.security.PrivilegeManager
					.enablePrivilege("UniversalXPConnect");
		} catch (e) {
			alert("您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js");
			return false;
		}
		var clip = Components.classes['@mozilla.org/widget/clipboard;1']
				.createInstance(Components.interfaces.nsIClipboard);
		if (!clip)
			return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1']
				.createInstance(Components.interfaces.nsITransferable);
		if (!trans)
			return;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes["@mozilla.org/supports-string;1"]
				.createInstance(Components.interfaces.nsISupportsString);
		var copytext = txt;
		str.data = copytext;
		trans.setTransferData("text/unicode", str, copytext.length * 2);
		var clipid = Components.interfaces.nsIClipboard;
		if (!clip)
			return false;
		clip.setData(trans, null, clipid.kGlobalClipboard);
	}
};

$(function() {
	//$(".tm-number").attr("title","请输入数字");	
	var miunsInterval = null;
	var plusInterval = null;
	$(".tm-ui-minus").mousedown(function() {
		var to = $(this).attr("to");
		var min = $(this).attr("min");
		var targetVal = $("#" + to).val();
		if (isNotEmpty(targetVal)) {
			miunsInterval = setInterval(function() {
				if (targetVal <= min) {
					clearInterval(miunsInterval);
				} else {
					targetVal--;
				}
				$("#" + to).val(targetVal);
			}, 80);
		}
	}).mouseup(function() {
		clearInterval(miunsInterval);
	}).mouseout(function() {
		clearInterval(miunsInterval);
	});

	$(".tm-ui-plus").mousedown(function() {
		var to = $(this).attr("to");
		var max = $(this).attr("max");
		var targetVal = $("#" + to).val();
		if (isNotEmpty(targetVal)) {
			plusInterval = setInterval(function() {
				if (targetVal >= max) {
					clearInterval(plusInterval);
				} else {
					targetVal++;
				}
				$("#" + to).val(targetVal);
			}, 80);
		}
	}).mouseup(function() {
		clearInterval(plusInterval);
	}).mouseout(function() {
		clearInterval(plusInterval);
	});
	
	$(".tm-number").attr({"style":"ime-mode:disabled"}).live("keyup",function(e){
		return tm_numberKey($(this),e);
	}).live("blur",function(e){
		return tm_numberKey($(this),e);
	});
});
function tm_numberKey($this,e){
	var inputVal=$.trim($this.val());
	var reg01=/^0\d$/g;
	if(inputVal.length>0&&reg01.test(inputVal)){
		$this.val(inputVal.substring(0,inputVal.length-1));
		return false;
	}
	
	var regNum=/^(\d){3,3}\.$/g;
	if(inputVal.length>1&&regNum.test(inputVal)){
		$this.val(inputVal.substring(0,inputVal.length-1));
		return false;
	}
	
	var reg=/^\D$/g;
	if(inputVal.length>0){
		var lastStr=inputVal.substring(inputVal.length-1,inputVal.length);
		if(reg.test(lastStr)&&lastStr!='.'){
			$this.val(inputVal.substring(0,inputVal.length-1));
			return false;
		}
	}
	
		var range =  $this.attr("range");
		if(isNotEmpty(range)){
			var reg=/(_|-)/g;
			var ranges = range.split(reg);
			var max = parseFloat(ranges[2]),min=(ranges[0]);
			var val = $this.val();
			//if(val!="0."){
				val=parseFloat(val);
				if(val==0) return false;
				if(val<min)	$this.val(min);
				if(val>max) $this.val(max);
				//$this.focus();
			//}
			
		}
		//小数位数,没有这个属性就默认为整数
		var deciLength =  $this.attr("deciLength");
		if(deciLength!=undefined){
			deciLength=parseInt(deciLength);
			if(typeof(deciLength)!="number"){
				deciLength=0;
			}
		}else{
			deciLength=0;
		}
		//截取小数位数
		if(deciLength!=0){
			var inputVal=$this.val();
			var hasdeci=inputVal.indexOf(".");
			if(hasdeci!=-1){
				var arr=inputVal.split(".");
				if(arr[1].length>deciLength){
					arr[1]=arr[1].substr(0,deciLength);
				}	
				inputVal=arr[0]+"."+arr[1];
				$this.val(inputVal);
			}
		}
	
	
	if (!e) e = window.event;
	 if(e.shiftKey)return false;
   var code = e.keyCode | e.which | e.charCode;
     if (code >= 48 && code <= 57 || code>=96 && code <=105 || code==9) return true; // 数字
     //如果存在小数时，按小数间才起作用
     if(deciLength!=0&&code==190){
    	 return true;
     }
     switch (code) {
        case 8: // 退格
        case 37: case 38: case 39: case 40: // 方向键
        case 13: // 回车
        case 46: // 删除
        case 45:
        case 110:
            return true;
     }
     return false;
}
var windowPosition = {
	scrollTop : function() {
		return window.pageYOffset || document.documentElement.scrollTop
				|| document.body.scrollTop;
	},
	top : function() {
		return window.pageYOffset || document.documentElement
				&& document.documentElement.scrollTop
				|| document.body.scrollTop;
	},
	height : function() {
		return window.innerHeight || document.documentElement
				&& document.documentElement.clientHeight
				|| document.body.clientHeight;
	},
	left : function() {
		return window.pageXOffset || document.documentElement
				&& document.documentElement.scrollLeft
				|| document.body.scrollLeft;
	},
	width : function() {
		return window.innerWidth || document.documentElement
				&& document.documentElement.clientWidth
				|| document.body.clientWidth;
	},
	right : function() {
		return windowPosition.left() + windowPosition.width();
	},
	bottom : function() {
		return windowPosition.top() + windowPosition.height();
	}
};

function getClientHeight() {
	var clientHeight = 0;
	if (document.body.clientHeight && document.documentElement.clientHeight) {
		var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight
				: document.documentElement.clientHeight;
	} else {
		var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight
				: document.documentElement.clientHeight;
	}
	return clientHeight;
}

function getClientWidth() {
	var clientWidth = 0;
	if (document.body.clientWidth && document.documentElement.clientWidth) {
		var clientWidth = (document.body.clientWidth < document.documentElement.clientWidth) ? document.body.clientWidth
				: document.documentElement.clientWidth;
	} else {
		var clientWidth = (document.body.clientWidth > document.documentElement.clientWidth) ? document.body.clientWidth
				: document.documentElement.clientWidth;
	}
	return clientWidth;
}

$(function(){
	var ovalue;
	$(".tm-inputs").live("focus",function(){
		var tip = $(this).attr("tip");
		var value = $(this).val();
		ovalue =  $(this).val();
		if(tip==value){
			$(this).val("");
			$(this).css("border","1px solid #ff3702");
		}
	}).live("blur",function(){
		var tip = $(this).attr("tip");
		var value = $(this).val();
		$(this).css("border","1px solid #ccc");
		if(isEmpty(value)){
			$(this).val(tip);
			ovalue = "";
		}
	});
	
});


/**      
 * 对Date的扩展，将 Date 转化为指定格式的String      
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符      
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)      
 * eg:      
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423      
 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
 */


Date.prototype.format=function(fmt) {
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}  

function evalDate(dateString){
	var strArray=dateString.split(" ");   
	var strDate=strArray[0].split(/[\/|-]/);   
	var strTime=strArray[1]?strArray[1].split(":"):null;   
	var date=new Date(strDate[0],(strDate[1]-parseInt(1)),strDate[2],strTime?(strTime[0]? strTime[0] : 00):00,strTime?(strTime[1]?strTime[1]:00):00,strTime?(strTime[2]?strTime[1]:00):00);
    return date;
}

function  getCharacter(num){
	var cweek = "";
	if(num==1)cweek = "A";
	if(num==2)cweek = "B";
	if(num==3)cweek = "C";
	if(num==4)cweek = "D";
	if(num==5)cweek = "E";
	if(num==6)cweek = "F";
	if(num==7)cweek = "G";
	if(num==8)cweek = "H";
	if(num==9)cweek = "I";
	if(num==10)cweek = "J";
	if(num==11)cweek = "K";
	if(num==12)cweek = "M";
	if(num==13)cweek = "L";
	if(num==14)cweek = "N";
	if(num==15)cweek = "O";
	if(num==16)cweek = "P";
	if(num==17)cweek = "Q";
	if(num==18)cweek = "R";
	if(num==19)cweek = "S";
	if(num==20)cweek = "T";
	if(num==21)cweek = "U";
	if(num==22)cweek = "V";
	if(num==23)cweek = "W";
	if(num==24)cweek = "X";
	if(num==25)cweek = "Y";
	if(num==26)cweek = "Z";
	return cweek;
}
/**
 * 将数字转换成对应的中文
 * @param {Object} num 
 *  比如:1对应一
 *       11：十一
 * 		 101:一百零一 
 * @return {TypeName} 
 */
function tmNumberToChinese(num)  //将阿拉伯数字翻译成中文的大写数字
	{
	    var AA = new Array("零","一","二","三","四","五","六","七","八","九","十");
	    var BB = new Array("","十","百","仟","萬","億","点","");
	    
	    var a = (""+ num).replace(/(^0*)/g, "").split("."), k = 0, re = "";
	
	    for(var i=a[0].length-1; i>=0; i--)
	    {
	        switch(k)
	        {
	            case 0 : re = BB[7] + re; break;
	            case 4 : if(!new RegExp("0{4}//d{"+ (a[0].length-i-1) +"}$").test(a[0]))
	                     re = BB[4] + re; break;
	            case 8 : re = BB[5] + re; BB[7] = BB[5]; k = 0; break;
	        }
	        if(k%4 == 2 && a[0].charAt(i+2) != 0 && a[0].charAt(i+1) == 0) re = AA[0] + re;
	        if(a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k%4] + re; k++;
	    }
	
	    if(a.length>1) //加上小数部分(如果有小数部分)
	    {
	        re += BB[6];
	        for(var i=0; i<a[1].length; i++) re += AA[a[1].charAt(i)];
	    }
	    if(re=='一十')re="十";
	    if(re.match(/^一/) && re.length==3)re = re.replace("一","");
	    return re;
	}

function getEditHtml(id){
	var $iframe = tmChildrenObject(id);
	var $ciframe = $iframe.document.getElementById("eWebEditor").contentWindow;
	return $($ciframe.document).find("body").html().replace(/<br>/ig,"");
};

function appendEditHtml(id,value){
	var $iframe = tmChildrenObject(id);
	var $ciframe = $iframe.document.getElementById("eWebEditor").contentWindow;
	$($ciframe.document).find("body").append(value);
};


function getEditText(id){
	var $iframe = tmChildrenObject(id);
	var $ciframe = $iframe.document.getElementById("eWebEditor").contentWindow;
	return $($ciframe.document).find("body").text();
};

function getValidtorEditText(id){
	var $iframe = tmChildrenObject(id);
	var $ciframe = $iframe.document.getElementById("eWebEditor").contentWindow;
	var text = $($ciframe.document).find("body").text();
	var imgLength = $($ciframe.document).find("body").find("img").length;
	if(isEmpty(text) && imgLength==0)return true;
	return false;
};
/**
 * 验证百度编辑器是否有内容
 */
function getValidtorUeditText(id){
	var $ueditor=getUeditorObj(id);
	return $ueditor.hasContents();
	
}
/**
 * 获取百度编辑的对象
 */
function getUeditorObj(id){
	return UE.getEditor(id);
}
/**
 * 获取百度编辑器的内容
 */
function getUeditText(id){
	var $ueditor=getUeditorObj(id);
	return $ueditor.getContent();
}

function getCursortPosition (ctrl) {
	var CaretPos = 0;	// IE Support
	if (document.selection) {
	ctrl.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -ctrl.value.length);
		CaretPos = Sel.text.length;
	}
	// Firefox support
	else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		CaretPos = ctrl.selectionStart;
	return (CaretPos);
};

function setCaretPosition(inputDom, startIndex, endIndex)
{
    if (inputDom.setSelectionRange)
    {  
        inputDom.setSelectionRange(startIndex, endIndex);  
    }   
    else if (inputDom.createTextRange) //IE 
    {
        var range = inputDom.createTextRange();  
        range.collapse(true);  
        range.moveStart('character', startIndex);  
        range.moveEnd('character', endIndex - startIndex-1);  
        range.select();
    }  
    inputDom.focus();  
}

//获取选中文本
function getSelectedText(inputDom){  
    if (document.selection) //IE
    { 
        return document.selection.createRange().text; 
    }  
    else {  
        return inputDom.value.substring(inputDom.selectionStart,  
                inputDom.selectionEnd);  
    }  
}


function getSecond(hms){
	if(isNotEmpty(hms)){
		if(isEmpty(hms) || hms==0)return "0";
		var times = hms.split(":");
		if(times !=null && times.length==3){
			return times[0]*60*60 +times[1]*60+times[2]*1; 
		}else{
			return "0";
		}
	}else{
	  return "0";
	}
}

/**
*将秒转换为 hh:mm:ss
*
*/
function tm_hhmmss(seconds){
   var hh;
   var mm;
   var ss;
   //传入的时间为空或小于0
   if(seconds==null||seconds<0){
       return;
   }
   //得到小时
   hh=seconds/3600|0;
   seconds=parseInt(seconds)-hh*3600;
   if(parseInt(hh)<10){
          hh="0"+hh;
   }
   //得到分
   mm=seconds/60|0;
   //得到秒
   ss=parseInt(seconds)-mm*60;
   if(parseInt(mm)<10){
         mm="0"+mm;    
   }
   if(ss<10){
       ss="0"+ss;      
   }
   return hh+":"+mm+":"+ss;
   
}


function stopBubble(e) {
    //如果提供了事件对象，则这是一个非IE浏览器 
    if (e && e.stopPropagation)
    //因此它支持W3C的stopPropagation()方法 
    e.stopPropagation();
    else
    //否则，我们需要使用IE的方式来取消事件冒泡 
    if(window.event)
    	window.event.cancelBubble = true;
}

/*加载课程列表信息*/
function tm_student_courseList(target){
	var datas = {"loadType":1};
	$.ajax({
		type:"post",
		url:jsonPath+"/student/loadCourse",
		data : datas,
		success:function(data){
			var jsonData = data.courseWebDtos;
			var studentWebDtos = data.studentWebDtos;
			$("#"+target).empty();
			$("#"+target).append("<option value=''>------请选择------</option>");
			if (isNotEmpty(studentWebDtos)) {
				for(var i=0;i<studentWebDtos.length;i++){
					$("#"+target).append("<option value='"+studentWebDtos[i].courseId+"' type=\"2\">"+studentWebDtos[i].name+"</option>");
				}
			}
			if (isNotEmpty(jsonData)) {
				for(var i=0;i<jsonData.length;i++){
					$("#"+target).append("<option value='"+jsonData[i].courseId+"'type=\"1\">"+jsonData[i].name+"</option>");
				}
			}
		}
	});	
}

/*笔记加载学生课程列表信息*/
function loadStudentCourse(target){
	$.ajax({
		type:"post",
		url:jsonPath+"/student/loadStudentCourse",
		success:function(data){
			var jsonData = data.courseDtos;
			$("#"+target).empty();
			$("#"+target).append("<option value=''>------请选择------</option>");
			if (isNotEmpty(jsonData)) {
				for(var i=0;i<jsonData.length;i++){
					$("#"+target).append("<option value='"+jsonData[i].courseId+"'>"+jsonData[i].name+"</option>");
				}
			}
		}
	});	
}

var he=0;
function tmUploadFile(target,folderId,userRole){
	var $target = $(target);
	$(".wrap_popboxes").remove();
	var url = basePath+"/upload/fileUpload";
	if(isNotEmpty(userRole)){
		basePath+"/upload/fileUpload?role="+userRole;
	}
	if(isNotEmpty(folderId)){
		url = basePath+"/upload/fileUpload?folderId="+folderId+"&role="+userRole;
	}
	if($target.offset().top!=0){
		var top = $target.offset().top;
		var h = $target.height();
		var nt = top - h -150;
		if(nt<60)nt = 60;
		he=nt;
	}
	var title = '<ul class="box_badgetab clear_float" style="padding:0px;">' + '<li class="badgetab_cur"><strong>上传文档</strong></li>' + '<li onclick="tmUploadImage(this,'+folderId+','+userRole+')"><strong><a  class="tm_upload_refere_pictures" href="javascript:void(0)"">上传图片</a></strong></li>' + '<li onclick="tmUploadVideo(this,'+folderId+','+userRole+')"><strong><a  class="tm_upload_refere_videos" href="javascript:void(0)"">上传音视频</a></strong></li>'+'</ul>';
	$.tmDialog.iframe({pos:"absolute",title:title,top:he,titleStyle: "border-bottom:0px solid #ccc;background:#f5f5f5;height:30px;",url:url,width:555,height:450,offsetTop:-1,drag:false,callback:function($iframe,$dialog,$parent,opts){
		if($iframe && $dialog && $parent){
			 $iframe.tm_uploadFile($iframe,$dialog,$parent,opts);
		}
	}});
}



/*图片文件上传*/
function tmUploadImage(target,folderId,userRole){
	var $target = $(target);
	$(".wrap_popboxes").remove();
	var url = basePath+"/upload/image?fileTypes=*.jpg;*.jpeg;*.png;*.gif;*.zip;*.rar";
	if(isNotEmpty(folderId)){
		url = basePath+"/upload/image?folderId="+folderId+"&role="+userRole+"&fileTypes=*.jpg;*.jpeg;*.png;*.gif;*.zip;*.rar";
	}
	var PtitleStyle = "background:#f5f5f5;"
	var title = '<ul class="box_badgetab clear_float" style="padding:0px;">' + '<li onclick="tmUploadFile(this,'+folderId+','+userRole+')"><strong>上传文档</strong></li>' + '<li class="badgetab_cur"><strong><a  class="tm_upload_refere_pictures" href="javascript:void(0)"">上传图片</a></strong></li>' + '<li onclick="tmUploadVideo(this,'+folderId+','+userRole+')"><strong><a  class="tm_upload_refere_videos" href="javascript:void(0)"">上传音视频</a></strong></li>'+'</ul>';
	$.tmDialog.iframe({pos:"absolute",title:title,top:he,titleStyle: "border-bottom:0px solid #ccc;background:#f5f5f5;height:30px;",url:url,width:555,height:450,offsetTop:-1,drag:false,callback:function($iframe,$dialog,$parent,opts){
		if($iframe && $dialog && $parent){
			 $iframe.tm_uploadImg($iframe,$dialog,$parent,opts);
		}
	}});
}
/*图片文件上传*/


/*上传视频*/
function tmUploadVideo(target,folderId,userRole){
	var $target = $(target);
	$(".wrap_popboxes").remove();
	var url = basePath+"/upload/video";
	if(isNotEmpty(userRole)){
		basePath+"/upload/video?role="+userRole;
	}
	if(isNotEmpty(folderId)){
		url = basePath+"/upload/video?folderId="+folderId+"&role="+userRole;
	}
	var PtitleStyle = "background:#f5f5f5;"
	var title = '<ul class="box_badgetab clear_float" style="padding:0px;">' + '<li onclick="tmUploadFile(this,'+folderId+','+userRole+')"><strong>上传文档</strong></li>' + '<li onclick="tmUploadImage(this,'+folderId+','+userRole+')"><strong><a  class="tm_upload_refere_pictures" href="javascript:void(0)"">上传图片</a></strong></li>' + '<li class="badgetab_cur"><strong><a  class="tm_upload_refere_videos" href="javascript:void(0)"">上传音视频</a></strong></li>'+'</ul>';
	//$.tmDialog.iframe({title:title,PtitleStyle:PtitleStyle,target:$(".operate_fbtna"),url:url,width:520,height:440,offsetTop:-1,drag:false,callback:function($iframe,$dialog,$parent,opts){
	$.tmDialog.iframe({pos:"absolute",title:title,top:he,titleStyle: "border-bottom:0px solid #ccc;background:#f5f5f5;height:30px;",url:url,width:555,height:450,offsetTop:-1,drag:false,callback:function($iframe,$dialog,$parent,opts){
			if($iframe && $dialog && $parent){
			 $iframe.tm_uploadvideo($iframe,$dialog,$parent,opts);
		}
	}});
}

/*上传视频结束*/
/*js 验证相关*/
function redirect(url) {
	document.location.href = url;
}
function isInteger(str) {
	var partten = /^[0-9]*[1-9][0-9]*$/;
	return partten.test(str);
};
function isPhone(str) {
	var partten = /^1[3,5,8]\d{9}$/;
	return partten.test(str);
};
/*
function isEmpty(str) {
	if (str == null || str == "" || typeof str == "undefined") {
		return true;
	}
	var regu = "^[ ]+$";
	var re = new RegExp(regu);
	return re.test(str);
};
function isNotEmpty(str) {
	return ! isEmpty(str);
};*/
function isIDCard(str) {
	var partten = /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/;
	return partten.test(str);
};
function isEmail(str) {
	var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
	if (emailReg.test(str)) {
		return true;
	} else {
		alert("您输入的Email地址格式不正确！");
		return false;
	}  
};

function isIP(strIP) {
	var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g;
	if (re.test(strIP)) {
		if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
			return true;
		}
	}
	return false;
};

function isLength(str, min, max) {
	if (str == null) {
		return false;
	} else {
		var length = str.length;
		if (length < min) {
			return false;
		} else if (length > max) {
			return false;
		}
	}
	return true;
};
function opinionTime(stratTime, endTime) {
	var start = stratTime.split("-");
	var end = endTime.split("-");
	if (start[0] <= end[0]) {
		if (start[0] == end[0]) {
			if (start[1] <= end[1]) {
				if (start[1] == end[1]) {
					if (start[2] <= end[2]) {
						return false;
					} else
					 return true;
				} else
				 return false;
			} else
			 return true;
		} else
		 return false;
	} else
	 return true;
}

function getDateDiff(startTime, endTime, diffType) {
	startTime = startTime.replace(/\-/g, "/");
	endTime = endTime.replace(/\-/g, "/");
	diffType = diffType.toLowerCase();
	var sTime = new Date(startTime);
	var eTime = new Date(endTime);
	var divNum = 1;
	switch (diffType) {
	case "second":
		divNum = 1000;
		break;
	case "minute":
		divNum = 1000 * 60;
		break;
	case "hour":
		divNum = 1000 * 3600;
		break;
	case "day":
		divNum = 1000 * 3600 * 24;
		break;
	default:
		break;
	}
	return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
}

function computation(sDate1, sDate2) {
	var aDate,
	oDate1,
	oDate2,
	iDays
	 aDate = sDate1.split("-")
	 oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
	 aDate = sDate2.split("-")
	 oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
	 iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) + 1;
	return iDays;
}

/**
 * 时间格式
 * @param {Object} datetime
 * @return {TypeName} 
 */
function GetDateDiff(datetime,serviceDate){
	var date1 = new Date(datetime.replace(/\-/g,"/")); //开始时间
	var date2 = new Date(serviceDate.replace(/\-/g,"/")); //结束时间
	var date3;
	if(date2.getTime()>date1.getTime()){
		date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数
	}else{
		date3 = date1.getTime() - date2.getTime(); //时间差的毫秒数
	}
	//计算出相差天数
	var days = Math.floor(date3 / (24 * 3600 * 1000));
	//计算出小时数
	var leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000));
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000);
	if(days<1 && hours<1 && minutes<1 && seconds>=0){
		if(seconds==0){
			seconds = 1;
		}
		datetime = seconds+ " 秒前";
	}else if(days<1 && hours<1 && minutes>0){
		datetime = minutes + " 分钟前";
	}else if(days<1 && hours>0){
		datetime = hours + "小时前";
	}else if(days>0){
		datetime = days + "天前";
	}
	//alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒");
	return datetime;
}


 //json转换成字符串
	    function jsonToString (obj){   
	        var THIS = this;    
	        switch(typeof(obj)){   
	            case 'string':   
	                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';   
	            case 'array':   
	                return '[' + obj.map(THIS.jsonToString).join(',') + ']';   
	            case 'object':   
	                 if(obj instanceof Array){   
	                    var strArr = [];   
	                    var len = obj.length;   
	                    for(var i=0; i<len; i++){   
	                        strArr.push(THIS.jsonToString(obj[i]));   
	                    }   
	                    return '[' + strArr.join(',') + ']';   
	                }else if(obj==null){   
	                    return 'null';   
	  
	                }else{   
	                    var string = [];   
	                    for (var property in obj) string.push(THIS.jsonToString(property) + ':' + THIS.jsonToString(obj[property]));   
	                    return '{' + string.join(',') + '}';   
	                }   
	            case 'number':   
	                return obj;   
	            case false:   
	                return obj;   
	        }   
  		 }
 
        //字符串转换json
		function stringToJSON(obj){   
		        return eval('(' + obj + ')');   
		}

/*验证相关结束*/
function tm_teacher_courseList(target,hasHead,defaultSelectedValue,disabled){
	$.ajax({
		type:"post",
		url:jsonPath+"/notice/listAllCourses",
		beforeSend:function(){tmWaitLoading("课程加载中...");},
		error:function(){tmClearLoading();},
		success:function(data){
			tmClearLoading();
			var jsonData = data.course4NoticeDtos;
			var _target = $("#"+target);
			_target.empty();
			if(hasHead == true){
				_target.append("<option value=''>我教授的全部课程</option>");
			}
			for(var i=0;i<jsonData.length;i++){
				_target.append("<option value='"+jsonData[i].courseId+"'>"+jsonData[i].name+"</option>");
			}
			_target.val(defaultSelectedValue);
			if(disabled == true){
				_target.attr("disabled","disabled");
			}
		}
	});	
}

function replaceUrlCode(str) {
	str = str.replace(/%/g,"%25")
	str = str.replace(/&/g,"%26");
    return str;
}


var letter = {
	'&' : '&amp;',
	'>' : '&gt;',
	'<' : '&lt;',
	'"' : '&quot;',
	"'" : '&#39;'
};

/*替换所有HTML标签*/
function tm_filterTagsReplace(content){
	return content.replace(/<|>|'|"|&/g,function($0){
		return letter[$0];
	});
}

/*过滤htmlTags，并去除空白行*/
function tm_filterTags(content) {
	if(isNotEmpty(content)){
		content = content.replace(/<\/?[^>]*>/g,''); //去除HTML tag
		content = content.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
		content = content.replace(/&nbsp;/ig,'');//去掉&nbsp;
		content = content.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	}
	return content;
}


function tm_show_testQuestion(obj){
	$(document).scrollTop(0);
	var opid = $(obj).attr("opid");
	$.tmDialog.iframe({url:basePath+"/question/show?id="+opid,scrolling:"auto",title:"预览试题",target:$(obj),showBtn:false,pos:"absolute",width:960,height:520,top:35,callback:function(){
	},loadSuccess:function($iframe,$dialog,opts){
		/*setTimeout(function(){
			var $children = $($iframe.document);
			var bodyHeight = $children.height() * 1+27;
			$dialog.find(".popboxes_main").height(bodyHeight)
			$dialog.find("#tmDialog_iframe").attr("height",bodyHeight);
			$("#popbox_overlay").height($(parent.document).height());
		},1000);*/
	}});
}

//防止脚本攻击
function preventJSToAttack(html){
	if(html==undefined||html==""||html==null){
		return "";
	}
	return "<xmp>"+html.replace(/<xmp>/ig,"&lt;xmp&gt;").replace(/<\/xmp>/ig,"&lt;\/xmp&gt;")+"</xmp>";
}

function tm_downloadFile(publicDataId){
	$.tmDialog.sureProxy({title:"下载",btnArrow:"center",sureButton:"下载文件",content:"您确定下载该压缩文件？",callback:function(ok){
		if(ok){
			$.ajax({
				type:"post",
				url:jsonPath+"/upload/downFile",
				data:{"id":publicDataId},
				beforeSend:function(){tmWaitLoading("请稍等，文件加载中...");},
				success : function(data){
					if(isEmpty(data.result) || data.result=='error'){
						tmInitLoadingT("服务器断开或下载文件不存在!!",1000);
					}else if(data.result=="logout"){
						tmInitLoadingT("请登录!",1000);
					}else{
						tmInitLoadingT("文件正在连接!!",3000);
						window.location.href = data.result;
					}
				}
			});
		}
	}});
}

function tm_downloadDataFile(dataId){
	$.tmDialog.sureProxy({title:"下载",btnArrow:"center",sureButton:"下载文件",content:"您确定下载该压缩文件？",callback:function(ok){
		if(ok){
			$.ajax({
				type:"post",
				url:jsonPath+"/upload/downDataFile",
				data:{"id":dataId},
				beforeSend:function(){tmWaitLoading("请稍等，文件加载中...");},
				success : function(data){
					if(isEmpty(data.result) || data.result=='error'){
						tmInitLoadingT("服务器断开或下载文件不存在!!",1000);
					}else if(data.result=="logout"){
						tmInitLoadingT("请登录!",1000);
					}else{
						tmInitLoadingT("文件正在连接!!",3000);
						window.location.href = data.result;
					}
				}
			});
		}
	}});
	
}

/**
*获取字符长度
*str  传入字符
*isEncode false返回length长度  true utf-8中文三个字节
*/
function strLength(str, isEncode) {
	var size = 0;
	var step = 1;
	if(isEncode){
	    step = 2;
	}
	for ( var i = 0, len = str.length; i < len; i++) {
		if (str.charCodeAt(i) > 255) {
			size += step;// utf-8中文三个字节
		} else {
			size++;
		}
	}
	return size;
};

/**
*字符串截取
*str  传入字符
*size  截取长度
*isEncode false返回length长度  true utf-8中文三个字节
*/
function subString(str, size, isEncode) {
	var curSize = 0, arr = [], step = 1;
	if(isEncode){
	    step = 2;
	}
	for ( var i = 0, len = str.length; i < len; i++) {
		if (str.charCodeAt(i) > 255) {
			if(size > curSize + step){
				arr.push(str.charAt(i));
				curSize += step;// utf-8中文三个字节
			} else {
				return arr.join('');
			}
		} else {
			if(size > curSize){
				arr.push(str.charAt(i));
				curSize++;
			} else {
				return arr.join('');
			}
		}
	}
}

/**
*字符串截取，并将大于长度的字符加...返回
*str  传入字符
*size  截取长度
*/
function subStringOmit(str, size){
	var strSize = strLength(str, true);
	if(strSize > size){
		return subString(str, size, true) + '...';
	}else{
		return str;
	}
}

$.tmAjax = {
	request : function(options,dataJson){
		var opts = $.extend({},{beforeSend:function(){}},options);
		var _url = opts.url;
		if(isEmpty(_url)){
			_url = jsonPath+"/"+opts.model+"/"+opts.method+"?ajax=true";
		}
		if(isNotEmpty(opts.params)){
			_url+="&"+opts.params;
		}
		$.ajax({
			type:"post",
			data : dataJson,
			url : _url,
			beforeSend:function(){opts.beforeSend();},
			error:function(){tmInitLoadingT("提示:出现错误",1000);},
			success:function(data){
				opts.callback(data);
			}
		});
	}	
};

/* 特殊字符替换 */
function specialStrChange(str){
	if(str == undefined) return '';
	str = ((str.replace(/<(.+?)>/gi,"&lt;$1&gt;")).replace(/ /gi,"&nbsp;")).replace(/\n/gi,"<br>");
	return str;
}

/**
 * huxiangping
 *文件上传文档转换[3.0版本]
 */
function documentConversion(fileData){
	if (fileData.comeFromType == 'file') {
		//判断如果不为可读文件，直接返回调用界面回调
		fileData.dataType = 1;
		fileData.interfaceDataId = fileData.fileId;
		if(!tmCheckDocument(fileData.suffix)){
			common_filter_save(fileData);
			return false;
		}
	} else if (fileData.comeFromType == 'image') {
		fileData.dataType = 2;
		common_filter_save(fileData);
		return false;
	} else if (fileData.comeFromType == 'video') {
		fileData.dataType = 3;
		common_filter_save(fileData);
		return false;
	}
	var documentId = fileData.fileId;
	var documentName = fileData.fileName;
	var fileUrl = fileData.fileUrl;
	var swfUrl = fileData.swfUrl;
	var fileSize = fileData.size;
	var suffix = fileData.suffix;
	//如果上传文档判断文档是否转换成功
	if(swfUrl == undefined || swfUrl == ''){
		common_filter_save(fileData);
		return false;
	}else{
		fileData.filePath = "http://base1.zhihuishu.com/able-commons/resources/demos/ablefilebrowser/swfReader.jsp?id="+fileData.fileId;
		common_filter_save(fileData);
		return false;
	}
}

$.tmArray = {
	/*each和map的功能是一样的*/	
	each : function(arr,fn){
		fn = fn || Function.K;
		var a = [];
		var args = Array.prototype.slice.call(arguments, 1);
		for(var i = 0; i < arr.length; i++){
			var res = fn.apply(arr,[arr[i],i].concat(args));
			if(res != null) a.push(res);
		}
		return a;
	},
	/*each和map的功能是一样的*/	
	map : function(arr,fn,thisObj){
		var scope = thisObj || window;
		var a = [];
		for ( var i=0, j=arr.length; i < j; ++i ) {
			var res = fn.call(scope, arr[i], i, this);
			if(res != null) a.push(res);
		}
		return a;
	},
	orderBy : function(array,sortFlag){
		var $arr = array;
		if(sortFlag=='asc'){
			$arr.sort(this._numAscSort);
		}else if(sortFlag=='desc'){
			$arr.sort(this._numDescSort);
		}else{
			$arr.sort(this._numAscSort);
		}
		return $arr;
	},
	// 求两个集合的并集
	union : function(a, b){
		 var newArr = a.concat(b);
		 return this.unique2(newArr);
	},
	// 求两个集合的补集
	complement :function(a,b){
		return this.minus(this.union(a,b),this.intersect(a,b));	
	},
	// 求两个集合的交集
	intersect : function(a,b){
	   a = this.unique(a);	
		return this.each(a,function(o){
			return b.contains(o) ? o : null;
		});
	},
	//求两个集合的差集
	minus : function(a,b){
		a = this.unique(a);	
		return this.each(a,function(o){
			return b.contains(o) ? null : o;
		});
	},
	max : function(arr){
		return Math.max.apply({},arr) ;
	},
	min : function(arr){
		return Math.min.apply({},arr) ;
	},
	unique :function(arr){
		 var ra = new Array();
		 for(var i = 0; i < arr.length; i ++){
			 if(!ra.contains(arr[i])){
			 //if(this.contains(ra,arr[i])){	
				ra.push(arr[i]);
			 }
		 }
		 return ra;
	},
	unique2 : function(arr){
		for ( var i = 0; i < arr.length; i++) {
			for ( var j = i + 1; j < arr.length;) {
				if (arr[j] == arr[i]) {
					arr.splice(j, 1);
				} else {
					j++;
				}
			}
		}
		return arr;
	},
	indexOf : function(arr,val){
		for ( var i = 0; i < arr.length; i++) {
			if (arr[i] == val)
				return i;
		}
		return -1;	
	},
	contains : function(arr,val){
		return this.indexOf(arr,val) !=-1 ? true : false;
	},
	remove : function(arr,index){
		var index = this.indexOf(arr,index);
		if (index > -1) {
			arr.splice(index, 1);
		}
		return arr;
	},
	removeObject : function(arr,item){
		for ( var i = 0; i < arr.length; i++) {
			var jsonData = arr[i];
			for ( var key in jsonData) {
				if (jsonData[key] == item) {
					arr.splice(i, 1);
				}
			}
		}
		return arr;
	},
	toArray : function(arrString,sp){
		if(sp==undefined)sp=",";
		if(arrString==undefined)return this;
		var arrs = arrString.split(sp);
		return arrs;
	},
	_numAscSort :function(a,b){
		 return a-b;
	},
	_numDescSort :function(a,b){
		return b-a;
	},
	_sortAsc : function(x, y){
		if(x>y){
			return 1;
		}else{
			return -1;
		}
	},
	_sortDesc : function (x, y){
		if(x>y){
			return -1;
		}else{
			return 1;
		}
	},
	keyMap : function(arr1,arr2,flag){
		if(arr1.length==arr2.length){
			var jsonData = {};
			var cdata = {};
			for(var i=0;i<arr1.length;i++){
				if(arr1[i] == arr2[i]){
					jsonData[arr1[i]] = arr2[i];
				}else{
					cdata[arr1[i]] = arr2[i];
				}
			}
			if(flag){
				return jsonData;
			}else{
				return cdata; 
			}
		}
	}
 };

/*判断一个元素释放包含在数组中。*/
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}

/* 文件在线预览  
 * dataId 文件id 
 *  dataType 文件类型
 *  url 文件路径
 *  name  文件名
 */
function filePreview(dataId,dataType,url,name){
	if(dataType == 1){
		if(url.indexOf('document/view/') > 0 || url.indexOf('swfReader.jsp?id=') > 0){
			window.open(url);
			return;
		}else{
			window.open(jsonPath+"/data/downloadMaterial?dataDto.name="+name+"&dataDto.url=" + url);
		}
	}
}

/* 文件在线预览  
 * dataId 文件id 
 *  dataType 文件类型
 *  url 文件路径
 *  name  文件名
 */
function filePreviewIframe(url,name,id,suffix){
	if(name.lastIndexOf('.') == -1){
		if(suffix != undefined){
			name = name + '.' + suffix;
		}
	}
	if(url.indexOf('document/view/') > 0){
		window.open(url);
		return;
	}
	if(url.indexOf('swfReader.jsp?id=') > 0){
		$.tmDialog.iframe({ title:"文档预览",showBtn:false,btnArrow:"center",pos:"absolute",appendClass:"docDownPop",url:url,top:$(window.top.document).scrollTop(),offsetTop:-10,width:860,height:520,callback:function(iframe,$dialog,$parent,opts){ 
			if($dialog && iframe && $parent){ 
				
			}
		},loadSuccess:function($iframe,$dialog,opts){
			 $(".box_popboxes").append('<input type="button" class="docDownBtn" onclick="downLoadFile('+id+',\''+name+'\')" value="下载" />');
		}});
 	
		return;
	}else{
		name = encodeURI(encodeURI(name));
		window.open(jsonPath+"/data/downloadMaterial?dataDto.name="+name+"&dataDto.url=" + url);
	}
	
}

/*文件下载*/
function downLoadFile(id,name,suffix){
	
	var url = jsonPath+"/data/downloadMaterial?dataDto.dataId="+id+"&dataDto.name="+name;
	url = encodeURI(encodeURI(url));
	window.open(url,"_self");
}
