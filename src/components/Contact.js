import React from "react";
import SocialMedia from "./SocialMedia";
import Button from "./Button";
import peepo from "../images/peeposhy.jpg";

const Contact = ({ resumeURL }) => {
  return (
    <>
      <div className="container">
        <div className="leftCol">
          <h1>Contact Information and social medias</h1>
          <div className="homeContainer">
            <p>You can reach me on LinkedIn and my email here!</p>
            <br />
            <SocialMedia />
            <br />
            <div>
              <Button text="See My Resume!" newTab={true} href={resumeURL} />
            </div>
          </div>
        </div>
        <div
          className="rightCol"
          style={{ flexDirection: "column", justifyContent: "start", padding: "20px" }}>
          <p>
            If you'd like to set up a meeting with me you can schedule one here with Calendly!
            <br /> Mon - Fri PDT, 12PM - 5PM
          </p>
          <br />
          <a
            className="calendly"
            target="_blank"
            rel="noopener noreferrer"
            href="https://calendly.com/jzhang22la/jzcoffeechat">
            Calendly Link
          </a>
          <img
            src={peepo}
            alt="a green frog guy that is shy"
            style={{ height: "100px", width: "100px" }}
          />
        </div>
      </div>
    </>
  );
};

export default Contact;
