import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

const Projects = (theme) => {
  const [githubIcon, setGithubIcon] = useState(
    "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png"
  );

  useEffect(() => {
    if (theme === "dark") {
      setGithubIcon("https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png");
    } else {
      setGithubIcon(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR27kaHyBN4-iwj7H4pMmnE7kaC720Y-PYzKQ&s"
      );
    }
  }, [theme]);

  const projects = [
    {
      imageUrl: "https://github.com/perFECt-dark/Front-End-Capstone/raw/master/client/Gallery.png",
      title: "FEC - Product store page",
      githubUrl: "https://github.com/perFECt-dark/Front-End-Capstone",
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/121067631?s=48&v=4",
      title: "SDC - Store back-end project",
      githubUrl: "https://github.com/Gaviali/Ratings-and-Reviews-SDC",
    },
    {
      imageUrl:
        "https://user-images.githubusercontent.com/59150695/214371736-04101068-2797-4f48-893c-112f8b311588.gif",
      title: "PAGER",
      githubUrl: "https://github.com/BO-Phoenix/PAGER",
    },
    {
      title: "Persistence",
      githubUrl: "https://github.com/jeffreyzhangsd/Persistence",
    },
  ];

  // template
  // { imageUrl: "img", title: "title", githubUrl: "github url" },

  return (
    <>
      <h1 className="projects" style={{ padding: "20px" }}>
        Projects!
      </h1>
      <div className="projectContainer">
        {projects.map((p, index) => (
          <ProjectCard key={index} imageUrl={p.imageUrl} title={p.title} githubUrl={p.githubUrl} />
        ))}
      </div>
    </>
  );
};

export default Projects;
