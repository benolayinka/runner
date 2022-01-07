function Chars () {

	// assets constants
	const SCALE_CHAR = 10;

	var charMixers = [], charActions = [];

	var characters = [];

	var charGlb;

	// different sets of color for the hero character,
	// for multiplayer differentiation.
	var charSkins = [
		textureLoader.load( 'assets/models/hero-texture-0.png' ),
		textureLoader.load( 'assets/models/hero-texture-1.png' ),
		textureLoader.load( 'assets/models/hero-texture-2.png' ),
		textureLoader.load( 'assets/models/hero-texture-3.png' )
	];

	addGroups( characters, 4 );

	function addGroups( arr, groupsNumber ) {

		for ( let i = 0 ; i < groupsNumber ; i++ ) {

			let group = new THREE.Group();

			arr.push( group );

		};

	};

	gltfLoader.load('https://edelweiss-game.s3.eu-west-3.amazonaws.com/hero.glb', (glb)=> {

		charGlb = glb;

		createMultipleModels(
			glb,
			SCALE_CHAR,
			null,
			characters,
			charMixers,
			charActions
		);

	});

	// Create iterations of the same loaded asset. nasty because of skeletons.
	// Hopefully THREE.SkeletonUtils.clone() is able to clone skeletons correctly.
	function createMultipleModels( glb, scale, offset, modelsArr, mixers, actions, lightEmissive ) {

		glb.scene.scale.set( scale, scale, scale );
		if ( offset ) glb.scene.position.add( offset );

		// z up coordinate system

		glb.scene.rotation.x = Math.PI/2

		for ( let i = mixers ? mixers.length : 0 ; i < modelsArr.length ; i++ ) {

			let newModel = THREE.SkeletonUtils.clone( glb.scene );

			modelsArr[ i ].add( newModel );

			if ( mixers ) {

				mixers[ i ] = new THREE.AnimationMixer( newModel );

				actions[ i ] = {};
				for ( let clip of glb.animations ) {
					actions[ i ][ clip.name ] = mixers[ i ].clipAction( clip ).play();
				};

			};

			setLambert( newModel, lightEmissive !== undefined );

		};

	};

		function createCharacter( skinIndex, displayName ) {

		for ( let i = 0; i < characters.length; i++ ) {

			if ( !characters[ i ].userData.isUsed ) {
				 
				 characters[ i ].userData.isUsed = true;

				// assign character skin
				let skin = charSkins[ skinIndex % charSkins.length ];
				if( skin ) {
					let body = characters[ i ].getObjectByName( 'hero001' );
					if( body ) {
						body.material.map = skin;
					};
				};

				// return both the character and its actions
				return {
					model : characters[ i ], actions : charActions[ i ]
				};
			};

		};

		// if here, we have exhausted all the characters - make some more

		addGroups( characters, 2 );

		createMultipleModels(
			charGlb,
			SCALE_CHAR,
			null,
			characters,
			charMixers,
			charActions
		);

		return createCharacter( skinIndex, displayName );
	};

	//

	function releaseCharacter( model ) {

		model.userData.isUsed = false;

		const label = model.getObjectByProperty( 'type', 'Sprite' );
		if ( label ) model.remove( label ) && label.material.map.dispose();

	};

	//

	function toggleCharacterShadows( enabled ) {

		for ( let character of characters ) {

			character.traverse( function (child) {

				if ( child.type == 'Mesh' ||
					 child.type == 'SkinnedMesh' ) {

					child.castShadow = enabled ;
					child.receiveShadow = enabled ;
				};

			});

		};

	};

	///////////////
	//// GENERAL
	///////////////

	// Create a new lambert material for the passed model, with the original map
	function setLambert( model, lightEmissive ) {

		model.traverse( (obj)=> {

			if ( obj.type == 'Mesh' ||
				 obj.type == 'SkinnedMesh' ) {

				obj.material = new THREE.MeshLambertMaterial({
					map: obj.material.map,
					side: obj.material.side,
					skinning: obj.material.skinning,
					emissive: lightEmissive ? 0x191919 : 0x000000
				});

				// fix self-shadows on double-sided materials

				obj.material.onBeforeCompile = function(stuff) {
					var chunk = THREE.ShaderChunk.shadowmap_pars_fragment
						.split ('z += shadowBias')
						.join ('z += shadowBias - 0.001');
					stuff.fragmentShader = stuff.fragmentShader
						.split ('#include <shadowmap_pars_fragment>')
						.join (chunk);
				};

				obj.castShadow = true ;
				obj.receiveShadow = true ;

			};

		});

	};

	function update( delta ) {

		for ( let mixer of charMixers ) {

			mixer.update( delta );

		};

	};

	//

	return {
		createCharacter,
		releaseCharacter,
		toggleCharacterShadows,
		update
	};
}