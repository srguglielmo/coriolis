import React from 'react';
import PropTypes from 'prop-types';
import TranslatedComponent from './TranslatedComponent';
import { Pip } from './SvgIcons';
import { autoBind } from 'react-extras';
import { Ship } from 'ed-forge';

/**
 * Pips displays SYS/ENG/WEP pips and allows users to change them with key presses by clicking on the relevant area.
 * Requires an onChange() function of the form onChange(sys, eng, wep) which is triggered whenever the pips change.
 */
export default class Pips extends TranslatedComponent {
  static propTypes = {
    ship: PropTypes.instanceOf(Ship).isRequired,
    pips: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  /**
   * Constructor
   * @param  {Object} props   React Component properties
   * @param  {Object} context   React Component context
   */
  constructor(props, context) {
    super(props);
    autoBind(this);

    const { ship } = props;
    this._incSys = this._change(ship.incSys);
    this._incEng = this._change(ship.incEng);
    this._incWep = this._change(ship.incWep);
    this._reset = this._change(ship.pipsReset);
  }

  /**
   * Add listeners after mounting
   */
  componentDidMount() {
    document.addEventListener('keydown', this._keyDown);
  }

  /**
   * Remove listeners before unmounting
   */
  componentWillUnmount() {
    document.removeEventListener('keydown', this._keyDown);
  }

  /**
   * Handle Key Down
   * @param  {Event} e  Keyboard Event
   */
  _keyDown(e) {
    if (e.ctrlKey || e.metaKey) { // CTRL/CMD
      switch (e.keyCode) {
        case 37:     // Left arrow == increase SYS
          e.preventDefault();
          this._incSys();
          break;
        case 38:     // Up arrow == increase ENG
          e.preventDefault();
          this._incEng();
          break;
        case 39:     // Right arrow == increase WEP
          e.preventDefault();
          this._incWep();
          break;
        case 40:     // Down arrow == reset
          e.preventDefault();
          this._reset();
          break;
      }
    }
  }

  /**
   * Creates a function that handles pip assignment and call `onChance`.
   * @param {String} cb Callback that handles the actual pip assignment
   * @param {Boolean} isMc True when increase is by multi crew
   * @returns {Function} Function that handles pip assigment
   */
  _change(cb, isMc) {
    return () => {
      cb(isMc);
      this.props.onChange(this.props.ship.getDistributorSettingsObject());
    };
  }

  /**
   * Set up the rendering for pips
   * @returns {Object}      Object containing the rendering for the pips
   */
  _renderPips() {
    const pipsSvg = {
      Sys: [],
      Eng: [],
      Wep: [],
    };

    for (let k in this.props.pips) {
      let { base, mc } = this.props.pips[k];
      for (let i = 0; i < Math.floor(base); i++) {
        pipsSvg[k].push(<Pip key={i} className='full' />);
      }
      if (base > Math.floor(base)) {
        pipsSvg[k].push(<Pip className='half' key={'half'} />);
      }
      for (let i = 0; i < mc; i++) {
        pipsSvg[k].push(<Pip key={base + i} className='mc' />);
      }
      for (let i = Math.ceil(base + mc); i < 4; i++) {
        pipsSvg[k].push(<Pip className='empty' key={i} />);
      }
    }

    return pipsSvg;
  }

  /**
   * Render pips
   * @return {React.Component} contents
   */
  render() {
    const { ship } = this.props;
    const { translate } = this.context.language;

    const pipsSvg = this._renderPips();
    return (
      <span id='pips'>
        <table>
          <tbody>
            <tr>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td className='clickable' onClick={this._incEng}>{pipsSvg.Eng}</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td className='clickable' onClick={this._incSys}>{pipsSvg.Sys}</td>
              <td className='clickable' onClick={this._incEng}>
                {translate('ENG')}
              </td>
              <td className='clickable' onClick={this._incWep}>{pipsSvg.Wep}</td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td className='clickable' onClick={this._incSys}>
                {translate('SYS')}
              </td>
              <td className='clickable' onClick={this._reset}>
                {translate('RST')}
              </td>
              <td className='clickable' onClick={this._incWep}>
                {translate('WEP')}
              </td>
            </tr>
            <tr>
              <td>&nbsp;</td>
              <td className='clickable' onClick={this._change(ship.incSys, true)}>
                <Pip className='mc' />
              </td>
              <td className='clickable' onClick={this._change(ship.incEng, true)}>
                <Pip className='mc' />
              </td>
              <td className='clickable' onClick={this._change(ship.incWep, true)}>
                <Pip className='mc' />
              </td>
            </tr>
          </tbody>
        </table>
      </span>
    );
  }
}
