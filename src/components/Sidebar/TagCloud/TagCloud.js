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
  return  window.open(`/tag/${kebabCase(tag.text)}/`,"_self");
}

const TagListCloud = ({ tagList }) => {
    const callbacks = {
      onWordClick:  newUrl,
    };

   return (<div style={{ height: 400, width: '100%', marginLeft: '-6%'}}>
        <ReactWordcloud options={options} words={tagList} callbacks={callbacks} />
      </div>);
  };

export default TagListCloud;
