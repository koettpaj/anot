const canvas = document.querySelector('canvas');
const zoom = document.getElementById('zoom');
$("#messageBox").hide();
const slider =document.getElementById('myRange');
let zoomValue=1;


const zoomIcon =document.getElementById('zoomIcon');
const moveIcon =document.getElementById('moveIcon');
const selectIcon =document.getElementById('selectIcon');

const vipLoad = document.getElementById('vipLoad');
//canvas.addEventListener("wheel", wheelZoom);
let imageIndex=0;
let leftMouseDown=false;
let  rightMouseDown=false;
let  latestMove=[null, null];
let lastZoomPos=[null,null];
let latestDrag=null;
let startZoom=[null, null];
let prevTool=null;
let currentTool=null;
let currentToolIcon=null;
let zoomBlock=false;
let textVIP=[];
let canvasVIP=[];
const loadCircle = document.getElementById("loadCircle");
const loadText = document.getElementById("loadText")
const messageBox = document.getElementById("messageBox");
const messageHeader = document.getElementById("messageHeader");
const messageP = document.getElementById("messageP");
let numWorkers=0;

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
    startZoom=[xMinTemp+widthXTemp/2 ,yMinTemp+widthYTemp/2];


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
function prevVIP(index){
    for (i = index; i >= 0; i--) {

        if(index>textVIP[i]){

            slider.value=textVIP[i];
            sliderChange(textVIP[i]);
            return;
        }
    }
}


function nextVIP(index){
    for (i = 0; i < textVIP.length; i++) {

        if(index<textVIP[i]){

            slider.value=textVIP[i];
            sliderChange(textVIP[i]);
            return;
        }
    }



}


function dragZoom(diff){
    //console.log(diff);


    console.log("ZOOMING");
    let xMin=0;
    let yMin=0;
    let xWidth=1280;
    let yWidth=480;

    if(diff<0 &&zoomValue<8){
        let x=startZoom[0]
        let y=startZoom[1]
        zoomValue+=Math.abs(diff/200*zoomValue);
        if(zoomValue>8){
            zoomValue=8;
        }
        xMin=(((x)-(1280/(zoomValue*2))));
        yMin=(y-(480/(zoomValue*2)));
        xWidth=(1280/(zoomValue));
        yWidth=(480/(zoomValue));}
    else if(diff>0 &&zoomValue>1){
        let x=startZoom[0]
        let y=startZoom[1]


        zoomValue-=Math.abs(diff/200*zoomValue);
        if(zoomValue<1){
            zoomValue=1;
        }
        xMin=(((x)-(1280/(zoomValue*2))));
        yMin=(y-(480/(zoomValue*2)));
        xWidth=(1280/(zoomValue));
        yWidth=(480/(zoomValue));
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
    //console.log("done");





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



    indexPath=0;
    lastZoomPos=startZoom;
    if(zoomValue<1.2){
        startZoom=[null, null];
    }

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
    if (currentTool==="select"){
        draw(event);
    }



}, false);
canvas.addEventListener('mousemove', function(event) {


    if(leftMouseDown && currentTool==="zoom"){




        if(startZoom[0]==null){

            posses=mapRange(event.layerX, event.layerY);

            startZoom=[posses[0],posses[1]];

        }
        if(latestDrag!=null){
            dragZoom(latestDrag-event.layerX);
        }
        if(latestDrag-event.layerX>0){
            lastZoomPos=startZoom;
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

document.addEventListener('keydown', function(event) {
    const key = event.key; // "a", "1", "Shift", etc.
    let index=imageIndex;
    if(key==="a"){
        prevVIP(index)
    }
    else if(key==="d"){
        nextVIP(index)
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
function handleVIPSelect(evt) {
    console.log(evt)
    file = evt.target.files;// FileList object

    let reader3 = new FileReader();
    reader3.onload = function() {
        let contents = reader3.result;
        let res = contents.split(".png");
        res.splice(-1,1)
        for (index in res){
            hashindex=res[index].indexOf("#")
            res[index]=parseInt(res[index].substr(hashindex+1));
        }
        textVIP=res;
        alertMessage("n00t säger:", "Hittade "+textVIP.length+" bilder att annotera.", "positive",5000);
        vipLoad.value="";
    };

    reader3.readAsText(file[0]);



}

function resetToolBtns(){
    resetList =document.querySelectorAll('#toolActive a i');
    for(var i=0, len=resetList.length; i < len; i++){resetList[i].style.color="white"}
}

function toolSelected(){
    resetToolBtns()

    currentToolIcon=this.querySelector('i');
    idString=currentToolIcon.id;
    currentTool=idString.substring(0,idString.length-4);
    this.querySelector('i').style.color="Aqua";
}

document.getElementById('fileLoad').addEventListener('change', handleFileSelect, false);
document.getElementById('vipLoad').addEventListener('change', handleVIPSelect, false);
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