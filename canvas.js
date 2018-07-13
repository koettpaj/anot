const canvas = document.querySelector('canvas');
const zoom = document.getElementById('zoom');

const slider =document.getElementById('myRange');
var zoomValue=1;
canvas.addEventListener("wheel", zoomy);
var xWidth=1280;
var xMin=0;
var yWidth=480;
var yMin=0;


function zoomy(event) {
    if(event.deltaY<0){
        if (zoomValue<4){
        zoomValue+=0.2;
        xMin=(event.layerX/zoomValue)-(1280/(zoomValue+0.2))/2;
        yMin=(event.layerY/zoomValue)-(480/(zoomValue+0.2))/2;
        xWidth=1280/(zoomValue+0.2);
        yWidth=480/(zoomValue+0.2);
        }}
    if(event.deltaY>0){
        if (zoomValue>1){
        zoomValue-=0.2 }
    }
    drawImg()
}

canvas.addEventListener('click', function(event) {

    //console.log(event);
   c.rect(event.layerX,event.layerY,150,100);
   c.stroke();
   //drawImg()

}, false);
canvas.addEventListener('mousemove', function(event) {

    //alert(event.screenX)
    //console.log(event);
    drawImg()
    //c.rect((event.layerX/zoomValue)-(1280/(zoomValue+0.2))/2,(event.layerY/zoomValue)-(480/(zoomValue+0.2))/2,1280/(zoomValue+0.2),480/(zoomValue+0.2));
    c.rect((event.layerX)-(1280*0.4),event.layerY-(480*0.4),1280*0.8,480*0.8);
    c.strokeStyle="#FF0000";
    c.stroke();
    //drawImg()

}, false);
const imgelement = document.querySelector('img');

const c = canvas.getContext('2d');
c.imageSmoothingEnabled = false;
const img = new Image();

const reader = new FileReader();
reader.onload = function (){

    img.onload=function(){
        drawImg(1);


    };
    img.src = reader.result;
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