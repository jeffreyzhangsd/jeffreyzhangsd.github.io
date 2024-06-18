import React from "react";

const ProjectCard = ({ imageUrl, title, githubUrl }) => {
  return (
    <div className="projectCardContainer">
      {imageUrl ? (
        <img src={imageUrl} alt={`${title} thumbnail`} className="projectImage" />
      ) : (
        <i className="fab fa-github"></i>
      )}

      <h1 className="projectTitle">{title}</h1>
      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="githubLink">
        View on GitHub
      </a>
    </div>
  );
};

export default ProjectCard;
