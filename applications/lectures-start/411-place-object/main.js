import * as THREE from '../../libs/three.js-r132/build/three.module.js';
import {ARButton} from '../../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

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
    
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);
    const controller = renderer.xr.getController(0);
    scene.add(controller);
    const anchor = mindarThree.addAnchor(0);
    controller.addEventListener('select', () => {
        const gltf = await loadGLTF("../../assets/models/musicband-raccoon/scene.gltf");
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.position.applyMatrix4(controller.matrixWorld);
        gltf.scene.quaternion.setFormRotationMatrix(controller.matrixWorld);
        anchor.group.add(gltf.scene);
        scene.add(mesh);
    });
  }

  initialize();
});
