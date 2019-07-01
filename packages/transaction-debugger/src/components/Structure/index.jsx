import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';


const Structure = ({ parts }) => {
  function renderPart(part, nested) {
    return (
      <code className={classnames(styles.part, { [styles.nested]: nested }, styles[part.background])}>
        {typeof part.data === 'string'
          ? part.data
          : part.data.map(p => renderPart(p, true))
        }
        <span className={classnames(styles.tooltip, { [styles.top]: nested })}>
          {part.name}
        </span>
      </code>
    );
  }

  return (
    <section className={styles.root}>
      {parts.map(p => renderPart(p))}
    </section>
  );
};

Structure.propTypes = {
  parts: T.arrayOf(T.shape()).isRequired,
};

export default Structure;
