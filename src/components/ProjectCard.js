import React from "react";

const ProjectCard = ({ imageUrl, title, githubUrl, desc }) => {
  return (
    <div className="projectCardContainer">
      {imageUrl ? (
        <img src={imageUrl} alt={`${title} thumbnail`} className="projectImage" priority="high" />
      ) : (
        <i className="fab fa-github"></i>
      )}

      <h1 className="projectTitle">{title}</h1>
      <p>{desc}</p>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="githubLink">
        View on GitHub
      </a>
    </div>
  );
};

export default ProjectCard;
