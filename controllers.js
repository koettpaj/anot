

function drawImg(zoom){

    console.log("in drawing");
    zoom=parseInt(zoom);
    console.log(video.width);
    canvas.width = video.width;
    canvas.height = video.height;
    console.log(video);
    c.imageSmoothingEnabled = false;
    c.drawImage(video,0,0,1282,482);
    //c.drawImage(img,500,300,15,15,0,0,1280,480);
   //c.drawImage(img, img.width / zoom, img.height / zoom, img.width / zoom, img.height / zoom, 0, 0, canvas.width, canvas.height);

}

function zoomFunc(){
    console.log("zoooming")
}