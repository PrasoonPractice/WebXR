import { loadGLTF } from '../libs/loader.js';
import * as THREE from '../libs/three.js-r132/build/three.module.js';
import {ARButton} from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

document.addEventListener('DOMContentLoaded', () => {
	const initialize = async() => {
		const scene = new THREE.Scene();
    		const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    		scene.add(light);

    		const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    		renderer.setPixelRatio(window.devicePixelRatio);
    		renderer.setSize(window.innerWidth, window.innerHeight);
   		renderer.xr.enabled = true;
    		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
		});

		const arButton = ARButton.createButton(renderer, {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    		document.body.appendChild(renderer.domElement);
    		document.body.appendChild(arButton);

    		const controller = renderer.xr.getController(0);
    		scene.add(controller);
		
	        //var loader = new GLTFLoader();
        	//loader.load(
          	//'../Project1/Avatar.glb',
          	//(avatar) => {
           	//model = avatar.scene;
           	//model.scale.set(0.1, 0.1, 0.1);
            	//model.castShadow = true;
            	//model.receiveShadow = true;
          	//}
		
		const avatar = await loadGLTF('../Project1/Avatar.glb');
		
    		controller.addEventListener('select', () => {
	    		avatar.scene.quaternion.setFromRotationMatrix(controller.matrixWorld);
	    		avatar.scene.position.applyMatrix4(controller.matrixWorld);
    		});
  	}

  	initialize();
});
