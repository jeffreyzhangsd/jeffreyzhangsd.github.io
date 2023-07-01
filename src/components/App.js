import React from "react";
import * as THREE from "three";

function App() {
	const createAnimation = () => {
		// set scene and camera position
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.set(0, 0, 15);
		camera.lookAt(0, 0, 0);

		const renderer = new THREE.WebGLRenderer();

		let container = document.getElementById("canvas");
		let rendered = true;
		let w = container.offsetWidth;
		let h = container.offsetHeight;
		console.log(w, h);
		renderer.setSize(w, h);

		if (rendered === true) {
			container.appendChild(renderer.domElement);
			rendered = false;
		}

		const resizeCanvas = () => {
			const canvas = renderer.domElement;
			let container = document.getElementById("canvas");
			const width = container.clientWidth;
			const height = container.clientHeight;

			if (canvas.width !== width || canvas.height !== height) {
				renderer.setSize(width, height);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
				console.log(canvas, width, height);
			}
		};

		const geometry = new THREE.BoxGeometry(1, 1, 1); // vertices for cube
		const points = [];
		points.push(new THREE.Vector3(-10, 0, 0));
		points.push(new THREE.Vector3(0, 10, 0));
		points.push(new THREE.Vector3(10, 0, 0));
		const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

		const material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
		}); // material to color cube
		const lineMat = new THREE.LineBasicMaterial({
			color: 0x0000ff,
		});

		// object, takes geometry and applies material
		const cube = new THREE.Mesh(geometry, material);
		const line = new THREE.Line(lineGeo, lineMat);

		scene.add(cube);
		scene.add(line);

		function animate() {
			resizeCanvas();

			line.rotation.y += 0.01;
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			renderer.render(scene, camera);
			requestAnimationFrame(animate); // better than setinterval
		}

		animate();
	};

	React.useEffect(() => {
		createAnimation();
	}, []);

	return (
		<div className="container">
			<div id="main">
				<div id="bg">
					<div id="canvas" />
				</div>
				<div>
					<h1>Jeffrey Zhang</h1>
					<h2>Full Stack Software Engineer</h2>
					<div id="info">
						<h3>Home || About Me || Portfolio || Contact</h3>
					</div>
					<h2>Testing testing</h2>
				</div>
			</div>
		</div>
	);
}

export default App;
