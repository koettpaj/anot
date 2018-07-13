function sliderChange(value){
    loadImage(value)
}

function loadImage(index){
    console.log("LOAAADING");
    reader.readAsDataURL(files[index-1]);

}

function drawImg(){

    console.log(img.width);
    canvas.width = img.width;
    canvas.height = img.height;
    c.imageSmoothingEnabled = false;
    c.imageSmoothingEnabled = false;
    //c.scale(zoomValue, zoomValue)
    //c.drawImage(img,0,0,1282,482);
    c.drawImage(img,xMin,yMin,xWidth,yWidth,0,0,1280,480);
   //c.drawImage(img, img.width / zoom, img.height / zoom, img.width / zoom, img.height / zoom, 0, 0, canvas.width, canvas.height);

}

function canvasDrag(){
    console.log("zoooming")
}