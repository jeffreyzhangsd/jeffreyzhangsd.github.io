import React from "react";

const Home = () => {
  return (
    <>
      <div className="container">
        <div className="leftCol">
          <h1>Expressing big ideas in byte sized messages</h1>
          {/* short summary/ title field */}
          <p>Software Engineer</p>
          {/* linkedin, github, leetcode?, email? */}
        </div>
        <div className="rightCol">
          <img src="https://github.com/jeffreyzhangsd.png" alt="It's me!" loading="lazy"></img>
        </div>
      </div>
    </>
  );
};

export default Home;
