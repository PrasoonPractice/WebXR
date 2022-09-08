﻿import { loadGLTF } from "../../libs/loader.js";
import * as THREE from '../../libs/three.js-r132/build/three.module.js';
import { ARButton } from '../../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

document.addEventListener('DOMContentLoaded', () => {
    const initialize = async () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera();

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const reticleGeometry = new THREE.RingGeometry(0.15, 0.2, 32).rotateX(Math.PI / 2);
        const reticleMaterial = new THREE.MeshBasicMaterial();
        const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
        reticle.matrixAutoUpdate = false;
        reticle.visible = false;
        scene.add(reticle);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;

        const arButton = ARButton.createButton(renderer, { requriedFeatures: ['hit-test'], optionalFeatures: ['dom-overlay'], domOverlay: { root: document.body } });
        document.body.appendChild(renderer.domElement);
        document.body.appendChild(arButton);

        const anchor = mindarThree.addAnchor(0);

        const controller = renderer.xr.getController(0);
        scene.add(controller);
        controller.addEventListener('select', () => {
            const glb = await loadGLTF("./Avatar.glb");
            glb.scene.scale.set(0.1, 0.1, 0.1);
            glb.scene.position.setFromMatrixPosition(reticle.matrix);
            anchor.group.add(glb.scene);

            //const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
            //const material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random() });
            //const mesh = new THREE.Mesh(geometry, material);

            //mesh.position.setFromMatrixPosition(reticle.matrix);
            //mesh.scale.y = Math.random() * 2 + 1;
            //scene.add(mesh);

        });

        renderer.xr.addEventListener("sessionstart", async () => {
            const session = renderer.xr.getSession();
            const viwerReferenceSpace = await session.requestRefrenceSpace("viwer");
            const hitTestSource = await session.requestHitTestSource({ space: viwerReferenceSpace });

            const mixer = new THREE.AnimationMixer(glb.scene);
            const action = mixer.clipAction(glb.animations[0]);

            const clock = new THREE.Clock();

            renderer.setAnimationLoop((timestamp, frame) => {

                if (!frame) return;
                const hitTestResults = frame.getHitTestResults(hitTestSource);
                if (hitTestResults.length > 0) {
                    const hit = hitTestResults[0];
                    const referenceSpace = renderer.xr.getReferenceSpace();
                    const hitPose = hit.getPose(referenceSpace);
                    reticle.visible = true;
                    reticle.matrix.fromArray(hitPose.transform.matrix);
                } eles {
                    reticle.visible = false;
                    action.play();
                }
                const delta = clock.getDelta();
                mixer.update(delta);
                renderer.render(scene, camera);
            });

        });

        renderer.xr.addEventListener("sessionend", async () => {


        });
    }

    initialize();
});
