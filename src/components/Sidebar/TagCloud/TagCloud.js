import React from 'react';
import kebabCase from 'lodash/kebabCase';
import ReactWordcloud from "react-wordcloud";

const options = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  enableTooltip: false,
  deterministic: false,
  fontFamily: "impact",
  fontSizes: [20, 90],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90],
  scale: "sqrt",
  spiral: "archimedean",
  transitionDuration: 100,
};

const newUrl = (tag) =>{
  debugger;
  return  window.open(`/tag/${kebabCase(tag.text)}/`, "_blank");
}

const TagListCloud = ({ tagList }) => {
    const callbacks = {
      onWordClick:  newUrl,
    };

   return (<div style={{ height: 700, width: '100%' , background: 'lightgrey' }}>
        <ReactWordcloud options={options} words={tagList} callbacks={callbacks} />
      </div>);
  };

export default TagListCloud;
