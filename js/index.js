var scene, camera, input, clock, charaAnim,
    gltfLoader, mixer, textureLoader,
    optimizer, ambientLight, dirLight,
    chars, soundMixer, renderer, composer, fxaaPass, charPath, charSpeed;

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
  shadows: true, // Use shadow
  trees: true, // Add trees to the map
  curbs: true, // Show texture on the extruded geometry
  grid: false // Show grid helper
};

window.addEventListener('load', ()=> {
    init();
});