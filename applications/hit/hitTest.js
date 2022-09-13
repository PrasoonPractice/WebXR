import {loadGLTF} from "../libs/loader.js";
import * as THREE from '../libs/three.js-r132/build/three.module.js';
import {ARButton} from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

// make clone object not sharing materials
//const deepClone = (obj) => {
//  const newObj = obj.clone();
//  newObj.traverse((o) => {
//    if (o.isMesh) {
//      o.material = o.material.clone();
//    }
//  });
//  return newObj;
//}

document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const reticleGeometry = new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX(- Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial(); 
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
    
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    const arButton = ARButton.createButton(renderer, {requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);

    const avatar = await loadGLTF('../Project1/Avatar.glb');
    avatar.scene.scale.set(1, 0.85, 1);
    //avatar.scene.position.set(-0.8, -0.75, -0.3);

    const item = new THREE.Group();
    item.add(avatar.scene);
    item.visible = false;

    const controller = renderer.xr.getController(0);
    scene.add(controller);
    controller.addEventListener('select', (e) => {
    console.log("select");
    });
    
    renderer.xr.addEventListener("sessionstart", async (e) => {
      const session = renderer.xr.getSession();
      const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
      const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});
      const counter = false;

      renderer.setAnimationLoop((timestamp, frame) => {
	    if (!frame) return;
	    const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
	  	const hit = hitTestResults[0];
	  	const referenceSpace = renderer.xr.getReferenceSpace(); // ARButton requested 'local' reference space
	  	const hitPose = hit.getPose(referenceSpace);
		
		if (!counter) {
	  		reticle.visible = true;
	  		reticle.matrix.fromArray(hitPose.transform.matrix);
		}
  	     } 
             if (reticle.visible && avatar){
	                item.visible = true;
	                item.position.setFromMatrixPosition(new THREE.Matrix4().fromArray(hit.getPose(referenceSpace).transform.matrix));
                    	counter = true;
            }
        }
	    renderer.render(scene, camera);
      });
    });
  }
  initialize();
});
