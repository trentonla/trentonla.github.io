document.getElementById("wheel-catcher").addEventListener("wheel", wheelHandler);

let currentDegrees = 0;
let wheelSpeed = 0;
let lastScroll = Date.now();
let lockScroll = false;
let distanceMultiplier = 1;
let warningTimeout;

const initialPositions = {
    /* name: [angle, distance]*/
    'text-1': [0.5, 450],
    'text-2': [Math.PI/2, 500],
    'text-3': [Math.PI, 700],
    'text-4': [4*Math.PI/3, 550],
    'text-5': [5, 650],
    'text-6': [3*Math.PI/4, 800],
    'text-7': [6.2, 696],
    'text-8': [5.7, 420],
    'moon': [2.5, 500]
};

function wheelHandler(event) {
    // cancel scroll event and convert into rotation
    console.log(wheelSpeed);
    event.preventDefault();

    if (lockScroll) return false;

    // checking scroll speed to activate spinning out of control
    if (lastScroll + 200 > Date.now()) {
        wheelSpeed += Math.abs(event.deltaY) - 100;
        if (wheelSpeed < 0) {
            wheelSpeed = 0;
        }
        clearTimeout(warningTimeout);
        if (Math.abs(event.deltaY) > 60) {
            document.getElementById("too-fast-0").style.display = "block";
        } else {
            warningTimeout = setTimeout(() => {
                document.getElementById("too-fast-0").style.display = "none";
            }, 400);
        }
        if (wheelSpeed > 5000) {
            console.log("YOURE GOING TOO FAST");
            document.getElementById("too-fast-0").style.display = "none";
            lockScroll = true;
            let dir = 1;
            if (event.deltaY < 0) dir = -1;
            itsOutOfControl(Math.sqrt(Math.abs(event.deltaY)) / 300, dir);
        }
    } else {
        wheelSpeed = 0;
    }
    lastScroll = Date.now();
    
    // handling normal scrolling
    let degreesChange = Math.sqrt(Math.abs(event.deltaY)) / 300;
    if (event.deltaY > 0) {
        currentDegrees += degreesChange;
    } else {
        currentDegrees -= degreesChange;
    }
    
    if (currentDegrees >= 2 * Math.PI) {
        currentDegrees -= 2 * Math.PI;
    } else if (currentDegrees < 0) { 
        currentDegrees += 2 * Math.PI; 
    }
    console.log(currentDegrees)

    updatePositions();
}

// update positions of floating text boxes
function updatePositions() {
    // find center of the earth
    const xOffset = document.getElementById("wheel-catcher").clientWidth / 2;

    for (let id of Object.keys(initialPositions)) {
        let angle = initialPositions[id][0];
        let distance = initialPositions[id][1] * distanceMultiplier;
        let element = document.getElementById(id);
        element.style.left = (Math.cos(angle + currentDegrees) * distance + xOffset).toString() + "px";
        element.style.top = (Math.sin(angle + currentDegrees) * distance).toString() + "px";
        element.style.rotate = (angle + currentDegrees - (Math.PI / 2)).toString() + "rad";
    }
}

// fun feature!
function itsOutOfControl(speed, dir) {
    let s = speed;
    let spinId = setInterval(() => {
        currentDegrees += s * dir;
        s += 0.001;
        distanceMultiplier += s / 100;
        updatePositions();
    }, 10);
    document.getElementById("too-fast-1").style.display =  "block";
    let fallId;
    let earthRotation = 0;
    let earthProgress = 30;
    let earthY = 0;
    setTimeout(() => {
        document.getElementById("too-fast-2").style.display =  "block";
        fallId = setInterval(() => {
            earthProgress++;
            let earthVelocity = Math.sin(earthProgress / 60) / 50;
            earthRotation += earthVelocity;
            document.getElementById("earth").style.rotate = earthRotation.toString() + "rad";
        }, 10);
    }, 3000);
    setTimeout(() => {
        clearTimeout(fallId);
        earthProgress = 10;
        fallId = setInterval(() => {
            earthProgress++;
            earthY += earthProgress;
            document.getElementById("earth").style.marginTop = earthY.toString() + "px";
            earthRotation -= 0.005;
            document.getElementById("earth").style.rotate = earthRotation.toString() + "rad";
        }, 10);
    }, 6000);
    setTimeout(() => {
        clearTimeout(fallId);
        document.getElementById("too-fast-3").style.display =  "block";
    }, 8000);
    setTimeout(() => {
        clearTimeout(spinId);
    }, 9000);
}

// init!
updatePositions();