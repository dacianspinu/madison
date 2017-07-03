import React, { Component } from 'react';
import {Dimensions, StyleSheet, ScrollView, AsyncStorage} from 'react-native';

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
  Button,
  Text,
  DropDownMenu
} from '@shoutem/ui';

import * as firebase from 'firebase';

import { connect } from 'react-redux';
import { navigatePush } from '../../../reducers/redux';
import Database from '../../../database/Database';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const styles = {
  startConversationButton: {
    marginBottom: 20,
    marginTop: 10,
    width: 60/100 * width,
    backgroundColor: "#22C064",
  }
}

let student = '';

class CreateNewConversationScreen extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      teachers: {
        lab: [{
          name: "Loading ..."
        }],
        lecture: [{
          name: "Loading ..."
        }]
      }
    };

    this.createConversationAndNavigateToDetails = this.createConversationAndNavigateToDetails.bind(this);
  }

  async componentWillMount() {
    await this.getTeachers();
  }

  async getTeachers() {
    let self = this;
    student = await AsyncStorage.getItem('currentStudent');
    let promises = await Promise.all([Database.getLoggedInStudentGroupSchedule(JSON.parse(student).group, JSON.parse(student).year), Database.getTeachers()]);

    let schedule = promises[0].val().schedule;
    let teachers = promises[1].val();

    let groupTeachers = {
      lab: [],
      lecture: []
    };

    schedule.map(function(scheduleDay) {
      scheduleDay.map(function(scheduleItem) {
        if (scheduleItem.type === 'lecture') {
          scheduleItem.teacherId.map(function(teacherId) {
            let teacherFoundBefore = false;
            teacherFoundBefore = groupTeachers.lecture.some(function(groupTeacher) {
              if (groupTeacher.name === teachers[teacherId].name) {
                return true;
              }
            });
            if (!teacherFoundBefore) {
              teachers[teacherId].class = scheduleItem.name;
              groupTeachers.lecture.push(teachers[teacherId]);
            }
          })
        } else {
          scheduleItem.teacherId.map(function(teacherId) {
            let teacherFoundBefore = false;
            teacherFoundBefore = groupTeachers.lab.some(function(groupTeacher) {
              if (groupTeacher.name === teachers[teacherId].name) {
                return true;
              }
            });
            if (!teacherFoundBefore) {
              teachers[teacherId].class = scheduleItem.name;
              groupTeachers.lab.push(teachers[teacherId]);
            }
          })
        }
      });
    });

    self.setState({
      teachers: groupTeachers,
      selectedLabTeacher: groupTeachers.lab[0],
      selectedLectureTeacher: groupTeachers.lecture[0]
    });
  }

  async createConversationAndNavigateToDetails(type) {
    let teacher = {};
    if (type === 'lab') {
      teacher = this.state.selectedLabTeacher
    } else {
      teacher = this.state.selectedLectureTeacher
    }

    const { onButtonPress } = this.props;

    let conversationId = await Database.createConversation(JSON.parse(student).uid);

    let newConversationDetails = {
      key: "ConversationDetailsScene",
      title: teacher.name,
      teacher: teacher,
      new: true,
      conversationId: conversationId
    }

    onButtonPress(newConversationDetails);
  }

  render() {
    return (
      <Screen>
        <NavigationBar title="Start a new conversation"  />
          <ScrollView>
            <View styleName="vertical v-center">
              <Row styleName="small">
                <Icon name="laptop" />
                <Text>Laboratory teachers</Text>
              </Row>
              <DropDownMenu
                options={this.state.teachers.lab}
                selectedOption={this.state.selectedLabTeacher ? this.state.selectedLabTeacher : this.state.teachers.lab[0]}
                onOptionSelected={(clickedClass) => this.setState({ selectedLabTeacher: clickedClass })}
                titleProperty="name"
                valueProperty="name"
              />
              <View styleName="horizontal h-center">
                <Button styleName="dark"  style={styles.startConversationButton} onPress={() => this.createConversationAndNavigateToDetails('lab')}>
                  <Icon name="edit" style = {{color: 'white'}}/>
                  <Text style = {{color: 'white'}}>START CONVERSATION</Text>
                </Button>
              </View>
              <Row styleName="small">
                <Icon name="news" />
                <Text>Lecture teachers</Text>
              </Row>
              <DropDownMenu
                options={this.state.teachers.lecture}
                selectedOption={this.state.selectedLectureTeacher ? this.state.selectedLectureTeacher : this.state.teachers.lecture[0]}
                onOptionSelected={(clickedClass) => this.setState({ selectedLectureTeacher: clickedClass })}
                titleProperty="name"
                valueProperty="name"
              />
              <View styleName="horizontal h-center">
                <Button styleName="dark" style = {styles.startConversationButton} onPress={() => this.createConversationAndNavigateToDetails('lecture')}>
                  <Icon name="edit" style = {{color: 'white'}}/>
                  <Text style = {{color: 'white'}}>START CONVERSATION</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
      </Screen>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (conversation) => {
    console.log(conversation);
    dispatch(navigatePush({
      key: conversation.key,
      title: conversation.title,
    }, { conversation }));
  },
});

export default connect(
	undefined,
	mapDispatchToProps
)(CreateNewConversationScreen);
