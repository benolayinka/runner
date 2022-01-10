var loopCount = 0 ;
var ticks, clockDelta;

function loop() {

	loopCount += 1 ;

    clockDelta = clock.getDelta();

    renderer.render( scene, camera );

    if ( chars ) chars.update( clockDelta );

    for ( let key in characterAnimations ) characterAnimations[ key ].update( clockDelta );

    if ( charaAnim ) charaAnim.update( clockDelta );

    move()

    updateCharacters(playerData)

    requestAnimationFrame( loop );

};

// event handlers for multiplayer

function updateCharacters ( data ) {

    var animation = characterAnimations[ data.id ];

    // Handle the case when a new player is sending their data.
    // A new character will be added to the scene.
    if ( !animation ) {

        var character = chars.createCharacter( utils.stringHash( data.id ), data.name );
        character.model.name = data.id; // for removal
        scene.add( character.model );

        animation = CharaAnim({
            actions: character.actions,
            charaGroup: character.model,
            target: new THREE.Vector3(),
            position: character.model.position
        });

        characterAnimations[ data.id ] = animation;
    };

    animation.setPlayerState( data );
};

//

function removeCharacters ( id ) {

    var group = scene.getObjectByName( id );

    if( group ) scene.remove( group ) && chars.releaseCharacter( group );

    delete characterAnimations[ id ];

};

//

function move() {

    charSpeed -= 0.001

    if (charSpeed < 0) charSpeed = 0

    if (charSpeed === 0) playerData.a = "idleGround"
    else playerData.a = "running"

    // add up to position for movement
    position += charSpeed;

    // get the point at position
    var point = charPath.getPointAt(position);

    if(!point) {
       position = 0; 
       point = charPath.getPointAt(position);
    } 

    playerData.x = point.x;
    playerData.y = point.y;

    var angle = getAngle(position);

    playerData.r = angle
        
}

var tangent

window.addEventListener( 'keydown', (e)=> {

    switch( e.code ) {

        case 'KeyW':
        case 'ArrowUp':
            console.log(tangent)
            break;
    };
    
}, false);

function getAngle( position ){

    // get the 2Dtangent to the curve
    tangent = charPath.getTangent(position).normalize();

    // change tangent to 3D
    angle = Math.atan2( tangent.y, tangent.x) + Math.PI / 2;

    return angle;
}

//