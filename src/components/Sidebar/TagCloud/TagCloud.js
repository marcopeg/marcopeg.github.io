import React from 'react';
import kebabCase from 'lodash/kebabCase';
import ReactWordcloud from "react-wordcloud";

const options = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  enableTooltip: false,
  deterministic: true,
  fontSizes: [15, 60],
  fontFamily: `apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif`,
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90, -90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 1000,
};

const newUrl = (tag) =>{
  return  window.open(`/tag/${kebabCase(tag.text)}/`,"_self");
}

const TagListCloud = ({ tagList }) => {
    const callbacks = {
      onWordClick:  newUrl,
    };

   return (<div style={{ height: 300, maxWidth: 300, marginLeft: '-6%'}}>
        <ReactWordcloud options={options} words={tagList} callbacks={callbacks} />
      </div>);
  };

export default TagListCloud;
