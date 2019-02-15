import React from 'react'
import PostImage from '../../PostImage'
import styles from './Content.module.scss'

const Content = ({ body, title, image }) => (
    <div className={styles['content']}>
        {image && (
            <div className={styles['content__image']}>
                <PostImage src={image} />
            </div>
        )}
        <h1 className={styles['content__title']}>{title}</h1>
        <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
    </div>
)

export default Content
