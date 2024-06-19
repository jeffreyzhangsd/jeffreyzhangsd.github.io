/* eslint-disable react/jsx-no-comment-textnodes */
import React from "react";
import uclaImg from "../images/uclapfp.jpg";

const AboutMe = () => {
  const commentStyle = { fontSize: "12px", lineHeight: "10px", margin: "5px 0" };
  return (
    <>
      <div className="container">
        <div className="leftCol">
          <h1>Hi there!</h1>
          <p className="commentText" style={commentStyle}>
            // quick background - i used to have long hair!
          </p>
          {/* background */}
          <h4>
            I'm a passionate full stack software engineer based in San Diego, California. With a
            foundation in Applied Math from UCLA and advanced software engineering experience from
            Hack Reactor, I bring a unique blend of analytical skill and technical expertise to the
            table.
          </h4>
          <p className="commentText" style={commentStyle}>
            // experience
          </p>
          {/* some skills */}
          <p>
            I have hands-on experience in both front-end and back-end development, with a diverse
            skill set including JavaScript, TypeScript, React, Node, SQL, NoSQL, Python and more. I
            also have experience with testing, deployment and other developer tools.
          </p>
          <p className="commentText" style={commentStyle}>
            // hobbies
          </p>
          {/* other things */}
          <p>
            Outside of coding, I enjoy a variety of things, some of them being watching football,
            playing piano and guitar, video games, eating Jack in the Box, and rooting for the San
            Diego Padres.
          </p>
        </div>
        <div className="rightCol">
          <img src={uclaImg} alt="It's me!" loading="lazy"></img>
        </div>
      </div>
    </>
  );
};

export default AboutMe;
