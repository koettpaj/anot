function sliderChange(value){
    loadImage(value)
}

function loadImage(index){
    console.log("LOAAADING");
    reader.readAsDataURL(files[index-1]);

}

function drawImg(){

    canvas.width = img.width;
    canvas.height = img.height;
    c.imageSmoothingEnabled = false;
    c.imageSmoothingEnabled = false;
    //c.scale(zoomValue, zoomValue)
    //c.drawImage(img,0,0,1282,482);

    console.log("image dimensions: "+img.zoomMinX+" "+img.zoomMinY+" "+img.zoomWidthX+" "+img.zoomWidthY+" zv: "+zoomValue);
    c.drawImage(img,img.zoomMinX,img.zoomMinY,img.zoomWidthX,img.zoomWidthY,0,0,1280,480);
   //c.drawImage(img, img.width / zoom, img.height / zoom, img.width / zoom, img.height / zoom, 0, 0, canvas.width, canvas.height);

}


function canvasDrag(){
    console.log("zoooming")
}