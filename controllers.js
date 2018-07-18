function sliderChange(value){
    loadImage(value)
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
        console.log("now at:" +i);
        c.beginPath();
        c.lineWidth=1/zoomValue;
        c.strokeStyle=drawingList[imageIndex][i].color;
        c.setTransform(zoomValue,0,0, zoomValue,-img.zoomMinX*zoomValue,-img.zoomMinY*zoomValue);
        let coordinateList=drawingList[imageIndex][i].coordinates;
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

function alertMessageInput(event){
    console.log(event);



    messageBoxInput.style.top=event.y+"px";
    messageBoxInput.style.left=event.x+"px";

    //messageHeader.innerHTML=header;
    //messageP.innerHTML=msg;
    $('#messageBoxInput')
        .transition('slide right')
    ;




}