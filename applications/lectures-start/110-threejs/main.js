import * as THREE from '../../libs/three.js-r132/build/three.module.js';
document.addEventListener("DOMContentLoded", () =>{
	const scene = new THREE.Scene();
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: "red" });
	const cube = new THREE.Mesh(geometry, material);

	scene.add(cube);
	cube.position.set(0, 0, -2);
	cube.rotation.set(0, Math.PI / 4, 0);

	const camera = new THREE.PerspectiveCamera();
	camera.position.set(1, 1, 5);


	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(500, 500);
	renderer.render(scene, camera);

	document.body.appendChild(renderer.domElement);

});
