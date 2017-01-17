$(function(){
	var windoww=$(window).width();
	var windowh=$(window).height();
    var erasers=$(".erasers");


//设置画布的大小
    $(".canvas-box").css({width:windoww,height:windowh*0.75});
    $(".copy").css({width:windoww,height:windowh*0.75});
    var canvasw=$(".canvas-box").width();
    var canvash=$(".canvas-box").height();
    var canvas=document.querySelector("canvas");
    canvas.width=windoww;
    canvas.height=canvash;
    
//画图
    var cobj=canvas.getContext("2d");
    var copy=document.querySelector(".copy");
    var draws=new shape(canvas,copy,cobj);
    $(".drawtool li").click(function(){
        var fn=$(this).attr("data-role");
        if(fn!="pencil") {
            draws.type = fn;
            draws.draw();
        }else{
            draws.pencil();
        }
    })

//文件下拉菜单的操作
    $(".file").click(function(){
        erasers.css({display:"none"});
        draws.isshowxp=false;
        $(".file>.menu-list-con").slideToggle(200);
    })

//文件下拉菜单的操作
    $(".tuexit").click(function(){
        erasers.css({display:"none"});
        draws.isshowxp=false;
        $(".tuexit>.tuexitlis").slideToggle(200);
    })


//颜色
    $(".menu-list-con:eq(3)>li>input").change(function(){
    	draws[$(this).attr("data-role")]=$(this).val();
    })

//画图方式
    $(".menu-list-con:eq(4) li").click(function(){
        erasers.css({display:"none"});
        draws.isshowxp=false;
    	draws.style=$(this).attr("data-role")
    })

//线条宽度
    $(".menu-list-con:eq(5) li").click(function(){
        erasers.css({display:"none"});
        draws.isshowxp=false;
        var num=$(this).attr("data-role");
        if(num!=="null") {
            draws.linewidth=num
            draws.draw();
        }
    })

    $(".menu-list-con:eq(5) li input").change(function(){
        erasers.css({display:"none"});
        draws.isshowxp=false;
        var num=$(this).val();
            draws.linewidth=num
            draws.draw();

    })

//返回
    $(".menu-list-con:eq(1)").click(function(){
        erasers.css({display:"none"});
        draws.isshowxp=false;
    	if(draws.historys.length==0){
	            //no
	         cobj.clearRect(0,0,canvas.width,canvas.height);
	         setTimeout(function(){
	             alert("不能返回");
	         },10)
        }else{
	         if (draws.isback) {
	             if (draws.historys.length == 1) {
	                 draws.historys.pop();
	                 cobj.clearRect(0, 0, canvas.width, canvas.height);
	             } else {
	                 draws.historys.pop();
	                 cobj.putImageData(draws.historys.pop(), 0, 0);
	             }
	         } else {
	             cobj.putImageData(draws.historys.pop(), 0, 0);
	         }

	         draws.isback = false;
        }
    })


/*文件*/
    $(".menu-list-con:eq(0) li ").click(function(){
        erasers.css({display:"none"});
        draws.isshowxp=false;
        var index=$(".menu-list-con:eq(0) li").index(this);
        if(index==0){
         if(draws.historys.length>0){
                var yes=confirm("是否保存");
                if(yes){
                    var url=canvas.toDataURL();
                    console.log(url);
                    var newurl=url.replace("image/png","stream/octet")
                    location.href=newurl;
                }
         }

         cobj.clearRect(0,0,canvas.width,canvas.height);
         draws.historys=[];

        }else if(index==1){
         //返回


         if(draws.historys.length==0){
                //no
             cobj.clearRect(0,0,canvas.width,canvas.height);
             setTimeout(function(){
                 alert("不能返回");
             },10)
         }else{
             if (draws.isback) {
                 if (draws.historys.length == 1) {
                     draws.historys.pop();
                     cobj.clearRect(0, 0, canvas.width, canvas.height);
                 } else {
                     draws.historys.pop();
                     // cobj.putImageData(draws.historys.pop(), 0, 0);
                 }
             } else {
                 draws.historys.pop();

                 // cobj.putImageData(draws.historys.pop(), 0, 0);
             }
             draws.isback = false;
         }
        }else if(index==2) {
           var url=canvas.toDataURL();
           var newurl=url.replace("image/png","stream/octet")
            location.href=newurl;
        }
    })

//上传图片的处理



    /*马赛克*/
    function msk(dataobj,num,x,y) {
        var width = dataobj.width, height = dataobj.height;
        var num = num;
        var w = width / num;
        var h = height / num;
        for (var i = 0; i < num; i++) {//行
            for (var j = 0; j < num; j++) {//列  x
                var dataObj = cobj.getImageData(j * w, i * h, w, h);

                var r = 0, g = 0, b = 0;
                for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                    r += dataObj.data[k * 4 + 0];
                    g += dataObj.data[k * 4 + 1];
                    b += dataObj.data[k * 4 + 2];
                }

                r = parseInt(r / (dataObj.width * dataObj.height));
                g = parseInt(g / (dataObj.width * dataObj.height));
                b = parseInt(b / (dataObj.width * dataObj.height));
                console.log(r + "--" + g + "--" + b);

                for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                    dataObj.data[k * 4 + 0] = r;
                    dataObj.data[k * 4 + 1] = g;
                    dataObj.data[k * 4 + 2] = b;
                }


                cobj.putImageData(dataObj, x + j * w, y+i * h);

            }

        }

    }




    /*模糊*/
    function blur(dataobj,num,x,y) {
        var width = dataobj.width, height = dataobj.height;
        var arr=[];
        var num = num;
        for (var i = 0; i < height; i++) {//行
            for (var j = 0; j < width; j++) {//列  x
                var x1=j+num>width?j-num:j;
                var y1=i+num>height?i-num:i;
                var dataObj = cobj.getImageData(x1, y1,num, num);

                var r = 0, g = 0, b = 0;
                for (var k = 0; k < dataObj.width * dataObj.height; k++) {
                    r += dataObj.data[k * 4 + 0];
                    g += dataObj.data[k * 4 + 1];
                    b += dataObj.data[k * 4 + 2];
                }

                r = parseInt(r / (dataObj.width * dataObj.height));
                g = parseInt(g / (dataObj.width * dataObj.height));
                b = parseInt(b / (dataObj.width * dataObj.height));

                arr.push(r,g,b,255);

            }

        }

        for(var i=0;i<dataobj.data.length;i++){
            dataobj.data[i]=arr[i]
        }
        cobj.putImageData(dataobj,x,y);

    }


    // 反相
    function fx(dataobj,x,y){
        for(var i=0;i<dataobj.width*dataobj.height;i++){
            dataobj.data[i*4+0]=255-dataobj.data[i*4+0];
            dataobj.data[i*4+1]=255-dataobj.data[i*4+1];
            dataobj.data[i*4+2]=255-dataobj.data[i*4+2];
            dataobj.data[i*4+3]=255

        }

        cobj.putImageData(dataobj,x,y);
    }



        var  files=document.querySelector(".files");
        var imgfile=document.querySelector(".imgfile");
        var tuexit=document.querySelector(".tuexit");
        files.onchange=function(){
            var fileObj=this.files[0];
            var reader=new FileReader();
            reader.readAsDataURL(fileObj);
            reader.onload=function(e){
                    imgfile.src= e.target.result;
                    cobj.drawImage(imgfile,0,0,canvas.width,canvas.height)
                dataobj=cobj.getImageData(0,0,canvas.width,canvas.height);
            }
        }

        var lis=$(".tuexit>.tuexitlis>li");
        for(var i=0;i<lis.length;i++){
            lis[i].onclick=function(){
                var attr=this.getAttribute("data-role")
                if(attr=="blur"){
                    blur(dataobj,4,0,0)
                }else if(attr=="fx"){
                    alert(1);
                    fx(dataobj,0,0)
                }else if(attr=="msk"){
                    msk(dataobj,50,0,0)
                }
            }
        }

    //点击使橡皮消失
   /* $(":not(.erasers)").click(function(){
        erasers.css({display:"none"});
    })*/

//擦除
    var eraserobj=$(".eraserobj");

    $(".eraserobj").click(function(){
        draws.isshowxp=true;
        draws.eraser(erasers);
    })

    $(".menu-list-con:eq(6) li").click(function(){
        var num=$(this).attr("data-role");
        if(num!=="null") {
            draws.isshowxp=true;
            draws.eraserwh=num;
            draws.eraser(erasers);
        }
    })

    $(".menu-list-con:eq(6) li input").change(function(){
        var num=$(this).val();
        draws.isshowxp=true;
        draws.eraserwh=num;
        draws.eraser(erasers);

    })




})