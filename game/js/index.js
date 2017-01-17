// 血
function fire(cobj) {
    this.cobj=cobj;
    this.x=0;//移动的初始横坐标
    this.y=0;//移动的初始横坐标
    this.x1=20*Math.random()-10;
    this.y1=20*Math.random()-10;
    this.x2=20*Math.random()-10;
    this.y2=20*Math.random()-10;
    this.speedy=-2-Math.random()-2;
    this.speedx=(16*Math.random()-8);
    // this.life=5;
    this.r=4;
    this.color="red";
}
fire.prototype={
    draw:function () {
        var cobj=this.cobj;
        cobj.save();
        cobj.beginPath();
        cobj.fillStyle=this.color;
        cobj.translate(this.x,this.y);
        cobj.scale(this.r,this.r);
        cobj.moveTo(0,0);
        cobj.lineTo(this.x1,this.y1);
        cobj.lineTo(this.x2,this.y2);
        cobj.fill();
        cobj.restore();
    },
    update:function () {
        this.x+=this.speedx;
        this.y+=this.speedy;
        // this.life-=1;
        this.r-=0.6;
    }
}


function stone(cobj,x,y,color) {
    var color=color||"#fff";
    var stonearr=[];
    for(var i=0;i<5;i++){
        var obj=new fire(cobj);
        obj.x=x;
        obj.y=y;
        obj.color=color;
        stonearr.push(obj);
    }
    var a=setInterval(function () {
        for(var i=0;i<stonearr.length;i++){
            stonearr[i].draw();
            stonearr[i].update();
            if(stonearr[i].r<0){
                stonearr.splice(i,1);
            }
        }
        if(stonearr.length==0){
            clearInterval(a);
        }
    },50)
}


// 人物
function person(canvas,cobj,run,jump,stop) {
    this.canvas=canvas;
    this.x=30;
    this.y=25;
    this.width=240;
    this.height=240;
    this.h=360;
    this.cobj=cobj;
    this.speedx=3;
    this.run=run;
    this.jump=jump;
    this.stop=stop;
    this.state=0;
    this.status="run";
    this.mg=10;
    this.speedy=3;
    this.num=0;
}
person.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.status][this.state],0,0,240,240,0,0,this.width,this.height);
        this.cobj.restore();
    },
    update:function () {
        if(this.y>=this.h){
            this.y=this.h;
            stone(this.cobj,this.x+this.width/3,this.y+this.height);
        }else{
            this.speedy+=this.mg;
            this.y+=this.speedy;
        }
    }
}


// 障碍物
function hider(canvas,cobj,hider) {
    this.x=canvas.width;
    this.y=500;
    this.canvas=canvas;
    this.cobj=cobj;
    this.hider=hider;
    this.state=0;
    this.width=100;
    this.height=100;
}
hider.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hider[this.state],0,0,700,700,0,0,this.width,this.height);
        this.cobj.restore();
    }
}

// 游戏
function game(canvas,cobj,run,jump,stop,hider,runa,jumpa,end,logos,cj) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.canvasw=this.canvas.width;
    this.canvash=this.canvas.height;
    this.speed=8;
    this.hider=hider;
    this.hiderarr=[];
    this.speeds=0;
    this.bspeed=5;
    this.score=1;
    this.cj=cj;
    this.fenshu=0;
    this.life=5;
    this.end=end;
    this.logos=logos;
    this.runa=runa;
    this.jumpa=jumpa;
    this.t1;
    this.person=new person(canvas,cobj,run,jump,stop);
}
game.prototype={
    play:function (start,logo,end,logos) {
        logo.css({display:"display",animation:"logo 2s ease forwards"});
        start.css({display:"display",animation:"starts 2s ease forwards 1s"});
        this.name=prompt("请输入名字","admin");
        this.person.y=500;
        this.person.draw();
        this.person.update();
        this.run();
        this.key();
    },
    run:function () {
        var that=this;
        that.runa.play();
        var num1=0;
        var back=0;
        var step=5000+parseInt(5*Math.random())*1000;
        var lifes=document.querySelector(".life");

        function move(){

        }
        that.t1=setInterval(function () {
            that.cobj.clearRect(0,0,that.canvasw,that.canvash);
            that.person.num++;
            back-=this.speed;
            lifes.innerHTML="";
            for(var i=0;i<that.life;i++){
                var live=document.createElement("li");
                lifes.appendChild(live);
            }
            if(that.person.status=="run"){
                that.person.state=that.person.num%10;
            }else{
                that.person.state=0;
            }
            if(that.person.speedx>that.width/2){
                that.person.speedx=that.width/2;
            }else{
                that.person.speedx=3;
                that.speed=8;
            }
            that.person.draw();
            that.person.update();
            that.speeds-=5;
            if(that.speeds<-that.person.canvas.width){
                that.speeds=that.person.canvas.width;
            }
            that.canvas.style.backgroundPositionX=that.speeds+"px";
            if(num1%step==0){
                num1=0;
                step=5000+parseInt(5*Math.random())*1000;
                var hiderobj=new hider(that.canvas,that.cobj,that.hider);
                hiderobj.state=Math.floor(that.hider.length*Math.random());
                that.hiderarr.push(hiderobj);
                if(that.hiderarr.length>5){
                    that.hiderarr.shift();
                }
            }
            num1+=50;
            for(var i=0;i<that.hiderarr.length;i++){
                that.hiderarr[i].x-=that.speed;
                that.hiderarr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.hiderarr[i])){
                    if(!that.hiderarr[i].flag1){
                        that.life--;
                        stone(that.cobj,that.person.x+that.person.width/2,that.person.y+that.person.height/2,"red");
                        if(that.life<0){
                            that.runa.pause();
                            //存储到本地
                            var messages=localStorage.messages?JSON.parse(localStorage.messages):[];   //存储信息 将字符串转换为对象
                            var temp={name:that.name,score:that.score};
                            if(messages.length>0){
                                messages.sort(function(a,b){
                                    return a.score<b.score;  //由大到小
                                })
                                //添加数组
                                if(temp.score>messages[messages.length-1].score){
                                    if(messages.length==5){    //如果大于5个,替换掉最小的
                                        messages[messages.length-1]=temp;
                                    }else if(messages.length<5){  //如果不够5个,直接放进去即可
                                        messages.push(temp); //添加游戏信息到messages中
                                    }
                                }
                            }else{
                                messages.push(temp);
                            }
                            localStorage.messages=JSON.stringify(messages);  //将对象转化为字符串
                        }

                    }
                    that.hiderarr[i].flag1=true;
                    if(that.life<=0){
                        that.end.style.display="block";
                        that.logos.onclick=function(){
                            location.reload();
                        }
                    }
                }else if(that.hiderarr[i].x+that.hiderarr[i].width<that.person.x){
                    if(!that.hiderarr[i].flag&&!that.hiderarr[i].flag1){
                        if(that.score%3==0){
                            that.speed+=1;
                        }
                        that.fenshu+=1;
                        that.cj.innerHTML=that.fenshu;
                        if(that.cj.innerHTML%5==0){
                            that.life+=1;
                        }
                    }
                    that.hiderarr[i].flag=true;
                }
            }
        },40)
    },
    key:function (e) {
        var that=this;
        var flag=true;
        document.onkeydown=function (e) {
            if(!flag){
                return;
            }
            flag=false;
            if(e.keyCode==32){
                var init=0;
                that.jumpa.play();
                that.runa.pause();
                that.person.status="jump";
                var speeda=5;
                var r=80;
                var y=that.person.y;
                var t=setInterval(function () {
                    init+=speeda;
                    if(init>180){
                        stone(that.cobj,that.person.x+that.person.width/3,that.person.y+that.person.height);
                        clearInterval(t);
                        that.runa.play();
                        that.person.status="run";
                        flag=true;
                    }else{
                        var top=Math.sin(init*Math.PI/180)*r;
                        that.person.y=y-top;
                    }
                },40)
            }else if(e.keyCode==13){
                clearInterval(t);
                clearInterval(that.t1);
                that.runa.pause();
                that.person.status="stop";
                flag=true;
            }else if(e.keyCode==65){
                var init=0;
                that.jumpa.play();
                that.runa.pause();
                that.person.status="jump";
                var speeda=5;
                var r=80;
                var y=that.person.y;
                var t=setInterval(function () {
                    init+=speeda;
                    if(init>180){
                        stone(that.cobj,that.person.x+that.person.width/3,that.person.y+that.person.height);
                        clearInterval(t);
                        that.runa.play();
                        that.person.status="run";
                        flag=true;
                    }else{
                        var top=Math.sin(init*Math.PI/180)*r;
                        that.person.y=y-top;
                    }
                },40)
                that.run();
            }
        }
    }
}