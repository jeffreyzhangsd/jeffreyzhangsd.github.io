import React from "react";

const onMouseEnter = (event, color, bgColor) => {
  const el = event.target;
  el.style.color = color;
  el.style.backgroundColor = bgColor;
};

const onMouseOut = (event, color, bgColor) => {
  const el = event.target;
  el.style.color = color;
  el.style.backgroundColor = bgColor;
};

export default function Button({ text, className, href, newTab, theme }) {
  return (
    <div className={className}>
      <a
        className="main-button"
        href={href}
        target={newTab && "_blank"}
        style={{
          color: "var(--text-color)",
          backgroundColor: "var(--background-color)",
          border: `solid 1px var(--text-color)`,
        }}
        onMouseEnter={(event) =>
          onMouseEnter(event, "var(--background-color)", "var(--text-color)")
        }
        onMouseOut={(event) => onMouseOut(event, "var(--text-color)", "var(--background-color)")}>
        {text}
      </a>
    </div>
  );
}
