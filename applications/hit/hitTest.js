//import libreries
import * as THREE from '../libs/three.js-r132/build/three.module.js';
import {GLTFLoader} from '../libs/three.js-r132/examples/jsm/loaders/GLTFLoader.js';
//import { loadAudio, loadTextures } from '../libs/loader.js';
import {ARButton} from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

document.addEventListener('DOMContentLoaded', () => {
	const initialize = async() => {
		//create scene and camera
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
		//create light
		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
		scene.add(light);
		//create a reticle to mark the hit test succes location
		const reticleGeometry = new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX(- Math.PI / 2);
    		const reticleMaterial = new THREE.MeshBasicMaterial(); 
    		const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    		reticle.matrixAutoUpdate = false;
		//make the reticle idealy not visible and add it to scene
    		reticle.visible = false;
    		scene.add(reticle);
		console.log("reticle added");
		//lod the 3d model using a loder object
		const loader = new GLTFLoader();
		console.log("loader");
		let avatar;
		let originPosition;
		await loader.load(
			'../Project1/person/scene.gltf',
			function (gltf) {
				avatar = gltf.scene;
				console.log("avatar loaded");
				avatar.matrix.fromArray(originPosition);
				avatar.visible = false;
				scene.add(avatar);
								
			},
			function (loading) {
				console.log("loading avatar");
				
			}
		);
		//Create a renderer
		const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    		renderer.setPixelRatio(window.devicePixelRatio);
    		renderer.setSize(window.innerWidth, window.innerHeight);
    		renderer.xr.enabled = true;
		//creat a button to request an XR session
		const arButton = ARButton.createButton(renderer, {requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    		document.body.appendChild(renderer.domElement);
    		document.body.appendChild(arButton);
		//create a counter variable to use as a check for number of models shown
		var counter = false;
		//create a controller object to store co ordinate information about any user input event
		const controller = renderer.xr.getController(0);
		scene.add(controller);
		//create an event listner on how to respond if a click or tap event occures
		controller.addEventListener('select', () => {
			console.log("select");
			if (reticle.visible && avatar) {
				avatar.scale.set(0.0019, 0.0019, 0.0019);
				avatar.visible = true;
				console.log(avatar);
				console.log("Avatar rendered at reticle");
				reticle.visible = false;
				counter = true;
				console.log("counter is now true");
			}
			//always use the reticle.matrix to set/compare position
			//mesh.position.setFromMatrixPosition(reticle.matrix);
      			//mesh.scale.y = Math.random() * 2 + 1;
			//scene.add(mesh);
		});
		//creat an event listner for when an event occure once an event start
		renderer.xr.addEventListener("sessionstart", async (e) => {
			const session = renderer.xr.getSession();
			const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
			const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});
			//start a render loop i.e., to determine the runtime activities
			renderer.setAnimationLoop((timestamp, frame) => {
				if (!frame) return;

				const hitTestResults = frame.getHitTestResults(hitTestSource);

				if (hitTestResults.length) {
					const hit = hitTestResults[0];
					const referenceSpace = renderer.xr.getReferenceSpace(); // ARButton requested 'local' reference space
					const hitPose = hit.getPose(referenceSpace);
					originPosition = hitPose.transform.matrix;
					//show where the x,y,z origin will be set in case of an event
					if (!counter) {
						reticle.visible = true;
						reticle.matrix.fromArray(originPosition);
					}
					
				} else {
					reticle.visible = false;
				}
				//render scene and camera
				renderer.render(scene, camera);
				
			});
		});

    		renderer.xr.addEventListener("sessionend", () => {
      			console.log("session end");
    		});
		
	}
  initialize();
});
