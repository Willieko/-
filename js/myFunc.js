/**
 * 根据id获取DOM元素
 * @param id
 * @returns {any}
 */
function $(id) {
    return typeof id ==='string'?document.getElementById(id):null;
}

/**
 * 兼容所有浏览器的事件添加方法
@param{element} dom 需要添加事件的元素
@param{string} type 事件类型
@param{function} fn 事件触发的时候所执行的方法
 **/
function addEvent(dom,type,fn){
//现代浏览器添加事件的方法
    if(document.addEventListener){
        dom.addEventListener(type,fn,false);
    }else if(document.attachEvent){
        dom.attachEvent('on'+type,fn);
    }else{//更低版本IE，5，6
        dom['on' + type] = fn;
    }
}


/**
 * 获取滚动的头部距离和左边距离
 * scroll().top scroll().left
 * @returns {*}
 */
function scroll() {
    if(window.pageYOffset !== null){
        return {
            top: window.pageYOffset,
            left: window.pageXOffset
        }
    }else if(document.compatMode === "CSS1Compat"){ // W3C
        return {
            top: document.documentElement.scrollTop,
            left: document.documentElement.scrollLeft
        }
    }
    return {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
    }
}


/**
 * 缓动动画和获取CSS属性函数
 */
function  buffer(obj,json,fn){
    // 1.1 清除定时器
    clearInterval(obj.timer);
    // 1.2 设置定时器
    var beginValue = 0,target = 0,speed = 0;
    obj.timer = setInterval(function () {
        //旗帜
        var flag = true;
        for (var k in json){
            //1.3获取初始值
            if("opacity" ===k){//透明度
                beginValue = Math.round(parseFloat(getCSSAttrValue(obj,k))*100||100);
                target = parseInt(json[k]*100);
            }else{//其它情况
                beginValue = parseInt(getCSSAttrValue(obj,k))||0;//没有在json取到key的时候，begin = 0;
                target = parseInt(json[k]);
            }
            // 1.4 求出步长
            speed = (target - beginValue) * 0.2;//缓动系数
            // 1.5判断取整 Math.ceil取大    向下取整会变小
            speed = (target > beginValue)?Math.ceil(speed):Math.floor(speed);
            // 1.6 动起来(判断k是啥子)
            if("opacity" === k){//透明度
                //W3C的浏览器
                obj.style.opacity = (beginValue + speed) /100;
                //ie浏览器
                obj.style.filter = 'alpha(Opacity='+(beginValue + speed)+')';
            }else{
                obj.style[k] = beginValue + speed +'px';
            }
            // 1.5 判断
            if(beginValue !== target){//只有当所有数值都到位，flag才为true
                flag = false;
            }
        }
        //清除定时器
        if (flag){//flag为true的时候才会执行
            clearInterval(obj.timer);
            if(fn){ //判断有没有回调函数
                fn();
            }
        }

    }, 20);
}


/**
 * 获取CSS的样式值
 * 无论行内页内还是外部样式的属性都可以获取
 * @param ｛object｝obj
 * @param ｛string｝attr
 * @returns {*}
 */
function getCSSAttrValue(obj, attr) {
    if(obj.currentStyle){ // IE 和 opera
        return obj.currentStyle[attr];
    }else {
        return window.getComputedStyle(obj, null)[attr];
    }
}



//事件添加、移除、阻止冒泡、阻止默认事件
var eventUtil = {
    add:function (dom,type,func) {
        if (window.addEventListener){
            dom.addEventListener(type,func,false);
        } else if(window.attachEvent){
            dom.attachEvent('on'+type,func);
        }else{
            dom['on'+type] = func;
        }
    },
    remove:function (dom,type,func) {
        if(window.removeEventListener){
            dom.removeEventListener(type,func,false);
        }else if(window.detachEvent){
            dom.detachEvent('on'+type,func);
        }else{
            dom['on'+type] = null;
        }
    },
    getEvent:function (e) {
        return e|| window.event;
    },
    getTarget:function (e) {
        return e.target || e.srcElement;
    },
    preventDefault:function (e) {
        if(e.preventDefault){
            e.preventDefault();
        }else{
            e.returnValue = false;
        }
    },
    stopPropagation:function (e) {
        if (e.stopPropagation){
            e.stopPropagation();
        } else{
            e.cancelBubble = true;
        }
    }
};