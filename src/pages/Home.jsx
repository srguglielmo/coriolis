import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ShipTable from '../components/ShipTable';

class Home extends Component {
  render() {
    return (
      <div className="page">
        <Link className={"link"} to={'/outfit/fer_de_lance'}>Fer De Lance</Link>
        <ShipTable/>
      </div>
    );
  }
}

export default Home;
