import React from 'react';
import { Link, graphql } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import './tag-list.scss';
import rightarrow from "../assets/images/arrow24.png";

const TagsListTemplate = ({ data }) => {
  const {
    title,
    subtitle
  } = data.site.siteMetadata;
  const { group } = data.allMarkdownRemark;

  return (
    <Layout title={`Tags - ${title}`} description={subtitle}>
      <Sidebar />
      <Page title="Tags">
        <section className='WaffleGridSection__grid'>
        {group.map((tag) => (
             <Link to={`/tag/${kebabCase(tag.fieldValue)}/`} key={tag.fieldValue} className='tagBlock'>
                  <h4>{tag.fieldValue}</h4>
                  Total Article : {tag.totalCount}
                    <img src={rightarrow} ></img>
              </Link>
          ))}
        </section>
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query TagsListQuery {
    site {
      siteMetadata {
        title,
        subtitle
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;

export default TagsListTemplate;