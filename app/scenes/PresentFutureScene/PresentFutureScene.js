import React, { Component } from 'react';
import {Dimensions, StyleSheet, Text, AsyncStorage, NetInfo} from 'react-native';

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
  Caption
} from '@shoutem/ui';

import * as firebase from 'firebase';

import { connect } from 'react-redux';
import { navigatePush } from '../../reducers/redux';

import Database from '../../database/Database';
let moment = require('moment');

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height


const styles = {
  // App container
  container: {
    flex: 1,                            // Take up all screen
    backgroundColor: '#8D76BE',         // Background color
  },
  // Tab content container
  content: {
    backgroundColor: '#8D76BE'
  },
  // Content header
  header: {
    color: 'white',
    textAlign: 'center',               // White color
    fontFamily: 'Avenir',               // Change font family
    fontSize: 20,                       // Bigger font size
    marginTop: 40
  },
  // Content text
  text: {
    marginHorizontal: 20,               // Add horizontal margin
    color: 'white', // Semi-transparent text
    textAlign: 'center',                // Center
    fontFamily: 'Avenir',
    fontSize: 18,
    marginBottom: 20
  },
};

let firstTab = "WAITING ... ";
let thirdTab = "";
let secondTab = "";

let firstTabData = [];
let secondTabData = [];
let thirdTabData = [];

let student = {};
export default class PresentFutureScene extends Component {
  constructor(props) {
    super(props);

    this.computeTabNames = this.computeTabNames.bind(this);
    this.renderListRow = this.renderListRow.bind(this);
  }

  async componentWillMount() {
    let schedule = {};

    NetInfo.fetch().done(
        async (networkType)=> {
          if (networkType === 'none') {
            schedule = await this.getLocalSchedule();
            this.computeTabNames(schedule);
          } else {
            schedule = await this.getSchedule();
            this.computeTabNames(schedule);
          }
        }
    )
    NetInfo.addEventListener('change',
        async (networkType)=> {
          if (networkType === 'none') {
            schedule = await this.getLocalSchedule();
            this.computeTabNames(schedule);
          } else {
            schedule = await this.getSchedule();
            this.computeTabNames(schedule);
          }
        }
    );
  }

  computeTabNames(schedule) {
    let currentMoment = moment();
    const currentDayOfTheWeek = moment(currentMoment).add(2, 'days').isoWeekday();
    console.log(currentDayOfTheWeek);

    if (currentDayOfTheWeek > 6) {
      firstTab = "WEEKEND"
      secondTab = "MONDAY";
      thirdTab = "TUESDAY";
      secondTabData = schedule[1];
      thirdTabData = schedule[2];
    } else if (currentDayOfTheWeek >=1 && currentDayOfTheWeek <=3) {
      firstTab = "TODAY";
      secondTab = "TOMORROW";
      thirdTab = moment(currentMoment).add(4, 'days').format('dddd').toUpperCase();
      firstTabData = schedule[currentDayOfTheWeek];
      secondTabData = schedule[currentDayOfTheWeek + 1];
      thirdTabData = schedule[currentDayOfTheWeek + 2];
      console.log(thirdTab)
    } else if (currentDayOfTheWeek === 4) {
      firstTab = "TODAY"
      secondTab = moment(currentMoment).add(1, 'day').format('dddd').toUpperCase();
      thirdTab = "WEEKEND";

      firstTabData = schedule[currentDayOfTheWeek];
      secondTabData = schedule[currentDayOfTheWeek + 1];
    } else if (currentDayOfTheWeek >= 5) {
      firstTab = "TODAY";
      secondTab = "TOMORROW";
      thirdTab = "MONDAY";

      firstTabData = schedule[currentDayOfTheWeek];
      secondTabData = schedule[currentDayOfTheWeek + 1] || [];
      thirdTabData = schedule[1];

    }
    this.forceUpdate();
  }

  renderListRow(scheduleItem) {
    return (
      <Row styleName="small">
        <Icon name={scheduleItem.type === 'lab' ? 'laptop' : 'news'} />
        <View styleName="vertical">
          <View styleName="horizontal space-between">
            <Subtitle>{scheduleItem.name}</Subtitle>
            <Caption>{scheduleItem.start} - {scheduleItem.end}</Caption>
          </View>
          <Caption>{scheduleItem.room} · grupa {scheduleItem.group} · {scheduleItem.teacher}</Caption>
        </View>
      </Row>
    )
  }

  async getLocalSchedule() {
      student = await AsyncStorage.getItem('currentStudent');

      let data = await Promise.all([AsyncStorage.getItem('currentStudentSchedule'), AsyncStorage.getItem('currentStudentTeachers')]);

      let schedule = JSON.parse(data[0]).shift();
      schedule.map(function(scheduleDay) {
        scheduleDay.map(async function(scheduleItem) {
            let teacher = "";
            scheduleItem.teacherId.forEach(function(teacherId) {
              teacher = teacher + ' ' + teachers[teacherId].name;
            })
            scheduleItem.teacher = teacher;
            scheduleItem.group = JSON.parse(student).group;
            return scheduleItem;
        });
      });

      return schedule;
  }

  async getSchedule() {
    try {
      student = await AsyncStorage.getItem('currentStudent');
      let data = await Promise.all([Database.getLoggedInStudentGroupSchedule(JSON.parse(student).group, JSON.parse(student).year), Database.getTeachers()]);

      let schedule = data[0].val().schedule;
      let teachers = data[1].val();

      AsyncStorage.setItem('currentStudentSchedule', JSON.stringify(schedule));
      AsyncStorage.setItem('currentStudentTeachers', JSON.stringify(teachers));

      schedule.map(function(scheduleDay) {
        scheduleDay.map(async function(scheduleItem) {
            let teacher = "";
            scheduleItem.teacherId.forEach(function(teacherId) {
              teacher = teacher + ' ' + teachers[teacherId].name;
            })
            scheduleItem.teacher = teacher;
            scheduleItem.group = JSON.parse(student).group;
            return scheduleItem;
        });
      });

      return schedule;
    } catch(e) {

    }
  }

  render() {
    return (
      <Screen>
        <NavigationBar title="Present & Future" />
        <View style={styles.container}>
          <Tabs>
            {/* First tab */}
            <View title={firstTab} style={styles.content}>
              <ListView
                data={ firstTabData }
                renderRow = {scheduleItem => this.renderListRow(scheduleItem)}
              />
            </View>
            {/* Second tab */}
            <View title={secondTab} style={styles.content}>
              <ListView
                data={ secondTabData }
                renderRow = {scheduleItem => this.renderListRow(scheduleItem)}
              />
            </View>
            {/* Third tab */}
            <View title={thirdTab} style={styles.content}>
              <ListView
                data={ thirdTabData }
                renderRow = {scheduleItem => this.renderListRow(scheduleItem)}
              />
            </View>

          </Tabs>
        </View>
      </Screen>
    );
  }
};
