import * as THREE from './libs/three.js-r132/build/three.module.js';
import { loadGLTF, loadAudio } from "./libs/loader.js";
import { CSS3DObject } from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import { reticle } from './hitTest.js';

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            });
        const { renderer, cssRenderer, scene, cssScene, camera } = mindarThree;

        const objCard = new CSS3DObject(document.querySelector("#ar-div"));
        const cssAnchor = mindarThree.addCSSAnchor(0);
        cssAnchor.group.add(objCard);

        const objIcon = new CSS3DObject(document.querySelector("#ar-icons"));
        cssAnchor.group.add(objIcon);

        const gltf = await loadGLTF('./Project1/Avatar.glb');
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.setFromMatrixPosition(reticle.matrix);
        gltf.scene.position.x += -3;

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(gltf.scene);

        const bgAudio = await loadAudio('./Project1/background.mp3')

        const listener = new THREE.AudioListener();
        camera.add(listener);

        const audioBG = new THREE.PositionalAudio(listener);
        anchor.group.add(audioBG);

        audioBG.setBuffer(bgAudio);
        audioBG.setRefDistance(80);
        audioBG.setLoop(true);

        await mindarThree.start();
        export { renderer, cssRenderer, scene, cssScene, camera};
        });
    }
    start();
});