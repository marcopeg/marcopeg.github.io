import React from 'react';
import styles from './Content.module.scss';

const Content = ({ body, title, image }) => (
  <div className={styles['content']}>
    {image && (
      <img
        src={`/media/${image}`}
        alt={title}
        style={{ margin: '50px auto 0 auto', width: 80, borderRadius: 40 }}
      />
    )}
    <h1 className={styles['content__title']}>{title}</h1>
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

export default Content;
