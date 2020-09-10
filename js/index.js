window.onload = function () {
    // 声明玩家的飞机
    var plane = null
    // 声明三种类型的敌机
    var enemy1 = null, enemy2 = null, enemy3 = null
    // 所有的敌机
    var enemys = []
    // 道具
    var prop = null
    // 所有的道具
    var props = []
    // 大招
    var bigBullet = null
    // 小子弹
    var bullet = null
    // 所有的子弹
    var bullets = []
    // 操作的状态
    var bottomState = false, topState = false, leftState = false,
        rightState = false, shootState = false,bigshootState = false, enterState = true

    var flag = true
    // 敌机移动、生产的定时器
    var enemyMoveTimer = null, enemy1timer = null, enemy2timer = null, enemy3timer = null
    // 玩家飞机移动的定时器
    var planMoveTimer = null
    // 子弹移动、射击的定时器
    var bulletMove = null, shootTimer = null
    //道具的移动、产生的定时器
    var propMoveTimer = null,proptimer = null
    //大招的移动、射击的定时器
    var bigBulletMoveTimer = null, bigshootTimer = null


    //点击开始事件
    eventUtil.add($('start'),'click', startGame)
    //键盘按下事件
    eventUtil.add(document,'keydown', ctrPlane)
    //键盘抬起事件
    eventUtil.add(document,'keyup', ctrPlaneUp)
    //点击控制进度事件
    eventUtil.add($('ctrl'),'click', changeState)
    //重新开始
    eventUtil.add($('restart_new'),'click',restart)


    /**
     * 开始游戏
     */
    function startGame() {
        // 样式上的改变

        // 将开始的背景改成游戏中的背景
        $('begin_img').src = 'imgs/background.png'
        // 隐藏开始游戏的按钮
        $('start').style.display = 'none'
        // 显示顶部操作栏
        $('ctrl').style.opacity = 1
        // 隐藏提示框
        $('over_panel').style.display = 'none'
        //背景开始移动
        $('bg').style.animation = "bg 10s linear infinite"
        //显示血量
        $('hp').style.display = 'flex'


        // 玩家飞机的创建
        plane = new myPlane('imgs/myPlane.gif')


        // 定时器的开启

        //飞机移动
        planMoveTimer = setInterval(planeFly,25)
        //子弹射击
        shootTimer = setInterval(shoot,50)
        //子弹移动
        bulletMove = setInterval(bulletFly,25)
        //子弹和敌机的碰撞
        setInterval(isHit,20)
        //本机爆炸
        setInterval(isGG,20)
        //吃道具
        setInterval(eat,20)

        //敌机1产生
        enemy1timer = setInterval(function () {
            enemy1 = new Enemy(Math.floor(Math.random()*280),-30,1,'imgs/enemy1.png')
            enemys.push(enemy1)
        },5000)
        //敌机2产生
        enemy2timer = setInterval(function () {
            enemy2 = new Enemy(Math.floor(Math.random()*250),-164,150,'imgs/enemy2.png')
            enemys.push(enemy2)
        },10000)
        //敌机3产生
        enemy3timer = setInterval(function () {
            enemy3 = new Enemy(Math.floor(Math.random()*250),-60,60,'imgs/enemy3.png')
            enemys.push(enemy3)
        },15000)

        //道具的产生
        proptimer = setInterval(function () {
            prop = new Prop(Math.floor(Math.random()*250),-100,'imgs/prop.png',1)
            props.push(prop)
        },20000)
        //敌机移动
        enemyMoveTimer = setInterval(enemyFly,20)
        //血量改变
        setInterval(planeBlood,20)
        //道具的移动
        propMoveTimer =  setInterval(propMove,20)

        // 大招的射击
        bigshootTimer = setInterval(bigshoot,50)

        // 大招的清屏
        setInterval(bigHit,20)

        // 大招的移动
        bigBulletMoveTimer = setInterval(bigMove,20)
    }


    /**
     * 控制游戏的进度
     * @param e
     */
    function changeState(e) {
        var e = eventUtil.getEvent(e)
        var target = eventUtil.getTarget(e)
        if (target == $('state')){
            if (flag){
                target.className = 'iconfont icon-bofang'
                $('bg').style.animationPlayState = "paused"
                // 停止敌机的移动
                clearInterval(enemyMoveTimer)
                // 停止生产敌机
                clearInterval(enemy1timer)
                clearInterval(enemy2timer)
                clearInterval(enemy3timer)
                // 停止道具的移动
                clearInterval(propMoveTimer)
                // 停止产生道具
                clearInterval(proptimer)
            }else{
                target.className = 'iconfont icon-zantingtingzhi'
                $('bg').style.animationPlayState = "running"
                enemyMoveTimer = setInterval(enemyFly,20)

                //敌机1产生
                enemy1timer = setInterval(function () {
                    enemy1 = new Enemy(Math.floor(Math.random()*280),-30,1,'imgs/enemy1.png',10)
                    enemys.push(enemy1)
                },5000)
                //敌机2产生
                enemy2timer = setInterval(function () {
                    enemy2 = new Enemy(Math.floor(Math.random()*250),-164,150,'imgs/enemy2.png',50)
                    enemys.push(enemy2)
                },10000)
                //敌机3产生
                enemy3timer = setInterval(function () {
                    enemy3 = new Enemy(Math.floor(Math.random()*250),-60,60,'imgs/enemy3.png',100)
                    enemys.push(enemy3)
                },15000)
            }
            flag = !flag
        } else if(target == $('restart')){
            $('begin_img').src = 'imgs/start-bg.png'
            $('start').style.display = 'block'
            $('ctrl').style.opacity = 0
            $('state').className = 'iconfont icon-zantingtingzhi'
            flag = true
            $('myPlane').remove()
            $('bg').style.animation = "null"
        }
    }

    /**
     * 重新开始游戏
     */
    function restart() {
        enemys = []
        props = []
        bullets = []
        $('myPlane').remove()
        var imgs = document.getElementsByClassName('imgs')
        for (var i=0; i<imgs.length; i++){
            imgs[i].remove()
        }
        startGame()
    }

    /**
     * 结束游戏
     */
    function gameOver() {
        enemys = []
        props = []
        bullets = []
        // 清除玩家飞机移动的定时器
        clearInterval(planMoveTimer)
        // 清除射击的定时器
        clearInterval(shootTimer)
        // 清除敌机移动的定时器
        clearInterval(enemyMoveTimer)
        // 清除敌机1移动的定时器
        clearInterval(enemy1timer)
        // 清除敌机2移动的定时器
        clearInterval(enemy2timer)
        // 清除敌机3移动的定时器
        clearInterval(enemy3timer)
        // 清除生产道具的定时器
        clearInterval(proptimer)
        // 清除道具移动的定时器
        clearInterval(propMoveTimer)
        // 清除大招射击的定时器
        clearInterval(bigshootTimer)
        // 清除大招移动的的定时器
        clearInterval(bigBulletMoveTimer)

        // 清除背景移动的css动画
        $('bg').style.animation = "null"
        // 显示提示游戏结束的弹窗
        $('over_panel').style.display = 'block'
    }

    /**
     *飞机的移动
     **/
    function planeFly() {
        if(topState) {
            plane.moveTop()
        } else if(bottomState) {
            plane.moveBottom()
        } else if(leftState) {
            plane.moveLeft()
        } else if(rightState) {
            plane.moveRight()
        }
    }

    /**
     * 开火
     */
    function shoot() {
        if(shootState) {
            plane.shoot()
        }
    }

    /**
     * 按下键盘控制飞机
     */
    function ctrPlane(e) {
        var e = e || window.event
        // 获取键盘码
        var k = e.keyCode || e.charCode || e.which
        // 下：40 上：38 左：37 右：39

        // 判断按下的键
        if(k == 40) {
            bottomState = true
        } else if(k == 38){
            topState = true
        } else if(k == 37) {
            leftState = true
        } else if(k == 39) {
            rightState = true
        }
        // 判断是否开火 按下空格键，开始射击子弹
        if(k == 32) {
            shootState = true
        }
        //判断大招
        if (k == 13 && $('prop').children.length>0 && enterState) {
            $('prop').children[0].remove()
            bigshootState = true
            enterState = false
        }
    }

    /**
     * 键盘抬起
     * @param e
     */
    function ctrPlaneUp(e){
        var e = e || window.event
        // 获取键盘码
        var k = e.keyCode || e.charCode || e.which
        // 判断按下的键
        if(k == 40) {
            bottomState = false
        } else if(k == 38){
            topState = false
        } else if(k == 37) {
            leftState = false
        } else if(k == 39) {
            rightState = false
        }
        //抬起空格键，停止射击子弹
        if(k == 32) {
            shootState = false
        }
        if (k==13){
            bigshootState = false
        }
    }

    /**
     * 让子弹飞
     */
    function bulletFly() {
        for (var i=0; i<bullets.length; i++){
            //先判断子弹是否存活
            if(!bullets[i].isDied && !plane.isDied){
                //判断当前的分数
                if (parseInt($('score').innerText) >= 2000){
                    plane.speed = 10
                    bullets[i].speed = 13
                    bullets[i].power = 200
                }
                if (parseInt(bullets[i].imgNode.style.top) > -20){
                    bullets[i].move()
                }else{
                    //如果子弹飞出边界，就从dom中移除
                    $('main').removeChild(bullets[i].imgNode)
                    bullets.splice(i,1)
                }
            }else{
                $('main').removeChild(bullets[i].imgNode)
                bullets.splice(i,1)
            }
        }
    }

    /**
     * 大招的释放
     */
    function bigshoot() {
        if (bigshootState){
            bigBullet = new boom('imgs/bigbullet.png')
        }
    }

    /**
     * 大招清屏
     */
    function bigHit() {
        if (bigBullet != null){
            for (var j=0; j<enemys.length; j++){
                if (parseInt(bigBullet.imgNode.style.left) + parseInt(bigBullet.imgNode.offsetWidth) >= parseInt(enemys[j].imgNode.style.left) &&

                    parseInt(bigBullet.imgNode.style.left) - parseInt(enemys[j].imgNode.offsetWidth) < parseInt(enemys[j].imgNode.style.left) &&

                    parseInt(bigBullet.imgNode.style.top) - parseInt(enemys[j].imgNode.offsetHeight) <= parseInt(enemys[j].imgNode.style.top)) {
                    enemys[j].isDied = true
                    if (!plane.isDied){
                        if (enemys[j].src == 'imgs/enemy1.png') {
                            enemys[j].imgNode.src = 'imgs/enemy1_boom.gif'
                            plane.score = plane.score + 5
                        } else if (enemys[j].src == 'imgs/enemy2.png') {
                            enemys[j].imgNode.src = 'imgs/enemy2_boom.gif'
                            plane.score = plane.score + 10
                        } else if (enemys[j].src == 'imgs/enemy3.png') {
                            enemys[j].imgNode.src = 'imgs/enemy3_boom.gif'
                            plane.score = plane.score + 20
                        }
                        $('score').innerText = plane.score
                    }
                }
            }
        }

    }

    /**
     * 子弹和敌机的碰撞
     */
    function isHit() {
        for (var i=0; i<bullets.length; i++) {
            for (var j = 0; j < enemys.length; j++) {
                if (parseInt(bullets[i].imgNode.style.left) + parseInt(bullets[i].imgNode.offsetWidth) >= parseInt(enemys[j].imgNode.style.left) &&

                    parseInt(bullets[i].imgNode.style.left) - parseInt(enemys[j].imgNode.offsetWidth) < parseInt(enemys[j].imgNode.style.left) &&

                    parseInt(bullets[i].imgNode.style.top) - parseInt(enemys[j].imgNode.offsetHeight) <= parseInt(enemys[j].imgNode.style.top)&&
                    parseInt(bullets[i].imgNode.style.top) >= parseInt(enemys[j].imgNode.style.top)) {
                    bullets[i].isDied = true
                    enemys[j].blood -= bullets[i].power
                    //敌机血量为0，死亡
                    if (enemys[j].blood <=0){
                        enemys[j].isDied = true
                        if (enemys[j].src == 'imgs/enemy1.png') {
                            enemys[j].imgNode.src = 'imgs/enemy1_boom.gif'
                            plane.score = plane.score + 5
                        } else if (enemys[j].src == 'imgs/enemy2.png') {
                            enemys[j].imgNode.src = 'imgs/enemy2_boom.gif'
                            plane.score = plane.score + 10
                        } else if (enemys[j].src == 'imgs/enemy3.png') {
                            enemys[j].imgNode.src = 'imgs/enemy3_boom.gif'
                            plane.score = plane.score + 20
                        }
                        $('score').innerText = plane.score
                        $('over_score').innerText = plane.score
                    }else{
                        //挨打时
                        if (enemys[j].src == 'imgs/enemy2.png') {
                            enemys[j].imgNode.src = 'imgs/enemy2_shoot.png'
                        } else if (enemys[j].src == 'imgs/enemy3.png') {
                            enemys[j].imgNode.src = 'imgs/enemy3_shoot.png'
                        }
                    }
                }
            }
        }
    }

    /**
     * 飞机吃道具
     */
    function eat() {
        for (var j = 0; j < props.length; j++) {
            if (parseInt(plane.imgNode.style.left) + parseInt(plane.imgNode.offsetWidth) >= parseInt(props[j].imgNode.style.left) &&

                parseInt(plane.imgNode.style.left) - parseInt(props[j].imgNode.offsetWidth) < parseInt(props[j].imgNode.style.left) &&

                parseInt(plane.imgNode.style.top)  <= parseInt(props[j].imgNode.style.top) + parseInt(props[j].imgNode.offsetHeight) &&
                parseInt(plane.imgNode.style.top) >= parseInt(props[j].imgNode.style.top)) {
                props[j].isDied = true
                if (!plane.isDied){
                    if (plane.help ==0){
                        plane.help =1
                    }else if (plane.help ==1) {
                        plane.help =2
                    }else if (plane.help ==2) {
                        plane.help =3
                    }
                    if ($('prop').children.length < 3){
                        $('prop').innerHTML += '<div><img src="imgs/boom.png" ></div>'
                    }
                }
            }
        }
    }

    /**
     * 本机爆炸
     */
    function isGG() {
        for (var j = 0; j < enemys.length; j++) {
            if (parseInt(plane.imgNode.style.left) + parseInt(plane.imgNode.offsetWidth) >= parseInt(enemys[j].imgNode.style.left) &&

                parseInt(plane.imgNode.style.left) - parseInt(enemys[j].imgNode.offsetWidth) < parseInt(enemys[j].imgNode.style.left) &&

                parseInt(plane.imgNode.style.top)  <= parseInt(enemys[j].imgNode.style.top) + parseInt(enemys[j].imgNode.offsetHeight) &&
                parseInt(plane.imgNode.style.top) >= parseInt(enemys[j].imgNode.style.top)) {
                plane.blood --
                if (plane.blood <=0){
                    plane.isDied = true
                    plane.imgNode.src = 'imgs/myPlane_boom.gif'
                    gameOver()
                }
            }
        }
    }

    /**
     * 显示本机的血量
     */
    function planeBlood() {
        $('blood_in').style.width = plane.blood + 'px'
    }

    /***
     * 让敌机飞，敌机移动
     */
    function enemyFly() {
        for (var i=0; i<enemys.length; i++){
            //先判断敌机是否存活
            if (!enemys[i].isDied && !plane.isDied){
                //判断当前的分数
                if (parseInt($('score').innerText) >= 2000){
                    enemys[i].speed = 2
                    if (enemys[i].src == 'imgs/enemy1.png') {
                        enemys[i].blood = 10
                    } else if (enemys[i].src == 'imgs/enemy2.png') {
                        enemys[i].blood = 300
                    } else if (enemys[i].src == 'imgs/enemy3.png') {
                        enemys[i].blood = 500
                    }
                }
                //如果子弹飞出边界，就从dom中移除
                if (parseInt(enemys[i].imgNode.style.top)< 570){
                    enemys[i].move()
                }else{
                    $('main').removeChild(enemys[i].imgNode)
                    enemys.splice(i,1)
                }
            } else{
                enemys[i].diedTime --
                if (enemys[i].diedTime == 0){
                    $('main').removeChild(enemys[i].imgNode)
                    enemys.splice(i,1)
                }

            }
        }
    }

    /**
     * 道具移动
     */
    function propMove() {
        for (var i=0; i<props.length; i++){
            if (!props[i].isDied) {
                //如果子弹飞出边界，就从dom中移除
                if (parseInt(props[i].imgNode.style.top)< 570){
                    props[i].move()
                }else{
                    $('main').removeChild(props[i].imgNode)
                    props.splice(i,1)
                }
            }else{
                $('main').removeChild(props[i].imgNode)
                props.splice(i,1)
            }
        }
    }

    /**
     * 大招移动
     */
    function bigMove() {
        if (bigBullet!=null){
            if (parseInt(bigBullet.imgNode.style.top) > -322) {
                bigBullet.move()
            }else{
                //如果子弹飞出边界，就从dom中移除
                $('main').removeChild(bigBullet.imgNode)
                enterState = true
                bigBullet = null
            }
        }

    }

    /**
     创建飞机的构造函数
     @param {string} src 飞机图片地址
     @param {number} x 飞机x坐标
     @params {number} y 飞机y坐标
     @params {number} speed 飞机速度
     @params {number} blood 飞机血量
     **/
    function myPlane(src,x,y,speed,blood) {
        //设置初始值
        src = src || "imgs/myPlane.gif"
        x = x || 125
        y = y || 440
        speed = speed || 5
        blood = blood || 160

        this.imgNode = document.createElement('img')
        this.src = src
        this.x = x
        this.y = y
        this.speed = speed
        this.blood = blood
        this.isDied = false
        this.score = 0
        this.help = 0

        //射击子弹
        this.shoot = function () {
            var l = parseInt(this.imgNode.style.left)+parseInt(this.imgNode.width/2)
            var t = parseInt(this.imgNode.style.top)
            bullet = new createBullet(l,t)
            bullets.push(bullet)
        }
        this.moveTop = function() {
            if (parseInt(this.imgNode.style.top) > 0){
                this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + 'px'
            } else{
                this.imgNode.style.top = 0
            }
        }
        this.moveBottom = function() {
            var height = this.imgNode.height
            if (parseInt(this.imgNode.style.top)< 568-height-20){
                this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px'
            }else{
                this.imgNode.style.top = 568 - height-20 + 'px'
            }

        }
        this.moveLeft = function() {
            // 判断边界
            if(parseInt(this.imgNode.style.left) > 0) {
                this.imgNode.style.left = parseInt(this.imgNode.style.left) - this.speed + 'px'
            } else {
                this.imgNode.style.left = 0
            }
        }
        this.moveRight = function() {
            // 获取飞机的宽度
            var  width = this.imgNode.offsetWidth

            // 判断右边界
            if(parseInt(this.imgNode.style.left) < 320 - width) {
                this.imgNode.style.left = parseInt(this.imgNode.style.left) + this.speed + 'px'
            } else {
                this.imgNode.style.left = 320 - width + 'px'
            }
        }

        /* 动态创建节点 */
        this.init = function () {
            this.imgNode.style.position = 'absolute'
            this.imgNode.style.left = this.x +'px'
            this.imgNode.style.top = this.y +'px'
            this.imgNode.src = this.src
            this.imgNode.id = 'myPlane'
            this.imgNode.style.zIndex = 5
            $('main').appendChild(this.imgNode)
        }
        //初始化飞机
        this.init()
    }

    /**
     * 创建子弹的构造函数
     */
    function createBullet(x,y,src,speed) {
        src = src || 'imgs/bullet.png'
        x = x || 127
        y = y || 480
        speed = speed || 8


        this.src = src
        this.x = x
        this.y = y
        this.speed = speed
        this.power = 1
        this.isDied = false

        //子弹移动
        this.move = function() {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + 'px'
        }


        this.imgNode = document.createElement('img')
        this.init = function () {
            this.imgNode.style.position = 'absolute'
            this.imgNode.style.left = this.x - this.imgNode.offsetWidth / 2 + 'px'
            this.imgNode.style.top = this.y - this.imgNode.offsetHeight + 'px'
            this.imgNode.src = this.src
            this.imgNode.className = 'bullet imgs'
            this.imgNode.id = 'mybullet'
            $('main').appendChild(this.imgNode)
        }
        this.init()
    }

    /**
     * 创建敌机的构造函数
     */
    function Enemy(x,y,blood,src,score,speed) {
        this.x = x
        this.y = y || -30
        this.blood = blood || 1
        this.src = src || 'imgs/enemy1.png'
        this.speed = speed || 1

        this.isDied = false
        this.diedTime = 20

        //敌机移动
        this.move = function () {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px'
        }
        this.imgNode = document.createElement('img')
        //初始化敌机
        this.init = function () {
            this.imgNode.style.position = 'absolute'
            this.imgNode.style.left = this.x - this.imgNode.offsetWidth + 'px'
            this.imgNode.style.top = this.y  + 'px'
            this.imgNode.src = this.src
            this.imgNode.className = 'enemy imgs'
            $('main').appendChild(this.imgNode)
        }
        this.init()
    }

    /**
     * 创建道具的构造函数
     */
    function Prop(x,y,src,speed) {
        this.x = x
        this.y = y
        this.src = src || 'imgs/prop.png'
        this.speed = speed || 1

        this.isDied = false

        //道具移动
        this.move = function () {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px'
        }
        this.imgNode = document.createElement('img')
        //初始化道具
        this.init = function () {
            this.imgNode.style.position = 'absolute'
            this.imgNode.style.left = this.x - this.imgNode.offsetWidth + 'px'
            this.imgNode.style.top = this.y  + 'px'
            this.imgNode.src = this.src
            this.imgNode.className = 'props imgs'
            $('main').appendChild(this.imgNode)
        }
        this.init()
    }

    /**
     * 释放大招的构造函数
     */
    function boom(src,x,y,speed) {
        this.src = src || 'imgs/bigbullet.png'
        this.x = x || 0
        this.y = y || 570
        this.speed = speed || 1

        //大招移动
        this.move = function () {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + 'px'
        }

        this.imgNode = document.createElement('img')
        this.init = function () {
            this.imgNode.style.position = 'absolute'
            this.imgNode.style.left = this.x  + 'px'
            this.imgNode.style.top = this.y  + 'px'
            this.imgNode.src = this.src
            this.imgNode.className = 'bigshoot imgs'
            $('main').appendChild(this.imgNode)
        }
        this.init()
    }

}




