import React, { Component } from 'react';
import {Dimensions, StyleSheet, AsyncStorage} from 'react-native';

import {
  Image,
  ListView,
  Tile,
  Title,
  Subtitle,
  TouchableOpacity,
  Screen,
  Divider,
} from '@shoutem/ui';

import * as firebase from 'firebase';

import { connect } from 'react-redux';
import { navigatePush } from '../../reducers/redux';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

let moment = require('moment');
let currentMoment = moment();

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const weekStartDay = moment(currentMoment).subtract(moment(currentMoment).isoWeekday() - 1, 'days').format('D MMMM');
const weekEndDay = moment(currentMoment).subtract(moment(currentMoment).isoWeekday() - 1, 'days').add(4, 'days').format('D MMMM');


const IMAGES = {
  week: require('./assets/week.png'),
  exams: require('./assets/exams.png'),
  communication: require('./assets/communication.png'),
  announcements: require('./assets/announcements.png'),
  semesteroverview: require('./assets/semester-overview.png')
};

const FEATURES = [
  {
    key: "PresentFutureScene",
    name: "Timetable",
    background: IMAGES.week
  },
  {
    key: "ThinkScene",
    name: "Homeworks, Tests, Exams",
    background: IMAGES.exams
  },
  {
    key: "SemesterOverviewScene",
    name: "Teachers, Classes, Your Grades",
    background: IMAGES.semesteroverview
  },
  {
    key: "AnnouncementsScene",
    name: "Announcements",
    background: IMAGES.announcements
  },
  {
    key: "ConversationsScene",
    name: "Communication",
    background: IMAGES.communication
  }
];


class OverviewScene extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(feature) {
    const { onButtonPress } = this.props;

    return (
      <TouchableOpacity onPress={() => onButtonPress(feature)}>
        <Image
          styleName="large-banner"
          source={feature.background}
        >
          <Tile>
            <Title styleName="md-gutter-bottom">{feature.name}</Title>
          </Tile>
        </Image>
        <Divider styleName="line" />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Screen>
        <NavigationBar title="Overview" />

        <ListView
          data={ FEATURES }
          renderRow = {feature => this.renderRow(feature)}
        />
      </Screen>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (feature) => {
    dispatch(navigatePush({
      key: feature.key,
      title: feature.title,
    }, { feature }));
  },
});


export default connect(
	undefined,
	mapDispatchToProps
)(OverviewScene);
