import React from 'react';
import Persist from '../stores/Persist';
import PropTypes from 'prop-types';
import TranslatedComponent from './TranslatedComponent';
import cn from 'classnames';
import { ListModifications, Modified } from './SvgIcons';
import AvailableModulesMenu from './AvailableModulesMenu';
import ModificationsMenu from './ModificationsMenu';
import { diffDetails } from '../utils/SlotFunctions';
import { stopCtxPropagation, wrapCtxMenu } from '../utils/UtilityFunctions';
import { blueprintTooltip } from '../utils/BlueprintFunctions';
import { Ship, Module } from 'ed-forge';
import { REG_MILITARY_SLOT, REG_HARDPOINT_SLOT } from 'ed-forge/lib/data/slots';

const HARDPOINT_SLOT_LABELS = {
  1: 'S',
  2: 'M',
  3: 'L',
  4: 'H',
};

/**
 * Abstract Slot
 */
export default class Slot extends TranslatedComponent {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    onOpen: PropTypes.func.isRequired,
    selected: PropTypes.bool,
    slot: PropTypes.instanceOf(Module),
    ship: PropTypes.instanceOf(Ship),
    warning: PropTypes.func,
    drag: PropTypes.func,
    drop: PropTypes.func,
    dropClass: PropTypes.string
  };

  /**
   * Constructor
   * @param  {Object} props   React Component properties
   */
  constructor(props) {
    super(props);

    this._modificationsSelected = false;

    this._contextMenu = wrapCtxMenu(this._contextMenu.bind(this));
    this._getMaxClassLabel = this._getMaxClassLabel.bind(this);
  }

  /**
   * Generate the slot contents
   * @param  {Object} m             Mounted Module
   * @param  {Function} translate   Translate function
   * @param  {Object} formats       Localized Formats map
   * @param  {Object} u             Localized Units Map
   * @return {React.Component}      Slot contents
   */
  _getSlotDetails(m, translate, formats, u) {
    if (m) {
      let classRating = String(m.getSize()) + m.getRating();
      let { drag, drop, ship } = this.props;
      let { termtip, tooltip } = this.context;
      let showModuleResistances = Persist.showModuleResistances();

      // Modifications tooltip shows blueprint and grade, if available
      // let modTT = translate('modified');
      // const blueprint = m.getBlueprint();
      // const experimental = m.getExperimental();
      // const grade = m.getGrade();
      // if (blueprint) {
      //   modTT = translate(blueprint) + ' ' + translate('grade') + ' ' + grade;
      //   if (experimental) {
      //     modTT += ', ' + translate(experimental);
      //   }
      //   modTT = (
      //     <div>
      //       <div>{modTT}</div>
      //       {blueprintTooltip(translate, m.blueprint.grades[m.blueprint.grade], m)}
      //     </div>
      //   );
      // }

      let mass = m.get('mass') || m.get('cargo') || m.get('fuel') || 0;
      const enabled = m.isEnabled();

      const className = cn('details', enabled ? '' : 'disabled');
      return (
        <div
          className={className}
          draggable="true"
          onDragStart={drag}
          onDragEnd={drop}
        >
          <div className={'cb'}>
            <div className={'l'}>
              {classRating} {translate(m.readMeta('type'))}
              {m.mods && Object.keys(m.mods).length > 0 ? (
                <span
                  onMouseOver={termtip.bind(null, modTT)}
                  onMouseOut={tooltip.bind(null, null)}
                >
                  <Modified />
                </span>
              ) : (
                ''
              )}
            </div>
            <div className={'r'}>
              {formats.round(mass)}
              {u.T}
            </div>
          </div>
          <div className={'cb'}>
            {/* { m.getOptMass() ? <div className={'l'}>{translate('optmass', 'sg')}: {formats.int(m.getOptMass())}{u.T}</div> : null }
          { m.getMaxMass() ? <div className={'l'}>{translate('maxmass', 'sg')}: {formats.int(m.getMaxMass())}{u.T}</div> : null }
          { m.bins ? <div className={'l'}>{m.bins} <u>{translate('bins')}</u></div> : null }
          { m.bays ? <div className={'l'}>{translate('bays')}: {m.bays}</div> : null }
          { m.rebuildsperbay ? <div className={'l'}>{translate('rebuildsperbay')}: {m.rebuildsperbay}</div> : null }
          { m.rate ? <div className={'l'}>{translate('rate')}: {m.rate}{u.kgs}&nbsp;&nbsp;&nbsp;{translate('refuel time')}: {formats.time(this.props.fuel * 1000 / m.rate)}</div> : null }
          { m.getAmmo() && m.grp !== 'scb' ? <div className={'l'}>{translate('ammunition')}: {formats.gen(m.getAmmo())}</div> : null }
          { m.getSpinup() ? <div className={'l'}>{translate('spinup')}: {formats.f1(m.getSpinup())}{u.s}</div> : null }
          { m.getDuration() ? <div className={'l'}>{translate('duration')}: {formats.f1(m.getDuration())}{u.s}</div> : null }
          { m.grp === 'scb' ? <div className={'l'}>{translate('cells')}: {formats.int(m.getAmmo() + 1)}</div> : null }
          { m.grp === 'gsrp' ? <div className={'l'}>{translate('shield addition')}: {formats.f1(m.getShieldAddition())}{u.MJ}</div> : null }
          { m.grp === 'gfsb' ? <div className={'l'}>{translate('jump addition')}: {formats.f1(m.getJumpBoost())}{u.LY}</div> : null }
          { m.grp === 'gs' ? <div className={'l'}>{translate('shield addition')}: {formats.f1(m.getShieldAddition())}{u.MJ}</div> : null }
          { m.getShieldReinforcement() ? <div className={'l'}>{translate('shieldreinforcement')}: {formats.f1(m.getDuration() * m.getShieldReinforcement())}{u.MJ}</div> : null }
          { m.getShieldReinforcement() ? <div className={'l'}>{translate('total')}: {formats.int((m.getAmmo() + 1) * (m.getDuration() * m.getShieldReinforcement()))}{u.MJ}</div> : null }
          { m.repair ? <div className={'l'}>{translate('repair')}: {m.repair}</div> : null }
          { m.getFacingLimit() ? <div className={'l'}>{translate('facinglimit')} {formats.f1(m.getFacingLimit())}°</div> : null }
          { m.getRange() ? <div className={'l'}>{translate('range')} {formats.f2(m.getRange())}{u.km}</div> : null }
          { m.getRangeT() ? <div className={'l'}>{translate('ranget')} {formats.f1(m.getRangeT())}{u.s}</div> : null }
          { m.getTime() ? <div className={'l'}>{translate('time')}: {formats.time(m.getTime())}</div> : null }
          { m.getHackTime() ? <div className={'l'}>{translate('hacktime')}: {formats.time(m.getHackTime())}</div> : null }
          { m.maximum ? <div className={'l'}>{translate('max')}: {(m.maximum)}</div> : null }
          { m.rangeLS ? <div className={'l'}>{translate('range')}: {m.rangeLS}{u.Ls}</div> : null }
          { m.rangeLS === null ? <div className={'l'}>∞{u.Ls}</div> : null }
          { m.rangeRating ? <div className={'l'}>{translate('range')}: {m.rangeRating}</div> : null }
          { m.passengers ? <div className={'l'}>{translate('passengers')}: {m.passengers}</div> : null }
          { m.getRegenerationRate() ? <div className='l'>{translate('regen')}: {formats.round1(m.getRegenerationRate())}{u.ps}</div> : null }
          { m.getBrokenRegenerationRate() ? <div className='l'>{translate('brokenregen')}: {formats.round1(m.getBrokenRegenerationRate())}{u.ps}</div> : null }
          { showModuleResistances && m.getExplosiveResistance() ? <div className='l'>{translate('explres')}: {formats.pct(m.getExplosiveResistance())}</div> : null }
          { showModuleResistances && m.getKineticResistance() ? <div className='l'>{translate('kinres')}: {formats.pct(m.getKineticResistance())}</div> : null }
          { showModuleResistances && m.getThermalResistance() ? <div className='l'>{translate('thermres')}: {formats.pct(m.getThermalResistance())}</div> : null }
          { showModuleResistances && m.getCausticResistance() ? <div className='l'>{translate('causres')}: {formats.pct(m.getCausticResistance())}</div> : null }
          { m.getHullReinforcement() ? <div className='l'>{translate('armour')}: {formats.int(m.getHullReinforcement() + ship.baseArmour * m.getModValue('hullboost') / 10000)}</div> : null }
          { m.getProtection() ? <div className='l'>{translate('protection')}: {formats.rPct(m.getProtection())}</div> : null }
          { m.getIntegrity() ? <div className='l'>{translate('integrity')}: {formats.int(m.getIntegrity())}</div> : null } */}
            {(m.getApplicableBlueprints() || []).length > 0 ? (
              <div className="r"
                ref={(modButton) => (this.modButton = modButton)}
              >
                <button onClick={this._toggleModifications.bind(this)}
                  onContextMenu={stopCtxPropagation}
                  onMouseOver={termtip.bind(null, 'modifications')}
                  onMouseOut={tooltip.bind(null, null)}
                >
                  <ListModifications />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      );
    } else {
      return <div className={'empty'}>{translate('empty')}</div>;
    }
  }

  /**
   * Get the CSS class name for the slot. Can/should be overriden
   * as necessary.
   * @return {string} CSS Class name
   */
  _getClassNames() {
    return null;
  }

  /**
   * Get the label for the slot size/class
   * Should be overriden if necessary
   * @return {string} label
   */
  _getMaxClassLabel() {
    const { slot } = this.props;
    let size = slot.getSize();
    switch (true) {
      case slot.getSlot() === 'armour':
        return '';
      case size === 0:
        // This can also happen for armour but that case was handled above
        return 'U';
      case Boolean(slot.getSlot().match(REG_HARDPOINT_SLOT)):
        return HARDPOINT_SLOT_LABELS[size];
      default:
        return size;
    }
  }

  /**
   * Empty slot on right-click
   * @param  {SyntheticEvent} event Event
   */
  _contextMenu(event) {
    event.stopPropagation();
    event.preventDefault();
    this.props.onSelect(null,null);
  }

  /**
   * Render the slot
   * @return {React.Component} The slot
   */
  render() {
    let language = this.context.language;
    let translate = language.translate;
    let { ship, slot, dropClass, dragOver, onOpen, onChange, selected, onSelect, warning } = this.props;
    let slotDetails, modificationsMarker, menu;

    if (!selected) {
      // If not selected then sure that modifications flag is unset
      this._modificationsSelected = false;
    }

    if (!slot.isEmpty()) {
      slotDetails = this._getSlotDetails(slot, translate, language.formats, language.units);  // Must be implemented by sub classes
    } else {
      slotDetails = <div className={'empty'}>
        {translate(
          slot.getSlot().match(REG_MILITARY_SLOT) ? 'emptyrestricted' : 'empty'
        )}
      </div>;
    }

    if (selected) {
      if (this._modificationsSelected) {
        menu = <ModificationsMenu
          className={this._getClassNames()}
          onChange={onChange}
          ship={ship}
          m={slot}
          modButton = {this.modButton}
        />;
      } else {
        menu = <AvailableModulesMenu
          className={this._getClassNames()}
          m={slot}
          ship={ship}
          onSelect={onSelect}
          warning={warning}
          diffDetails={diffDetails.bind(ship, this.context.language)}
        />;
      }
    }

    // TODO: implement touch dragging

    return (
      <div className={cn('slot', dropClass, { selected })} onClick={onOpen}
        onContextMenu={this._contextMenu}
        onDragOver={dragOver} tabIndex="0"
      >
        <div className='details-container'>
          <div className='sz'>{this._getMaxClassLabel(translate)}</div>
          {slotDetails}
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
