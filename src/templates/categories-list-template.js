import React from 'react';
import { Link, graphql } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';
import Page from '../components/Page';
import './category-list.scss';
import rightarrow from "../assets/images/arrow24.png";

const CategoriesListTemplate = ({ data }) => {
  const {
    title,
    subtitle
  } = data.site.siteMetadata;

  const { group } = data.allMarkdownRemark;

  return (
    <Layout title={`Categories - ${title}`} description={subtitle}>
      <Sidebar />
      <Page title="Categories">
      <section className='WaffleGridSection__grid'>
        {group.map((category) => (
             <Link to={`/category/${kebabCase(category.fieldValue)}/`} key={category.fieldValue} className='categoryBlock'>
                  <h4>{category.fieldValue}</h4>
                  Total Article : {category.totalCount}
                    <img src={rightarrow} ></img>
              </Link>
          ))}
        </section>
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query CategoriesListQuery {
    site {
      siteMetadata {
        title
        subtitle
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
    ) {
      group(field: frontmatter___category) {
        fieldValue
        totalCount
      }
    }
  }
`;

export default CategoriesListTemplate;
