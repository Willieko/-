window.onload = function () {
    //声明飞机和敌机
    var plane,enemy1,enemy2,enemy3;
    //所有的敌机
    var enemys = [];
    //道具
    var prop;
    //所有的道具
    var props = [];
    //大招
    var b ;
    var bullet;
    //所有的子弹数组
    var bullets = [];
    var bottomState = false, topState = false, leftState = false,
        rightState = false, shootState = false,bigshootState = false,enterState = true;
    var flag = true;
    //敌机移动.敌机的生产
    var enemyMoveTimer = null,enemy1timer = null,enemy2timer = null,enemy3timer = null;
    //本机移动
    var planf = null;
    //子弹移动,子弹射击
    var bulletf = null,shootTimer = null;
    //道具的移动,道具的产生
    var propMoveTimer = null,proptimer = null;
    //大招的移动,大招的射击
    var bigMoveTimer = null,bigshootTimer = null;

    //点击开始事件
    eventUtil.add($('start'),'click',startGame);
    //键盘按下事件
    eventUtil.add(document,'keydown',ctrPlane);
    //键盘抬起事件
    eventUtil.add(document,'keyup',ctrPlaneUp);
    //点击控制进度事件
    eventUtil.add($('ctr'),'click',changeState);
    //重新开始
    eventUtil.add($('restart_new'),'click',restart);


    /**
     * 控制游戏的进度
     * @param e
     */
    function changeState(e) {
        var e = eventUtil.getEvent(e);
        var target = eventUtil.getTarget(e);
        if (target == $('s_t')){
            if (flag){
                target.className = 'iconfont icon-zanting ';
                $('bg').style.animationPlayState = "paused";
                clearInterval(enemyMoveTimer);
                clearInterval(enemy1timer);
                clearInterval(enemy2timer);
                clearInterval(enemy3timer);
            }else{
                target.className = 'iconfont icon-zantingbofang';
                $('bg').style.animationPlayState = "running";
                enemyMoveTimer = setInterval(enemyFly,20);

                //敌机1产生
                enemy1timer = setInterval(function () {
                    enemy1 = new Enemy(Math.floor(Math.random()*280),-30,1,'images/enemy1.png',10);
                    enemys.push(enemy1);
                },5000);
                //敌机2产生
                enemy2timer = setInterval(function () {
                    enemy2 = new Enemy(Math.floor(Math.random()*250),-164,150,'images/enemy2_fly_1.png',50);
                    enemys.push(enemy2);
                },15000);
                //敌机3产生
                enemy3timer = setInterval(function () {
                    enemy3 = new Enemy(Math.floor(Math.random()*250),-60,60,'images/enemy3_fly_1.png',100);
                    enemys.push(enemy3);
                },10000);
            }
            flag = !flag;
        } else if(target == $('restart')){
            $('begin_img').src = 'images/开始背景.png';
            $('start').style.display = 'block';
            $('ctr').style.opacity = 0;
            $('s_t').className = 'iconfont icon-zantingbofang';
            flag = true;
            $('myplane').remove();
            $('bg').style.animation = "null";
        }
    }

    /**
     * 开始游戏
     */
    function startGame() {
        $('begin_img').src = 'images/bg.png';
        $('start').style.display = 'none';
        $('ctr').style.opacity = 1;
        $('over_panel').style.display = 'none';
        //产生本方飞机
        plane = new myPlane('images/myplane.gif');
        //背景开始移动
        $('bg').style.animation = "bg 10s linear infinite";
        //显示血量
        $('blood').style.display = 'block';


        //飞机移动
        planf = setInterval(planeFly,25);

        //子弹射击
        shootTimer = setInterval(shoot,50);

        //子弹移动
        bulletf = setInterval(bulletFly,25);

        //子弹和敌机的碰撞
        setInterval(isHit,20);

        //本机爆炸
        setInterval(isGG,20);

        //吃道具
        setInterval(eat,20);


        //敌机1产生
        enemy1timer = setInterval(function () {
            enemy1 = new Enemy(Math.floor(Math.random()*280),-30,1,'images/enemy1.png');
            enemys.push(enemy1);
        },5000);
        //敌机2产生
        enemy2timer = setInterval(function () {
            enemy2 = new Enemy(Math.floor(Math.random()*250),-164,150,'images/enemy2_fly_1.png');
            enemys.push(enemy2);
        },15000);
        //敌机3产生
        enemy3timer = setInterval(function () {
            enemy3 = new Enemy(Math.floor(Math.random()*250),-60,60,'images/enemy3_fly_1.png');
            enemys.push(enemy3);
        },10000);

        //道具的产生
        proptimer = setInterval(function () {
            prop = new Prop(Math.floor(Math.random()*250),-100,'images/prop.png',1);
            props.push(prop);
        },20000);

        //敌机移动
        enemyMoveTimer = setInterval(enemyFly,20);

        //血量改变
        setInterval(planeBlood,20);

        //道具的移动
        propMoveTimer =  setInterval(propMove,20);


        bigshootTimer = setInterval(bigshoot,50);


        setInterval(bigHit,20);

        bigMoveTimer = setInterval(bigMove,20);
    }

    /**
     * 重新开始游戏
     */
    function restart() {
        enemys = [];
        props = [];
        bullets = [];
        $('myplane').remove();
        var imgs = document.getElementsByClassName('imgs');
        for (var i=0;i<imgs.length;i++){
            imgs[i].remove();
        }
        // startGame();
    }

    /**
     * 结束游戏
     */
    function gameOver() {
        clearInterval(planf);
        clearInterval(shootTimer);
        clearInterval(enemyMoveTimer);
        clearInterval(enemy1timer);
        clearInterval(enemy2timer);
        clearInterval(enemy3timer);
        clearInterval(proptimer);
        clearInterval(propMoveTimer);
        clearInterval(bigshootTimer);
        $('bg').style.animation = "null";
        $('over_panel').style.display = 'block';
    }

    /**
     * 按下键盘控制飞机
     */
    function ctrPlane(e) {
        var e = e || window.event;
        // 获取键盘码
        var k = e.keyCode || e.charCode || e.which;
        // 下：40 上：38 左：37 右：39

        // 判断按下的键
        if(k == 40) {
            bottomState = true;
        } else if(k == 38){
            topState = true;
        } else if(k == 37) {
            leftState = true;
        } else if(k == 39) {
            rightState = true;
        }
        // 判断是否开火 按下空格键，开始射击子弹
        if(k == 32) {
            shootState = true;
        }
        //判断大招
        if (k == 13 && $('propbt').children.length>0 && enterState) {
            $('propbt').children[0].remove();
            bigshootState = true;
            enterState = false;
        }
    }

    /**
     * 开火
     */
    function shoot() {
        if(shootState) {
            plane.shoot();
        }
    }

    /**
     * 键盘抬起
     * @param e
     */
    function ctrPlaneUp(e){
        var e = e || window.event;
        // 获取键盘码
        var k = e.keyCode || e.charCode || e.which;
        // 判断按下的键
        if(k == 40) {
            bottomState = false;
        } else if(k == 38){
            topState = false;
        } else if(k == 37) {
            leftState = false;
        } else if(k == 39) {
            rightState = false;
        }
        //抬起空格键，停止射击子弹
        if(k == 32) {
            shootState = false;
        }
        if (k==13){
            bigshootState = false;
        }
    };

    /**
    *飞机的移动
    **/
    function planeFly() {
        if(topState) {
            plane.moveTop();
        } else if(bottomState) {
            plane.moveBottom();
        } else if(leftState) {
            plane.moveLeft();
        } else if(rightState) {
            plane.moveRight();
        }
    }



    /**
     * 大招的释放
     */
    function bigshoot() {
        if (bigshootState){
            b = new boom('images/bigbullet.png');
        }
    }

    /**
     * 大招清屏
     */
    function bigHit() {
        if (b !=null){
            for (var j=0;j<enemys.length;j++){
                if (parseInt(b.imgNode.style.left) + parseInt(b.imgNode.offsetWidth) >= parseInt(enemys[j].imgNode.style.left) &&

                    parseInt(b.imgNode.style.left) - parseInt(enemys[j].imgNode.offsetWidth) < parseInt(enemys[j].imgNode.style.left) &&

                    parseInt(b.imgNode.style.top) - parseInt(enemys[j].imgNode.offsetHeight) <= parseInt(enemys[j].imgNode.style.top)) {
                    enemys[j].isDied = true;
                    if (!plane.isDied){
                        if (enemys[j].src == 'images/enemy1.png') {
                            enemys[j].imgNode.src = 'images/小飞机爆炸1.gif';
                            plane.score = plane.score + 5;
                        } else if (enemys[j].src == 'images/enemy2_fly_1.png') {
                            enemys[j].imgNode.src = 'images/大飞机爆炸.gif';
                            plane.score = plane.score + 20;
                        } else if (enemys[j].src == 'images/enemy3_fly_1.png') {
                            enemys[j].imgNode.src = 'images/中飞机爆炸.gif';
                            plane.score = plane.score + 10;
                        }
                        $('scrore_in').innerText = plane.score;
                    }
                }
            }
        }
       
    }

    /**
     * 子弹和敌机的碰撞
     */
    function isHit() {
        for (var i=0;i<bullets.length;i++) {
            for (var j = 0; j < enemys.length; j++) {
                    if (parseInt(bullets[i].imgNode.style.left) + parseInt(bullets[i].imgNode.offsetWidth) >= parseInt(enemys[j].imgNode.style.left) &&

                        parseInt(bullets[i].imgNode.style.left) - parseInt(enemys[j].imgNode.offsetWidth) < parseInt(enemys[j].imgNode.style.left) &&

                        parseInt(bullets[i].imgNode.style.top) - parseInt(enemys[j].imgNode.offsetHeight) <= parseInt(enemys[j].imgNode.style.top)&&
                        parseInt(bullets[i].imgNode.style.top) >= parseInt(enemys[j].imgNode.style.top)) {
                        bullets[i].isDied = true;
                        enemys[j].blood -= bullets[i].power;
                        //敌机血量为0，死亡
                        if (enemys[j].blood <=0){
                            enemys[j].isDied = true;
                            if (enemys[j].src == 'images/enemy1.png') {
                                enemys[j].imgNode.src = 'images/小飞机爆炸1.gif';
                                plane.score = plane.score + 5;
                            } else if (enemys[j].src == 'images/enemy2_fly_1.png') {
                                enemys[j].imgNode.src = 'images/大飞机爆炸.gif';
                                plane.score = plane.score + 20;
                            } else if (enemys[j].src == 'images/enemy3_fly_1.png') {
                                enemys[j].imgNode.src = 'images/中飞机爆炸.gif';
                                plane.score = plane.score + 10;
                            }
                            $('scrore_in').innerText = plane.score;
                            $('over_score').innerText = plane.score;
                        }else{
                            //挨打时
                            if (enemys[j].src == 'images/enemy2_fly_1.png') {
                                enemys[j].imgNode.src = 'images/大飞机挨打.png';
                            } else if (enemys[j].src == 'images/enemy3_fly_1.png') {
                                enemys[j].imgNode.src = 'images/中飞机挨打.png';
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
                props[j].isDied = true;
                if (!plane.isDied){
                    if (plane.help ==0){
                        plane.help =1;
                    }else if (plane.help ==1) {
                        plane.help =2;
                    }else if (plane.help ==2) {
                        plane.help =3;
                    }
                    if ($('propbt').children.length < 3){
                        $('propbt').innerHTML += '<li><img src="images/boom.png" ></li>';
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
                plane.blood --;
                if (plane.blood <=0){
                    plane.isDied = true;
                    plane.imgNode.src = 'images/本方飞机爆炸.gif';
                    gameOver();
                }
                }
            }
        }

    /**
     * 显示本机的血量
     */
    function planeBlood() {
        $('blood_in').style.width = plane.blood + 'px';
    }


    /**
     * 让子弹飞
     */
    function bulletFly() {
        for (var i=0;i<bullets.length;i++){
           //先判断子弹是否存活
            if(!bullets[i].isDied && !plane.isDied){
                //判断当前的分数
               if (parseInt($('scrore_in').innerText) >= 2000){
                   plane.speed = 10;
                   bullets[i].speed = 13;
                   bullets[i].power = 200;
               }
                if (parseInt(bullets[i].imgNode.style.top) > -20){
                    bullets[i].move();
                }else{
                    //如果子弹飞出边界，就从dom中移除
                    $('wrap').removeChild(bullets[i].imgNode);
                    bullets.splice(i,1);
                }
                }else{
                $('wrap').removeChild(bullets[i].imgNode);
                bullets.splice(i,1);
            }
        }
    }

    /***
     * 让敌机飞，敌机移动
     */
    function enemyFly() {
        for (var i=0;i<enemys.length;i++){
           //先判断敌机是否存活
            if (!enemys[i].isDied && !plane.isDied){
                //判断当前的分数
                if (parseInt($('scrore_in').innerText) >= 2000){
                    enemys[i].speed = 2;
                    if (enemys[i].src == 'images/enemy1.png') {
                        enemys[i].blood = 10;
                    } else if (enemys[i].src == 'images/enemy2_fly_1.png') {
                        enemys[i].blood = 500;
                    } else if (enemys[i].src == 'images/enemy3_fly_1.png') {
                        enemys[i].blood = 300;
                    }
                }
                //如果子弹飞出边界，就从dom中移除
                if (parseInt(enemys[i].imgNode.style.top)< 570){
                    enemys[i].move();
                }else{
                    $('wrap').removeChild(enemys[i].imgNode);
                    enemys.splice(i,1);
                }
            } else{
                enemys[i].diedTime --;
                if (enemys[i].diedTime == 0){
                    $('wrap').removeChild(enemys[i].imgNode);
                    enemys.splice(i,1);
                }

            }
        }
    }

    /**
     * 道具移动
     */
    function propMove() {
        for (var i=0;i<props.length;i++){
            if (!props[i].isDied) {
                //如果子弹飞出边界，就从dom中移除
                if (parseInt(props[i].imgNode.style.top)< 570){
                    props[i].move();
                }else{
                    $('wrap').removeChild(props[i].imgNode);
                    props.splice(i,1);
                }
            }else{
                $('wrap').removeChild(props[i].imgNode);
                props.splice(i,1);
            }
        }
    }

    /**
     * 大招移动
     */
    function bigMove() {
        if (b!=null){
            if (parseInt(b.imgNode.style.top) > -322) {
                b.move();
            }else{
                //如果子弹飞出边界，就从dom中移除
                $('wrap').removeChild(b.imgNode);
                enterState = true;
                b = null;
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
        src = src || "images/myplane.gif";
        x = x || 125;
        y = y || 440;
        speed = speed || 5;
        blood = blood || 160;

        this.imgNode = document.createElement('img');
        this.src = src;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.blood = blood;
        this.isDied = false;
        this.score = 0;
        this.help = 0;

        //射击子弹
        this.shoot = function () {
            var l = parseInt(this.imgNode.style.left)+parseInt(this.imgNode.width/2);
            var t = parseInt(this.imgNode.style.top);
            bullet = new createBullet(l,t);
            bullets.push(bullet);
        };
        this.moveTop = function() {
            if (parseInt(this.imgNode.style.top) > 0){
                this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + 'px';
            } else{
                this.imgNode.style.top = 0;
            }
        };
        this.moveBottom = function() {
            var height = this.imgNode.height;
            if (parseInt(this.imgNode.style.top)< 568-height-20){
                this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px';
            }else{
                this.imgNode.style.top = 568 - height-20 + 'px';
            }

        };
        this.moveLeft = function() {
            // 判断边界
            if(parseInt(this.imgNode.style.left) > 0) {
                this.imgNode.style.left = parseInt(this.imgNode.style.left) - this.speed + 'px';
            } else {
                this.imgNode.style.left = 0;
            }
        };
        this.moveRight = function() {
            // 获取飞机的宽度
            var  width = this.imgNode.offsetWidth;

            // 判断右边界
            if(parseInt(this.imgNode.style.left) < 320 - width) {
                this.imgNode.style.left = parseInt(this.imgNode.style.left) + this.speed + 'px';
            } else {
                this.imgNode.style.left = 320 - width + 'px';
            }
        };

        /* 动态创建节点 */
        this.init = function () {
            this.imgNode.style.position = 'absolute';
            this.imgNode.style.left = this.x +'px';
            this.imgNode.style.top = this.y +'px';
            this.imgNode.src = this.src;
            this.imgNode.id = 'myplane';
            this.imgNode.style.zIndex = 5;
            $('wrap').appendChild(this.imgNode);
        };
        //初始化飞机
        this.init();
    }

    /**
     * 创建子弹的构造函数
     */
    function createBullet(x,y,src,speed) {
        src = src || 'images/bullet.png';
        x = x || 127;
        y = y || 480;
        speed = speed || 8;


        this.src = src;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.power = 1;
        this.isDied = false;

        //子弹移动
        this.move = function() {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + 'px';
        };
       

        this.imgNode = document.createElement('img');
        this.init = function () {
            this.imgNode.style.position = 'absolute';
            this.imgNode.style.left = this.x - this.imgNode.offsetWidth / 2 + 'px';
            this.imgNode.style.top = this.y - this.imgNode.offsetHeight + 'px';
            this.imgNode.src = this.src;
            this.imgNode.className = 'bullet imgs';
            this.imgNode.id = 'mybullet';
            $('wrap').appendChild(this.imgNode);
        };
        this.init();
    }

    /**
     * 创建敌机的构造函数
     */
    function Enemy(x,y,blood,src,score,speed) {
        this.x = x;
        this.y = y || -30;
        this.blood = blood || 1;
        this.src = src || 'images/enemy1.png';
        this.speed = speed || 1;

        this.isDied = false;
        this.diedTime = 20;

        //敌机移动
        this.move = function () {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px';
        };
        this.imgNode = document.createElement('img');
        //初始化敌机
        this.init = function () {
            this.imgNode.style.position = 'absolute';
            this.imgNode.style.left = this.x - this.imgNode.offsetWidth + 'px';
            this.imgNode.style.top = this.y  + 'px';
            this.imgNode.src = this.src;
            this.imgNode.className = 'enemy imgs';
            $('wrap').appendChild(this.imgNode);
        };
        this.init();
    }

    /**
     * 道具的构造函数
     */
    function Prop(x,y,src,speed) {
        this.x = x;
        this.y = y;
        this.src = src || 'images/prop.png';
        this.speed = speed || 1;

        this.isDied = false;

        //道具移动
        this.move = function () {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) + this.speed + 'px';
        };
        this.imgNode = document.createElement('img');
        //初始化道具
        this.init = function () {
            this.imgNode.style.position = 'absolute';
            this.imgNode.style.left = this.x - this.imgNode.offsetWidth + 'px';
            this.imgNode.style.top = this.y  + 'px';
            this.imgNode.src = this.src;
            this.imgNode.className = 'prop imgs';
            $('wrap').appendChild(this.imgNode);
        };
        this.init();
    }

    /**
     * 大招的构造函数
     */
    function boom(src,x,y,speed) {
        this.src = src || 'images/bigbullet.png';
        this.x = x || 0;
        this.y = y || 570;
        this.speed = speed || 1;

        //大招移动
        this.move = function () {
            this.imgNode.style.top = parseInt(this.imgNode.style.top) - this.speed + 'px';
        };

        this.imgNode = document.createElement('img');
        this.init = function () {
            this.imgNode.style.position = 'absolute';
            this.imgNode.style.left = this.x  + 'px';
            this.imgNode.style.top = this.y  + 'px';
            this.imgNode.src = this.src;
            this.imgNode.className = 'bigshoot imgs';
            $('wrap').appendChild(this.imgNode);
        };
        this.init();
    }

};