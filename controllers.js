function sliderChange(value){
    loadImage(value)
}

function loadImage(index){
    reader.readAsDataURL(files[index-1])
}

function drawImg(zoom){
    zoom=parseInt(zoom);
    console.log(img.width);
    canvas.width = img.width;
    canvas.height = img.height;
    c.imageSmoothingEnabled = false;
    c.drawImage(img,0,0,1282,482);
    //c.drawImage(img,500,300,15,15,0,0,1280,480);
   //c.drawImage(img, img.width / zoom, img.height / zoom, img.width / zoom, img.height / zoom, 0, 0, canvas.width, canvas.height);

}

function zoomFunc(){
    console.log("zoooming")
}