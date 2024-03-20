import * as THREE from "three";
import earth from "../Earth/EarthMask_2500x1250.jpg";
import stars from "../Earth/starfield.png";

const createAnimation = () => {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.z = 250;
	camera.position.x = 150;
	camera.position.y = 25;
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById("canvas").appendChild(renderer.domElement);

	let textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(earth);

	const geometry = new THREE.SphereGeometry(25, 32, 32); // (radius, widthSegments, heightSegments)
	const material = new THREE.MeshBasicMaterial({ map: texture });
	const sphere = new THREE.Mesh(geometry, material);
	scene.add(sphere);

	// // Galaxy
	let galaxyGeometry = new THREE.SphereGeometry(300, 90, 90);
	let galaxyMaterial = new THREE.MeshBasicMaterial({
		side: THREE.BackSide,
	});
	let galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
	galaxy.position.set(150, 25, 250);

	// // Load Galaxy Textures
	textureLoader.crossOrigin = true;
	textureLoader.load(stars, function (texture) {
		galaxyMaterial.map = texture;
		galaxy.material.transparent = true; // Enable transparency
		galaxy.material.opacity = 0.2; // Set opacity to 20%
		scene.add(galaxy);
	});

	// Animation loop
	const animate = function () {
		requestAnimationFrame(animate);

		// Rotate
		sphere.rotation.y += 0.0005;
		sphere.rotation.x += 0.00000001;
		galaxy.rotation.y -= 0.0001;
		renderer.render(scene, camera);
	};

	// Handle window resize
	window.addEventListener("resize", function () {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});

	// Start the animation loop
	animate();
};

export default createAnimation;
