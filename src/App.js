import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import GeoHome from './geolocation/GeoHome'
import GeoDataLoad from './geolocation/GeoDataLoad'


const App = () => (
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/geolocation' component={GeoHome} />
        <Route path='/geolocation-prep' component={GeoDataLoad} />
      </Switch>
);

export default App;