import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './components/Login/Login';

const routes = (
    <Switch>
        <Route exact path="/" component={ Login } />
    </Switch>
);

export default routes;