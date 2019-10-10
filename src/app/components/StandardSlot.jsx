import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Persist from '../stores/Persist';
import TranslatedComponent from './TranslatedComponent';
import { diffDetails } from '../utils/SlotFunctions';
import AvailableModulesMenu from './AvailableModulesMenu';
import ModificationsMenu from './ModificationsMenu';
import { ListModifications, Modified } from './SvgIcons';
import { Modifications } from 'coriolis-data/dist';
import { stopCtxPropagation } from '../utils/UtilityFunctions';
import { blueprintTooltip } from '../utils/BlueprintFunctions';
import { Ship, Module } from 'ed-forge';

/**
 * Standard Slot
 */
export default class StandardSlot extends TranslatedComponent {
  static propTypes = {
    slot: PropTypes.instanceOf(Module),
    onSelect: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    ship: PropTypes.instanceOf(Ship),
    selected: PropTypes.bool,
    warning: PropTypes.func,
  };

  /**
   * Construct the slot
   * @param {object} props Object properties
   */
  constructor(props) {
    super(props);
    this._modificationsSelected = false;
    this._keyDown = this._keyDown.bind(this);
    this.modButton = null;
    this.slotDiv = null;
  }
  /**
   * Handle Enter key
   * @param {SyntheticEvent} event KeyDown event
   */
  _keyDown(event) {
    if (event.key == 'Enter') {
      if(event.target.className == 'r') {
        this._toggleModifications();
      }
      this.props.onOpen(event);
    }
  }

  /**
   * Render the slot
   * @return {React.Component} Slot component
   */
  render() {
    let { termtip, tooltip } = this.context;
    let { translate, formats, units } = this.context.language;
    let { slot, selected, warning, onSelect, onChange, ship } = this.props;
    let classRating = String(slot.getClass()) + (slot.getRating() || '');
    let menu;
    let validMods = slot.getApplicableBlueprints();
    let showModuleResistances = Persist.showModuleResistances();
    let mass = slot.get('cargo') || slot.get('fuel') || slot.get('mass') || 0;

    // Modifications tooltip shows blueprint and grade, if available
    let modTT = translate('modified');
    const appliedBlueprint = slot.getBlueprint();
    const appliedExperimental = slot.getExperimental();
    if (appliedBlueprint) {
      modTT = translate(appliedBlueprint) + ' ' + translate('grade') + ' ' + slot.getBlueprintGrade();
      if (appliedExperimental) {
        modTT += ', ' + translate(appliedExperimental);
      }
      modTT = (
        <div>
          <div>{modTT}</div>
          {blueprintTooltip(translate, slot)}
        </div>
      );
    }

    if (!selected) {
      // If not selected then sure that modifications flag is unset
      this._modificationsSelected = false;
    }

    if (selected) {
      if (this._modificationsSelected) {
        menu = <ModificationsMenu
          className="standard"
          onChange={onChange}
          ship={ship}
          m={slot}
          modButton={this.modButton}
        />;
      } else {
        menu = <AvailableModulesMenu
          className='standard'
          m={slot}
          ship={ship}
          onSelect={onSelect}
          warning={warning}
          diffDetails={diffDetails.bind(ship, this.context.language)}
          slotDiv = {this.slotDiv}
        />;
      }
    }

    return (
      <div className={cn('slot', { selected: this.props.selected })} onClick={this.props.onOpen} onKeyDown={this._keyDown} onContextMenu={stopCtxPropagation} tabIndex="0" ref={ slotDiv => this.slotDiv = slotDiv }>
        <div className={cn('details-container', { warning: warning && warning(slot), disabled: slot.isEnabled() })}>
          <div className={'sz'}>{slot.getSize()}</div>
          <div>
            <div className={'l'}>{classRating} {translate(slot.getItem())}{appliedBlueprint ? <span className='r' onMouseOver={termtip.bind(null, modTT)} onMouseOut={tooltip.bind(null, null)}><Modified /></span> : null }</div>
            <div className={'r'}>{formats.round(mass)}{units.T}</div>
            <div/>
            <div className={'cb'}>
              {/* { m.getMinMass() ? <div className='l'>{translate('minimum mass')}: {formats.int(m.getMinMass())}{units.T}</div> : null }
              { m.getOptMass() ? <div className='l'>{translate('optimal mass')}: {formats.int(m.getOptMass())}{units.T}</div> : null }
              { m.getMaxMass() ? <div className='l'>{translate('max mass')}: {formats.int(m.getMaxMass())}{units.T}</div> : null }
              { m.getOptMul() ? <div className='l'>{translate('optimal multiplier')}: {formats.rPct(m.getOptMul())}</div> : null }
              { m.getRange() ? <div className='l'>{translate('range', m.grp)}: {formats.f2(m.getRange())}{units.km}</div> : null }
              { m.time ? <div className='l'>{translate('time')}: {formats.time(m.time)}</div> : null }
              { m.getThermalEfficiency() ? <div className='l'>{translate('efficiency')}: {formats.f2(m.getThermalEfficiency())}</div> : null }
              { m.getPowerGeneration() > 0 ? <div className='l'>{translate('pgen')}: {formats.f1(m.getPowerGeneration())}{units.MW}</div> : null }
              { m.getMaxFuelPerJump() ? <div className='l'>{translate('max')} {translate('fuel')}: {formats.f1(m.getMaxFuelPerJump())}{units.T}</div> : null }
              { m.getWeaponsCapacity() ? <div className='l'>{translate('WEP')}: {formats.f1(m.getWeaponsCapacity())}{units.MJ} / {formats.f1(m.getWeaponsRechargeRate())}{units.MW}</div> : null }
              { m.getSystemsCapacity() ? <div className='l'>{translate('SYS')}: {formats.f1(m.getSystemsCapacity())}{units.MJ} / {formats.f1(m.getSystemsRechargeRate())}{units.MW}</div> : null }
              { m.getEnginesCapacity() ? <div className='l'>{translate('ENG')}: {formats.f1(m.getEnginesCapacity())}{units.MJ} / {formats.f1(m.getEnginesRechargeRate())}{units.MW}</div> : null }
              { showModuleResistances && m.getExplosiveResistance() ? <div className='l'>{translate('explres')}: {formats.pct(m.getExplosiveResistance())}</div> : null }
              { showModuleResistances && m.getKineticResistance() ? <div className='l'>{translate('kinres')}: {formats.pct(m.getKineticResistance())}</div> : null }
              { showModuleResistances && m.getThermalResistance() ? <div className='l'>{translate('thermres')}: {formats.pct(m.getThermalResistance())}</div> : null }
              { m.getIntegrity() ? <div className='l'>{translate('integrity')}: {formats.int(m.getIntegrity())}</div> : null } */}
              {/* { validMods.length > 0 ? <div className='r' tabIndex="0" ref={ modButton => this.modButton = modButton }><button  tabIndex="-1" onClick={this._toggleModifications.bind(this)} onContextMenu={stopCtxPropagation} onMouseOver={termtip.bind(null, 'modifications')} onMouseOut={tooltip.bind(null, null)}><ListModifications /></button></div> : null } */}
            </div>
          </div>
        </div>
        {menu}
      </div>
    );
  }

  /**
   * Toggle the modifications flag when selecting the modifications icon
   */
  _toggleModifications() {
    this._modificationsSelected = !this._modificationsSelected;
  }
}
