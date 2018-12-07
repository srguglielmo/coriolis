import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from "react-loadable";
import Header from './components/Header';
const LoadableComponent = Loadable({
  loader: () => import("./pages/Home"),
  loading: () => <h2>Loading</h2>
});

class App extends Component {
  render() {
    return (
      <div style={{ minHeight: '100%' }}>
        <Switch>
          <Route exact path='/' component={LoadableComponent}/>
        </Switch>
        <Header/>


        <footer>
          <div className="right cap">
            <a href="https://github.com/EDCD/coriolis" target="_blank" rel="noopener noreferrer"
               title="Coriolis Github Project">{window.CORIOLIS_VERSION} - {window.CORIOLIS_DATE}</a>
            <br/>
            <a
              href={'https://github.com/EDCD/coriolis/compare/edcd:develop@{' + window.CORIOLIS_DATE + '}...edcd:develop'}
              target="_blank" rel="noopener noreferrer" title={'Coriolis Commits since' + window.CORIOLIS_DATE}>Commits
              since last release
              ({window.CORIOLIS_DATE})</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
