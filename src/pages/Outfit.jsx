import React, { Component } from 'react';
import { Factory } from 'ed-forge';
import Slot from '../components/Slot';
import ShipSummaryTable from '../components/ShipSummaryTable';

class Outfit extends Component {
  constructor(props) {
    super(props);

    const ship = Factory.newShip(this.props.match.params.ship);

    this.state = {
      ship
    };

  }

  render() {
    return (
      <div
        id="outfit"
        className={'page'}
      >
        <ShipSummaryTable ship={this.state.ship}/>
        {this.state.ship.getCoreModules().map(core =>
          <Slot mod={core}/>
        )}
        {this.state.ship.getHardpoints().map(core =>
          <Slot mod={core}/>
        )}
      </div>
    );
  }
}

export default Outfit;
