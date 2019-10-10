import React from 'react';
import PropTypes from 'prop-types';
import TranslatedComponent from './TranslatedComponent';
import cn from 'classnames';
import NumberEditor from 'react-number-editor';
import { Module } from 'ed-forge';

/**
 * Modification
 */
export default class Modification extends TranslatedComponent {
  static propTypes = {
    m: PropTypes.instanceOf(Module).isRequired,
    property: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    highlight: PropTypes.bool,
  };

  /**
   * Constructor
   * @param  {Object} props   React Component properties
   * @param  {Object} context React Component context
   */
  constructor(props, context) {
    super(props);
    const { m, property } = props;
    const originalValue = m.get(property);
    this.state = { originalValue, value: String(originalValue) };
  }

  /**
   * Notify listeners that a new value has been entered and commited.
   */
  _updateFinished() {
    const { m, property } = this.props;
    const { value, originalValue } = this.state;
    const numValue = Number(value);
    if (!isNaN(numValue) && originalValue !== numValue) {
      m.set(property, numValue);
      this.props.onChange();
      this.setState({ originalValue: numValue });
    }
  }

  /**
   * Render the modification
   * @return {React.Component} modification
   */
  render() {
    const { translate, formats } = this.context.language;
    const { m, property, highlight } = this.props;
    const { originalValue, value } = this.state;

    // Some features only apply to specific modules; these features will be
    // undefined on items that do not belong to the same class. Filter these
    // features here
    if (originalValue === undefined) {
      return null;
    }

    return (
      <div onBlur={this._updateFinished.bind(this)} key={property}
        className="cb modification-container"
      >
        <span className="cb">{translate(property)}</span>
        <span className="header-adjuster"></span>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td className="input-container">
                <span>
                  <NumberEditor value={value} stepModifier={1}
                    decimals={2} step={0.01} style={{ textAlign: 'right' }}
                    className={cn(
                      'cb',
                      { 'greyed-out': !highlight },
                    )}
                    onKeyDown={(event) => {
                      if (event.key == 'Enter') {
                        this._updateFinished();
                        event.stopPropagation();
                      }
                    }}
                    onValueChange={(value) => {
                      if (value.length <= 15) {
                        this.setState({ value });
                      }
                    }} />
                  {/* TODO: support unit */}
                  <span className="unit-container">{/* unit */}</span>
                </span>
              </td>
              <td style={{ textAlign: 'center' }}
                className={cn({
                  // TODO:
                  // secondary: isBeneficial,
                  // Is beneficial might be undefined; in this case we have a 0%
                  // modifier. Check this here.
                  // warning: isBeneficial === false,
                })}
              // TODO: support absolute modifiers
              >{formats.pct(m.getModifier(property))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
