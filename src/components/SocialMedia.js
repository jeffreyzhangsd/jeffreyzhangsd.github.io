import React from "react";
import styled from "styled-components";

const SocialMedia = (props) => {
  const IconWrapper = styled.span`
    i {
      background-color: var(--text-color);
    }
    &:hover i {
      background-color: var(--text-color);
      transition: 0.3s ease-in;
    }
  `;

  const socialMediaLinks = [
    {
      name: "Github",
      link: "https://github.com/jeffreyzhangsd/",
      fontAwesomeIcon: "fa-github", // Reference https://fontawesome.com/icons/github?style=brands
      backgroundColor: "#181717", // Reference https://simpleicons.org/?q=github
    },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/jeffreyzhangsd/",
      fontAwesomeIcon: "fa-linkedin-in", // Reference https://fontawesome.com/icons/linkedin-in?style=brands
      backgroundColor: "#0077B5", // Reference https://simpleicons.org/?q=linkedin
    },
    {
      name: "Gmail",
      link: "mailto:jzhang22la@gmail.com",
      fontAwesomeIcon: "fa-google", // Reference https://fontawesome.com/icons/google?style=brands
      backgroundColor: "#D14836", // Reference https://simpleicons.org/?q=gmail
    },
  ];

  return (
    <div className="social-media-div">
      {socialMediaLinks.map((media, i) => {
        return (
          <a
            key={i}
            href={media.link}
            className={`icon-button`}
            target="_blank"
            rel="noopener noreferrer">
            <IconWrapper {...media} {...props}>
              <i className={`fab ${media.fontAwesomeIcon}`}></i>
            </IconWrapper>
            <p>{media.name}</p>
            {/* <span></span> */}
          </a>
        );
      })}
    </div>
  );
};

export default SocialMedia;
