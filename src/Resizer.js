import React, { Component } from 'react';
import styled from 'styled-components';

let supportsPassiveEvent = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      supportsPassiveEvent = true;
    }
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {}

export { supportsPassiveEvent };

const Wrapper = styled.div`
  background: #000;
  opacity: 0.2;
  z-index: 1;
  box-sizing: border-box;
  background-clip: padding-box;

  :hover {
    transition: all 2s ease;
  }
`;

const HorizontalWrapper = styled(Wrapper)`
  height: 11px;
  margin: -5px 0;
  border-top: 5px solid rgba(255, 255, 255, 0);
  border-bottom: 5px solid rgba(255, 255, 255, 0);
  cursor: row-resize;
  width: 100%;

  :hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }

  .disabled {
    cursor: not-allowed;
  }
  .disabled:hover {
    border-color: transparent;
  }
`;

const VerticalWrapper = styled(Wrapper)`
  width: 11px;
  margin: 0 -5px;
  border-left: 5px solid rgba(255, 255, 255, 0);
  border-right: 5px solid rgba(255, 255, 255, 0);
  cursor: col-resize;

  :hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .disabled {
    cursor: not-allowed;
  }
  .disabled:hover {
    border-color: transparent;
  }
`;

class Resizer extends Component {
  componentDidMount() {
    const opts = supportsPassiveEvent ? { passive: false } : false;
    this.resizer.addEventListener('touchstart', this.handleTouchStart, opts);
    this.resizer.addEventListener('touchend', this.handleTouchEnd, opts);
  }
  componentWillUnmount() {
    const opts = supportsPassiveEvent ? { passive: false } : false;
    this.resizer.removeEventListener('touchstart', this.handleTouchStart, opts);
    this.resizer.removeEventListener('touchend', this.handleTouchEnd, opts);
  }
  handleTouchStart = (event) => {
    const { index, onTouchStart = () => {} } = this.props;
    event.preventDefault();
    onTouchStart(event, index);
  };
  handleTouchEnd = (event) => {
    const { index, onTouchEnd = () => {} } = this.props;
    event.preventDefault();
    onTouchEnd(event, index);
  };
  handleMouseDown = (event) => {
    const { index, onMouseDown = () => {} } = this.props;
    onMouseDown(event, index);
  };
  handleClick = (event) => {
    const { index, onClick = () => {} } = this.props;
    if (onClick) {
      event.preventDefault();
      onClick(event, index);
    }
  };
  handleDoubleClick = (event) => {
    const { index, onDoubleClick = () => {} } = this.props;
    if (onDoubleClick) {
      event.preventDefault();
      onDoubleClick(event, index);
    }
  };
  setResizerRef = (resizer) => {
    this.resizer = resizer || this.resizer;
  };

  render() {
    const {
      split = 'vertical'
    } = this.props;

    const props = {
      ref: this.setResizerRef,
      'data-attribute': split,
      'data-type': 'Resizer',
      onMouseDown: this.handleMouseDown,
      onClick: this.handleClick,
      onDoubleClick: this.handleDoubleClick
    };

    return split === 'vertical' ? (
      <VerticalWrapper { ...props } />
    ) : (
      <HorizontalWrapper { ...props } />
    );
  }
}

export default Resizer;
