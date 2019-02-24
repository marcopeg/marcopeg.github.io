/* eslint-disable */

import React from 'react';
import { withPrefix, Link } from 'gatsby';
import styles from './Author.module.scss';

const Author = ({ author, isIndex }) => (
  <div className={styles['author']}>
    {/* <Link to="/">
      <img
        src={withPrefix(author.photo)}
        className={styles['author__photo']}
        width="75"
        height="75"
        alt={author.name}
      />
    </Link> */}

    { isIndex ? (
      <h1 className={styles['author__title']} style={{ marginTop: 0 }}>
        <Link className={styles['author__title-link']} to="/">{author.name}</Link>
      </h1>
    ) : (
      <h2 className={styles['author__title']} style={{ marginTop: 0 }}>
        <Link className={styles['author__title-link']} to="/">{author.name}</Link>
      </h2>
    )}
    {/* <p className={styles['author__subtitle']}>{author.bio}</p> */}
    <div style={{ color: '#444', fontSize: 12 }}>
      <p style={{ marginBottom: 15 }}>
        When it comes to write code <b>you don't need to learn magic spells</b>.
      </p>
      <p>
        All you need is to <b>take a look outside the window</b> and solve your problem
        with <b>patterns from the real world :-)</b>
      </p>
    </div>
  </div>
);

export default Author;
