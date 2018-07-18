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

document.getElementById('fileLoad').addEventListener('change', handleFileSelect, false);
document.getElementById('vipLoad').addEventListener('change', handleVIPSelect, false);
var toolUsedBtns =document.querySelectorAll('#toolActive a');
for(var i=0, len=toolUsedBtns.length; i < len; i++){toolUsedBtns[i].addEventListener('click', toolSelected)};