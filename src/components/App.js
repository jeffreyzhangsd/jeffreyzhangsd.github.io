import React, { useEffect, useState, Suspense } from "react";
import Home from "./Home";
import Projects from "./Projects";
import AboutMe from "./AboutMe";
import Contact from "./Contact";

function App() {
  // State to manage the theme
  const [theme, setTheme] = useState("dark");

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Apply the theme to the body class
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // views to switch what is rendered
  const [view, setView] = useState({ name: "Home", viewProps: {} });

  const changeView = (name, someProps = {}) => {
    return (moreProps = {}) => {
      // console.log("Changing view to: " + name);
      setView({ name, viewProps: { ...someProps, ...moreProps } });
    };
  };

  const resumeURL =
    "https://docs.google.com/document/d/e/2PACX-1vTgJ7NWdytfXo9WOdfXCsIT2ESU5tsU7XLBDvdkHfvQKhUc1sgLiz8VmI2s4Fanfsud4U3lL0Ar4-dM/pub";

  const renderView = () => {
    switch (view.name) {
      case "Home":
        return <Home resumeURL={resumeURL} theme={theme} changeView={(v) => changeView(v)} />;
      case "Projects":
        return <Projects theme={theme} changeView={(v) => changeView(v)} />;
      case "AboutMe":
        return <AboutMe changeView={(v) => changeView(v)} />;
      case "Contact":
        return <Contact resumeURL={resumeURL} changeView={(v) => changeView(v)} />;
      default:
        return <Home changeView={(v) => changeView(v)} />;
    }
  };

  // Note to self: fix header margin for mobile devices
  // also fix my name size for mobile
  // next.js to host everything would probably be better (fast image)

  return (
    <>
      <div className="appContainer">
        <div className="header">
          <div>
            <a id="name" href="#home" onClick={changeView("Home")}>
              Jeffrey Zhang
            </a>
            <p>
              <br />
              Full Stack Software Engineer
            </p>
          </div>
          <nav>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button className="toggleTheme" onClick={toggleTheme}>
                {theme === "light" ? (
                  <i className="fas fa-moon" style={{ color: "#000000" }}></i>
                ) : (
                  <i className="fas fa-sun" style={{ color: "#ffffff" }}></i>
                )}
              </button>
              <ul className="tabs">
                <li>
                  <a href="#aboutme" onClick={changeView("AboutMe")}>
                    About Me
                  </a>
                </li>
                <li>
                  <a href="#projects" onClick={changeView("Projects")}>
                    Projects
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={changeView("Contact")}>
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <main>
          <Suspense fallback={<p>Loading!</p>}>{renderView()}</Suspense>
        </main>
      </div>
    </>
  );
}

export default App;
