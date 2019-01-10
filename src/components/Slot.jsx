import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

class Slot extends Component {
  render() {
    const m = this.props.mod;
    const warning = () => false;
    const slot = {};
    const classRating = 0;
    const mass = 0;
    const translate = arg => arg;
    const formats = {
      round: a => Math.round(a)
    };
    const units = {};
    return (
      <div className={'slot'}>
        <div className={'cb'}>
          <div className={'r'}>{formats.round(mass)}</div>
        </div>
        <div className={cn('slot', { selected: this.props.selected })} onClick={this.props.onOpen}
             onKeyDown={this._keyDown} tabIndex="0" ref={slotDiv => this.slotDiv = slotDiv}>
          <div className={cn('details-container', {
            warning: warning && warning(slot.m),
            disabled: m.grp !== 'bh' && !slot.enabled
          })}>
            <div className={'sz'}>{m.grp == 'bh' ? m.name.charAt(0) : m.getSize()}</div>
            <div>
              <div className={'l'}>{classRating} {translate(m.name || m.grp)}{m.mods && Object.keys(m.mods).length > 0 ?
                <span className='r'></span> : null}</div>
              <div className={'r'}>{formats.round(mass)}{units.T}</div>
              <div/>
              <div className={'cb'}>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Slot.propTypes = {
  mod: PropTypes.any
};

export default Slot;
