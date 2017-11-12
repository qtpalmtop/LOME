
/* 
 * 用户菜单,用于对外跨越调用
 * @author zt
 * @date 2014/04/29
 */
var $USER_HEADMENU = {};

/*
 * 创建节点
 */
$USER_HEADMENU.appendObj = function(obj,attributes,textNode){
	var object = document.createElement(obj);
	for(var name in attributes){
		object.setAttribute(name,attributes[name]);
	}
	
	if(textNode){
		object_textNode = document.createTextNode(textNode);
		object.appendChild(object_textNode);
	}
	return object;
};

/*
 * 显示菜单
 */
$USER_HEADMENU.showMenus = function(data){
	try{
		console.log("no zuo no die...");
	}catch(e){}
	
	var headerMenuBoxDiv = $USER_HEADMENU.appendObj('div',{"class":"headerMenuBox"},null);
	var headerMenuDiv = $USER_HEADMENU.appendObj('div',{"class":"headerMenu clearfix"},null);
	var headerMenuDiv_a = $USER_HEADMENU.appendObj('a',{"href":menuPath,"title":"智慧树首页","target":"_self","class":"headerMenu_logo"},null);
	var headerMenuDiv_a_img = $USER_HEADMENU.appendObj('img',{"src":menuPath+"web/images/common/menuLogo.png","alt":"智慧树,www.zhihuishu.com"},null);
	headerMenuDiv_a.appendChild(headerMenuDiv_a_img);
	headerMenuDiv.appendChild(headerMenuDiv_a);
	
	var headerMenuDiv_h1 = $USER_HEADMENU.appendObj('h1',{"class":"headerMenu_line"},"中国最大的MOOC式在线互动学堂");
	headerMenuDiv.appendChild(headerMenuDiv_h1);
	
	if(data.msg == "failure"){//未登陆
		var loginregLink = $USER_HEADMENU.appendObj('ul',{"class":"headerMenu_lgRg"},null);
		var loginregLinkLi = $USER_HEADMENU.appendObj('li',null);
		var loginregLinkLi_a = $USER_HEADMENU.appendObj('a',{"href":menuPath+"web/index.jsp?service=http://www.zhihuishu.com/home","title":"登录","target":"_self"},'登录');
		var loginregLinkLi2 = $USER_HEADMENU.appendObj('li',null);
		var loginregLinkLi_a2 = $USER_HEADMENU.appendObj('a',{"href":menuPath+"web/register/pages/registerStep.jsp","title":"注册","target":"_self"},'注册')
		loginregLinkLi.appendChild(loginregLinkLi_a);
		loginregLinkLi2.appendChild(loginregLinkLi_a2);
		loginregLink.appendChild(loginregLinkLi);
		loginregLink.appendChild(loginregLinkLi2);
		
		headerMenuDiv.appendChild(loginregLink);
	}else if(data.msg == "success"){//已登陆
		var header_userInfoDiv = $USER_HEADMENU.appendObj('div',{"class":"header_userInfo"},null);
		var userInfo_headerSpan = $USER_HEADMENU.appendObj('span',{"class":"userInfo_header"},null);
		var userInfo_headerSpan_img = $USER_HEADMENU.appendObj('img',{"src":data.headPic,"width":"20","height":"20","alt":"用户头像"},null);
		userInfo_headerSpan.appendChild(userInfo_headerSpan_img);
		header_userInfoDiv.appendChild(userInfo_headerSpan);
		
		var userInfo_userName_a = $USER_HEADMENU.appendObj('a',{"href":"javascript:void(0);","class":"userInfo_userName"},data.realName);
		header_userInfoDiv.appendChild(userInfo_userName_a);
		
		var em = $USER_HEADMENU.appendObj('em',{"class":"userInfo_arrow"});
		header_userInfoDiv.appendChild(em);
		
		var noticeTips_a = $USER_HEADMENU.appendObj('a',{"href":"javascript:void(0);","title":"您有未读通知","style":"display: none;"},null);
		header_userInfoDiv.appendChild(noticeTips_a);
		
		var userLinksDiv = $USER_HEADMENU.appendObj('div',{"class":"userLinks","style":"display: none;"},null);
		var userLinksDiv_em = $USER_HEADMENU.appendObj('em',{"class":"userLinks_arrow"});
		userLinksDiv.appendChild(userLinksDiv_em);
		
		var userLinksDiv_ul = $USER_HEADMENU.appendObj('ul',null,null);
		var userLinksDiv_ul_li1 = $USER_HEADMENU.appendObj('li',null);
		var userLinksDiv_ul_li1_a = $USER_HEADMENU.appendObj('a',{"href":"http://online.zhihuishu.com/onlineSchool","target":"_self","class":"userLinks_item"},"在线学堂");
		userLinksDiv_ul_li1.appendChild(userLinksDiv_ul_li1_a);
		userLinksDiv_ul.appendChild(userLinksDiv_ul_li1);
		
		//myuni
		if(data.msg == "success"){
			if(data.isRole == "1"){//有权限
				var userLinksDiv_ul_li2 = $USER_HEADMENU.appendObj('li',{"id":"myschool"});
				var userLinksDiv_ul_li2_a = $USER_HEADMENU.appendObj('a',{"href":"http://myuni.zhihuishu.com","target":"_self","class":"userLinks_item"},"My University");
				userLinksDiv_ul_li2.appendChild(userLinksDiv_ul_li2_a);
				userLinksDiv_ul.appendChild(userLinksDiv_ul_li2);
			}
		}
		
		//添加mycu图标
		var userLinksDiv_ul_li3 = $USER_HEADMENU.appendObj('li',{"id":"isShowMyCU","display":"none"});
		var userLinksDiv_ul_li3_a = $USER_HEADMENU.appendObj('a',{"href":"javascript:void(0);","target":"_self","class":"userLinks_item"},"MyCU");
		userLinksDiv_ul_li3.appendChild(userLinksDiv_ul_li3_a);
		userLinksDiv_ul.appendChild(userLinksDiv_ul_li3);
		
		
		// 消息
		var userLinksDiv_ul_li4 = $USER_HEADMENU.appendObj('li',{"class":"noticeItem"});
		var userLinksDiv_ul_li4_a = $USER_HEADMENU.appendObj('a',{"href":"http://www.zhihuishu.com/notification/home","target":"_self","class":"userLinks_item"},"消息中心");
		var userLinksDiv_ul_li4_a2 = $USER_HEADMENU.appendObj('a',{"id":"noti-tip","href":"javascript:void(0);","title":"您有未读通知","class":"noticeTips"},null);
		userLinksDiv_ul_li4.appendChild(userLinksDiv_ul_li4_a);
		userLinksDiv_ul_li4.appendChild(userLinksDiv_ul_li4_a2);
		userLinksDiv_ul.appendChild(userLinksDiv_ul_li4);
		
		var userLinksDiv_ul_li5 = $USER_HEADMENU.appendObj('li',null);
		var userLinksDiv_ul_li5_a = $USER_HEADMENU.appendObj('a',{"href":"http://user.zhihuishu.com/index.action","target":"_self","class":"userLinks_item"},"智慧空间");
		userLinksDiv_ul_li5.appendChild(userLinksDiv_ul_li5_a);
		userLinksDiv_ul.appendChild(userLinksDiv_ul_li5);
		
		var userLinksDiv_ul_li6 = $USER_HEADMENU.appendObj('li',null);
		var userLinksDiv_ul_li6_a = $USER_HEADMENU.appendObj('a',{"href":menuPath+"logout.do","target":"_self","class":"userLinks_item"},"退出");
		userLinksDiv_ul_li6.appendChild(userLinksDiv_ul_li6_a);
		userLinksDiv_ul.appendChild(userLinksDiv_ul_li6);
		
		userLinksDiv.appendChild(userLinksDiv_ul);
		header_userInfoDiv.appendChild(userLinksDiv);
		headerMenuDiv.appendChild(header_userInfoDiv);
	}
	
	var headerMenu_menuUL = $USER_HEADMENU.appendObj('ul',{"class":"headerMenu_menu"},null);
	var headerMenu_menuUL_li1 = $USER_HEADMENU.appendObj('li',null);
	var headerMenu_menuUL_li1_dl = $USER_HEADMENU.appendObj('dl',{"style":"margin-top: 0px;"});
	var headerMenu_menuUL_li1_dt = $USER_HEADMENU.appendObj('dt',null);
	var headerMenu_menuUL_li1_dt_a = $USER_HEADMENU.appendObj('a',{"href":"http://user.zhihuishu.com","target":"_self","title":"首页"},"首页");
	var headerMenu_menuUL_li1_dd = $USER_HEADMENU.appendObj('dd',null);
	var headerMenu_menuUL_li1_dd_a = $USER_HEADMENU.appendObj('a',{"href":"http://user.zhihuishu.com","target":"_self","title":"首页"},"首页");
	
	headerMenu_menuUL_li1_dt.appendChild(headerMenu_menuUL_li1_dt_a);
	headerMenu_menuUL_li1_dd.appendChild(headerMenu_menuUL_li1_dd_a);
	headerMenu_menuUL_li1_dl.appendChild(headerMenu_menuUL_li1_dt);
	headerMenu_menuUL_li1_dl.appendChild(headerMenu_menuUL_li1_dd);
	headerMenu_menuUL_li1.appendChild(headerMenu_menuUL_li1_dl);
	headerMenu_menuUL.appendChild(headerMenu_menuUL_li1);
	
	var headerMenu_menuUL_li2 = $USER_HEADMENU.appendObj('li',null);
	var headerMenu_menuUL_li2_dl = $USER_HEADMENU.appendObj('dl',{"style":"margin-top: 0px;"});
	var headerMenu_menuUL_li2_dt = $USER_HEADMENU.appendObj('dt',null);
	var headerMenu_menuUL_li2_dt_a = $USER_HEADMENU.appendObj('a',{"href":"http://www.zhihuishu.com/course","target":"_self","title":"课程"},"课程");
	var headerMenu_menuUL_li2_dd = $USER_HEADMENU.appendObj('dd',null);
	var headerMenu_menuUL_li2_dd_a = $USER_HEADMENU.appendObj('a',{"href":"http://www.zhihuishu.com/coursem","target":"_self","title":"课程"},"课程");
	
	headerMenu_menuUL_li2_dt.appendChild(headerMenu_menuUL_li2_dt_a);
	headerMenu_menuUL_li2_dd.appendChild(headerMenu_menuUL_li2_dd_a);
	headerMenu_menuUL_li2_dl.appendChild(headerMenu_menuUL_li2_dt);
	headerMenu_menuUL_li2_dl.appendChild(headerMenu_menuUL_li2_dd);
	headerMenu_menuUL_li2.appendChild(headerMenu_menuUL_li2_dl);
	headerMenu_menuUL.appendChild(headerMenu_menuUL_li2);
	
	
	var headerMenu_menuUL_li3 = $USER_HEADMENU.appendObj('li',null);
	var headerMenu_menuUL_li3_dl = $USER_HEADMENU.appendObj('dl',{"style":"margin-top: 0px;"});
	var headerMenu_menuUL_li3_dt = $USER_HEADMENU.appendObj('dt',null);
	var headerMenu_menuUL_li3_dt_a = $USER_HEADMENU.appendObj('a',{"href":"http://www.zhihuishu.com/video/home","target":"_self","title":"直播"},"直播");
	var headerMenu_menuUL_li3_dd = $USER_HEADMENU.appendObj('dd',null);
	var headerMenu_menuUL_li3_dd_a = $USER_HEADMENU.appendObj('a',{"href":"http://www.zhihuishu.com/video/home","target":"_self","title":"直播"},"直播");
	
	headerMenu_menuUL_li3_dt.appendChild(headerMenu_menuUL_li3_dt_a);
	headerMenu_menuUL_li3_dd.appendChild(headerMenu_menuUL_li3_dd_a);
	headerMenu_menuUL_li3_dl.appendChild(headerMenu_menuUL_li3_dt);
	headerMenu_menuUL_li3_dl.appendChild(headerMenu_menuUL_li3_dd);
	headerMenu_menuUL_li3.appendChild(headerMenu_menuUL_li3_dl);
	headerMenu_menuUL.appendChild(headerMenu_menuUL_li3);
	
	var headerMenu_menuUL_li4 = $USER_HEADMENU.appendObj('li',null);
	var headerMenu_menuUL_li4_dl = $USER_HEADMENU.appendObj('dl',{"style":"margin-top: 0px;"});
	var headerMenu_menuUL_li4_dt = $USER_HEADMENU.appendObj('dt',null);
	var headerMenu_menuUL_li4_dt_a = $USER_HEADMENU.appendObj('a',{"href":"javascript:void(0);","target":"_self","title":"大学"},"大学");
	var headerMenu_menuUL_li4_dd = $USER_HEADMENU.appendObj('dd',null);
	var headerMenu_menuUL_li4_dd_a = $USER_HEADMENU.appendObj('a',{"href":"javascript:void(0);","target":"_self","title":"大学"},"大学");
	
	headerMenu_menuUL_li4_dt.appendChild(headerMenu_menuUL_li4_dt_a);
	headerMenu_menuUL_li4_dd.appendChild(headerMenu_menuUL_li4_dd_a);
	headerMenu_menuUL_li4_dl.appendChild(headerMenu_menuUL_li4_dt);
	headerMenu_menuUL_li4_dl.appendChild(headerMenu_menuUL_li4_dd);
	headerMenu_menuUL_li4.appendChild(headerMenu_menuUL_li4_dl);
	headerMenu_menuUL.appendChild(headerMenu_menuUL_li4);
	
	var headerMenu_menuUL_li5 = $USER_HEADMENU.appendObj('li',{"id":"socialGroup"});
	var headerMenu_menuUL_li5_dl = $USER_HEADMENU.appendObj('dl',{"style":"margin-top: 0px;"});
	var headerMenu_menuUL_li5_dt = $USER_HEADMENU.appendObj('dt',null);
	var headerMenu_menuUL_li5_dt_a = $USER_HEADMENU.appendObj('a',{"href":"http://www.zhihuishu.com/socialGroup/home","target":"_self","title":"社团"},"社团");
	var headerMenu_menuUL_li5_dd = $USER_HEADMENU.appendObj('dd',null);
	var headerMenu_menuUL_li5_dd_a = $USER_HEADMENU.appendObj('a',{"href":"http://www.zhihuishu.com/socialGroup/home","target":"_self","title":"社团"},"社团");
	
	headerMenu_menuUL_li5_dt.appendChild(headerMenu_menuUL_li5_dt_a);
	headerMenu_menuUL_li5_dd.appendChild(headerMenu_menuUL_li5_dd_a);
	headerMenu_menuUL_li5_dl.appendChild(headerMenu_menuUL_li5_dt);
	headerMenu_menuUL_li5_dl.appendChild(headerMenu_menuUL_li5_dd);
	headerMenu_menuUL_li5.appendChild(headerMenu_menuUL_li5_dl);
	headerMenu_menuUL.appendChild(headerMenu_menuUL_li5);
	
	headerMenuDiv.appendChild(headerMenu_menuUL);
	headerMenuBoxDiv.appendChild(headerMenuDiv);
	//document.body.appendChild(headerMenuBoxDiv);	
	document.getElementById("menu").appendChild(headerMenuBoxDiv);	
};

/**
 * params
 * 		--参数:JSON格式
 * url
 * 		--请求路径
 * callback
 * 		--回调函数
 * showError 
 * 		---是否显示错误信息(可选)
 * 异常Ajax请求
 */
$USER_HEADMENU.ajaxUrl = function(params,url,callback,showError){
	$.ajax({
		 type: 'POST', 
	     url:url,
	     data: params, 
	     dataType:'json', 
	     success:callback,
	     error:function(XMLHttpRequest, textStatus, errorThrown){ 
	    	 if(showError){
	    		 alert("服务器异常,请稍候再试试!");
	    	 }
	     } 
	});
};

/*
 * 添加javascript标签
 */
$USER_HEADMENU.addScriptTag = function(src){
	var script = document.createElement('script');
	script.setAttribute("type","text/javascript");
	script.src = src;
	document.body.appendChild(script);
};

$USER_HEADMENU.callBack = function(data){
	$USER_HEADMENU.showMenus(data);
};


/*是否显示MyCU @author zt*/
$USER_HEADMENU.getMyCUByUserId = function(userName){
	if(userName){
		if(userName != null){
			$.ajax({  
                type: "get",  
                url: "http://user.zhihuishu.com/user/league_getMyCUByUserId2.do",  
                data: { "userName":userName},  
                dataType : "jsonp",  
                jsonp: "callback",  
                async: false,  
                cache: false,  
                success: function(data){  
                	if(data){
   				     if(data.msg == "success"){
   				        $("#isShowMyCU a").attr("href","http://mycu.zhihuishu.com/loginSystem");
   				        $("#isShowMyCU").show();
   				     }else{
   				    	 $("#isShowMyCU a").attr("href","javascritp:void(0);");
   					     $("#isShowMyCU").hide();
   				     }
   				   }
                }  
             });
		}			 
	}   
};

//获取message消息
$USER_HEADMENU.userGetMsg = function(userId){
	if(userName){
		if(userName != null){
			$.ajax({  
                type: "get",  
                url: "http://msgcenter.base1.zhihuishu.com/able-base-msgcenter/http/findMsgCnt",  
                data: { "userId":userId},  
                dataType : "jsonp",  
                jsonp: "callback",  
                async: false,  
                cache: false,  
                success: function(json){  
	                 if(json.rt>0){
	 					$("#noti-tip").text(json.rt);
	 					$("#noti-tip").show();
	 					$("#noti-tip_no").text(json.rt);
	 					$("#noti-tip_no").show();
	 				}else{
	 					$("#noti-tip").text("");
	 					$("#noti-tip").hide();
	 					$("#noti-tip_no").text("");
	 					$("#noti-tip_no").hide();
	 				}
                }  
             }); 
		}
		
	}
};

//获取购物车
$USER_HEADMENU.getShopCart = function(){
	$('.mycart .badge').shopcart('getCount');
}

//初始化
$USER_HEADMENU.init = function(userName){
	// 验证用户是否登陆 
	if(userName){
		if(userName != null){
			var params = {};
			params.userName = userName
			//$USER_HEADMENU.ajaxUrl(params,menuPath+'user/isUserLogin.do',$USER_HEADMENU.initData,false);
			//
			$.ajax({  
                type: "get",  
                url: "http://user.zhihuishu.com/user/isUserLogin2.do",  
                data: params,  
                dataType : "jsonp",  
                jsonp: "callback",  
                async: false,  
                cache: false,  
                success: function(data){  
					if(data.msg == "success"){//已登陆
						$(".header_userInfo .userInfo_header img").attr("src",data.headPic);
						$(".header_userInfo .userInfo_userName").text(data.realName);	
						if(data.isRole == "1"){//有权限
							$("#myschool").show();
						}else{
							$("#myschool").hide();
						}
						if (data.isMyinst == "1") {// 有权限
							$("#myinst").show();
						} else {
							$("#myinst").hide();
						}
					}
                }  
             }); 
			//$USER_HEADMENU.ajaxUrl('',menuPath+'user/isUserLogin.do',$USER_HEADMENU.callBack,false);
			//$USER_HEADMENU.getShopCart();
		 	$USER_HEADMENU.userGetMsg(userName);		 	
		 	$USER_HEADMENU.getMyCUByUserId(userName);//是否显示MyCU
		}else{
			var data = {};
			data.msg= "failure";
			$USER_HEADMENU.showMenus(data);
		}
	}else{
		var data = {};
		data.msg= "failure";
		$USER_HEADMENU.showMenus(data);
	}
};

$USER_HEADMENU.initMenu = function(userName,userId){
	// 验证用户是否登陆 
//	if(userName){
//		if(userName != null){
//			var params = {};
//			params.userName = userName
//			//$USER_HEADMENU.ajaxUrl(params,menuPath+'user/isUserLogin.do',$USER_HEADMENU.initData,false);
//			//
//			$.ajax({  
//                type: "get",  
//                url: "http://user.zhihuishu.com/user/isUserLogin2.do",  
//                data: params,  
//                dataType : "jsonp",  
//                jsonp: "callback",  
//                async: false,  
//                cache: false,  
//                success: function(data){  
//					if(data.msg == "success"){//已登陆
//						$(".header_userInfo .userInfo_header img").attr("src",data.headPic);
//						$(".header_userInfo .userInfo_userName").text(data.realName);	
//						if(data.isRole == "1"){//有权限
//							$("#myschool").show();
//						}else{
//							$("#myschool").hide();
//						}
//						if (data.isMyinst == "1") {// 有权限
//							$("#myinst").show();
//						} else {
//							$("#myinst").hide();
//						}
//					}
//                }  
//             });  		 	
//		 	$USER_HEADMENU.getMyCUByUserId(userName);//是否显示MyCU
//		}
//	}
	
	// 验证用户是否登陆
	var loginInfo = jQuery.parseJSON($.cookie('CASLOGC'));//获取cookie
	if(loginInfo != null) {
		var realName = loginInfo.realName;
		var loginUserId = loginInfo.userId;
		var username = loginInfo.username;
		var headPic = loginInfo.headPic;
		var myuni = loginInfo.myuniRole;
		var mycu = loginInfo.mycuRole;
		var myinst = loginInfo.myinstRole;
		if(realName && loginUserId && username) {
			$(".header_userInfo .userInfo_header img").attr("src", headPic);//显示头像
			$(".header_userInfo .userInfo_userName").text(realName);//显示姓名
			if(myuni == "1") {// 有权限
				$("#myschool").show();
			} else {
				$("#myschool").hide();
			}
			if(mycu == "1") {// 有权限
				$("#isShowMyCU a").attr("href", "http://mycu.zhihuishu.com/loginSystem");
				$("#isShowMyCU").show();
			} else {
				$("#isShowMyCU a").attr("href", "javascritp:void(0);");
				$("#isShowMyCU").hide();
			}
			if(myinst == "1") {// 有权限
				$("#myinst").show();
			} else {
				$("#myinst").hide();
			}
		}
	}
	if(userId){
		if(userId!=null){
			$USER_HEADMENU.userGetMsg(userId);
		}
	}
};

$USER_HEADMENU.initData = function(data){
	if(data.msg == "success"){//已登陆
		$(".header_userInfo .userInfo_header img").attr("src",data.headPic);
		$(".header_userInfo .userInfo_userName").text(data.realName);	
		if(data.isRole == "1"){//有权限
			$("#myschool").show();
		}else{
			$("#myschool").hide();
		}
		if (data.isMyinst == "1") {// 有权限
			$("#myinst").show();
		} else {
			$("#myinst").hide();
		}
	}
};

$USER_HEADMENU.coursereg = function(data) {
	
	if(data) {
		var r = confirm("新学期报到需要退出当前登录账号，请确认是否需要退出");
		if(r==true) {
			window.location.href="http://user.zhihuishu.com/web/pages/courseregistration/course_registration_01.jsp"; 
		} else {
			
		}
	} else {
		window.location.href="http://user.zhihuishu.com/web/pages/courseregistration/course_registration_01.jsp"; 
	}
	
};

$(function(){
	/*$(".header_userInfo").live("click",function(){
		var flag = $('.header_userInfo .userLinks').is(":hidden");
		if(flag){
			$(this).find('.userLinks').show();
		}else{
			$(this).find('.userLinks').hide();
		}
	});

  $(document).bind("click",function(e){ 
		var target = $(e.target); 
		if(target.closest(".header_userInfo").length == 0){ 
			$(this).find('.userLinks').hide();
		} 
	});*/
	
	$(".header_userInfo").hover(function(){
		if(!$(this).find('.userLinks').is(":animated")){
			$(this).find('.userLinks').show();
		}
	},function(){
		$(this).find('.userLinks').hide();
	})
	
  /*$(".header_userInfo").live("hover",function(){
		 if($(".header_userInfo").hasClass("open")){
			 $(".header_userInfo").removeClass("open");
	     }else{
			 $(".header_userInfo").addClass("open");
		 }
	});*/
  
/*	$('.header_userInfo').hoverIntent({
		sensitivity: 7,
		interval: 100,
		over: function(){
			$(this).find('.userLinks').show();
		},
		timeout:200,
		out: function(){
			$(this).find('.userLinks').hide();
		}
	});*/
	
	$(".headerMenu_menu li").hover(function(){
		if(!$(this).children("dl").is(":animated")){
			$(this).children("dl").animate({marginTop : '-26px'}, 200);
		}
	},function(){
		$(this).children("dl").animate({marginTop : '0'}, 200);
	});
	
	//固定菜单
	$(window).scroll(function(){
		/*var scrollTop = $(window).scrollTop();
		if(scrollTop != 0){
			 $('.headerMenuBox').stop().animate({'opacity':'0.2'},400);
		}else{
			 $('.headerMenuBox').stop().animate({'opacity':'1'},400);
		}*/
		/*if( $(window).scrollTop()>205 & $(window).width() > 1200 ){
			$('.headerMenuBox').addClass('headerMenuBox_fix');
		} else if($(window).scrollTop()<1){
			$('.headerMenuBox').removeClass('headerMenuBox_fix');
		}*/
	});
	
	//固定菜单
//	$(window).scroll(function(){
//		var scrollTop = $(window).scrollTop();
//		if(scrollTop != 0){
//			 $('.headerMenuBox').stop().animate({'opacity':'0.2'},400);
//		}else{
//			 $('.headerMenuBox').stop().animate({'opacity':'1'},400);
//		}
//	});
//	
//	$(".headerMenuBox").hover(function(e){
//		var scrollTop = $(window).scrollTop();
//		if(scrollTop != 0){
//			 $('.headerMenuBox').stop().animate({'opacity':'1'},400);
//		}
//	},function(e){
//		var scrollTop = $(window).scrollTop();
//		if(scrollTop != 0){
//			 $('.headerMenuBox').stop().animate({'opacity':'0.2'},400);
//		}
//	});
	
	//JPlaceHolder.init();  
});
/*var JPlaceHolder = {
    //检测
    _check : function(){
        return 'placeholder' in document.createElement('input');
    },
    //初始化
    init : function(){
        if(!this._check()){
            this.fix();
        }
    },
    //修复
    fix : function(){
        jQuery(':input[placeholder]').each(function(index, element) {
            var self = $(this), txt = self.attr('placeholder');
            self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none'}));
            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left');
            var holder = $('<span></span>').text(txt).css({position:'absolute', left:pos.left, top:pos.top, height:h, lineHeight:h+'px', paddingLeft:paddingleft,textIndent:'12px', color:'#aaa'}).appendTo(self.parent());
            self.focusin(function(e) {
                holder.hide();
            }).focusout(function(e) {
                if(!self.val()){
                    holder.show();
                }
            });
            holder.click(function(e) {
                holder.hide();
                self.focus();
            });
        });
    }
};*/