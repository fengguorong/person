function shape(canvas,copy,cobj) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.copy=copy;
    this.type="line";
    this.style="fill";
    this.fillstyle="blue";
    this.strokestyle="blue";
    this.historys=[];
    this.linewidth=1;
    this.width=canvas.width;
    this.height=canvas.height;
    this.biannum=5;
    this.isback=true;
    this.isshowxp=true;
    this.eraserwh=10;
}
shape.prototype={
    init:function(){
        this.cobj.lineWidth=this.linewidth;
        this.cobj.fillStyle=this.fillstyle;
        this.cobj.strokeStyle=this.strokestyle;
    },
    draw:function(){
        var that=this;
        this.copy.onmousedown=function(e){
            var dx=e.offsetX;
            var dy=e.offsetY;
            that.copy.onmousemove=function(e){
                that.isback=true;
                that.init();
                that.cobj.clearRect(0,0,that.width,that.height);
                var movex=e.offsetX;
                var movey=e.offsetY;
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);
                }
                that.cobj.beginPath();
                that[that.type](dx,dy,movex,movey);
                that.cobj[that.style]();
            }
            that.copy.onmouseup=function(){
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
                that.copy.onmousemove=null;
                that.copy.onmouseup=null;

            }
        }
    },
    line:function(x,y,x1,y1){
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
    },
    rect:function(x,y,x1,y1){
        this.cobj.rect(x,y,x1-x,y1-y);
    },
    arc:function(x,y,x1,y1){
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,Math.PI*2);
        this.cobj.closePath();
    },
    bian:function(x,y,x1,y1){
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var angle=360/this.biannum*(Math.PI/180);
        for(var i=0;i<this.biannum;i++){
            this.cobj.lineTo(r*Math.cos(angle*i)+x,r*Math.sin(angle*i)+y);
        }
    },
    star:function(x,y,x1,y1){
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        var r1=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y))/2;
        var angle=360/(this.biannum*2)*(Math.PI/180);
        for(var i=0;i<this.biannum*2;i++){
            if(i%2==0){
                this.cobj.lineTo(r*Math.cos(angle*i)+x,r*Math.sin(angle*i)+y);
            }else{
                this.cobj.lineTo(r1*Math.cos(angle*i)+x,r1*Math.sin(angle*i)+y);
            }

        }
        this.cobj.closePath();
    },
    pencil:function(){
        var that=this;
        this.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.cobj.beginPath();
            that.cobj.moveTo(startx,starty);
            that.copy.onmousemove=function(e){
                that.init();
                var endx= e.offsetX;
                var endy= e.offsetY;
                that.cobj.clearRect(0,0,that.width,that.height);
                if(that.historys.length>0){
                    that.cobj.putImageData(that.historys[that.historys.length-1],0,0);
                }
                that.cobj.lineTo(endx,endy);
                that.cobj.stroke();
            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
            }
        }
    },
    eraser:function(erasers){
        var that=this;
        this.copy.onmousemove=function(e){
            if(!that.isshowxp){
                return false;
            }
            var startx= e.offsetX;
            var starty= e.offsetY;
            var lefts=startx-that.eraserwh/2;
            var tops=starty-that.eraserwh/2;
            if(lefts>=that.width-that.eraserwh){
                lefts=that.width-that.eraserwh;
            }
            if(tops>=that.height-that.eraserwh){
                tops=that.height-that.eraserwh;
            }
            if(lefts<0){
                lefts=0;
            }
            if(tops<0){
                tops=0;
            }
            erasers.css({width:that.eraserwh+"px",height:that.eraserwh+"px",display:"block",left:lefts,top:tops});

        }
        that.copy.onmousedown=function(e){
            var startx= e.offsetX;
            var starty= e.offsetY;
            that.copy.onmousemove=function(e){
                var movex= e.offsetX;
                var movey= e.offsetY;
                var lefts=movex-that.eraserwh/2;
                var tops=movey-that.eraserwh/2;
                if(lefts>=that.width-that.eraserwh){
                    lefts=that.width-that.eraserwh;
                }
                if(tops>=that.height-that.eraserwh){
                    tops=that.height-that.eraserwh;
                }
                if(lefts<0){
                    lefts=0;
                }
                if(tops<0){
                    tops=0;
                }
                erasers.css({width:that.eraserwh+"px",height:that.eraserwh+"px",display:"block",left:lefts,top:tops});
                that.cobj.clearRect(lefts,tops,that.eraserwh,that.eraserwh);
            }
            that.copy.onmouseup=function(){
                that.copy.onmouseup=null;
                that.copy.onmousemove=null;
                that.eraser(erasers);
                that.historys.push(that.cobj.getImageData(0,0,that.width,that.height));
            }
        }

    }
}





















