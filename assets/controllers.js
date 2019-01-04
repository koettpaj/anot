function sliderChange(value){

    loadImage(value);
    updateWholeTable();
}

function loadImage(index){
    //console.log("Reading "+files[parseInt(index)-1].name);
    reader.readAsDataURL(files[parseInt(index)-1]);
    imageIndex=parseInt(index);

}

function sliderContrast(value){
    contrast=value;
    drawImg();
    drawMarking();

}


function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
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

function zoomBoxToggle(e){
        if(zoomBox){
            zoomBox=false;
            $("#zoomCanvas").hide();
            zoomBoxa.className="item"
        }
        else{
            zoomBox=true;
            $("#zoomCanvas").show();
            zoomBoxa.className="active item"
        }
        console.log(this);

}

function drawImg(){
    imageName.innerHTML=imageIndex;
    //console.log("Drawing "+files[imageIndex].name);
    if(textVIP.includes(imageIndex)){
        imageName.style.color="red";
    }
    else{
        imageName.style.color="yellow";
    }

    if(zoomValue<1.1){
        imageName.style.display="none";
    }
    else{
        imageName.style.display="block";
    }
    canvas.width = img.width;
    canvas.height = img.height;
    c.imageSmoothingEnabled = false;
    if(contrast!==100){
        c.filter="contrast("+contrast+"%)";
    }

    c2.imageSmoothingEnabled = false;
    //c.scale(zoomValue, zoomValue)
    //c.drawImage(img,0,0,1282,482);

    //console.log("image dimensions: "+img.zoomMinX+" "+img.zoomMinY+" "+img.zoomWidthX+" "+img.zoomWidthY+" zv: "+zoomValue);
    c.drawImage(img,img.zoomMinX,img.zoomMinY,img.zoomWidthX,img.zoomWidthY,0,0,1280,480);



    //c.drawImage(img, img.width / zoom, img.height / zoom, img.width / zoom, img.height / zoom, 0, 0, canvas.width, canvas.height);

}

function renderZoom(event){

    let canvasPos = canvas.getBoundingClientRect();
    zoomCanvas.style.top=event.layerY+canvasPos.top-64+"px";
    zoomCanvas.style.left=event.layerX+canvasPos.left-64+"px";
    let cSmall = zoomCanvas.getContext('2d');
    let minX=event.layerX-16;
    let minY=event.layerY-16;

    cSmall.imageSmoothingEnabled = false;
    cSmall.drawImage(canvas,minX,minY,32,32, 0, 0,128, 128);


}
function downloadImage()
{
    c.imageSmoothingEnabled = false;
    let link = document.createElement('a');
    link.setAttribute('download', 'MintyPaper.png');
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
}

function exportImages(){
    zoomValue=1.0000;
    resetZoom();

    let zip = new JSZip();
    let imgdir = zip.folder("images");
    imgdir = zip.folder("images");

    for(let i=0;i<textVIP.length;i++){
        if(drawingList[indexDict[textVIP[i]]+1]!==undefined){

            let imgdata=exportImage(indexDict[textVIP[i]+1]);
            let name="";
            if(files[indexDict[textVIP[i]]]==="undefined"){
                name="no_name_"+drawingList[indexDict[textVIP[i]]]+".png";
            }
            else{
                name=files[indexDict[textVIP[i]]].name;
            }

            imgdir.file(name, imgdata, {base64: true});




        }

    }
    zip.generateAsync({type:"blob"})
        .then(function (blob) {
            saveAs(blob, projectName+".zip");
        });

    /*
    zip.generate({type:"base64"}).then(function (base64) {
        window.location = "data:application/zip;base64," + base64;
    });
       */


}


function exportImage(index){
    /*
    if(drawingList[index]===null){
        alert("Missing data for img: "+index);
    }*/
    console.log(index);
    let layers=[];
    zoomValue=1.0000;
    translate(0,0);
    resetZoom();

    c.clearRect(0, 0, 1280, 480);
    drawMarking();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c2.setTransform(1, 0, 0, 1, 0, 0);
    for(let objIndex=0;objIndex<drawingList[index].length; objIndex++){

        c.clearRect(0, 0, 1280, 480);
        drawSingleMark(drawingList[index][objIndex].coordinates[0],drawingList[index][objIndex].color);
        let imageData=c.getImageData(0,0,1280,480);


        for(let i=3;i<imageData.data.length;i+=4){
            if(imageData.data[i-1]!==255 && imageData.data[i-1]!==128){
                imageData.data[i-1]=0;
            }
            if(imageData.data[i-2]!==255 && imageData.data[i-2]!==128){
                imageData.data[i-2]=0;
            }
            if(imageData.data[i-3]!==255 && imageData.data[i-3]!==128){
                imageData.data[i-3]=0;
            }

            if(imageData.data[i-1]+imageData.data[i-2]+imageData.data[i-3]>0){
                imageData.data[i]=255;
            }


        }
        //console.log(objIndex+ " hoho");
        layers.push(imageData)
    }
    c.fillStyle = '#000000';
    c.fillRect(0,0,1280,480)

    for(let layerIndex=0; layerIndex<layers.length;layerIndex++){

        c2.putImageData(layers[layerIndex],0,0);
        c.drawImage(canvas2,0,0);
    }


    if(sideChosen==="left"){
        c.putImageData(createDarkness(), 640,0);
    }
    else if(sideChosen==="right"){
        c.putImageData(createDarkness(), 0,0);
    }
    else{
        alert("No side chosen for export. Try setting it programmatically and try again.")
    }



    let imgData = canvas.toDataURL();
    let imgDataStripped=imgData.replace("data:image/png;base64,","");
    return imgDataStripped;

}

function createDarkness(){
    let darkness = c.createImageData(640, 480);
    for(let i=3;i<darkness.data.length;i+=4){
        darkness.data[i]=255;
    }
    return darkness
}

function removeAA(listpath, color){
    drawSingleMark(listpath,color)
    let colors=color.substring(5,color.length-1).split(",");
    for(y=0;y<480;y++){
        console.log("On line "+y);
        for(x=0;x<1280;x++){
            let pxl= c.getImageData(x, y, 1, 1);
            let pxldata=pxl.data;
            if(pxldata[0]===0 && pxldata[1]===0 && pxldata[1]===0 ){
                continue;
            }
            let rdiff=Math.abs(parseInt(colors[0])-pxldata[0]);
            let gdiff=Math.abs(parseInt(colors[1])-pxldata[1]);
            let bdiff=Math.abs(parseInt(colors[2])-pxldata[2]);
            if(rdiff>50 && gdiff>50 && bdiff>50){
                pxldata[0]=0;
                pxldata[1]=0;
                pxldata[2]=0;
            }
            else{
                pxldata[0]=colors[0];
                pxldata[1]=colors[1];
                pxldata[2]=colors[2];
            }
            c.putImageData(pxl,x,y)

        }
    }


}
function drawSingleMark(coordinateList,color){

    //.filter ='url(assets/filter.xml#remove-alpha)';
    c.beginPath();
    c.setTransform(zoomValue,0,0, zoomValue,-img.zoomMinX*zoomValue,-img.zoomMinY*zoomValue);

    //c.fillRect(coordinateList[0][0]-5/zoomValue, coordinateList[0][1]-5/zoomValue, 10/zoomValue, 10/zoomValue);

    //c.arc(coordinateList[0][0], coordinateList[0][1], 10/zoomValue, 0, 2*Math.PI);
    c.moveTo(coordinateList[0][0], coordinateList[0][1]);
    canvasFloat.innerHTML="";
    for (y = 0; y <coordinateList.length; y++) {
        c.lineTo(coordinateList[y][0], coordinateList[y][1]);
    }
    c.closePath();
    c.imageSmoothingEnabled = false;
    c.fillStyle=color;
    c.fill();

}
function drawMarking(){
    //c.filter ='url(#remove-alpha)';
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
        //c.translate(0.5, 0.5)
        let coordinateList=drawingList[imageIndex][i].coordinates[0];
        c.moveTo(coordinateList[0][0], coordinateList[0][1]);
        for (y = 1; y <coordinateList.length; y++) {
            c.imageSmoothingEnabled = false;
            c.lineTo(coordinateList[y][0], coordinateList[y][1]);

            //c.stroke();
        }
        if(drawingList[imageIndex][i].finished){
            //c.closePath();
            c.imageSmoothingEnabled = false;
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
    for(let i=0; i<textVIP.length;i++){
        if(drawingList[indexDict[textVIP[i]]+1]==null){
            drawingList[indexDict[textVIP[i]]+1]=[]
        }
        if(textVIP[i]===imageIndex){
            continue;
        }
        drawingList[indexDict[textVIP[i]]+1].push(obj);
    }
    $('#messageBoxInputLayer')
        .transition('slide right')
    ;
    alertMessage("n00t säger:","Kopierade masken till "+textVIP.length+" bilder.","positive",5000);
}

function alertMessageInput(event,edit){




    messageBoxInput.style.top=event.y+"px";
    messageBoxInput.style.left=event.x+"px";
    editColor=edit;
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

