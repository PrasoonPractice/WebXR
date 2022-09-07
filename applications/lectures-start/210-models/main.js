import { loadGLTF } from "../../libs/loader.js";
import { mockWithVideo } from '../../libs/camera-mock.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    mockWithVideo('../../assets/mock-videos/musicband1.mp4');
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const anchor = mindarThree.addAnchor(0);

    const glb = await loadGLTF("../../Project1/Avatar.glb");
    glb.scene.scale.set(0.1, 0.1, 0.1);
    glb.scene.position.set(0, -0.4, 0);
    anchor.group.add(glb.scene);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
