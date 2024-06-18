import React from "react";
import SocialMedia from "./SocialMedia";
import Button from "./Button";

const Contact = () => {
  return (
    <>
      <div className="container">
        <div className="leftCol">
          <h1>Contact</h1>
          <br />
          <SocialMedia />
        </div>
        <div className="rightCol">{/* form? */}</div>
      </div>
    </>
  );
};

export default Contact;
