import { CSS3DObject } from '../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
import { loadGLTF } from "../libs/loader.js";
import * as THREE from '../libs/three.js-r132/build/three.module.js';
import { ARButton } from '../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

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
        const counter = false;
        const controller = renderer.xr.getController(0);
        scene.add(controller);
        controller.addEventListener('select', () => {
            if (!counter) {
                const glb = await loadGLTF("./Avatar.glb");
                glb.scene.scale.set(1, 1, 1);

                const webButton = document.querySelector("#web-button");
                const locationButton = document.querySelector("#location-button");
                const callButton = document.querySelector("#call-button");
                const messageButton = document.querySelector("#message-button");
                const emailButton = document.querySelector("#email-button");

                const businessLogo = new CSS3DObject(document.querySelector("#cardlogo"));
                const cssAnchor = mindarThree.addCSSAnchor(0);
                cssAnchor.group.add(businessLogo);
                //webButton.setAttribute("visible", true);
                //setTimeout(() => {
                //    const obj1 = new CSS3DObject(document.querySelector("#info1"));                                        cssAnchor.group.add(obj1);
                //    locationButton.setAttribute("visible", true);
                //    setTimeout(() => {
                //        const obj2 = new CSS3DObject(document.querySelector("#info2"));
                //        cssAnchor.group.add(obj2);
                //    }, 50);
                //}, 300);
                //setTimeout(() => {
                //    callButton.setAttribute("visible", true);
                //}, 600);
                //setTimeout(() => {
                //    messageButton.setAttribute("visible", true);
                //}, 900);
                //setTimeout(() => {
                //    emailButton.setAttribute("visible", true);
                //}, 1200);

                counter = true;


            }
             glb.scene.position.setFromMatrixPosition(reticle.matrix);
            anchor.group.add(glb.scene);

            webButton.addEventListener('click', function (evt) {
                window.location.href = " https://falconicx.com/";
            });
            locationButton.addEventListener('click', function (evt) {
                console.log("loc");
                text.setAttribute("value", "Vancouver, Canada | Hong Kong");
            });
            callButton.addEventListener('click', function (evt) {
                window.location.href = "tel://+919453275960";
            });
            messageButton.addEventListener('click', function (evt) {
                window.location.href = "https://wa.me/919453275960";
            });
            emailButton.addEventListener('click', function (evt) {
                //looking into ways to directly open a compose mail window;
            });

        }


        //        webButton.setAttribute("visible", true);
        //        setTimeout(() => {
        //            locationButton.setAttribute("visible", true);
        //        }, 300);
        //        setTimeout(() => {
        //            callButton.setAttribute("visible", true);
        //        }, 600);
        //        setTimeout(() => {
        //            messageButton.setAttribute("visible", true);
        //        }, 900);
        //        setTimeout(() => {
        //            emailButton.setAttribute("visible", true);
        //        }, 1200);

        //        webButton.addEventListener('click', function (evt) {
        //            window.location.href = "https://softmind.tech";
        //        });
        //        locationButton.addEventListener('click', function (evt) {
        //            console.log("loc");
        //            text.setAttribute("value", "Vancouver, Canada | Hong Kong");
        //        });
        //        callButton.addEventListener('click', function (evt) {
        //            window.location.href = "tel://+919453275960";
        //        });
        //        messageButton.addEventListener('click', function (evt) {
        //            window.location.href = "https://wa.me/919415496532";
        //        });
        //        emailButton.addEventListener('click', function (evt) {
        //            //looking into ways to directly open a compose mail window;
        //        });

        //    }

        //});

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
