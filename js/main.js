var EDU = (function(){
    // 工具函数
    // 获取cookie键值对对象
    var getCookie = function(){
        var cookie = {},
            all = document.cookie;
        if(all === ""){
            return cookie;
        }
        var list = all.split(";");
        for(var i=0;i<list.length;i++){
            var item = list[i].trim(),
                p = item.indexOf("=");
                name = item.substring(0,p);
            name = decodeURIComponent(name);
            var value = item.substring(p+1);
            value = decodeURIComponent(value);
            cookie[name] = value;
        }
        return  cookie;
    }

    // 设置cookie
    var setCookie = function(name,value,daysToLive){
        var cookie = name + "=" + encodeURIComponent(value);
        if(typeof daysToLive === 'number')
            cookie += "; expires=" + (daysToLive*60*60*24);
        document.cookie = cookie;
    }

    // 对传入的对象进行编码并连接
    var encodeFormData = function(data){
        if(!data)return "";
        var pairs = [];
        for(var name in data){
            var value = data[name].toString();
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            pairs.push(name + '=' + value);
        }
        return pairs.join("&");
    }
    console.log(getCookie().followSuc);
    // 向服务器发起请求，这里默认为get方法
    var getData =function(url,data,callback){
        var request = new XMLHttpRequest();
        request.open("GET",url + "?" + encodeFormData(data),true);
        request.onreadystatechange = function(){
            if(request.readyState == 4 && callback){
                if((request.status >= 200 && request.status <300) || request.status == 304){
                    var type = request.getResponseHeader("Content-Type");
                    callback(request);
                }else{
                    alert("request was unsuccessful: " + request.status);
                }
            }
        }
        request.send(null);
    }
    var $ = function(selector){
        return document.querySelector(selector);
    }

    // 顶部提示部分
    var tips = (function(){
        var oTips = $(".g-tips"),
            oBtnClose = $(".close");
        if(getCookie().noMoretips){
            oTips.style.display = "none";
        }
        oBtnClose.onclick = function(){
            setCookie('noMoretips',1,900);
            oTips.style.display = "none";
        }
    })()

    // 登录表单部分
    var loginForce = (function(){
        var oLoginForm = $(".g-log"),
            oBtnFollow = $(".btn"),
            oFollow = $(".follow"),
            oBtnCloseLogin = $(".fm .close"),
            oBtnLogin = $(".login"),
            followNum = $(".follow-num"),
            url = 'http://study.163.com/webDev/attention.htm';

        //通过判断followSuc的值来确定是否已经关注
        if(getCookie().followSuc === 1) {
            oBtnFollow.classList.add("btn-folled");
            oBtnFollow.firstChild.innerHTML = "√ 已关注 ";
            oBtnFollow.lastChild.style.display = "inline-block";
            followNum.innerHTML = "粉丝 46";
        }else {
            oBtnFollow.classList.remove('btn-folled');
            oBtnFollow.firstChild.innerHTML = "+ 关注";
            oBtnFollow.lastChild.style.display = "none";
            followNum.innerHTML = "粉丝 45";
        }
        //先判断loginSuc是否设置，若已设置则设置为‘已关注’，否则显示登录框
        oFollow.onclick = function() {
            if(getCookie().loginSuc) {
                forceAPI(forceed);
            }else {
                oLoginForm.style.display = "block";
            }
        }

        //关闭登录框
        oBtnCloseLogin.onclick = function() {
            oLoginForm.style.display = "none";
        }

        //取得表单数据,并对其进行MD5加密
        var getFormData = function() {
            var oUserName = $("#account"),
                oPaasword = $("#password"),
                userName = oUserName.value,
                password = oPaasword.value,
                data = {
                    userName: md5(userName),
                    password: md5(password)
            };
            return data;
        }

        //登录后的回调函数，设置loginSuc为1，‘已关注’
        var loginCallback = function(req) {
            if(parseInt(req.responseText) === 1) {
                setCookie("loginSuc",1,100);
                forceAPI(forceed);
                oBtnCloseLogin.onclick();
                alert("登录成功");
            } else {
                alert('登录失败,请输入正确的账号');
                oBtnCloseLogin.onclick();
            }
        }

        //登录
        oBtnLogin.onclick = function(req) {

            var url = 'http://study.163.com/webDev/login.htm',
                data = getFormData();
            getData(url,data,loginCallback);
        }

        // 关注API
        var forceAPI = function(callback) {
            getData(url,{},callback);
        }

        // 关注后的dom操作
        var forceed = function(request) {
            if(request.responseText == '1') {
                oBtnFollow.classList.add("btn-folled");
                oBtnFollow.firstChild.innerHTML = "√ 已关注 ";
                oBtnFollow.lastChild.style.display = "inline-block";
                followNum.innerHTML = "粉丝 46";
                setCookie("followSuc",1,10);
            }else {
                alert('关注失败')
            }
        }

        // 取消关注后的dom操作
        var cancel = function(request){
            if(request.responseText == '1'){
                oBtnFollow.classList.remove('btn-folled');
                oBtnFollow.firstChild.innerHTML = "+ 关注";
                oBtnFollow.lastChild.style.display = "none";
                followNum.innerHTML = "粉丝 45";
                setCookie("followSuc",0,10);
            }else {
                alert('取消关注失败')
            }
        }

        //点击取消后取消关注
        oBtnFollow.lastChild.onclick = function(){
            forceAPI(cancel);
        }

        })();

    //图片轮播部分
    var picPlay = (function(){
        var banner = $(".g-mnc1"),
            picList = $(".sld"),
            buttons = $(".g-mnc1 .btn").getElementsByTagName("span"),
            len = 3,
            index = 1,
            animated,
            timerPlay,
            timerFade;
        /*图片切换函数
        参数说明：
        offset：图片容器要在垂直方向上移动的距离*/
        var animate = function(offset){
            var nContainerTop = parseInt(picList.style.top) + offset,
                nTime = 500,
                nInterval =500,
                speed = offset/(nTime/nInterval);
            var go = function(){
                if (( parseInt(picList.style.top) < nContainerTop && speed > 0)||(parseInt(picList.style.top) > nContainerTop && speed < 0) ) {
                    picList.style.top = parseInt(picList.style.top) + speed + "px";
                    setTimeout(go, nInterval);
                    animated = true;
                }else{
                    picList.style.top = nContainerTop + "px";
                    // 显示第一幅图片时的图图片容器top为0px，若循坏到第四幅图则马上跳到第一幅
                    if (nContainerTop < -420*(len-1)) {
                        picList.style.top =  "0px";
                    }
                    animated = false;
                    }

                }
            go();
        }
        //淡入函数
        var fadeinTime = function(){
            if(picList.style.opacity < 1){
                picList.style.opacity = parseFloat(picList.style.opacity) + 0.01
                timerFade = setTimeout(fadeinTime,5);
            }else{
                picList.style.opacity = 1;
                clearTimeout(timerFade);
                }
            }

        //自动播放
        var play = function() {
            timerPlay = setTimeout(function () {
                nextPic();
                play();
            }, 5000);
        }
        play();
        //悬停
        var stop = function(){
            clearTimeout(timerPlay,timerFade);
        }
        banner.onmouseover = stop;
        banner.onmouseout = play;
        //小黑点跟随图片移动
        var showButton =  function() {
                for (var i = 0; i < buttons.length ; i++) {
                    if( buttons[i].className == 'on'){
                        buttons[i].className = '';
                        break;
                    }
                }
                buttons[index - 1].className = 'on';
            }

        var nextPic = function(){
            if (index == 3) {
                index = 1;
            }else{
                index += 1;
                }
            picList.style.opacity = 0.4;
            animate(-420);
            fadeinTime();
            showButton();
        }

        for (var i = 0,len = buttons.length; i < len; i++) {
            buttons[i].onclick = function(){
                if (animated) return;
                var myIndex = parseInt(this.getAttribute('index'));
                var offset = -420 * (myIndex - index);
                picList.style.opacity = 0.4;
                animate(offset);
                fadeinTime();
                index = myIndex;
                showButton();
             }
         };
    })();

    //课程列表
    var courseList = (function(){
        //若屏幕宽度小于1205px则每页返回15个
        var psize = document.body.clientWidth > 1205 ? 20 : 15,
            data;
        //请求参数生成
        var urlDataCreate = function(pageNo,type){
            data = {
                'pageNo' : pageNo,
                'psize' : psize,
                'type' : type,
            }
            return data;
        }
        var dealCourseList = function(req){
            var oListObj = JSON.parse(req.responseText),
                oUlContainer = $(".m-lst-cour ul"),
                aLiNodes = [] , sLiNode;
            for (var i = 0; i < oListObj.list.length; i++) {
                var price = oListObj.list[i].price ? '￥'+parseFloat(oListObj.list[i].price):"免费",
                    index = 20 -i;
                sLiNode ='<li class="item"'+'style="z-index:'+index+';">'+
                            '<div class="detail">'+
                                '<div class="top">'+
                                    '<img src="'+ oListObj.list[i].bigPhotoUrl +'" alt="">'+
                                    '<div class="content">'+
                                        '<p class="item-title">'+oListObj.list[i].name+'<p>'+
                                        '<p class="learnerCount">'+oListObj.list[i].learnerCount+'</p>'+
                                        '<p class="maker">发布者：'+oListObj.list[i].provider+'</p>'+
                                        '<p class="kinds">课程分类：'+oListObj.list[i].categoryName+'</p>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="descript ">'+oListObj.list[i].description+'</div>'+
                            '</div>'+
                            '<img src=' + oListObj.list[i].bigPhotoUrl + ' alt=""/>'+
                            '<div class="item-content">'+
                                '<p class="item-title"><a>'+oListObj.list[i].name+'</a></p>'+
                                '<p class="item-category">'+oListObj.list[i].categoryName+'</p>'+
                                '<p class="learnerCount">'+oListObj.list[i].learnerCount+'</p>'+
                                '<p class="price">'+price+'</p>'+
                            '</div>'+
                        '</li>'
                aLiNodes.push(sLiNode);
            }
            var li = aLiNodes.join(" ");
            oUlContainer.innerHTML = li;
            detailBox();

        }
        //课程详细弹窗
        var detailBox = function(){
            if (psize === 15) {
                var lis = document.querySelectorAll(".m-lst-cour li");
                for (var i = 0; i < lis.length; i++) {
                    lis[i].onmouseenter = function(event){
                        this.firstElementChild.style.display = "block";
                    }
                    lis[i].onmouseleave = function(event){
                        this.firstElementChild.style.display = 'none';
                    };
                }
            };
        }
        //get方法获取数据
        var getCourseList = function(pageNo,type){
            var data = urlDataCreate(pageNo,type);
            var url = "http://study.163.com/webDev/couresByCategory.htm";
            getData(url,data,dealCourseList);
        }


        //翻页
        var oDesignButton = $(".tab1"),
            oLangugeButton = $(".tab2"),
            bFirst = true,
            nCurrentNum = 1,
            j = nCurrentNum;

        /*根据变量first判断当前课程类型，
        然后再根据参数num返回对应页面的课程列表
        e为对应点击页面的事件对象*/
        var pageChange = function(num,e){
            if (bFirst) {
                getCourseList(num,10);
            }else{
                getCourseList(num,20);
            }
            // 改变数字颜色
            for (var i = 1; i < e.target.parentNode.children.length-1; i++) {
                e.target.parentNode.children[i].style.color = '#000';
            };
            e.target.style.color = '#39a030';
            nCurrentNum = num;

        }
        var numButton = $(".m-page  ul");
        //事件代理，处理冒泡上来的翻页事件
        numButton.onclick = function(event){
            var pageNum = parseInt(event.target.textContent);
            pageChange(pageNum,event);
            preShow();

        };



        /*下一页按钮，若当前页面为显示数字的最大页面，
        则生成新的页面数字，同时跳到下一页*/
        numButton.lastElementChild.onclick = function(event) {
            if (nCurrentNum%8 === 0 ) {
                for (var i =nCurrentNum + 1,z = 1; z < numButton.children.length-1; i++,z++) {
                    numButton.children[z].innerHTML = i;
                }
                pageChange(nCurrentNum + 1,event);
                j = 1;
                event.target.parentNode.children[j].style.color = '#39a030';
            }else {
                j = j + 1;
                pageChange(nCurrentNum + 1,event);
                event.target.parentNode.children[j].style.color = '#39a030';
            }

            preShow();
            event.stopPropagation();
        }

        /*上一页按钮，若当前页面为显示数字的最小页面，
        则生成新的页面数字，同时跳到上一页*/
        numButton.firstElementChild.onclick = function(event) {
            if (nCurrentNum%8 === 1) {
                for (var i = nCurrentNum - 8,z=1; z < numButton.children.length-1; z++,i++) {
                    numButton.children[z].innerHTML = i;
                }
                pageChange(nCurrentNum - 1,event);
                j = 8;
                event.target.parentNode.children[j].style.color = '#39a030';
            }else {
                j = j - 1;
                pageChange(nCurrentNum - 1,event);
                event.target.parentNode.children[j].style.color = '#39a030';
            }

            preShow();
            event.stopPropagation();
        }
        //若当前页面为第一页则上一页那六不显示
        var preShow = function() {
            if (nCurrentNum===1) {
                numButton.firstElementChild.style.display = "none";
            }else{
                numButton.firstElementChild.style.display = "inline-block";
            }
        }

        //当切换课程类型时，默认显示第一页
        var tabClick = function() {
            for (var i = 1 ,len = numButton.children.length-1; i < len; i++) {
                numButton.children[i].style.color = '#000';
            };
            nCurrentNum = 1;
            j = 1;
            preShow();
            numButton.children[1].style.color = '#39a030';
        }
        oDesignButton.onclick = function(){
            getCourseList(1,10);
            oLangugeButton.style.backgroundColor = '#fff';
            oLangugeButton.style.color = "#000";
            this.style.backgroundColor = '#39a030';
            this.style.color = "#fff";
            tabClick();
            bFirst = true;
        }
        oDesignButton.onclick();//默认显示产品设计课程

        oLangugeButton.onclick = function(){
            getCourseList(1,20);
            oDesignButton.style.backgroundColor = '#fff';
            oDesignButton.style.color = "#000";
            this.style.backgroundColor = '#39a030';
            this.style.color = "#fff";
            tabClick();
            bFirst = false;
        }
        if (nCurrentNum===1) {
                numButton.firstElementChild.style.display = "none";
                numButton.firstElementChild.nextElementSibling.style.color = '#39a030';
            }

    })();

    //最热排行
    var hotList = (function() {
        var hotListCallback = function(req){
            var oListObj = JSON.parse(req.responseText),
                oUlContainer = $(".sd4 ul"),
                nStart = 0,
                nEnd =  9;
            /*get方法返回20个课程，nStart,nEnd分别表示
            显示从第nStart个到第nEnd个的课程*/
            var createList = function(nStart,nEnd){
                var aLiNodes = [] , sLiNode;
                for (var i=nStart; i < nEnd; i++) {
                    sLiNode = '<li>'+
                                '<img src=' + oListObj[i].bigPhotoUrl + ' alt=""/>'+
                                '<div class="item-content">'+
                                    '<p class="item-title">'+oListObj[i].name+'</p>'+
                                    '<p class="hotcount">'+oListObj[i].learnerCount+'</p>'+
                                '</div>'+
                                '</li>'
                    aLiNodes.push(sLiNode);
                    }
                var li = aLiNodes.join(" ");
                oUlContainer.innerHTML = li;
            }
            var changeList =  function(){

                if (nStart < 10 && nEnd < 20) {
                    createList(nStart,nEnd);
                    nStart = nStart + 1;
                    nEnd = nEnd + 1;
                }else{
                    nStart = 0;
                    nEnd = 9;
                    createList(nStart,nEnd);
                }
            }
            changeList();
            setInterval(changeList,5000);
        }

        var getHotList = function(){
            var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';
            getData(url,{},hotListCallback);
        }
        getHotList();
        })();
    //视频播放
    var vedio = (function() {
        var oVedio = $(".sd2"),
            oVedioContainer = $(".g-vedio"),
            oCloseContainer = $(".m-video .close");
        oVedio.onclick = function(){
            oVedioContainer.style.display = "block";
        }
        oCloseContainer.onclick = function(){
            oVedioContainer.style.display = "none";
    }
    })();

    //兼容firefox,设置轮播图片的高度
    var firefox = (function(){
        if(/Firefox\/(\S+)/.test(navigator.userAgent)){
            var bannerPic = document.querySelectorAll(".sld img");
            for (var i = 0; i < bannerPic.length; i++) {
                bannerPic[i].style.height = 418 + "px";
            };
            console.log(bannerPic)
            //设置登录框字体大小
            var font = $(".fm h1");
            font.style.fontSize = 18 + "px";
        }
    })();

})();
