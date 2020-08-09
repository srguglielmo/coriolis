import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import TranslatedComponent from './TranslatedComponent';
import PowerBands from './PowerBands';
import { Power, NoPower } from './SvgIcons';
import autoBind from 'auto-bind';
import { Ship, Module } from 'ed-forge';

/**
 * Makes a comparison based on the order `false < undefined < true` (fut) and
 * maps it to `[-1, 0, 1]`.
 * @param {boolean} a Bool or undefined
 * @param {boolean} b Bool or undefined
 * @returns {number} Comparison
 */
function futComp(a, b) {
  switch (a) {
    case false: return (b === false ? 0 : 1);
    // The next else-expression maps false to -1 and true to 1
    case undefined: return (b === undefined ? 0 : 2 * Number(b) - 1);
    case true: return (b === true ? 0 : -1);
  }
}

/**
 * Get the enabled-icon.
 * @param {boolean} enabled Is the module enabled?
 * @returns {React.Component} Enabled icon.
 */
function getPowerIcon(enabled) {
  if (enabled === undefined) {
    return null;
  }
  if (enabled) {
    return <Power className='secondary-disabled' />;
  } else {
    return <NoPower className='icon warning' />;
  }
}

/**
 * Power Management Section
 */
export default class PowerManagement extends TranslatedComponent {
  static propTypes = {
    ship: PropTypes.instanceOf(Ship).isRequired,
    code: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @param  {Object} props   React Component properties
   */
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      predicate: 'pwr',
      desc: true,
      width: 0
    };
  }

  /**
   * Set the sort order
   * @param  {string} predicate Sort predicate
   */
  _sortOrder(predicate) {
    let desc = this.state.desc;

    if (predicate == this.state.predicate) {
      desc = !desc;
    } else {
      desc = true;
    }

    this.setState({ predicate, desc });
  }

  /**
   * Sorts the power list
   * @param  {Module[]} modules Modules to sort
   * @returns {Module[]} Sorted modules
   */
  _sortAndFilter(modules) {
    modules = modules.filter((m) => m.get('powerdraw') >= 0);
    let { translate } = this.context.language;
    const { predicate, desc } = this.state;
    let comp;
    switch (predicate) {
      case 'n': comp = (a, b) => translate(a.readMeta('type')).localeCompare(
        translate(b.readMeta('type'))
      ); break;
      // case 't': comp = comp((a, b) => a.type.localeCompare(b.type), desc); break;
      case 'pri': comp = (a, b) => a.getPowerPriority() - b.getPowerPriority(); break;
      case 'pwr': comp = (a, b) => a.get('powerdraw') - b.get('powerdraw'); break;
      case 'r': comp = (a, b) => futComp(a.isPowered().retracted, b.isPowered().retracted); break;
      case 'd': comp = (a, b) => futComp(a.isPowered().deployed, b.isPowered().deployed); break;
    }
    modules.sort(comp);
    if (desc) {
      modules.reverse();
    }
    return modules;
  }

  /**
   * Creates a callback that changes the power priority for the given module
   * based on the given delta.
   * @param {Module} m Module to set the priority for
   * @param {Number} delta Delta to set
   * @returns {Function} Callback
   */
  _prioCb(m, delta) {
    return () => {
      const prio = m.getPowerPriority();
      const newPrio = Math.max(0, prio + delta);
      if (0 <= newPrio) {
        m.setPowerPriority(newPrio);
      }
    };
  }

  /**
   * Generate/Render table rows
   * @param  {Ship} ship          Ship instance
   * @param  {Function} translate Translate function
   * @param  {Function} pwr       Localized Power formatter
   * @param  {Function} pct       Localized Percent formatter
   * @return {Array}              Array of React.Component table rows
   */
  _renderPowerRows(ship, translate, pwr, pct) {
    let powerRows = [];

    let modules = this._sortAndFilter(ship.getModules());
    for (let m of modules) {
      let retractedElem = null, deployedElem = null;
      const flipEnabled = () => m.setEnabled();
      if (m.isEnabled()) {
        let powered = m.isPowered();
        retractedElem = <td className='ptr upp' onClick={flipEnabled}>{getPowerIcon(powered.retracted)}</td>;
        deployedElem = <td className='ptr upp' onClick={flipEnabled}>{getPowerIcon(powered.deployed)}</td>;
      } else {
        retractedElem = <td className='ptr disabled upp' colSpan='2' onClick={flipEnabled}>{translate('disabled')}</td>;
      }

      const slot = m.getSlot();
      powerRows.push(<tr key={slot} className={cn('highlight', { disabled: !m.isEnabled() })}>
        <td className='ptr' style={{ width: '1em' }} onClick={flipEnabled}>{String(m.getClass()) + m.getRating()}</td>
        <td className='ptr le shorten cap' onClick={flipEnabled}>{translate(m.readMeta('type'))}</td>
        {/* <td className='ptr' onClick={flipEnabled}><u>{translate(slot.type)}</u></td> */}
        <td>
          <span className='flip ptr btn' onClick={this._prioCb(m, -1)}>&#9658;</span>
          {' ' + (m.getPowerPriority() + 1) + ' '}
          <span className='ptr btn' onClick={this._prioCb(m, 1)}>&#9658;</span>
        </td>
        <td className='ri ptr' style={{ width: '3.25em' }} onClick={flipEnabled}>{pwr(m.get('powerdraw'))}</td>
        <td className='ri ptr' style={{ width: '3em' }} onClick={flipEnabled}>
          <u>{pct(m.get('powerdraw') / ship.getPowerPlant().get('powercapacity'))}</u>
        </td>
        {retractedElem}
        {deployedElem}
      </tr>);
    }
    return powerRows;
  }

  /**
   * Update power bands width from DOM
   */
  _updateWidth() {
    this.setState({ width: this.node.offsetWidth });
  }

  /**
   * Add listeners when about to mount and sort power list
   */
  componentWillMount() {
    this.resizeListener = this.context.onWindowResize(this._updateWidth);
  }

  /**
   * Trigger DOM updates on mount
   */
  componentDidMount() {
    this._updateWidth();
  }

  /**
   * Remove listeners on unmount
   */
  componentWillUnmount() {
    this.resizeListener.remove();
  }

  /**
   * Render power management section
   * @return {React.Component} contents
   */
  render() {
    let { ship, code } = this.props;
    let { translate, formats } = this.context.language;
    let pp = ship.getPowerPlant();

    return (
      <div ref={node => this.node = node} className='group half' id='componentPriority'>
        <table style={{ width: '100%' }}>
          <thead>
            <tr className='main'>
              <th colSpan='2' className='sortable le' onClick={() => this._sortOrder('n')} >{translate('module')}</th>
              {/* <th style={{ width: '3em' }} className='sortable' onClick={() => this._sortOrder('t')} >{translate('type')}</th> */}
              <th style={{ width: '4em' }} className='sortable' onClick={() => this._sortOrder('pri')} >{translate('pri')}</th>
              <th colSpan='2' className='sortable' onClick={() => this._sortOrder('pwr')} >{translate('PWR')}</th>
              <th style={{ width: '3em' }} className='sortable' onClick={() => this._sortOrder('r')} >{translate('ret')}</th>
              <th style={{ width: '3em' }} className='sortable' onClick={() => this._sortOrder('d')} >{translate('dep')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{String(pp.getClass()) + pp.getRating()}</td>
              <td className='le shorten cap' >{translate('pp')}</td>
              <td>1</td>
              <td className='ri'>{formats.f2(pp.get('powercapacity'))}</td>
              <td className='ri'><u>100%</u></td>
              <td></td>
              <td></td>
            </tr>
            <tr><td style={{ lineHeight:0 }} colSpan='8'>
              <hr style={{ margin: '0 0 3px', background: '#ff8c0d', border: 0, height: 1 }} />
            </td></tr>
            {this._renderPowerRows(ship, translate, formats.f2, formats.pct1)}
          </tbody>
        </table>
        <PowerBands width={this.state.width} ship={ship} code={code} />
      </div>
    );
  }
}
