import React from "react";
import ProjectCard from "./ProjectCard";

const Projects = (theme) => {
  const projects = [
    {
      imageUrl: "https://github.com/perFECt-dark/Front-End-Capstone/raw/master/client/Gallery.png",
      title: "Project Atelier FE",
      githubUrl: "https://github.com/perFECt-dark/Front-End-Capstone",
      desc: "Front end project",
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/121067631?s=48&v=4",
      title: "Project Atelier SDE",
      githubUrl: "https://github.com/Gaviali/Ratings-and-Reviews-SDC",
      desc: "System design back-end project",
    },
    {
      imageUrl:
        "https://user-images.githubusercontent.com/59150695/214371736-04101068-2797-4f48-893c-112f8b311588.gif",
      title: "PAGER",
      githubUrl: "https://github.com/BO-Phoenix/PAGER",
      desc: "Full stack mobile application",
    },
    {
      title: "Persistence",
      githubUrl: "https://github.com/jeffreyzhangsd/Persistence",
      desc: "Swift notification project",
    },
    {
      imageUrl:
        "https://github.com/jeffreyzhangsd/http-cat-viewer/assets/109628105/cf9f6f78-8778-46dd-a191-81576cfbd73a",
      title: "HTTP Cat Viewer",
      githubUrl: "https://github.com/jeffreyzhangsd/http-cat-viewer",
      desc: "1st place NextJS hackathon project",
    },
  ];

  // template
  // { imageUrl: "img", title: "title", githubUrl: "github url", desc: "short description" },

  // fix project width for phones

  return (
    <>
      <h1 className="projects">Projects!</h1>
      <div className="projectContainer">
        {projects.map((p, index) => (
          <ProjectCard
            key={index}
            imageUrl={p.imageUrl}
            title={p.title}
            githubUrl={p.githubUrl}
            desc={p.desc}
          />
        ))}
      </div>
    </>
  );
};

export default Projects;
