import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <div>
        <footer>
          <div className="right cap">
            <a href="https://github.com/EDCD/coriolis" target="_blank" rel="noopener noreferrer"
               title="Coriolis Github Project">{window.CORIOLIS_VERSION} - {window.CORIOLIS_DATE}</a>
            <br/>
            <a
              href={'https://github.com/EDCD/coriolis/compare/edcd:develop@{' + window.CORIOLIS_DATE + '}...edcd:develop'}
              target="_blank" rel="noopener noreferrer" title={'Coriolis Commits since' + window.CORIOLIS_DATE}>Commits since last release
              ({window.CORIOLIS_DATE})</a>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
