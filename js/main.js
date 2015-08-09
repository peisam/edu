var EDU = (function(){
    // 工具函数
    var getCookie = function(){
        var cookie = {};
        var all = document.cookie;
        if(all === ""){
            return cookie;
        }
        var list = all.split(";");
        for(var i=0;i<list.length;i++){
            var item = list[i].trim();
            var p = item.indexOf("=");
            var name = item.substring(0,p);
            name = decodeURIComponent(name);
            var value = item.substring(p+1);
            value = decodeURIComponent(value);
            cookie[name] = value;
        }
        return  cookie;
    }

    var setCookie = function(name,value,daysToLive){
        var cookie = name + "=" + encodeURIComponent(value);
        if(typeof daysToLive === 'number')
            cookie += "; expires=" + (daysToLive*60*60*24);
        document.cookie = cookie;
    }

    var eventUtil = {
        addHandler: function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler,false);
            }else
            if(element.attachEvent){
                element.attachEvent("on" + type,handler);
            }else{
                element['on' + type] = handler;
                }
        },
    }
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

    var getData =function(url,data,callback){
        var request = new XMLHttpRequest();
        request.open("GET",url + "?" + encodeFormData(data),true);
        request.onreadystatechange = function(){
            if(request.readyState == 4 && callback){
                if((request.status >= 200 && request.status <300) || request.status == 304){
                    callback(request);
                }else{
                    alert("request was unsuccessful: " + request.status)
                }
            }
        }
        request.send(null);
    }
// 顶部提示
    var pro = document.querySelector(".g-pro");

    if(getCookie().noMorePro){
        pro.style.display = "none";
    }

    var noMoreProHandler = function(){
        setCookie('noMorePro','true',900);
        pro.style.display = "none";
    }
    var btnNoMore = document.querySelector(".pro-content-right");
    eventUtil.addHandler(btnNoMore,'click',noMoreProHandler);


var loginForce = (function(){
    // 登录表单部分
    var docLoginForm = document.querySelector(".g-dis-login");
    var form = document.forms.loginForm;
    var btnForce = document.querySelector(".follow-btn");
    var domForce = document.querySelector(".force")
    var btnCloseLogin = document.querySelector(".close-icon");
    var btnlogin = document.querySelector("#login");
    var btnCloseLogin = document.querySelector(".close-icon")
    //打开登录框
    var loginForm = function(){
        if(getCookie().loginSuc){
            forceAPI(forceed);
            }else{
            docLoginForm.style.display = "block";
        }
    }
    //关闭登录框
    var closeLogin = function(){
        docLoginForm.style.display = "none";
    }

    eventUtil.addHandler(domForce,"click",loginForm);
    eventUtil.addHandler(btnCloseLogin,"click",closeLogin); //关闭登录框
    //取得表单数据
    var getDataObject = function(){
        var docUsername = document.querySelector("#account");
        var docPaasword = document.querySelector("#password");
        var username = docUsername.value;
        var password = docPaasword.value;
        console.log(username);
        console.log(password);
        var data = {
                userName: md5(username),
                password: md5(password)
        }
        return data;
    }
    //登录后的回调函数
    var loginCallback = function(req){
        if(req.responseText){
            setCookie("loginSuc","true",100);
            forceAPI(forceed);
            closeLogin();
            alert("登录成功");
        }
    }
    //登录
    var login = function(req){
        var url = 'http://study.163.com/webDev/login.htm';
        var data = getDataObject();
        getData(url,data,loginCallback)
    }
    eventUtil.addHandler(btnlogin,'click',login);


    // 关注API
    var followNum = document.querySelector(".f0llow-num");

    var forceAPI = function(callback){
        var url = 'http://study.163.com/webDev/attention.htm';
        getData(url,{},callback);
    }
    // 关注
    var forceed = function(request){
            if(request.responseText == '1'){
                btnForce.classList.add("follow-btn-ed");
                btnForce.firstChild.innerHTML = "√ 已关注 ";
                btnForce.lastChild.style.display = "inline-block";
                followNum.innerHTML = "粉丝 46";
                setCookie("followSuc","true",10);
            }else{alert('关注失败')}
        }

    // 取消关注
    var cancelForce = function(){
        forceAPI(cancel);
    }
    var cancel = function(request){
        if(request.responseText == '1'){
            btnForce.classList.remove('follow-btn-ed');
            btnForce.firstChild.innerHTML = "+ 关注";
            btnForce.lastChild.style.display = "none";
            followNum.innerHTML = "粉丝 45";
            setCookie("followSuc","false",10);
        }else{alert('取消关注失败')}
    }

    eventUtil.addHandler(btnForce.lastChild,'click',cancelForce);
    if(getCookie().followSuc!=='false'){
        btnForce.classList.add("follow-btn-ed");
        btnForce.firstChild.innerHTML = "√ 已关注 ";
        btnForce.lastChild.style.display = "inline-block";
        followNum.innerHTML = "粉丝 46";
    }else{
        btnForce.classList.remove('follow-btn-ed');
        btnForce.firstChild.innerHTML = "+ 关注";
        btnForce.lastChild.style.display = "none";
        followNum.innerHTML = "粉丝 45";
    }

    })();
})();
