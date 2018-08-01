const canvas = document.getElementById('canvas');
const zoom = document.getElementById('zoom');
$("#messageBox").hide();
$("#messageBoxInput").hide();
$("#messageBoxInputLayer").hide();
$("#messageBoxInputLayerPaste").hide();
$("#zoomCanvas").hide();

const slider =document.getElementById('myRange');
let zoomValue=1;
slider.addEventListener("keydown", function(e){
    e.preventDefault();
})
const additionalTools =document.getElementById('additionalTools');
const zoomIcon =document.getElementById('zoomIcon');
const moveIcon =document.getElementById('moveIcon');
const selectIcon =document.getElementById('selectIcon');
const zoomCanvas = document.getElementById('zoomCanvas');
const vipLoad = document.getElementById('vipLoad');
const zoomBoxa=document.getElementById("zoomBoxa")

//canvas.addEventListener("wheel", wheelZoom);
let imageIndex=0;
let leftMouseDown=false;
let  rightMouseDown=false;
let  latestMove=[null, null];
let lastZoomPos=[null,null];
let latestDrag=null;
let startZoom=[null, null];
let prevTool=null;
let currentTool=null;
let currentToolIcon=null;
let zoomBlock=false;
let textVIP=[];
let canvasVIP=[];
const loadCircle = document.getElementById("loadCircle");
const loadText = document.getElementById("loadText")
const messageBox = document.getElementById("messageBox");
const messageHeader = document.getElementById("messageHeader");
const messageP = document.getElementById("messageP");
const messageBoxInput = document.getElementById("messageBoxInput");
const messageBoxInputLayer = document.getElementById("messageBoxInputLayer");
const messageBoxInputLayerPaste = document.getElementById("messageBoxInputLayerPaste");
const thead= document.getElementById("thead");
let saveBtn= document.getElementById("save");
let exportBtn= document.getElementById("export");
let editColor=null;
let drawingList=[];
let numWorkers=0;
let currentColor=null;
let prevColor=null;
let colorSelectedStr=null;
let latestEvent=null;
let isDrawing=false;
let toCopy=null;
const layerList=document.getElementById("layerList");
const tbody=document.getElementById("tbodyInsert");
const canvasFloat=document.getElementById("canvasFloat");
let rect = canvas.getBoundingClientRect();
let zoomBox=false;
canvasFloat.style.top=rect.top+"px";
canvasFloat.style.left=rect.left+"px";
canvas.style.cursor = "pointer";
additionalTools.style.top=rect.top+"px";
additionalTools.style.left=rect.right+"px";
let boxBeingDragged=null;
let zindex=15;
let objectBeingAltered=null;
let showAll=true;
let canvas2=document.createElement("canvas");
canvas2.width=1280;
canvas2.height=480;
let c2=canvas2.getContext("2d")



let rowTarget=null;


$("#canvasFloat").hide();
window.addEventListener('resize', function(){
    let rect = canvas.getBoundingClientRect();
    canvasFloat.style.top=rect.top+"px";
    canvasFloat.style.left=rect.left+"px";
    additionalTools.style.top=rect.top+"px";
    additionalTools.style.left=rect.right+"px";
}, true);
function translate(xdiff,ydiff, callback=null){

    if(zoomValue<1.1){
        return;
    }
    xdiff=xdiff/zoomValue;
    ydiff=ydiff/zoomValue;
    console.log("xdiff: "+ xdiff+" ydiff: "+ydiff);

    let xMinTemp=img.zoomMinX;
    let yMinTemp=img.zoomMinY;
    let widthXTemp=img.zoomWidthX;
    let widthYTemp=img.zoomWidthY;
    xMinTemp=xMinTemp-xdiff;
    yMinTemp=yMinTemp-ydiff;
    startZoom=[xMinTemp+widthXTemp/2 ,yMinTemp+widthYTemp/2];


    if(xMinTemp<-50){
        xMinTemp=-50;
    }
    if(yMinTemp<-50){
        yMinTemp=-50;
    }
    if(xMinTemp+widthXTemp>1480){
        xMinTemp=1480-widthXTemp;
    }
    if(yMinTemp+widthYTemp>580){
        yMinTemp=580-widthYTemp;
    }

    img.zoomMinX= xMinTemp;
    img.zoomMinY= yMinTemp;
    drawImg()
    drawMarking();
    if(callback!==null){
        callback();
    }



}
function prevVIP(index){
    for (i = index; i >= 0; i--) {

        if(index>textVIP[i]){

            slider.value=textVIP[i];
            sliderChange(textVIP[i]);
            return;
        }
    }
}


function nextVIP(index){
    for (i = 0; i < textVIP.length; i++) {

        if(index<textVIP[i]){

            slider.value=textVIP[i];
            sliderChange(textVIP[i]);
            return;
        }
    }



}

function centerImage(xdiff,ydiff){


    let interval=setInterval(function(){
        if(img.zoomMinX<1 ||  img.zoomWidthX+img.zoomMinX>1280){
            translate(xdiff,0);

        }
        if(img.zoomMinY<1 || img.zoomWidthY+img.zoomMinY>480){
            translate(0,ydiff);
        }

        else{
        clearInterval(interval)}
    },20);






}



function dragZoom(diff){
    //console.log(diff);

    let xdiff=0;
    let ydiff=0;



    if(img.zoomMinX<0){
        xdiff=-10
    }
    if(img.zoomMinY<0){
        ydiff=-5
    }
    if(img.zoomWidthX+img.zoomMinX>1280){
        xdiff=10
    }
    if(img.zoomWidthY+img.zoomMinY>480){
        ydiff=5
    }

    if(xdiff!==0 || ydiff!==0){
        centerImage(xdiff,ydiff);
        return;
    }


    let xMin=0;
    let yMin=0;
    let xWidth=1280;
    let yWidth=480;

    if(diff<0 &&zoomValue<8){
        canvas.style.cursor = "zoom-in";
        let x=startZoom[0]
        let y=startZoom[1]
        zoomValue+=Math.abs(diff/200*zoomValue);
        if(zoomValue>8){
            zoomValue=8;
        }
        xMin=(((x)-(1280/(zoomValue*2))));
        yMin=(y-(480/(zoomValue*2)));
        xWidth=(1280/(zoomValue));
        yWidth=(480/(zoomValue));}
    else if(diff>0 &&zoomValue>1){
        canvas.style.cursor = "zoom-out";
        let x=startZoom[0]
        let y=startZoom[1]


        zoomValue-=Math.abs(diff/200*zoomValue);
        if(zoomValue<1){
            zoomValue=1;
        }
        xMin=(((x)-(1280/(zoomValue*2))));
        yMin=(y-(480/(zoomValue*2)));
        xWidth=(1280/(zoomValue));
        yWidth=(480/(zoomValue));
    } else{

        return
    }


        if(xMin<0){
            xMin=0;
        }
        if(yMin<0){
            yMin=0;
        }
        if(xMin+xWidth>1280){
            xMin=1280-xWidth;

        }
        if(yMin+yWidth>480){
            yMin=480-yWidth;

        }



    img.zoomMinX= xMin;
    img.zoomMinY= yMin;
    img.zoomWidthX = xWidth;
    img.zoomWidthY = yWidth;

    //setTimeout(wtf,10000);
    drawImg();
    drawMarking();
    //console.log("done");





}




function mapRange(xTrue,yTrue){
    var relX=Math.round((parseInt(xTrue)/1280)*(img.zoomWidthX)+img.zoomMinX);
    var relY=Math.round((parseInt(yTrue)/480)*(img.zoomWidthY)+img.zoomMinY);
    console.log(relX + "and "+relY);
    return [relX, relY];


}

function mapRangeFloat(xTrue,yTrue){
    var relX=Math.round((parseInt(xTrue)/1480)*(img.zoomWidthX)+img.zoomMinX);
    var relY=Math.round((parseInt(yTrue)/528)*(img.zoomWidthY)+img.zoomMinY);
    console.log(relX + "and "+relY);
    return [relX, relY];


}



const c = canvas.getContext('2d');
c.imageSmoothingEnabled = false;
const img = new Image();

const reader = new FileReader();
reader.onload = function (){

    img.onload=function(){
        drawImg();
        drawMarking();


    };
    img.src = reader.result;
    if (img.zoomMinX==null){
    img.zoomMinX=0;
    img.zoomMinY=0;
    img.zoomWidthX=1280;
    img.zoomWidthY=480;}
    //imgelement.src=img

   // c.fillRect(20,20,150,100)
    //console.log(reader.result)
};


function handleProjectSelect(evt){
    file = evt.target.files
    let reader4 = new FileReader();
    reader4.onload = function() {
        let contents = reader4.result;
        drawingList=JSON.parse(contents)
        alertMessage("n00t säger:","Öppnade projekt!","positive",5000);
    }

    reader4.readAsText(file[0]);
}

function handleFileSelect(evt) {
    console.log("hello")
    console.log(evt)
    files = evt.target.files;// FileList object
    slider.setAttribute("max", files.length.toString())
    console.log(files);
    alertMessage("n00t säger:","Laddade in "+files.length+" bilder.","positive","5000");

    loadImage(1)

}
function handleVIPSelect(evt) {
    console.log(evt)
    file = evt.target.files;// FileList object

    let reader3 = new FileReader();
    reader3.onload = function() {
        let contents = reader3.result;
        let res = contents.split(".png");
        res.splice(-1,1)
        for (index in res){
            hashindex=res[index].indexOf("#")
            res[index]=parseInt(res[index].substr(hashindex+1));
        }
        textVIP=res;
        alertMessage("n00t säger:", "Hittade "+textVIP.length+" bilder att annotera.", "positive",5000);
        vipLoad.value="";
    };

    reader3.readAsText(file[0]);



}

function resetToolBtns(){
    resetList =document.querySelectorAll('#toolActive a i');
    for(var i=0, len=resetList.length; i < len; i++){resetList[i].style.color="white"}
}

function toolSelected(){
    resetToolBtns()

    currentToolIcon=this.querySelector('i');
    idString=currentToolIcon.id;
    currentTool=idString.substring(0,idString.length-4);
    if(currentTool==="zoom"){
        canvas.style.cursor = "zoom-in";
    }
    else if(currentTool==="move"){
        canvas.style.cursor = "move";
    }
    else if(currentTool==="select"){
        canvas.style.cursor = "initial";
    }
    this.querySelector('i').style.color="Aqua";
}

function updateWholeTable(){
    tbody.innerHTML="";
    if(drawingList[imageIndex]==null){
        return;
    }
    for(let i=0;i<drawingList[imageIndex].length; i++){
        updateTable(drawingList[imageIndex][i])
    }
}

function removePath(obj){
    if(drawingList[imageIndex].length===1){
        drawingList[imageIndex]=null;
    }
    else{
        let removeindex=drawingList[imageIndex].indexOf(obj);
        drawingList[imageIndex].splice(removeindex,1);
    }
    updateWholeTable();

    drawImg();
    drawMarking();
}


function alterPath(obj){
    disableEdit();
    objectBeingAltered=obj;
    $("#canvasFloat").fadeIn();
    obj.altering=true;
    drawMarking();
    createBoxes();

}

function updateTable(obj){
    console.log("Updating: "+obj);

    let name = document.createElement("td");
    let nameField = document.createElement("div");
    nameField.className="ui inverted transparent input";
    let inputF = document.createElement("input");
    inputF.type="text";
    inputF.placeholder=obj.name;

    inputF.addEventListener("blur", function(e){
        obj.name=inputF.value;
    });
    let type = document.createElement("td");
    type.className="center aligned selectable";
    type.addEventListener("click", function(event){
        alertMessageInput(event, obj)
    })
    let image = document.createElement("i");
    image.className=obj.logo;

    let edit = document.createElement("td");
    edit.className="center aligned selectable";
    edit.innerHTML="<i class='edit icon'></i>";

    let deleteSpace = document.createElement("td");
    deleteSpace.className="center aligned selectable";
    let deleteimage = document.createElement("i");
    deleteimage.className="trash alternate icon";
    deleteSpace.addEventListener('click', function(){
        removePath(obj)
    });

    edit.addEventListener('click',function(){
        edit.className="center aligned";
        alterPath(obj)
    });

    let view = document.createElement("td");

    let checkBox=document.createElement("div");
    checkBox.className="ui center aligned checked checkbox";

    let inputBox= document.createElement("input");
    inputBox.type="checkbox";
    inputBox.checked=true;
    checkBox.appendChild(inputBox);
    let emptyLabel=document.createElement("label");
    checkBox.appendChild(emptyLabel);
    view.appendChild(checkBox);

    checkBox.addEventListener("change", function(e){
        obj.show=inputBox.checked;
        drawImg();
        drawMarking();

    });



    let tr = document.createElement("tr");
    nameField.appendChild(inputF);
    name.appendChild(nameField);
    tr.addEventListener("contextmenu", function(e){
        e.preventDefault();
        layerOptions(e,this, obj)
    })
    type.appendChild(image);
    deleteSpace.appendChild(deleteimage);

    $(tr).data( "obj", obj );
    tr.draggable=true;
    tr.appendChild(view);
    tr.appendChild(name);
    tr.appendChild(type);
    tr.appendChild(edit);
    tr.appendChild(deleteSpace);


    tr.addEventListener("dragenter", function(e){
        rowTarget=$(tr).data( "obj");
    });
    tr.addEventListener("dragend", function(e){
        let index1 = drawingList[imageIndex].indexOf($(tr).data( "obj"));
        let index2 = drawingList[imageIndex].indexOf(rowTarget);
        drawingList[imageIndex][index1]=rowTarget;
        drawingList[imageIndex][index2]=$(tr).data( "obj");
        drawImg();
        drawMarking();
        updateWholeTable();
    });

    tr.style.over="border: 2px dashed #000";

    tbody.appendChild(tr);
}

function layerOptions(e, that, obj){

    console.log(obj.name);
    console.log(that);
    alertMessageInputLayer(e, obj);
}

function disableAll(){
    $("#disableAllView")
        .transition('stop all')
    ;
    let disableBtn = document.getElementById("disableAllView");
    let viewButtons = document.querySelectorAll('#tbodyInsert .ui.center.aligned.checked.checkbox input');
    for(let i=0, len=viewButtons.length; i < len; i++){viewButtons[i].click()}
    console.log(disableBtn.className);

    if(showAll){
        showAll=false;
        disableBtn.className="inverted eye slash icon"

    }

    else if(!showAll){
        showAll=true;
        disableBtn.className="inverted eye icon"

    }


}

function wink(){

    $("#disableAllView")
        .transition('jiggle').transition('pulse')
    ;
}


function disableEdit(){
    let editButtons = document.querySelectorAll('#tbodyInsert tr td .edit.icon');
    console.log(editButtons);
    for(let i=0, len=editButtons.length; i < len; i++){editButtons[i].parentElement.className="center aligned"}

    let editTable =document.getElementById("layerList");
    editTable.className="ui inverted fixed table"

}

function enableEdit(){
    let editButtons = document.querySelectorAll('#tbodyInsert tr td .edit.icon');
    for(let i=0, len=editButtons.length; i < len; i++){editButtons[i].parentElement.className="center aligned selectable"}
    let editTable =document.getElementById("layerList");
    editTable.className="ui selectable inverted fixed table"

}

function save(){

}

function newPath(event, logo){

    isDrawing=true;
    let selectObj = Object();
    selectObj.finished=false;
    selectObj.color=colorSelectedStr;
    selectObj.coordinates=[];
    selectObj.coordinates[0]=[];
    selectObj.coordinates[1]=[];
    selectObj.logo=logo;
    selectObj.index=0;
    selectObj.arrindex=drawingList[imageIndex].length;
    selectObj.name=drawingList[imageIndex].length;
    selectObj.altering=false;
    selectObj.show=true;
    let posses = mapRange(event.layerX, event.layerY);

    selectObj.coordinates[0].push(posses);
    updateTable(selectObj);
    drawingList[imageIndex].push(selectObj);
    console.log("color:"+selectObj.color);
}

function finishPath(){
    isDrawing=false;

    drawingList[imageIndex][drawingList[imageIndex].length-1].finished=true;
}

function draw(event){
    if(drawingList[imageIndex]==null){
        latestEvent=event;
        alertMessageInput(event)
        drawingList[imageIndex]= [];

    }

    else if(drawingList[imageIndex][drawingList[imageIndex].length-1].finished){
        latestEvent=event;
        alertMessageInput(event);
    }


    else{

    let posses = mapRange(event.layerX, event.layerY);

    drawingList[imageIndex][drawingList[imageIndex].length-1].coordinates[0].push(posses);
    drawMarking();}

}

function colorSelected(){
    if(currentColor!==null){
        prevColor=currentColor;
        prevColor.style.color="white";
    }



    currentColorIcon=this.querySelector('i');
    currentColor=currentColorIcon;
    color = currentColorIcon.getAttribute("data-color");
    currentColorIcon.style.color=color;

}

function colorSelectedFinal(){


    currentColorIcon=this.querySelector('i');
    icon = currentColorIcon.getAttribute("data-class");
    color = currentColorIcon.getAttribute("data-color");
    colorSelectedStr=color;

    $(currentColorIcon)
        .transition('jiggle')
    ;
   $('#messageBoxInput').transition('fade')
   ;

    if(editColor!=null){
        editColor.color=color;
        editColor.logo=icon;
        updateWholeTable();
        drawImg();
        drawMarking();
        return
    }
    newPath(latestEvent, icon);

}
function removeCanvasFloat(){

    clearBoxes(objectBeingAltered);
    $("#canvasFloat").fadeOut();
    canvasFloat.innerHTML="";

    objectBeingAltered.altering=false;
    objectBeingAltered=null;
    drawMarking();
    enableEdit();


}




/*
<div class="column">
    <div id="loadImgDiv" class="ui container">
        <label for="fileLoadBtn" class="ui blue inverted grey icon button" id="addImagesBox">
            <i class="file icon"></i>
            Infoga bilder</label>
        <input name="files[]" type="file" id="fileLoadBtn" style="display:none" multiple>
        </d
 */