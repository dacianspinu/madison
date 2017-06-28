import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

import Database from './database/Database';

import {
  CardStack,
  NavigationBar,
} from '@shoutem/ui/navigation';

import { View } from 'react-native';

import { navigatePop } from './reducers/redux';
import LoginScene from './scenes/Login/LoginScene';
import OverviewScene from './scenes/OverviewScene/OverviewScene';
import PresentFutureScene from './scenes/PresentFutureScene/PresentFutureScene';
import ThinkScene from './scenes/ThinkScene/ThinkScene';
import HomeworkScene from './scenes/HomeworkScene/HomeworkScene';
import SemesterOverviewScene from './scenes/SemesterOverviewScene/SemesterOverviewScene';
import AnnouncementsScene from './scenes/AnnouncementsScene/AnnouncementsScene';
import ConversationsScene from './scenes/CommunicationScene/ConversationsScene/ConversationsScene';
import CreateHomeworkScene from './scenes/CreateHomeworkScene/CreateHomeworkScene';
import CreateTestScene from './scenes/CreateTestScene/CreateTestScene';


let Scenes = {
  'LoginScene': LoginScene,
  'OverviewScene': OverviewScene,
  'PresentFutureScene': PresentFutureScene,
  'ThinkScene': ThinkScene,
  'HomeworkScene': HomeworkScene,
  'SemesterOverviewScene': SemesterOverviewScene,
  'AnnouncementsScene': AnnouncementsScene,
  'ConversationsScene': ConversationsScene,
  'CreateHomeworkScene': CreateHomeworkScene,
  'CreateTestScene': CreateTestScene
}

let firebaseApp = Database.initializeApplication();

class App extends Component {
  static propTypes = {
    onNavigateBack: React.PropTypes.func.isRequired,
    navigationState: React.PropTypes.object,
    scene: React.PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.renderNavBar = this.renderNavBar.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  renderScene(props) {
    const { route } = props.scene;

    let Screen = Scenes[route.key];

    return (<Screen {...route.props} />);
  }

  renderNavBar(props) {
    const { onNavigateBack } = this.props;
    if (props.scene.route.key !== 'LoginScene') {
      return (
        <NavigationBar.View
          {...props}
          onNavigateBack={onNavigateBack}
        />
      );
    } else {
      return (<View></View>)
    }

  }

  render() {
    const { navigationState, onNavigateBack } = this.props;

    return (
      <CardStack
        navigationState={navigationState}
        onNavigateBack={onNavigateBack}
        renderNavBar={this.renderNavBar}
        renderScene={this.renderScene}
      />
    );
  }
}

export default connect(
  state => ({ navigationState: state.navigationState }),
  { onNavigateBack: navigatePop }
)(App);
