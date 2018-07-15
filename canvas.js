const canvas = document.querySelector('canvas');
const zoom = document.getElementById('zoom');

const slider =document.getElementById('myRange');
var zoomValue=1;
//canvas.addEventListener("wheel", wheelZoom);

var leftMouseDown=false;
var rightMouseDown=false;
var latestMove=[null, null];
var lastZoomPos=[null,null];
var latestDrag=null;
var startZoom=[null, null];
let isBusy=false;

function translate(xdiff,ydiff){
    xdiff=xdiff/zoomValue;
    ydiff=ydiff/zoomValue;
    console.log("xdiff: "+typeof xdiff+" ydiff: "+ydiff);

    let xMinTemp=img.zoomMinX;
    let yMinTemp=img.zoomMinY;
    let widthXTemp=img.zoomWidthX;
    let widthYTemp=img.zoomWidthY;
    xMinTemp=xMinTemp-xdiff;
    yMinTemp=yMinTemp-ydiff;


    if(xMinTemp<0){
        xMinTemp=0;
    }
    if(yMinTemp<0){
        yMinTemp=0;
    }
    if(xMinTemp+widthXTemp>1280){
        xMinTemp=1280-widthXTemp;
    }
    if(yMinTemp+widthYTemp>480){
        yMinTemp=480-widthYTemp;
    }

    img.zoomMinX= xMinTemp;
    img.zoomMinY= yMinTemp;
    drawImg()



}

function dragZoom(diff){
    //console.log(diff);
    let xMin=0;
    let yMin=0;
    let xWidth=1280;
    let yWidth=480;
    if(diff<0 &&zoomValue<8){
        x=startZoom[0];
        y=startZoom[1];
        zoomValue+=Math.abs(diff/100*zoomValue);
        if(zoomValue>8){
            zoomValue=8;
        }
        xMin=Math.round(((x)-(1280/(zoomValue*2))));
        yMin=Math.round(y-(480/(zoomValue*2)));
        xWidth=Math.round(1280/(zoomValue));
        yWidth=Math.round(480/(zoomValue));}
    else if(diff>0 &&zoomValue>1){
        x=startZoom[0];
        y=startZoom[1];
        zoomValue-=Math.abs(diff/100*zoomValue);
        if(zoomValue<1){
            zoomValue=1;
        }
        xMin=Math.round(((x)-(1280/(zoomValue*2))));
        yMin=Math.round(y-(480/(zoomValue*2)));
        xWidth=Math.round(1280/(zoomValue));
        yWidth=Math.round(480/(zoomValue));
    } else{
        return
    }

    if(xMin<0){
        xMin=0;
    }
    if(yMin<0){
        yMin=0;
    }
    if(xMin+xWidth>1280){
        xMin=1280-xWidth;
    }
    if(yMin+yWidth>480){
        yMin=480-yWidth;
    }

    img.zoomMinX= xMin;
    img.zoomMinY= yMin;
    img.zoomWidthX = xWidth;
    img.zoomWidthY = yWidth;

    //setTimeout(wtf,10000);
    drawImg();
    console.log("done");





}

function wtf(){
    alert("balls")
}

function mapRange(xTrue,yTrue){
    var relX=Math.round((parseInt(xTrue)/1280)*(img.zoomWidthX)+img.zoomMinX);
    var relY=Math.round((parseInt(yTrue)/480)*(img.zoomWidthY)+img.zoomMinY);
    console.log(relX + "and "+relY);
    return [relX, relY];


}
canvas.addEventListener('mousedown', function(event) {

    if (event.button.toString()==="0"){
        leftMouseDown=true;
    }
    if (event.button.toString()==="2"){
        rightMouseDown=true;
    }
    event.preventDefault()
    //console.log(event);
    //c.rect(event.layerX,event.layerY,150,100);
    //c.stroke();
    //drawImg()

});
canvas.addEventListener('contextmenu', event => event.preventDefault());
canvas.addEventListener('mouseup', function(event) {
    leftMouseDown=false;
    rightMouseDown=false;
    startZoom=[null, null];
    latestDrag=null;
    latestMove=[null, null];
    event.preventDefault()
});

canvas.addEventListener('mouseleave', function(event) {
    leftMouseDown=false;
    rightMouseDown=false;
    latestMove=[null, null];
    startZoom=[null, null];
    latestDrag=null;
});





canvas.addEventListener('click', function(event) {
    //mapRange(event.layerX,event.layerY)
    //console.log(event);
   //c.rect(event.layerX,event.layerY,150,100);
   //c.stroke();
   //drawImg()

}, false);
canvas.addEventListener('mousemove', function(event) {

    if(leftMouseDown){

        isBusy=true;
        if(startZoom[0]==null){
            posses=mapRange(event.layerX, event.layerY);
            startZoom=[posses[0],posses[1]];

        }
        if(latestDrag!=null){
            dragZoom(latestDrag-event.layerX);
        }

        latestDrag=event.layerX;
    }

    if(rightMouseDown){
        if(latestMove[0]!=null){
            translate(event.layerX-latestMove[0],event.layerY-latestMove[1])
        }

        latestMove=[event.layerX,event.layerY];
    }


});


const c = canvas.getContext('2d');
c.imageSmoothingEnabled = false;
const img = new Image();

const reader = new FileReader();
reader.onload = function (){

    img.onload=function(){
        drawImg();


    };
    img.src = reader.result;
    if (img.zoomMinX==null){
    img.zoomMinX=0;
    img.zoomMinY=0;
    img.zoomWidthX=1280;
    img.zoomWidthY=480;}
    //imgelement.src=img

   // c.fillRect(20,20,150,100)
    //console.log(reader.result)
};
function handleFileSelect(evt) {
    console.log("hello")
    console.log(evt)
    files = evt.target.files;// FileList object
    slider.setAttribute("max", files.length.toString())
    console.log(files);

    loadImage(1)

}

function resetToolBtns(){
    resetList =document.querySelectorAll('#toolActive a i');
    for(var i=0, len=resetList.length; i < len; i++){resetList[i].style.color="white"}
}

function toolSelected(){
    resetToolBtns()
    this.querySelector('i').style.color="blue";
}

document.getElementById('fileLoad').addEventListener('change', handleFileSelect, false);
var toolUsedBtns =document.querySelectorAll('#toolActive a');
for(var i=0, len=toolUsedBtns.length; i < len; i++){toolUsedBtns[i].addEventListener('click', toolSelected)};



/*
<div class="column">
    <div id="loadImgDiv" class="ui container">
        <label for="fileLoadBtn" class="ui blue inverted grey icon button" id="addImagesBox">
            <i class="file icon"></i>
            Infoga bilder</label>
        <input name="files[]" type="file" id="fileLoadBtn" style="display:none" multiple>
        </d
 */