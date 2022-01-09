//KEYBOARD

window.focus()

var keyAllowed = {}

var lastKey

function processKey(key) {

    console.log("key")

    if(key === "a" || key === "s") {

        if(key !== lastKey) boost()

        lastKey = key

    }
}

charSpeed = 0

function boost() {
    charSpeed += .005
}

window.addEventListener( 'keydown', (e)=> {

    if(keyAllowed[e.which] === false) return

    keyAllowed[e.which] = false;

    switch( e.code ) {

        case 'KeyA':
        case 'ArrowLeft':
            processKey( 'a' );
            break;

        case 'KeyW':    
        case 'ArrowUp' :
            processKey( 'w' );
            break;

        case 'KeyD':
        case 'ArrowRight' :
            processKey( 'd' );
            break;

        case 'KeyS':
        case 'ArrowDown' :
            processKey( 's' );
            break;

    };
    
}, false);

//

window.addEventListener( 'keyup', (e)=> {

    keyAllowed[e.which] = true;

});

//