var viewSize = (function(){

    var pageWidth = window.innerWidth,
        pageHeight = window.innerHeight;

    if (typeof pageWidth != 'number') {
        if (document.compatMode == 'CSS1Compat') {
            pageHeight = document.documentElement.clientHeight;
            pageWidth = document.documentElement.clientWidth;
        } else {
            pageHeight = document.body.clientHeight;
            pageWidth = document.body.clientWidth;
        }
    };
    if(pageWidth >= pageHeight){
        pageWidth = pageHeight * 360 / 640;
    }
   　 pageWidth = pageWidth >  414 ? 414 : pageWidth;
    pageHeight = pageHeight > 736 ? 736 : pageHeight;

    return {
        width: pageWidth,
        height: pageHeight
    };

})();

(function(){
    var lastTime = 0;
    var prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀

    var requestAnimationFrame = window.requestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame;

    var prefix;
//通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
    for( var i = 0; i < prefixes.length; i++ ) {
        if ( requestAnimationFrame && cancelAnimationFrame ) {
            break;
        }
        prefix = prefixes[i];
        requestAnimationFrame = requestAnimationFrame || window[ prefix + 'RequestAnimationFrame' ];
        cancelAnimationFrame  = cancelAnimationFrame  || window[ prefix + 'CancelAnimationFrame' ] || window[ prefix + 'CancelRequestAnimationFrame' ];
    }

//如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
    if ( !requestAnimationFrame || !cancelAnimationFrame ) {
        requestAnimationFrame = function( callback, element ) {
            var currTime = new Date().getTime();
            //为了使setTimteout的尽可能的接近每秒60帧的效果
            var timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
            var id = window.setTimeout( function() {
                callback( currTime + timeToCall );
            }, timeToCall );
            lastTime = currTime + timeToCall;
            return id;
        };

        cancelAnimationFrame = function( id ) {
            window.clearTimeout( id );
        };
    }

//得到兼容各浏览器的API
    window.requestAnimationFrame = requestAnimationFrame;
    window.cancelAnimationFrame = cancelAnimationFrame;
})()

var vs=document.getElementById("vs");
var ctx=vs.getContext("2d");

vs.width=viewSize.width;
vs.height=viewSize.height;
/*init();
function init(){
	
}*/
var k=viewSize.height/600;		//像素比例 图片大小为600
var gameover=false;
var isStarted=false;
var img=new Image();
var timer=null;
var food=false;
var Bird=new bird();
var pie=[];
var cancount=true;
var ground=new Ground();
var score=new Score();
var birdDid=false;
var over=document.getElementById("gameover");
img.src="img/img.png";
img.onload=start;
createPie();
function start(){
	check();		//检测水管碰撞;
	
	if(gameover){
		return;
	
		}
		else{
			//否则画图像
		ctx.clearRect(0,0,viewSize.width,viewSize.height);
		ctx.drawImage(img,0,0,800,600,0,0,Math.ceil(800*k),viewSize.height);
			
			if(!isStarted){		//是否开始游戏变量
				//准备开始画小鸟,水管
				
					Bird.draw();
				
				
				
				//水管
				//createPie();
				if(pie[0].canX<=-pie[0].imgX&&pie.length==4){
					pie[0]=null;
					pie[1]=null;
					pie.shift();
					pie.shift();
					cancount=true;
				}
				//alert(viewSize.width*0.5)
				if(pie[0].canX<=viewSize.width*0.5-pie[0].canW&&pie.length==2){
					//alert(23)
					createPie();
				}
				for(var i=0;i<pie.length;i++){
					pie[i].draw();
				}
				
				
				
				}
		}
	ground.draw();
	score.draw();
	
	timer=window.requestAnimationFrame(start);
	
}
var clickEventType=((document.ontouchstart!==null)?'click':'touchstart');
addEventListener(clickEventType,jumpBird,false);
function jumpBird(e){
	
   
	if(gameover){
		window.cancelAnimationFrame(timer);
		return;
	}
		
	if(!isStarted){
		for(var i=0;i<3;i++){
			Bird.y[i]=Bird.canY[i];
		}
		Bird.t=0;
	}
	else{
		return;
	}
	 var e = e || window.event;
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = false;
    }
	return false;
}

function bird(){
	this.imgX = [170, 222, 275];                          
    this.imgY = [750, 750, 750];                           
    this.imgW = [34, 34, 34];                             
    this.imgH = [24, 24, 24];                              
    var canX=100;
    this.canX=[canX,canX,canX];
    var canY=Math.ceil(viewSize.height/2+100);
    this.canY=[canY,canY,canY];
    var canW=Math.ceil(34*k);		
    var canH=Math.ceil(k*24);
    this.canW=[canW,canW,canW];
    this.canH=[canH,canH,canH];
    
    this.count=0;
    this.index=0;
    this.step=1;
    this.t=0	;	//小鸟速度
    this.y=[canY,canY,canY];
    this.dy=null;
}
bird.prototype.draw=function(){
	var index=this.index;
	
	this.count++;
	
	if(this.count==16){
		this.index+=this.step;
		this.count=0;
	}
	
	if((this.index==2&&this.step==1)||this.index==0&&this.step==-1){
		this.step=-this.step;
	}
	// 垂直抛物线计算公式:dy=a*this.t*(this.t-c)
	var c=50;
	var minY=15;
	var a=minY/100;
	//console.log(a)
	this.dy=a*this.t*(this.t-c);
	
	for(var i=0;i<3;i++){
		this.canY[i]=this.y[i]+Math.ceil(this.dy);
		
	}
	
	this.t++;
	ctx.drawImage(img, this.imgX[index], this.imgY[index], this.imgW[index], 
                       this.imgH[index], this.canX[index], this.canY[index], 
                       this.canW[index], this.canH[index]);

}
function Ground(){
	this.imgX=0;
	this.imgY=600;
	this.imgH=112;
	this.imgW=600;
	this.canH=112;
	this.canW=800;
	this.canX=0;
	this.canY=viewSize.height-this.canH;
	
}
Ground.prototype.draw=function(){
	ctx.drawImage(img,this.imgX,this.imgY,this.imgW,this.imgH,this.canX,this.canY,this.canW,this.canH);
	if(this.imgX>20){
		this.imgX=0;
	}
	this.imgX+=2;
}

function Pie(){
	this.imgW=52;
	this.imgH=420;
	this.imgY=751;
	this.canX=viewSize.width;
	this.canW=Math.ceil(50*k);
	this.canH=Math.ceil(250*k);
}

function upPie(top){
	Pie.call(this);
	this.imgX=70;
	this.canY=-top*1.1;
	this.draw=drawPie;
}
function downPie(top){
	Pie.call(this);
	this.canH=Math.ceil(top*k*(0.6+Math.random()));
	this.imgX=0;
	this.canY=viewSize.height-(ground.canH-15)-this.canH;
	this.draw=drawPie;
}

function drawPie(){
	var speed=2*k;
	this.canX-=speed;
	ctx.drawImage(img,this.imgX,this.imgY,this.imgW,this.imgH,this.canX,this.canY,this.canW,this.canH);
	
}


function createPie(){
	var minTop=Math.ceil(90/800*viewSize.height);
	var maxTop=Math.ceil(190/800*viewSize.height);
	var top=maxTop+(Math.ceil(Math.random()*(maxTop-minTop)));
	//console.log(top)
	pie.push(new upPie(top));
	pie.push(new downPie(top));
	
}

function Score(){
	this.imgX = 900;
    this.imgY = 400;
    this.imgW = 36;
    this.imgH = 54;
    this.canW = Math.ceil(36 * k);
    this.canH = Math.ceil(54 * k);
    this.canY = Math.ceil(50 / 800 * viewSize.height);
    this.canX = Math.ceil(viewSize.width / 2 - this.canW / 2);
	this.score=0;
	this.numW=0;
}
Score.prototype.draw=function(){
	var aScore=(""+this.score).split("");
	var len=aScore.length;
	console.log(this.score)
	for(var i=0;i<len;i++){
		var num=parseInt(aScore[i]);
		for(var j=10,k=1;j<100,k<10;j+=10,k++)
		if(this.score>=j){
			num=k;
		}
		if(num<5){
			var imgX=this.imgX+40*num;
			var imgY=400;
		}
		else{
			var imgX=this.imgX+40*(num-5);
			var imgY=460;
		}
		
		
	}
	ctx.drawImage(img,imgX,imgY,this.imgW,this.imgH,this.canX-this.numW,this.canY,this.canW,this.canH);
	if(this.score>=10){
		this.numW=this.canW;
		var aTwo=(""+this.score).split("")[1];
		//console.log(aTwo)
		if(aTwo<5){
			var imgX_=this.imgX+40*aTwo;
			var imgY_=400;
		}
		else{
			var imgX_=this.imgX+40*(aTwo-5);
			var imgY_=460;
		}
		ctx.drawImage(img,imgX_,imgY_,this.imgW,this.imgH,this.canX,this.canY,this.canW,this.canH);
	}
}


function check(){

					if(Math.floor(pie[0].canX)<=Math.floor(Bird.canX[0]-Bird.canW[0]+2)&&cancount){
						score.score++;
						cancount=false;
					}
					if(Bird.canY[0]<=0||Bird.canY[0]+Bird.canH[0]>=ground.canY){
						gameover=true;
						
						newGame();
						return;
					}
			var birdOver={
				top: Bird.canY[0],
			    bottom: Bird.canY[0] + Bird.canH[0],
			    left: Bird.canX[0],
			    right: Bird.canX[0] + Bird.canW[0]
			}
			function checkBird(r1,r2){
				var f=false;
				if(r1.top > r2.bottom || r1.bottom < r2.top || r1.right < r2.left || r1.left > r2.right){
       				 f = true;
    					}
				return !f;
			}
			for(var i=0;i<pie.length;i++){
				var t=pie[i];
				var pieOver={
				    top: t.canY,
			        bottom: t.canY + t.canH,
			        left: t.canX,
			        right: t.canX + t.canW
				}
				if(checkBird(birdOver,pieOver)){
					gameover=true;
					newGame();
					return;
				}
			}
			
}
					

function newGame(){
	
	over.style.display='block';
	over.style.left=viewSize.width/2-over.offsetWidth/2+'px';
	over.style.top=viewSize.height/2-over.offsetHeight/4+30+'px';
	ctx.drawImage(img, 170, 990, 300, 90, Math.ceil(viewSize.width * 0.5 - k * 277 * 0.5), 
              Math.ceil(200 / 800 * viewSize.height), 277 * k, 75 * k);
    ctx.drawImage(img, 550, 1005, 160, 90, Math.ceil(viewSize.width * 0.5 - k * 160 * 0.5), 
              Math.ceil(400 / 800 * viewSize.height), 160 * k, 90 * k);
   		ground=null;
   		Bird=null;
   		score=null;
   		for(var i=0;i<pie.length;i++){
   			pie[i]=null;
   		}
   		pie=[];
   		
}
over.onclick=over.ontouchstart=function(e){
	
	this.style.display='none';
	gameover=false;
	isStarted=false;
	cancount=true;
	Bird=new bird();
	ground=new Ground();
	score=new Score();
	pie=[];
	createPie();
	timer=window.requestAnimationFrame(start);
	 var e = e || window.event;
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = false;
    }

}
