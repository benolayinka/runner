var scene, camera, input, atlas,
    controler, clock, charaAnim,
    gltfLoader, mixer, cameraControl, stamina, interaction,
    dynamicItems, textureLoader, fileLoader, mapManager,
    socketIO, optimizer, gameState, ambientLight, dirLight,
    chars, soundMixer, renderer, composer, fxaaPass, charPath;

var actions = [];

var characterAnimations = {};

var position = 0;

const playerData = {
    id: "1",
    name: "ben",
    x: 0,
    y: 0,
    z: 0,
    r: Math.PI,
    a: "running"
}

var utils = Utils();
var easing = Easing();

const config = {
  showHitZones: false,
  shadows: true, // Use shadow
  trees: true, // Add trees to the map
  curbs: true, // Show texture on the extruded geometry
  grid: false // Show grid helper
};

const lawnGreen = "#67C240";
const trackColor = "#546E90";
const edgeColor = "#725F48";
const treeCrownColor = 0x498c2c;
const treeTrunkColor = 0x4b3f2f;
const treeTrunkGeometry = new THREE.BoxBufferGeometry(15, 15, 30);
const treeTrunkMaterial = new THREE.MeshLambertMaterial({
  color: treeTrunkColor
});
const treeCrownMaterial = new THREE.MeshLambertMaterial({
  color: treeCrownColor
});

const trackRadius = 225;
const trackWidth = 45;
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

const arcAngle1 = (1 / 3) * Math.PI; // 60 degrees

const deltaY = Math.sin(arcAngle1) * innerTrackRadius;
const arcAngle2 = Math.asin(deltaY / outerTrackRadius);

const arcCenterX =
  (Math.cos(arcAngle1) * innerTrackRadius +
    Math.cos(arcAngle2) * outerTrackRadius) /
  2;

const arcAngle3 = Math.acos(arcCenterX / innerTrackRadius);

const arcAngle4 = Math.acos(arcCenterX / outerTrackRadius);

let charSpeed = 0
let score;
const speed = 0.0017;

const playerAngleInitial = Math.PI;
let playerAngleMoved = 0;
let accelerate = false; // Is the player accelerating
let decelerate = false; // Is the player decelerating

let ready;
let lastTimestamp;

const scoreElement = document.getElementById("score");
const buttonsElement = document.getElementById("buttons");
const instructionsElement = document.getElementById("instructions");
const resultsElement = document.getElementById("results");
const accelerateButton = document.getElementById("accelerate");
const decelerateButton = document.getElementById("decelerate");
const youtubeLogo = document.getElementById("youtube-main");

setTimeout(() => {
  if (ready) instructionsElement.style.opacity = 1;
  buttonsElement.style.opacity = 1;
  youtubeLogo.style.opacity = 1;
}, 4000);

function startGame() {
  if (ready) {
    ready = false;
    scoreElement.innerText = 0;
    buttonsElement.style.opacity = 1;
    instructionsElement.style.opacity = 0;
    youtubeLogo.style.opacity = 1;
    renderer.setAnimationLoop(animation);
  }
}

window.addEventListener('load', ()=> {
    init();
});

window.addEventListener( 'resize', ()=> {

    if ( cameraControl ) cameraControl.adaptFOV() ;

    if ( camera ) {

        // Adjust camera
        const newAspectRatio = window.innerWidth / window.innerHeight;
        const adjustedCameraHeight = cameraWidth / newAspectRatio;

        camera.top = adjustedCameraHeight / 2;
        camera.bottom = adjustedCameraHeight / -2;
        camera.updateProjectionMatrix(); // Must be called after change

        // Reset renderer
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    };
});