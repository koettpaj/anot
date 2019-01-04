canvas.addEventListener('mousedown', function(event) {


    if (event.button.toString()==="0"){
        leftMouseDown=true;
    }
    if (event.button.toString()==="2"){

        rightMouseDown=true;
    }
    //event.preventDefault()
    //console.log(event);
    //c.rect(event.layerX,event.layerY,150,100);
    //c.stroke();
    //drawImg()

});
canvas.addEventListener('contextmenu', event => event.preventDefault());


thead.addEventListener('contextmenu', function(e){
    e.preventDefault();
    alertMessageInputLayerPaste(e);

});

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

    if(zoomBox){
        renderZoom(event)
    }

    if(isDrawing && currentTool==="select"){
        drawImg();
        drawMarking();
        //let posses = mapRange(event.layerX, event.layerY)
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.lineWidth=1;
        c.lineTo(event.layerX, event.layerY);
        c.stroke();
    }


});
saveBtn.addEventListener("click", function(){
    let dl = document.createElement('a');
    dl.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(drawingList)));
    dl.setAttribute('download', 'canvas_save.json');
    dl.click();

});

exportBtn.addEventListener("click", function(){
    $('#leftOrRight')
        .transition('swing left')
    ;

    //exportImages();
})



document.addEventListener('keydown', function(event) {

    const key = event.key; // "a", "1", "Shift", etc.
    console.log(key);
    let index=imageIndex;
    if(key==="ArrowRight"){
        if(imageIndex<files.length){

        slider.value=imageIndex+1;
        sliderChange(imageIndex+1);
    }}
    if(key==="ArrowLeft"){
        if(imageIndex>0){
            slider.value=imageIndex-1;
            sliderChange(imageIndex-1);
        }}


    if(key===prevKeyBinding.value){
        prevVIP(index)
    }

    if(key===zoomBoxKeyBinding.value){
        zoomBoxa.click();
    }
    else if(key===nextKeyBinding.value){
        nextVIP(index)}

    else if(key===zoomKeyBinding.value){
        $('#zoomIcon').click();
        }
    else if(key===selectKeyBinding.value){
        $('#selectIcon').click();
    }

    else if(key==="h"){
        $('#moveIcon').click();
    }


    else if(key===" " && currentTool==="select"){
        console.log("FINISH");
        finishPath();
        drawMarking();
    }
});

document.getElementById('fileLoad').addEventListener('change', handleFileSelect, false);
document.getElementById('vipLoad').addEventListener('change', handleVIPSelect, false);
document.getElementById('load').addEventListener('change', handleProjectSelect, false);
document.getElementById('leftSide').addEventListener('click', handleLeft, false);
document.getElementById('rightSide').addEventListener('click', handleRight, false);
document.getElementById('canvasFloat').addEventListener('click', removeCanvasFloat, false);
var toolUsedBtns =document.querySelectorAll('#toolActive a');
for(var i=0, len=toolUsedBtns.length; i < len; i++){toolUsedBtns[i].addEventListener('click', toolSelected)};
var colorSelectDivs =document.querySelectorAll('#cardcontent td');
for(var i=0, len=colorSelectDivs.length; i < len; i++){colorSelectDivs[i].addEventListener('mouseover', colorSelected)};
for(var i=0, len=colorSelectDivs.length; i < len; i++){colorSelectDivs[i].addEventListener('click', colorSelectedFinal)};