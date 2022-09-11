import * as THREE from './libs/three.js-r132/build/three.module.js';
import { loadGLTF, loadAudio } from "./libs/loader.js";
import { CSS3DObject } from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import {ARButton} from './libs/three.js-r132/examples/jsm/webxr/ARButton.js';

document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const reticleGeometry = new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX(- Math.PI / 2);
    const reticleMaterial = new THREE.MeshBasicMaterial(); 
    const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const xrRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    xrRenderer.setPixelRatio(window.devicePixelRatio);
    xrRenderer.setSize(window.innerWidth, window.innerHeight);
    xrRenderer.xr.enabled = true;

    const arButton = ARButton.createButton(renderer, {requiredFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);

    const counter = false;

    const controller = renderer.xr.getController(0);
    scene.add(controller);
    controller.addEventListener('select', () => {
    //forward to ui
    consol.log("send to ui.js");

    });

    xrRenderer.xr.addEventListener("sessionstart", async (e) => {
      const session = xrRenderer.xr.getSession();
      const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
      const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});


      xrRenderer.setAnimationLoop((timestamp, frame) => {
	    if (!frame) return;

	    const hitTestResults = frame.getHitTestResults(hitTestSource);

        if (!counter)
    	    if (hitTestResults.length) {
	        const hit = hitTestResults[0];
	        const referenceSpace = xrRenderer.xr.getReferenceSpace(); // ARButton requested 'local' reference space
	        const hitPose = hit.getPose(referenceSpace);

	        reticle.matrix.fromArray(hitPose.transform.matrix);
            counter = true;
            export {hit, reticle};
	        }
        renderer.render(scene, camera);
        cssRenderer.render(cssScene, camera);
        xrRenderer.render(scene, camera);
       });
    });
    
    xrRenderer.xr.addEventListener("sessionend", () => {
      console.log("session end");
    });

  }

  initialize();
});