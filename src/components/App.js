import React, { useState, Suspense } from "react";
import createAnimation from "./Animate";
import Home from "./Home";
import Projects from "./Projects";
import AboutMe from "./AboutMe";
import Contact from "./Contact";

function App() {
	React.useEffect(() => {
		createAnimation();
	}, []);

	// views to switch what is rendered
	const [view, setView] = useState({ name: "Home", viewProps: {} });

	const changeView = (name, someProps = {}) => {
		return (moreProps = {}) => {
			console.log("Changing view to: " + name);
			setView({ name, viewProps: { ...someProps, ...moreProps } });
		};
	};

	const renderView = () => {
		switch (view.name) {
			case "Home":
				return <Home changeView={(v) => changeView(v)} />;
			case "Projects":
				return <Projects changeView={(v) => changeView(v)} />;
			case "AboutMe":
				return <AboutMe changeView={(v) => changeView(v)} />;
			case "Contact":
				return <Contact changeView={(v) => changeView(v)} />;
			default:
				return <Home changeView={(v) => changeView(v)} />;
		}
	};

	return (
		<>
			<div id="main">
				<div className="container">
					<div className="canvas-container" id="canvas">
						<canvas className="canvas-container" id="webgl-canvas"></canvas>
					</div>
					<div className="header">
						<h1>Jeffrey Zhang</h1>
						<p>Full Stack Software Engineer</p>
						<nav>
							<ul className="tabs">
								<li>
									<a href="#home" onClick={changeView("Home")}>
										Home
									</a>
								</li>
								<li>
									<a href="#projects" onClick={changeView("Projects")}>
										Projects
									</a>
								</li>
								<li>
									<a href="#aboutme" onClick={changeView("AboutMe")}>
										About Me
									</a>
								</li>
								<li>
									<a href="#contact" onClick={changeView("Contact")}>
										Contact
									</a>
								</li>
							</ul>
						</nav>
					</div>

					<main>
						<Suspense fallback={<p>Loading!</p>}>{renderView()}</Suspense>
					</main>
				</div>
			</div>
		</>
	);
}

export default App;
