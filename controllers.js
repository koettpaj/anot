function sliderChange(value){

    loadImage(value);
    updateWholeTable();
}

function loadImage(index){

    reader.readAsDataURL(files[index-1]);
    imageIndex=index;

}



function getVIP(){
    canvasVIP=[];
    loadCircle.className="ui active dimmer";
    findVIP(0);
}


function findVIP(index){
        loadText.innerHTML=index+"/"+files.length;

        let reader2 = new FileReader();
        reader2.onload = function (){
            let tempimg = new Image();
            tempimg.onload=function(){

                getData(tempimg,143,24, index);
            };
            tempimg.src=reader2.result;

        };
        reader2.readAsDataURL(files[index]);





}


function getData(tempImg,x,y, index){

    let ypos= Math.floor(index/1280);
    let xpos = index%1280
    c.drawImage(tempImg,x,y,1,1,xpos,ypos,1,1);
    var imgd = c.getImageData(xpos,ypos, 1, 1);
    var pix = imgd.data;

    if(pix[0]>200 &&pix[1]<100){
        canvasVIP.push(index+1);
    }
    if(index<files.length-1){
        findVIP(index+1);
    }
    else{
        loadCircle.className="ui dimmer";
        if(textVIP.length==0){
            alertMessage("n00t säger:","Hittade "+canvasVIP.length+" bilder att annotera.","",5000);
        }

        else if(textVIP.length!==canvasVIP.length){
            alertMessage("n00t säger:","Hittade "+canvasVIP.length+" bilder att annotera, men i textfilen står det "+textVIP.length+".","NEGATIVE",5000);
        }

        else if(textVIP.length==canvasVIP.length){
            alertMessage("n00t säger:","Hittade "+canvasVIP.length+" bilder att annotera, vilket stämmer överens med textfilen.","POSITIVE",5000);
        }
    }

}

function drawImg(){

    canvas.width = img.width;
    canvas.height = img.height;
    c.imageSmoothingEnabled = false;
    //c.scale(zoomValue, zoomValue)
    //c.drawImage(img,0,0,1282,482);

    //console.log("image dimensions: "+img.zoomMinX+" "+img.zoomMinY+" "+img.zoomWidthX+" "+img.zoomWidthY+" zv: "+zoomValue);
    c.drawImage(img,img.zoomMinX,img.zoomMinY,img.zoomWidthX,img.zoomWidthY,0,0,1280,480);


    //c.drawImage(img, img.width / zoom, img.height / zoom, img.width / zoom, img.height / zoom, 0, 0, canvas.width, canvas.height);

}

function drawMarking(){
    if(drawingList[imageIndex]==null){
        return
    }

    console.log("total: "+drawingList[imageIndex].length);
    let i;
    for(i=0;i<drawingList[imageIndex].length; i++){
        if(drawingList[imageIndex][i].altering){
            continue;
        }
        if(!drawingList[imageIndex][i].show){
            continue;
        }

        c.beginPath();
        c.lineWidth=1/zoomValue;
        c.strokeStyle=drawingList[imageIndex][i].color;
        c.setTransform(zoomValue,0,0, zoomValue,-img.zoomMinX*zoomValue,-img.zoomMinY*zoomValue);
        let coordinateList=drawingList[imageIndex][i].coordinates[0];
        c.moveTo(coordinateList[0][0], coordinateList[0][1]);
        for (y = 1; y <coordinateList.length; y++) {
            c.lineTo(coordinateList[y][0], coordinateList[y][1]);

            c.stroke();
        }
        if(drawingList[imageIndex][i].finished){
            //c.closePath();
            c.fillStyle=drawingList[imageIndex][i].color;
            c.fill();
        }




    }
    drawAlter();


}

function drawAlter(){

    if(drawingList[imageIndex]==null){
        return
    };



    let i;
    for(i=0;i<drawingList[imageIndex].length; i++){
        if(!drawingList[imageIndex][i].altering){
            continue;
        }

        c.beginPath();
        c.lineWidth=1/zoomValue;
        c.strokeStyle="orange";
        c.setTransform(zoomValue,0,0, zoomValue,-img.zoomMinX*zoomValue,-img.zoomMinY*zoomValue);
        let coordinateList=drawingList[imageIndex][i].coordinates[0];
        c.fillStyle="blue";
        //c.fillRect(coordinateList[0][0]-5/zoomValue, coordinateList[0][1]-5/zoomValue, 10/zoomValue, 10/zoomValue);

        //c.arc(coordinateList[0][0], coordinateList[0][1], 10/zoomValue, 0, 2*Math.PI);
        c.moveTo(coordinateList[0][0], coordinateList[0][1]);
        for (y = 1; y <coordinateList.length; y++) {
            console.log("DRAWING SDHT");
            c.lineTo(coordinateList[y][0], coordinateList[y][1]);


            //c.fillRect(coordinateList[y][0]-(5/zoomValue), coordinateList[y][1]-(5/zoomValue),10/zoomValue,10/zoomValue);

            //c.arc(coordinateList[y][0], coordinateList[y][1], 10/zoomValue, 0, 2*Math.PI);
            //let box = drawBox(coordinateList[y][0], coordinateList[y][1],y,i);
            //drawingList[imageIndex][i].coordinates[1].push(box);
        }
        c.closePath();
        c.stroke();





    }

}

function clearBoxes(pathIndex){



    objectBeingAltered.coordinates[1]=[];

}

function createBoxes(){



        let coordinateList=objectBeingAltered.coordinates[0];
        for (y = 0; y <coordinateList.length; y++) {

            let box = createBox(coordinateList[y][0], coordinateList[y][1],y);
            objectBeingAltered.coordinates[1].push(box);
        }

}

function dragStart(event,box){


    box.style.background="red";
    let boxBeingDraggedLocal = Object();
    boxBeingDraggedLocal.box=box;
    boxBeingDraggedLocal.index= objectBeingAltered.coordinates[1].indexOf(boxBeingDraggedLocal.box);
    boxBeingDragged=boxBeingDraggedLocal;
    //console.log("I AM BEING DRAGGED! "+box);
   // box.style.left=event.x;
    //box.style.top=event.y;

}
function dragOver(e) {
    if (e.preventDefault) {
        //  e.preventDefault(); // Necessary. Allows us to drop.
    }
    if(e.layerX<15 || e.layerY<15){
        return
    }

    console.log(e)
    let posses = mapRange(e.layerX, e.layerY);
    boxBeingDragged.box.style.top=e.layerY+"px";
    boxBeingDragged.box.style.left=e.layerX+"px";


    console.log(posses);
    objectBeingAltered.coordinates[0][boxBeingDragged.index]=[posses[0],posses[1]];
    //drawMarking();
    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
    //console.log(e);
    if(objectBeingAltered.coordinates[0].length<10){
        drawImg();
        drawMarking();

    }


}

function drop(e, box, boxIndex, pathIndex){
    console.log(e);
    boxBeingDragged.box.style.top=e.layerY+"px";
    boxBeingDragged.box.style.left=e.layerX+"px";

}



function createBox(relX,relY, boxIndex){

    let box= document.createElement("div");
    box.style.position="inherit";
    box.style.width="10px";
    box.style.height="10px";
    //box.style.background="green";
    let posses = getTruePos(relX,relY);
    console.log("True posses"+posses)
    box.style.top=posses[1]-5+"px";
    box.style.left=posses[0]-5+"px";
    box.style.zIndex=zindex.toString();
    box.style.background="green";
    box.draggable=true;
    box.style.borderRadius="50%";

    box.addEventListener("dragstart", function(e){
        dragStart(e,box)
    });
    canvasFloat.addEventListener("dragover", function(e){
        dragOver(e)
    });
    canvasFloat.addEventListener("drop", function(e){
        drop(e)
    });

    zindex+=1;
    canvasFloat.appendChild(box);
    return box


}

function getTruePos(relX,relY){
    //let trueX=(relX/(img.zoomWidthX+img.zoomMinX))*1280/zoomValue;
    //let trueY=(relY/(img.zoomWidthY+img.zoomMinY))*480/zoomValue;

    let trueX=((relX/img.zoomWidthX)*1280)-img.zoomMinX*zoomValue;
    let trueY=((relY/img.zoomWidthY)*480)-img.zoomMinY*zoomValue;
    //let trueX=(relX*1280)/(img.zoomWidthX+img.zoomMinX);
    //let trueY=(relY*480)/(img.zoomWidthY+img.zoomMinY);    //(50*1280)/(100)+0;
    //let trueX=(292/1280)/(img.zoomWidthX+img.zoomMinX);
    return [trueX,trueY];
}



function alertMessage(header,msg, type, duration){

    let posses=canvas.getBoundingClientRect();
    console.log("gegdgdg");
    console.log(posses["top"]+"px");
    messageBox.style.top=posses["top"]+"px";
    messageBox.style.left=posses["left"]+"px";
    messageBox.className="ui "+type+" message";
    messageHeader.innerHTML=header;
    messageP.innerHTML=msg;
    $('#messageBox')
        .transition('slide right').transition({animation:'slide right',interval:duration,onComplete:function() {$('#messageBox').hide()}})
    ;



}

function copyOne(e){
    let obj = $('#messageBoxInputLayer').data("selected");
    toCopy= obj;
    $('#messageBoxInputLayer')
        .transition('slide right')
    ;

}

function copyAll(){
    let obj = $('#messageBoxInputLayer').data("selected");
    for(let i=0; i<files.length;i++){
        if(drawingList[i]==null){
            drawingList[i]=[]
        }
        drawingList[i].push(obj);
    }
    $('#messageBoxInputLayer')
        .transition('slide right')
    ;
    alertMessage("n00t säger:","Kopierade masken till "+files.length+" bilder.","positive",5000);
}

function alertMessageInput(event){




    messageBoxInput.style.top=event.y+"px";
    messageBoxInput.style.left=event.x+"px";

    //messageHeader.innerHTML=header;
    //messageP.innerHTML=msg;
    $('#messageBoxInput')
        .transition('slide right')
    ;

}
function alertMessageInputLayer(event, obj){




    messageBoxInputLayer.style.top=event.y+"px";
    messageBoxInputLayer.style.left=event.x+"px";
    $('#messageBoxInputLayer').data("selected",obj);
    //messageHeader.innerHTML=header;
    //messageP.innerHTML=msg;
    $('#messageBoxInputLayer')
        .transition('slide right')
    ;

}
function alertMessageInputLayerPaste(event){




    messageBoxInputLayerPaste.style.top=event.y+"px";
    messageBoxInputLayerPaste.style.left=event.x+"px";

    //messageHeader.innerHTML=header;
    //messageP.innerHTML=msg;
    $('#messageBoxInputLayerPaste')
        .transition('slide right')
    ;

}

function paste(e,copy){
    if(  drawingList[imageIndex]==null){
        drawingList[imageIndex]=[];
    }
    let copyobj=toCopy
    if(copy){

        copyobj = jQuery.extend(true, {}, toCopy);
    }

    drawingList[imageIndex].push(copyobj);
    $('#messageBoxInputLayerPaste')
        .transition('slide right')
    ;
    drawImg();
    drawMarking();
    updateWholeTable();
}

