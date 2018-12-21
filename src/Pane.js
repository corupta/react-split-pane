import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import prefixAll from 'inline-style-prefixer/static';
import resolveArrayValue from 'css-in-js-utils/lib/resolveArrayValue';

import { getUnit, convertSizeToCssValue } from './SplitPane';

function PaneStyle({
  split,
  initialSize,
  size,
  minSize,
  maxSize,
  resizersSize,
  styleQ: extraStyle
}) {
  const value = size || initialSize;
  const vertical = split === 'vertical';
  const styleProp = {
    minSize: vertical ? 'minWidth' : 'minHeight',
    maxSize: vertical ? 'maxWidth' : 'maxHeight',
    size: vertical ? 'width' : 'height'
  };

  let style = {
    display: 'flex',
    outline: 'none',
    ...extraStyle
  };

  style[styleProp.minSize] = convertSizeToCssValue(minSize, resizersSize);
  style[styleProp.maxSize] = convertSizeToCssValue(maxSize, resizersSize);

  switch (getUnit(value)) {
    case 'ratio':
      style.flex = value;
      break;
    case '%':
    case 'px':
    case 'vw':
    case 'vh':
      style.flexGrow = 0;
      style[styleProp.size] = convertSizeToCssValue(value, resizersSize);
      break;
  }

  style = prefixAll(style);

  style = Object.keys(style)
    .filter((key) => style.hasOwnProperty(key))
    .map((key) => {
      let styleValue = style[key];
      if (Array.isArray(styleValue)) {
        styleValue = resolveArrayValue(key, styleValue);
      }
      return { [key]: styleValue };
    })
    .reduce((acc, x) => ({ ...acc, ...x }), {});

  return style;
}

class Pane extends PureComponent {
  setRef = (element) => {
    this.props.innerRef(this.props.index, element);
  };

  render() {
    const { children, className } = this.props;
    const prefixedStyle = PaneStyle(this.props);

    return (
      <div className={ className } style={ prefixedStyle } ref={ this.setRef }>
        {children}
      </div>
    );
  }
}

Pane.propTypes = {
  children: PropTypes.node,
  innerRef: PropTypes.func,
  index: PropTypes.number,
  className: PropTypes.string,
  initialSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minSize: PropTypes.string,
  maxSize: PropTypes.string,
  styleQ: PropTypes.shape()
};

Pane.defaultProps = {
  initialSize: '1',
  split: 'vertical',
  minSize: '0',
  maxSize: '100%',
};

export default Pane;
