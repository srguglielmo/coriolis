import React from 'react';
import cn from 'classnames';
import SlotSection from './SlotSection';
import StandardSlot from './StandardSlot';
import Module from '../shipyard/Module';
import * as ShipRoles from '../shipyard/ShipRoles';
import { stopCtxPropagation } from '../utils/UtilityFunctions';
import { ShipProps } from 'ed-forge';

/**
 * Standard Slot section
 */
export default class StandardSlotSection extends SlotSection {
  /**
   * Constructor
   * @param  {Object} props   React Component properties
   * @param  {Object} context React Component context
   */
  constructor(props, context) {
    super(props, context, 'standard', 'core internal');
    this._optimizeStandard = this._optimizeStandard.bind(this);
    this._selectBulkhead = this._selectBulkhead.bind(this);
    this.selectedRefId = null;
    this.firstRefId = 'maxjump';
    this.lastRefId = 'racer';
  }
  /**
   * Handle focus if the component updates
   * @param {Object} prevProps React Component properties
   */
  componentDidUpdate(prevProps) {
    this._handleSectionFocus(prevProps,this.firstRefId, this.lastRefId);
  }

  /**
   * Use the lightest/optimal available standard modules
   */
  _optimizeStandard() {
    this.selectedRefId = 'maxjump';
    this.props.ship.useLightestStandard();
    this.props.onChange();
    this._close();
  }

  /**
   * Fill all standard slots with the specificed rating (using max class)
   * @param  {Boolean} shielded True if shield generator should be included
   * @param {integer} bulkheadIndex Bulkhead to use see Constants.BulkheadNames
   */
  _multiPurpose(shielded, bulkheadIndex) {
    this.selectedRefId = 'multipurpose';
    if (bulkheadIndex === 2) this.selectedRefId = 'combat';
    ShipRoles.multiPurpose(this.props.ship, shielded, bulkheadIndex);
    this.props.onChange();
    this._close();
  }

  /**
   * Trader Build
   * @param  {Boolean} shielded True if shield generator should be included
   */
  _optimizeCargo(shielded) {
    this.selectedRefId = 'trader';
    ShipRoles.trader(this.props.ship, shielded);
    this.props.onChange();
    this._close();
  }

  /**
   * Miner Build
   * @param  {Boolean} shielded True if shield generator should be included
   */
  _optimizeMiner(shielded) {
    this.selectedRefId = 'miner';
    ShipRoles.miner(this.props.ship, shielded);
    this.props.onChange();
    this._close();
  }

  /**
   * Explorer role
   * @param  {Boolean} planetary True if Planetary Vehicle Hangar (PVH) should be included
   */
  _optimizeExplorer(planetary) {
    this.selectedRefId = 'explorer';
    if (planetary) this.selectedRefId = 'planetary';
    ShipRoles.explorer(this.props.ship, planetary);
    this.props.onChange();
    this._close();
  }

  /**
   * Racer role
   */
  _optimizeRacer() {
    this.selectedRefId = 'racer';
    ShipRoles.racer(this.props.ship);
    this.props.onChange();
    this._close();
  }

  /**
   * Use the specified bulkhead
   * @param  {Object} bulkhead Bulkhead module details
   */
  _selectBulkhead(bulkhead) {
    this.props.ship.useBulkhead(bulkhead.index);
    this.context.tooltip();
    this.props.onChange();
    this._close();
  }

  /**
   * On right click optimize the standard modules
   */
  _contextMenu() {
    this._optimizeStandard();
  }

  /**
   * Generate the slot React Components
   * @return {Array} Array of Slots
   */
  _getSlots() {
    let { ship, currentMenu } = this.props;
    let slots = new Array(8);
    let open = this._openMenu;
    let select = this._selectModule;
    // let st = ship.standard;
    // let avail = ship.getAvailableModules().standard;
    // let bh = ship.bulkheads;

    let armour = ship.getAlloys();
    slots[0] = <StandardSlot
      key='bh'
      slot={armour}
      modules={armour.getApplicableItems()}
      onOpen={open.bind(this, armour)}
      onSelect={this._selectBulkhead}
      selected={currentMenu == armour}
      onChange={this.props.onChange}
      ship={ship}
    />;

    const powerPlant = ship.getPowerPlant();
    slots[1] = <StandardSlot
      key='pp'
      slot={powerPlant}
      modules={powerPlant.getApplicableItems()}
      onOpen={open.bind(this, powerPlant)}
      onSelect={select.bind(this, powerPlant)}
      selected={currentMenu == powerPlant}
      onChange={this.props.onChange}
      ship={ship}
      warning={m => ship.get(ShipProps.CONSUMED_RETR) < m.get('powercapacity')}
    />;

    const thrusters = ship.getThrusters();
    slots[2] = <StandardSlot
      key='th'
      slot={thrusters}
      modules={thrusters.getApplicableItems()}
      onOpen={open.bind(this, thrusters)}
      onSelect={select.bind(this, thrusters)}
      selected={currentMenu == thrusters}
      onChange={this.props.onChange}
      ship={ship}
      warning={m => m.get('enginemaximalmass') < ship.get(ShipProps.LADEN_MASS)}
    />;


    const fsd = ship.getFSD();
    slots[3] = <StandardSlot
      key='fsd'
      slot={fsd}
      modules={fsd.getApplicableItems()}
      onOpen={open.bind(this, fsd)}
      onSelect={select.bind(this, fsd)}
      onChange={this.props.onChange}
      ship={ship}
      selected={currentMenu == fsd}
    />;

    const lifeSupport = ship.getLifeSupport();
    slots[4] = <StandardSlot
      key='ls'
      slot={lifeSupport}
      modules={lifeSupport.getApplicableItems()}
      onOpen={open.bind(this, lifeSupport)}
      onSelect={select.bind(this, lifeSupport)}
      onChange={this.props.onChange}
      ship={ship}
      selected={currentMenu == lifeSupport}
    />;

    const powerDistributor = ship.getPowerDistributor();
    slots[5] = <StandardSlot
      key='pd'
      slot={powerDistributor}
      modules={powerDistributor.getApplicableItems()}
      onOpen={open.bind(this, powerDistributor)}
      onSelect={select.bind(this, powerDistributor)}
      selected={currentMenu == powerDistributor}
      onChange={this.props.onChange}
      ship={ship}
      warning={m => m instanceof Module ? m.getEnginesCapacity() <= ship.boostEnergy : m.engcap <= ship.boostEnergy}
    />;

    const sensors = ship.getSensors();
    slots[6] = <StandardSlot
      key='ss'
      slot={sensors}
      modules={sensors.getApplicableItems()}
      onOpen={open.bind(this, sensors)}
      onSelect={select.bind(this, sensors)}
      selected={currentMenu == sensors}
      onChange={this.props.onChange}
      ship={ship}
    />;

    const fuelTank = ship.getCoreFuelTank();
    slots[7] = <StandardSlot
      key='ft'
      slot={fuelTank}
      modules={fuelTank.getApplicableItems()}
      onOpen={open.bind(this, fuelTank)}
      onSelect={select.bind(this, fuelTank)}
      selected={currentMenu == fuelTank}
      onChange={this.props.onChange}
      ship={ship}
      // Show warning when fuel tank is smaller than FSD Max Fuel
      warning= {m => m.get('fuel') < fsd.get('maxfuel')}
    />;

    return slots;
  }

  /**
   * Generate the section drop-down menu
   * @param  {Function} translate Translate function
   * @return {React.Component}    Section menu
   */
  _getSectionMenu(translate) {
    let planetaryDisabled = this.props.ship.internal.length < 4;
    return <div className='select' onClick={(e) => e.stopPropagation()} onContextMenu={stopCtxPropagation}>
      <ul>
        <li className='lc' tabIndex="0" onClick={this._optimizeStandard} onKeyDown={this._keyDown} ref={smRef => this.sectionRefArr['maxjump'] = smRef}>{translate('Maximize Jump Range')}</li>
      </ul>
      <div className='select-group cap'>{translate('roles')}</div>
      <ul>
        <li className='lc' tabIndex="0" onClick={this._multiPurpose.bind(this, false, 0)} onKeyDown={this._keyDown} ref={smRef => this.sectionRefArr['multipurpose'] = smRef}>{translate('Multi-purpose')}</li>
        <li className='lc' tabIndex="0" onClick={this._multiPurpose.bind(this, true, 2)} onKeyDown={this._keyDown} ref={smRef => this.sectionRefArr['combat'] = smRef}>{translate('Combat')}</li>
        <li className='lc' tabIndex="0" onClick={this._optimizeCargo.bind(this, true)} onKeyDown={this._keyDown} ref={smRef => this.sectionRefArr['trader'] = smRef}>{translate('Trader')}</li>
        <li className='lc' tabIndex="0" onClick={this._optimizeExplorer.bind(this, false)} onKeyDown={this._keyDown} ref={smRef => this.sectionRefArr['explorer'] = smRef}>{translate('Explorer')}</li>
        <li className={cn('lc', { disabled:  planetaryDisabled })} tabIndex={planetaryDisabled ? '' : '0'} onClick={!planetaryDisabled && this._optimizeExplorer.bind(this, true)} onKeyDown={this._keyDown} ref={smRef => this.sectionRefArr['planetary'] = smRef}>{translate('Planetary Explorer')}</li>
        <li className='lc' tabIndex="0" onClick={this._optimizeMiner.bind(this, true)} onKeyDown={this._keyDown} ref={smRef => this.sectionRefArr['miner'] = smRef}>{translate('Miner')}</li>
        <li className='lc' tabIndex="0" onClick={this._optimizeRacer.bind(this)} onKeyDown={this._keyDown} ref={smRef => this.sectionRefArr['racer'] = smRef}>{translate('Racer')}</li>
      </ul>
    </div>;
  }
}
