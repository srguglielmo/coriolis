import React from 'react';
import PropTypes from 'prop-types';
import TranslatedComponent from './TranslatedComponent';
import { Rocket } from './SvgIcons';
import Persist from '../stores/Persist';
import cn from 'classnames';
import { Factory, Ship } from 'ed-forge';
import autoBind from 'auto-bind';

/**
 * Ship picker
 * Requires an onChange() function of the form onChange(ship), providing the ship, which is triggered on ship change
 */
export default class ShipPicker extends TranslatedComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    ship: PropTypes.instanceOf(Ship).isRequired,
    opponent: PropTypes.instanceOf(Ship).isRequired,
    opponentId: PropTypes.string
  };

  /**
   * constructor
   * @param {object} props  Properties react
   * @param {object} context   react context
   */
  constructor(props, context) {
    super(props);
    autoBind(this);
    this.state = { menuOpen: false };
  }

  /**
   * Update ship
   * @param {object} type  the ship
   * @param {string} id   the build, if present
   */
  _shipChange(type, id) {
    const { opponent, opponentId, onChange } = this.props;
    this.setState({ menuOpen: false });

    if (type instanceof Ship) {
      if (type !== opponent) {
        onChange(type, id);
      }
    // Ensure that the ship has changed
    } else if (type !== opponent.getShipType() || id !== opponentId) {
      onChange(
        id ? new Ship(Persist.getBuild(type, id)) : Factory.newShip(type),
        id,
      );
    }
  }

  /**
   * Render the menu for the picker
   * @returns {object}    the picker menu
   */
  _renderPickerMenu() {
    const { translate } = this.context.language;
    const { ship, opponent, opponentId } = this.props;
    const opponentType = opponent.getShipType();
    const _shipChange = this._shipChange;
    const builds = Persist.getBuilds();
    return Factory.getAllShipTypes().sort().map((type) => {
      const shipBuilds = [
        // Add stock build
        <li key={type} className={cn({ selected: opponentType === type && !opponentId && ship !== opponent })}
          onClick={_shipChange.bind(this, type, '')}>{translate('stock')}</li>
      ].concat(
        // Add stored builds
        Persist.getBuildsNamesFor(type).sort().map((id) => (
          <li key={type + '-' + id}
            className={ cn({ selected: opponentType === type && opponentId === id })}
            onClick={_shipChange.bind(this, type, id)}>{id}</li>))
      );

      if (ship.getShipType() === type) {
        shipBuilds.unshift(
          <li key='self' className={cn({ selected: ship === opponent })}
            onClick={_shipChange.bind(this, ship, '')}>{translate('THIS_SHIP')}</li>
        );
      }

      return <ul key={type} className='block'>{translate(type)}{shipBuilds}</ul>;
    });
  }

  /**
   * Toggle the menu state
   */
  _toggleMenu() {
    const { menuOpen } = this.state;
    this.setState({ menuOpen: !menuOpen });
  }

  /**
   * Render picker
   * @return {React.Component} contents
   */
  render() {
    const { translate } = this.context.language;
    const { opponent, opponentId, ship } = this.props;
    const { menuOpen } = this.state;

    let label;
    if (ship === opponent) {
      label = translate('THIS_SHIP');
    } else if (opponentId) {
      label = opponentId;
    } else {
      label = translate('stock');
    }

    return (
      <div className='shippicker' onClick={ (e) => e.stopPropagation() }>
        <div className='menu'>
          <div className={cn('menu-header', { selected: menuOpen })} onClick={this._toggleMenu}>
            <span><Rocket className='warning' /></span>
            <span className='menu-item-label'>
              {`${opponent.getShipType()}: ${label}`}
            </span>
          </div>
          { menuOpen ?
            <div className='menu-list' onClick={ (e) => e.stopPropagation() }>
              <div className='quad'>
                {this._renderPickerMenu()}
              </div>
            </div> : null }
        </div>
      </div>
    );
  }
}
