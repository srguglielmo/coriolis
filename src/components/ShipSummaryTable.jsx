import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {Ship, Module, Factory} from 'ed-forge'

class ShipSummaryTable extends Component {

  /**
   * The ShipSummaryTable constructor
   * @param {Object} props The props
   */
  constructor(props) {
    super(props);
    this.state = {
      shieldColour: 'blue'
    };
  }

  render() {
    const ship = this.props.ship;
    console.log(ship)
    return <div></div>
    // return <div id='summary'>
    //   <div style={{display: "table", width: "100%"}}>
    //     <div style={{display: "table-row"}}>
    //       <table className={'summaryTable'}>
    //         <thead>
    //         <tr className='main'>
    //           <th rowSpan={2} className={ cn({ 'bg-warning-disabled': !canThrust }) }>{translate('speed')}</th>
    //           <th rowSpan={2} className={ cn({ 'bg-warning-disabled': !canBoost }) }>{translate('boost')}</th>
    //           <th colSpan={5}>{translate('jump range')}</th>
    //           <th rowSpan={2}>{translate('shield')}</th>
    //           <th rowSpan={2}>{translate('integrity')}</th>
    //           <th rowSpan={2}>{translate('DPS')}</th>
    //           <th rowSpan={2}>{translate('EPS')}</th>
    //           <th rowSpan={2}>{translate('TTD')}</th>
    //           {/* <th onMouseEnter={termtip.bind(null, 'heat per second')} onMouseLeave={hide} rowSpan={2}>{translate('HPS')}</th> */}
    //           <th rowSpan={2}>{translate('cargo')}</th>
    //           <th rowSpan={2} onMouseEnter={termtip.bind(null, 'passenger capacity', { cap: 0 })} onMouseLeave={hide}>{translate('pax')}</th>
    //           <th rowSpan={2}>{translate('fuel')}</th>
    //           <th colSpan={3}>{translate('mass')}</th>
    //           <th onMouseEnter={termtip.bind(null, 'hull hardness', { cap: 0 })} onMouseLeave={hide} rowSpan={2}>{translate('hrd')}</th>
    //           <th rowSpan={2}>{translate('crew')}</th>
    //           <th onMouseEnter={termtip.bind(null, 'mass lock factor', { cap: 0 })} onMouseLeave={hide} rowSpan={2}>{translate('MLF')}</th>
    //           <th onMouseEnter={termtip.bind(null, 'TT_SUMMARY_BOOST_TIME', { cap: 0 })} onMouseLeave={hide} rowSpan={2}>{translate('boost time')}</th>
    //           <th rowSpan={2}>{translate('resting heat (Beta)')}</th>
    //         </tr>
    //         <tr>
    //           <th className='lft'>{translate('max')}</th>
    //           <th>{translate('unladen')}</th>
    //           <th>{translate('laden')}</th>
    //           <th>{translate('total unladen')}</th>
    //           <th>{translate('total laden')}</th>
    //           <th className='lft'>{translate('hull')}</th>
    //           <th>{translate('unladen')}</th>
    //           <th>{translate('laden')}</th>
    //         </tr>
    //         </thead>
    //         <tbody>
    //         <tr>
    //           <td onMouseEnter={termtip.bind(null, speedTooltip, { cap: 0 })} onMouseLeave={hide}>{ canThrust ? <span>{int(ship.calcSpeed(4, ship.fuelCapacity, 0, false))}{u['m/s']}</span> : <span className='warning'>0 <Warning/></span> }</td>
    //           <td onMouseEnter={termtip.bind(null, boostTooltip, { cap: 0 })} onMouseLeave={hide}>{ canBoost ? <span>{int(ship.calcSpeed(4, ship.fuelCapacity, 0, true))}{u['m/s']}</span> : <span className='warning'>0 <Warning/></span> }</td>
    //           <td><span onMouseEnter={termtip.bind(null, 'TT_SUMMARY_MAX_SINGLE_JUMP', { cap: 0 })} onMouseLeave={hide}>{f2(Calc.jumpRange(ship.unladenMass + ship.standard[2].m.getMaxFuelPerJump(), ship.standard[2].m, ship.standard[2].m.getMaxFuelPerJump(), ship))}{u.LY}</span></td>
    //           <td><span onMouseEnter={termtip.bind(null, 'TT_SUMMARY_UNLADEN_SINGLE_JUMP', { cap: 0 })} onMouseLeave={hide}>{f2(Calc.jumpRange(ship.unladenMass + ship.fuelCapacity, ship.standard[2].m, ship.fuelCapacity, ship))}{u.LY}</span></td>
    //           <td><span onMouseEnter={termtip.bind(null, 'TT_SUMMARY_LADEN_SINGLE_JUMP', { cap: 0 })} onMouseLeave={hide}>{f2(Calc.jumpRange(ship.unladenMass + ship.fuelCapacity + ship.cargoCapacity, ship.standard[2].m, ship.fuelCapacity, ship))}{u.LY}</span></td>
    //           <td onMouseEnter={termtip.bind(null, 'TT_SUMMARY_UNLADEN_TOTAL_JUMP', { cap: 0 })} onMouseLeave={hide}>{f2(Calc.totalJumpRange(ship.unladenMass + ship.fuelCapacity, ship.standard[2].m, ship.fuelCapacity, ship))}{u.LY}</td>
    //           <td onMouseEnter={termtip.bind(null, 'TT_SUMMARY_LADEN_TOTAL_JUMP', { cap: 0 })} onMouseLeave={hide}>{f2(Calc.totalJumpRange(ship.unladenMass + ship.fuelCapacity + ship.cargoCapacity, ship.standard[2].m, ship.fuelCapacity, ship))}{u.LY}</td>
    //           <td className={sgClassNames} onMouseEnter={termtip.bind(null, sgTooltip, { cap: 0 })} onMouseLeave={hide}>{int(ship.shield)}{u.MJ}</td>
    //           <td onMouseEnter={termtip.bind(null, 'TT_SUMMARY_INTEGRITY', { cap: 0 })} onMouseLeave={hide}>{int(ship.armour)}</td>
    //           <td onMouseEnter={termtip.bind(null, 'TT_SUMMARY_DPS', { cap: 0 })} onMouseLeave={hide}>{f1(ship.totalDps)}</td>
    //           <td onMouseEnter={termtip.bind(null, 'TT_SUMMARY_EPS', { cap: 0 })} onMouseLeave={hide}>{f1(ship.totalEps)}</td>
    //           <td onMouseEnter={termtip.bind(null, 'TT_SUMMARY_TTD', { cap: 0 })} onMouseLeave={hide}>{timeToDrain === Infinity ? '∞' : time(timeToDrain)}</td>
    //           {/* <td>{f1(ship.totalHps)}</td> */}
    //           <td>{round(ship.cargoCapacity)}{u.T}</td>
    //           <td>{ship.passengerCapacity}</td>
    //           <td>{round(ship.fuelCapacity)}{u.T}</td>
    //           <td onMouseEnter={termtip.bind(null, 'TT_SUMMARY_HULL_MASS', { cap: 0 })} onMouseLeave={hide}>{ship.hullMass}{u.T}</td>
    //           <td onMouseEnter={termtip.bind(null, 'TT_SUMMARY_UNLADEN_MASS', { cap: 0 })} onMouseLeave={hide}>{int(ship.unladenMass)}{u.T}</td>
    //           <td onMouseEnter={termtip.bind(null, 'TT_SUMMARY_LADEN_MASS', { cap: 0 })} onMouseLeave={hide}>{int(ship.ladenMass)}{u.T}</td>
    //           <td>{int(ship.hardness)}</td>
    //           <td>{ship.crew}</td>
    //           <td>{ship.masslock}</td>
    //           <td>{shipBoost !== 'No Boost' ? formats.time(shipBoost) : 'No Boost'}</td>
    //           <td>{formats.pct(restingHeat)}</td>
    //         </tr>
    //         </tbody>
    //       </table>
    //     </div>
    //   </div>
    // </div>;
  }
}

ShipSummaryTable.propTypes = {
  ship: PropTypes.any.isRequired,
};

export default ShipSummaryTable;
