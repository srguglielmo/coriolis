import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Persist from '../stores/Persist';
import TranslatedComponent from './TranslatedComponent';
import PowerManagement from './PowerManagement';
import CostSection from './CostSection';
import Movement from './Movement';
import Offence from './Offence';
import Defence from './Defence';
import WeaponDamageChart from './WeaponDamageChart';
import Pips from '../components/Pips';
import Boost from '../components/Boost';
import Fuel from '../components/Fuel';
import Cargo from '../components/Cargo';
import ShipPicker from '../components/ShipPicker';
import EngagementRange from '../components/EngagementRange';
import autoBind from 'auto-bind';
import { ShipProps } from 'ed-forge';
const { CARGO_CAPACITY, FUEL_CAPACITY } = ShipProps;

/**
 * Outfitting subpages
 */
export default class OutfittingSubpages extends TranslatedComponent {
  static propTypes = {
    ship: PropTypes.object.isRequired,
    code: PropTypes.string.isRequired,
    buildName: PropTypes.string,
  };

  /**
   * Constructor
   * @param  {Object} props   React Component properties
   */
  constructor(props) {
    super(props);
    autoBind(this);

    this.props.ship.setOpponent(this.props.ship);
    this.state = {
      boost: false,
      cargo: props.ship.get(CARGO_CAPACITY),
      fuel: props.ship.get(FUEL_CAPACITY),
      pips: props.ship.getDistributorSettingsObject(),
      tab: Persist.getOutfittingTab() || 'power',
      engagementRange: 1000,
      opponentId: '',
      opponent: this.props.ship,
    };
  }

  /**
   * Show selected tab
   * @param  {string} tab Tab name
   */
  _showTab(tab) {
    this.setState({ tab });
  }

  /**
   * Render the power tab
   * @return {React.Component} Tab contents
   */
  _powerTab() {
    let { ship, buildName, code } = this.props;
    Persist.setOutfittingTab('power');

    return <div>
      <PowerManagement ship={ship} code={code} />
      <CostSection ship={ship} buildName={buildName} code={code} />
    </div>;
  }

  /**
   * Render the profiles tab
   * @return {React.Component} Tab contents
   */
  _profilesTab() {
    const { ship, code, boost, opponent, engagementRange } = this.props;
    const { translate } = this.context.language;
    Persist.setOutfittingTab('profiles');

    return <div>
      <div className='group third'>
        <h1>{translate('movement profile')}</h1>
        <Movement code={code} ship={ship} boost={boost} />
      </div>
{/*
      <div className='group third'>
        <h1>{translate('damage to opponent\'s shields')}</h1>
        <WeaponDamageChart code={code} ship={ship} opponent={opponent} engagementRange={engagementRange} />
      </div>

      <div className='group third'>
        <h1>{translate('damage to opponent\'s hull')}</h1>
        <WeaponDamageChart code={code} ship={ship} opponent={opponent} engagementRange={engagementRange} />
      </div> */}
    </div>;
  }

  /**
   * Render the offence tab
   * @return {React.Component} Tab contents
   */
  _offenceTab() {
    const { ship, code, engagementRange, opponent } = this.props;
    Persist.setOutfittingTab('offence');

    return <div>
      <Offence code={code} ship={ship} opponent={opponent} engagementRange={engagementRange}/>
    </div>;
  }

  /**
   * Render the defence tab
   * @return {React.Component} Tab contents
   */
  _defenceTab() {
    const { code, ship, engagementRange, opponent } = this.props;
    Persist.setOutfittingTab('defence');

    return <div>
      <Defence code={code} ship={ship} opponent={opponent} engagementRange={engagementRange}/>
    </div>;
  }

  /**
   * Render the section
   * @return {React.Component} Contents
   */
  render() {
    const { ship } = this.props;
    const {
      boost, cargo, fuel, pips, tab, engagementRange, opponent, opponentId
    } = this.state;
    const translate = this.context.language.translate;
    let tabSection;

    switch (tab) {
      case 'power': tabSection = this._powerTab(); break;
      case 'profiles': tabSection = this._profilesTab(); break;
      case 'offence': tabSection = this._offenceTab(); break;
      case 'defence': tabSection = this._defenceTab(); break;
    }

    const cargoCapacity = ship.get(CARGO_CAPACITY);
    return (
      <div>
        {/* Control of ship and opponent */}
        <div className="group quarter">
          <div className="group half">
            <h2 style={{ verticalAlign: 'middle', textAlign: 'left' }}>
              {translate('ship control')}
            </h2>
          </div>
          <div className="group half">
            <Boost boost={boost} onChange={(boost) => this.setState({ boost })} />
          </div>
        </div>
        <div className="group quarter">
          <Pips ship={ship} pips={pips} onChange={(pips) => this.setState({ pips })} />
        </div>
        <div className="group quarter">
          <Fuel fuelCapacity={ship.get(FUEL_CAPACITY)} fuel={fuel}
            onChange={(fuel) => this.setState({ fuel })} />
        </div>
        <div className="group quarter">
          {cargoCapacity > 0 ? (
            <Cargo cargoCapacity={cargoCapacity} cargo={cargo}
              onChange={(cargo) => this.setState({ cargo })} />
          ) : null}
        </div>
        <div className="group half">
          <div className="group quarter">
            <h2 style={{ verticalAlign: 'middle', textAlign: 'left' }}>
              {translate('opponent')}
            </h2>
          </div>
          <div className="group threequarters">
            <ShipPicker ship={ship} opponent={opponent} opponentId={opponentId}
              onChange={(opponent, opponentId) => this.setState({ opponent, opponentId })}
            />
          </div>
        </div>
        <div className="group half">
          <EngagementRange ship={ship} engagementRange={engagementRange}
            onChange={(engagementRange) => this.setState({ engagementRange })}
          />
        </div>
        <div className='group full' style={{ minHeight: '1000px' }}>
          <table className='tabs'>
            <thead>
              <tr>
                <th style={{ width:'25%' }} className={cn({ active: tab == 'power' })} onClick={this._showTab.bind(this, 'power')} >{translate('power and costs')}</th>
                <th style={{ width:'25%' }} className={cn({ active: tab == 'profiles' })} onClick={this._showTab.bind(this, 'profiles')} >{translate('profiles')}</th>
                <th style={{ width:'25%' }} className={cn({ active: tab == 'offence' })} onClick={this._showTab.bind(this, 'offence')} >{translate('offence')}</th>
                <th style={{ width:'25%' }} className={cn({ active: tab == 'defence' })} onClick={this._showTab.bind(this, 'defence')} >{translate('tab_defence')}</th>
              </tr>
            </thead>
          </table>
          {tabSection}
        </div>
      </div>
    );
  }
}
