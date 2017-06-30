import React, { Component } from 'react';
import {Dimensions, StyleSheet, ScrollView, AsyncStorage} from 'react-native';

import Tabs from './../components/Tabs';

import {
  Image,
  ListView,
  Tile,
  Title,
  Subtitle,
  TouchableOpacity,
  Screen,
  Divider,
  Row,
  Icon,
  View,
  Caption,
  Text
} from '@shoutem/ui';

import * as firebase from 'firebase';

import { connect } from 'react-redux';
import { navigatePush } from '../../reducers/redux';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

import Database from '../../database/Database';

export default class AnnouncementsScene extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allAnnouncements: [],
      yearAnnouncements: []
    };
  }

  async componentWillMount() {
    await this.getAnnouncements();
  }

  async getAnnouncements() {
    let self = this;
    let allAnnouncements = [];
    let yearAnnouncements = [];

    let student = await AsyncStorage.getItem('currentStudent');
    student = JSON.parse(student);

    let promises = await Promise.all([Database.getAnnouncementsForStudentYear(student.year), Database.getAnnouncementsForAllStudents()]);

    promises[0].on('value', function(snapshot) {
      yearAnnouncements = snapshot.val();
      yearAnnouncements = Object.keys(yearAnnouncements).map(function (key) { return yearAnnouncements[key]; });
      self.setState({yearAnnouncements: yearAnnouncements.reverse()});

      console.log(yearAnnouncements);
    });

    promises[1].on('value', function(snapshot) {
      allAnnouncements = snapshot.val();
      allAnnouncements = Object.keys(allAnnouncements).map(function (key) { return allAnnouncements[key]; });
      self.setState({allAnnouncements: allAnnouncements.reverse()});

      console.log(allAnnouncements)

    });
  }

  renderAnnouncement(announcement) {
    return (
      <View>
        <Row>
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Subtitle>{announcement.sender}</Subtitle>
              <Caption>{announcement.when}</Caption>
            </View>
            <Text styleName="multiline">{announcement.contents}</Text>
          </View>
        </Row>
        <Divider styleName="line"></Divider>
      </View>
    )
  }

  render() {
    const { onButtonPress } = this.props;

    return (
      <Screen>
        <NavigationBar title="Announcements" />
        <ScrollView>
          <ListView
            data={this.state.yearAnnouncements}
            renderRow = {announcement => this.renderAnnouncement(announcement)}
            />
          <ListView
            data={this.state.allAnnouncements}
            renderRow = {announcement => this.renderAnnouncement(announcement)}
            />
        </ScrollView>
      </Screen>
    );
  }
};
