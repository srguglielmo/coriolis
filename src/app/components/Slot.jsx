import React from 'react';
import PropTypes from 'prop-types';
import TranslatedComponent from './TranslatedComponent';
import cn from 'classnames';
import AvailableModulesMenu from './AvailableModulesMenu';
import ModificationsMenu from './ModificationsMenu';
import { diffDetails } from '../utils/SlotFunctions';
import { wrapCtxMenu } from '../utils/UtilityFunctions';
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
    this._keyDown = this._keyDown.bind(this);
    this.slotDiv = null;
  }

  // Must be implemented by subclasses:
  // _getSlotDetails()

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

  /** Key Down handler
   *  @param {SyntheticEvent} event Event
   *  ToDo: see if this can be moved up
   *  we do more or less the same thing
   *  in every section when Enter key is pressed
   *  on a focusable item
   *
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
          slotDiv = {this.slotDiv}
        />;
      }
    }

    // TODO: implement touch dragging

    return (
      <div className={cn('slot', dropClass, { selected })} onClick={onOpen}
        onKeyDown={this._keyDown} onContextMenu={this._contextMenu}
        onDragOver={dragOver} tabIndex="0"
        ref={slotDiv => this.slotDiv = slotDiv}>
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
