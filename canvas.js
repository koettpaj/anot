const canvas = document.querySelector('canvas');
const zoom = document.getElementById('zoom');




canvas.addEventListener('click', function() {


}, false);

const imgelement = document.querySelector('img');

const c = canvas.getContext('2d');
c.imageSmoothingEnabled = false;
const img = new Video();

const reader = new FileReader();
reader.onload = function (){

    img.onload=function(){
        drawImg(0);


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