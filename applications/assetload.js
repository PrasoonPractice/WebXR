import { loadGLTF, loadAudio } from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {

        //when the hit test occures

        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './assets/targets/musicband.mind',
        });
        const { renderer, scene, camera } = mindarThree;

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const gltf = await loadGLTF('./Project1/Avatar.glb');
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(-2, -0.2, 0);

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(gltf.scene);

        const bgAudio = await loadAudio('./Project1/background.mp3')

        const listener = new THREE.AudioListener();
        camera.add(listener);

        const audioBG = new THREE.PositionalAudio(listener);
        anchor.group.add(audioBG);

        audioBG.setBuffer(bgAudio);
        audioBG.setRefDistance(200);
        audioBG.setLoop(true);

        audioBG.play();
         
        const iAudioClip = await loadAudio('./Project1/intro.mp3');

        const introListener = new THREE.AudioListener();
        camera.add(introListener);

        const audioIntro = new THREE.PositionalAudio(introListener);
        anchor.group.add(audioIntro);

        audioIntro.setBuffer(iAudioClip);
        audioIntro.setRefDistance(70);
        //audioIntro.setLoop(false);

        //when hit occures = () => {
        //    audio.play();
        //}


        //const mixer = new THREE.AnimationMixer(gltf.scene);
        //const action = mixer.clipAction(gltf.animations[0]);
        //action.play();

        const clock = new THREE.Clock();

        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            mixer.update(delta);
            renderer.render(scene, camera);
        });
    }
    start();
});
