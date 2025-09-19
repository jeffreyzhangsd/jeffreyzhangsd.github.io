import React from "react";
import styled from "styled-components";

const IconWrapper = styled.span`
  i {
    background-color: var(--text-color);
  }
  &:hover i {
    background-color: var(--text-color);
    transition: 0.3s ease-in;
  }
`;

const SocialMedia = (props) => {
  const socialMediaLinks = [
    {
      name: "Github",
      link: "https://github.com/jeffreyzhangsd/",
      fontawesomeicon: "fa-github", // Reference https://fontawesome.com/icons/github?style=brands
      backgroundcolor: "#181717", // Reference https://simpleicons.org/?q=github
    },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/jeffreyzhangsd/",
      fontawesomeicon: "fa-linkedin-in", // Reference https://fontawesome.com/icons/linkedin-in?style=brands
      backgroundcolor: "#0077B5", // Reference https://simpleicons.org/?q=linkedin
    },
    {
      name: "Gmail",
      link: "mailto:jeffreyzhangsd@gmail.com",
      fontawesomeicon: "fa-google", // Reference https://fontawesome.com/icons/google?style=brands
      backgroundcolor: "#D14836", // Reference https://simpleicons.org/?q=gmail
    },
  ];

  // note to self: fix button and name size for phones

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
              <i className={`fab ${media.fontawesomeicon}`}></i>
            </IconWrapper>
            <p>{media.name}</p>
          </a>
        );
      })}
    </div>
  );
};

export default SocialMedia;
