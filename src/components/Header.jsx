import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { CoriolisLogo, Hammer, Rocket, Cogs, Help, StatsBars } from './SvgIcons';

const cn = (...args) => args.join(' ')
const translate = (args) => args;
const hasBuilds = () => false
const openedMenu = () => false

class Header extends Component {
  render() {
    return (
      <header className={"header"}>
        <Link className='l menu' to={'/'}><CoriolisLogo className='icon xl' /></Link>
        <div className='l menu'>
          <div className={'menu-header'} onClick={this._openShips}>
            <Rocket className='warning' /><span className='menu-item-label'>{translate('ships')}</span>
          </div>
        </div>
        <div className='l menu'>
          <div className={'menu-header'} onClick={hasBuilds && this._openBuilds}>
            <Hammer className={'menu-header'} /><span className='menu-item-label'>{translate('builds')}</span>
          </div>
        </div>

        <div className='l menu'>
          <div className={cn('menu-header', { selected: openedMenu == 'comp', disabled: !hasBuilds })} onClick={hasBuilds && this._openComp}>
            <StatsBars className={'menu-header'} /><span className='menu-item-label'>{translate('compare')}</span>
          </div>
        </div>

        <div className='l menu'>
          <div className={'menu-header'}>
            <span className='menu-item-label'>{translate('announcements')}</span>
          </div>
        </div>
        <div className='r menu'>
          <div className={cn('menu-header', { selected: openedMenu == 'settings' })} onClick={this._openSettings}>
            <Cogs className='xl warning'/><span className='menu-item-label'>{translate('settings')}</span>
          </div>
          {openedMenu == 'settings' ? this._getSettingsMenu() : null}
        </div>

        <div className='r menu'>
          <div className={cn('menu-header')} onClick={this._showHelp}>
            <Help className='xl warning'/>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
