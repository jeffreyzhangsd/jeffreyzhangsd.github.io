import React from "react";
import createAnimation from "./Animate";

function App() {
	React.useEffect(() => {
		createAnimation();
	}, []);

	return (
		<div id="main">
			<div className="container">
				<div className="canvas-container" id="canvas"></div>
				<div className="header">
					<h1>Jeffrey Zhang</h1>
					<p>Full Stack Software Engineer</p>
				</div>
				<nav>
					<ul className="tabs">
						<li>
							<a href="#home">Home</a>
						</li>
						<li>
							<a href="#projects">Projects</a>
						</li>
						<li>
							<a href="#info">Info</a>
						</li>
						<li>
							<a href="#contact">Contact</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default App;
