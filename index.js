
var offsetX = 0;
var offsetY = 0;

var isDown = false;
var isDrag = false;
var rectDrawn = false;
var rectIndex;



var startX;
var startY;

var prevStartX = 0;
var prevStartY = 0;

var prevWidth = 0;
var prevHeight = 0;

var ctx;
var ctxo;

var rectangle = [];
function init() {


    var canvas = document.getElementById("canvas");
    var overlay = document.getElementById("overlay");
    ctx = canvas.getContext("2d");
    ctxo = overlay.getContext("2d");

    // style the context
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctxo.strokeStyle = "black";
    ctxo.lineWidth = 3;


    offsetX = canvas.getBoundingClientRect().left;
    offsetY = canvas.getBoundingClientRect().top;


    canvas.addEventListener('mousedown', (e) => {
        handleMouseDown(e);
    });

    canvas.addEventListener('mousemove', (e) => {
        handleMouseMove(e);
    });


    canvas.addEventListener('mouseup', (e) => {
        handleMouseUp(e);
    });


    canvas.addEventListener('mouseout', (e) => {
        handleMouseOut(e);
    });

    canvas.addEventListener('dblclick', (e) => {
        handleDoubleClick(e);
    });
}


function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();


    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);


    isDown = true;


    //for (i = 0; i < rectangle.length; i++) {
    for (i = rectangle.length - 1; i >= 0; i--) {
        if (isMouseOnRect(startX, startY, rectangle[i])) {
            rectIndex = i;
            //alert("drag...")
            isDrag = true;
            break;
        }
    }


}

function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!rectDrawn) {
        console.log("retrunn")
        return;
    }


    if (isDown) {

        if (isDrag) {

            console.log("isdrag...");

            let shape = rectangle[rectIndex];

            shape.x = prevStartX;
            shape.y = prevStartY;

            ctxo.strokeRect(prevStartX, prevStartY, shape.w, shape.h);

            // Create gradient
            var grd = ctxo.createLinearGradient(prevStartX, prevStartY, shape.w, shape.h);
            var color = shape.c;
            grd.addColorStop(0, color);
            grd.addColorStop(1, color);

            // Fill with gradient
            ctxo.fillStyle = grd;
            ctxo.fillRect(prevStartX, prevStartY, shape.w, shape.h);

            console.log(rectangle);

            isDrag = false;

        } else {
            ctxo.strokeRect(prevStartX, prevStartY, prevWidth, prevHeight);

            var grd = ctxo.createLinearGradient(prevStartX, prevStartY, prevWidth, prevHeight);
            var color = getRandomColor();
            grd.addColorStop(0, color);
            grd.addColorStop(1, color);


            ctxo.fillStyle = grd;
            ctxo.fillRect(prevStartX, prevStartY, prevWidth, prevHeight);

            rect = {
                x: prevStartX,
                y: prevStartY,
                w: prevWidth,
                h: prevHeight,
                c: color,
            }
            rectangle.push(rect);
        }

        isDown = false;

        rectDrawn = false;


    }



}

function handleMouseOut(e) {
    e.preventDefault();
    e.stopPropagation();

    isDown = false;

    isDrag = false;
}

function handleMouseMove(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!isDown) {
        return;
    }

    rectDrawn = true;

    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);



    if (isDrag) {
        //console.log(rectangle);
        var tempShape = rectangle[rectIndex];

        //ctxo.clearRect(tempShape.x - 3, tempShape.y - 3, tempShape.w + 6, tempShape.h + 6);
        ctxo.clearRect(0, 0, 800, 400);

        for (j = 0; j < rectangle.length; j++) {
            console.log("draw again" + rectangle[j]);
            if (j != rectIndex) {
                ctxo.strokeRect(rectangle[j].x, rectangle[j].y, rectangle[j].w, rectangle[j].h);
                var grd = ctxo.createLinearGradient(rectangle[j].x, rectangle[j].y, rectangle[j].w, rectangle[j].h);

                var color = rectangle[j].c;
                grd.addColorStop(0, color);
                grd.addColorStop(1, color);

                ctxo.fillStyle = grd;
                ctxo.fillRect(rectangle[j].x, rectangle[j].y, rectangle[j].w, rectangle[j].h);
            }


        }


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(mouseX, mouseY, tempShape.w, tempShape.h);

        var grd = ctx.createLinearGradient(mouseX, mouseY, tempShape.w, tempShape.h);

        var color = tempShape.c;
        grd.addColorStop(0, color);
        grd.addColorStop(1, color);

        ctx.fillStyle = grd;
        ctx.fillRect(mouseX, mouseY, tempShape.w, tempShape.h);

        prevStartX = mouseX;
        prevStartY = mouseY;

    } else {

        var width = mouseX - startX;
        var height = mouseY - startY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeRect(startX, startY, width, height);

        prevStartX = startX;
        prevStartY = startY;

        prevWidth = width;
        prevHeight = height;


    }
}

function handleDoubleClick(e) {
    console.log("double click is called...");
    console.log(rectangle);
    console.log(rectangle.length);
    clickPosX = e.clientX - canvas.getBoundingClientRect().left;
    clickPosY = e.clientY - canvas.getBoundingClientRect().top;


    //for (i = 0; i < rectangle.length; i++) {
    for (i = rectangle.length - 1; i >= 0; i--) {
        console.log("checking - " + i + rectangle[i]);
        if (isMouseOnRect(clickPosX, clickPosY, rectangle[i])) {
            console.log("found rec position");
            //var tempShape = rectangle[rectIndex];
            // ctxo.clearRect(tempShape.x - 3, tempShape.y - 3, tempShape.w + 6, tempShape.h + 6);
            // ctx.clearRect(tempShape.x - 3, tempShape.y - 3, tempShape.w + 6, tempShape.h + 6);
            rectangle.splice(i, 1);
            //clearAndRedraw();

            ctxo.clearRect(0, 0, 800, 400);
            ctx.clearRect(0, 0, 800, 400);

            console.log("Rectangle length after splic-" + rectangle.length)

            for (j = 0; j < rectangle.length; j++) {
                console.log("draw again" + rectangle[j]);
                ctxo.strokeRect(rectangle[j].x, rectangle[j].y, rectangle[j].w, rectangle[j].h);
                var grd = ctxo.createLinearGradient(rectangle[j].x, rectangle[j].y, rectangle[j].w, rectangle[j].h);

                var color = rectangle[j].c;
                grd.addColorStop(0, color);
                grd.addColorStop(1, color);

                ctxo.fillStyle = grd;
                ctxo.fillRect(rectangle[j].x, rectangle[j].y, rectangle[j].w, rectangle[j].h);
            }


            isDown = false;
            isDrag = false;
            rectDrawn = false;

            break;
        }
    }
}


function isMouseOnRect(x, y, shape) {


    if (shape.w < 0 && shape.h < 0) {
        if (x > (shape.x + shape.w) && x < shape.x && y > (shape.y + shape.h) && y < shape.y) {
            return true;
        }
    } else if (shape.w < 0) {
        if (x > (shape.x + shape.w) && x < shape.x && y < (shape.y + shape.h) && y > shape.y) {
            return true;
        }
    } else if (shape.h < 0) {
        if (x < (shape.x + shape.w) && x > shape.x && y > (shape.y + shape.h) && y < shape.y) {
            return true;
        }
    } else {
        if (x < (shape.x + shape.w) && x > shape.x && y < (shape.y + shape.h) && y > shape.y) {
            return true;
        }
    }

    return false;
}


function getRandomColor() {
    var color = "";
    for (var i = 0; i < 3; i++) {
        var sub = Math.floor(Math.random() * 256).toString(16);
        color += (sub.length == 1 ? "0" + sub : sub);
    }
    return "#" + color;
}



function clearCanvas() {


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctxo.clearRect(0, 0, overlay.width, overlay.height);

    rectangle = [];

}