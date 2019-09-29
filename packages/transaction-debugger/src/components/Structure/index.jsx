import React from 'react';
import T from 'prop-types';
import classnames from 'classnames';
import styles from './styles.scss';


const Structure = ({ parts }) => {
  function renderPart(part, nested) {
    let content;
    if (typeof part.data === 'string') {
      content = part.data;
    } else if (Array.isArray(part.data)) {
      content = part.data.map(d => renderPart(d, true));
    } else {
      content = Object.keys(part).map(k => renderPart(part[k], true));
    }
    return (
      <code className={classnames(
        styles.part,
        { [styles.nested]: nested },
        styles[part.background],
      )}
      >
        {content}
        {part.name && (
          <span className={classnames(styles.tooltip, { [styles.top]: nested })}>
            {part.name}
          </span>
        )}
      </code>
    );
  }

  return (
    <section className={styles.root}>
      {Object.keys(parts).map(k => renderPart(parts[k]))}
    </section>
  );
};

Structure.propTypes = {
  parts: T.arrayOf(T.shape()).isRequired,
};

export default Structure;
