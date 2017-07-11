import React, { Component } from 'react';
// import {Scene, Router} from 'react-native-router-flux';

import { AppRegistry, StatusBar} from 'react-native';
import * as firebase from 'firebase';

import Root from './root';


StatusBar.setBarStyle('light-content');

console.disableYellowBox = true;
class Madison extends Component {

}

AppRegistry.registerComponent('madison', () => Root);
