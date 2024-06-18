import React from "react";
import SocialMedia from "./SocialMedia";
import Button from "./Button";

const Home = () => {
  const resumeLink =
    "https://drive.google.com/file/d/1FYApZkQLq0FzWh4EJS10Po69-uPE7Af0/view?usp=sharing";
  return (
    <>
      <div className="container">
        <div className="leftCol">
          <h1>Expressing big ideas in byte sized messages</h1>
          <div className="homeContainer">
            {/* short summary/ title field */}
            <br />
            <p>Applied Math UCLA | Hack Reactor Alumni | Baseball Enjoyer</p>
            <br />

            <SocialMedia />
            <div className="resume-btn-div">
              <Button text="See My Resume!" newTab={true} href={resumeLink} />
            </div>
          </div>
        </div>
        <div className="rightCol">
          <img src="https://github.com/jeffreyzhangsd.png" alt="It's me!" loading="lazy"></img>
        </div>
      </div>
    </>
  );
};

export default Home;
