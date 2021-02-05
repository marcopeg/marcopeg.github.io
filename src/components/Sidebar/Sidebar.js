import React from 'react'
import { graphql, StaticQuery } from 'gatsby'
import Author from './Author'
import Contacts from './Contacts'
import Copyright from './Copyright'
import Menu from './Menu'
import styles from './Sidebar.module.scss'
import TagCloud from './TagCloud'

export const PureSidebar = ({ data, isIndex }) => {
    const {
        author,
        copyright,
        menu
    } = data.site.siteMetadata

    const { group } = data.allMarkdownRemark;
    
    const dataTag=[];
    
    group.map((item) => (
      dataTag.push({ text: item.fieldValue, value : item.totalCount})
    ))

    return (
        <div className={styles['sidebar']}>
            <div className={styles['sidebar__inner']}>
                <Author author={author} isIndex={isIndex} />
                <Menu menu={menu} />
                <TagCloud tagList={dataTag}/>
                <Contacts contacts={author.contacts} />
                <Copyright copyright={copyright} />
            </div>
        </div>
        
    )
}

export const Sidebar = (props) => (
    <StaticQuery
        query={graphql`
      query SidebarQuery {
        site {
          siteMetadata {
            title
            subtitle
            copyright
            menu {
              label
              path
            }
            author {
              name
              photo
              bio
              contacts {       
                twitter
                telegram
                github
                email
                rss
                vkontakte
              }
            }
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
    `}
        render={(data) => <PureSidebar {...props} data={data} />}
    />
)

export default Sidebar
