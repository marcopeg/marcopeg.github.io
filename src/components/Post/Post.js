import React from 'react'
import { Link } from 'gatsby'
import Author from './Author'
import Comments from './Comments'
import Content from './Content'
import Meta from './Meta'
import Tags from './Tags'
import styles from './Post.module.scss'

const Post = ({ post }) => {
    const {
        tags,
        title,
        date
    } = post.frontmatter

    const { html } = post
    const { tagSlugs, image } = post.fields

    return (
        <div className={styles['post']}>
            <Link className={styles['post__home-button']} to="/">All Articles</Link>

            <div className={styles['post__content']}>
                <Content
                    body={html}
                    title={title}
                    image={image}
                />
            </div>

            {/* <div className={styles['post__footer']}>
                <Meta date={date} />
                <Tags tags={tags} tagSlugs={tagSlugs} />
                <Author />
            </div> */}

            <div className={styles['post__comments']}>
                <div className={styles['post__comments--inner']}>
                    <Comments postSlug={post.fields.slug} postTitle={post.frontmatter.title} />
                </div>
            </div>
        </div>
    )
}

export default Post
