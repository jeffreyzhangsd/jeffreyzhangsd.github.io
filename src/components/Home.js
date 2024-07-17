import React from "react";
// import SocialMedia from "./SocialMedia";
import Button from "./Button";
import IconCss3 from "./Icons/IconCss3";
import IconHtml5 from "./Icons/IconHtml5";
import IconLogoJavascript from "./Icons/IconLogoJavascript";
import IconMongodb from "./Icons/IconMongodb";
import IconMysql from "./Icons/IconMysql";
import IconNodejs from "./Icons/IconNodejs";
import IconPostgresql from "./Icons/IconPostgresql";
import IconPython from "./Icons/IconPython";
import IconReact from "./Icons/IconReact";
import IconTypescript from "./Icons/IconTypescript";
import IconSqllite from "./Icons/IconSqllite";
import IconTailwind from "./Icons/IconTailwind";

const Home = ({ resumeURL }) => {
  return (
    <>
      <div className="container">
        <div className="leftCol">
          <h1>Expressing big ideas in byte sized messages</h1>
          <div className="homeContainer">
            <p>Applied Math UCLA | Hack Reactor Alumni | Baseball Enjoyer</p>
            <br />

            <p>Technologies</p>
            <div className="technologies">
              {skills.map((skill, i) => (
                <div key={i} className="tech">
                  <div className="logo">{skill.logo}</div>
                  <p>{skill.title}</p>
                </div>
              ))}
            </div>

            {/* <SocialMedia /> */}
            <br />
            <div className="resume-btn-div">
              <Button text="See My Resume!" newTab={true} href={resumeURL} />
            </div>
          </div>
        </div>
        <div className="rightCol">
          <img src="https://github.com/jeffreyzhangsd.png" alt="It's me!" priority="high"></img>
        </div>
      </div>
    </>
  );
};

// JavaScript, TypeScript, Python, Swift, Kotlin, React, HTML/CSS, Tailwind, Node, MySQL

const skills = [
  { logo: <IconLogoJavascript />, title: "JavaScript" },
  { logo: <IconTypescript />, title: "TypeScript" },
  { logo: <IconPython />, title: "Python" },
  { logo: <IconReact />, title: "React" },
  { logo: <IconHtml5 />, title: "HTML 5" },
  { logo: <IconCss3 />, title: "CSS 3" },
  { logo: <IconTailwind />, title: "Tailwind" },
  { logo: <IconNodejs />, title: "Node" },
  { logo: <IconMysql />, title: "MySQL" },
  { logo: <IconPostgresql />, title: "PostgreSQL" },
  { logo: <IconSqllite />, title: "SQLite" },
  { logo: <IconMongodb />, title: "MongoDB" },
];

export default Home;
