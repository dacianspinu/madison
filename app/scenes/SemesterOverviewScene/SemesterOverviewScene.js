import React, { Component } from 'react';
import {Dimensions, StyleSheet, AsyncStorage, ScrollView} from 'react-native';

import Tabs from './../components/Tabs';

import {
  Image,
  ListView,
  Title,
  Subtitle,
  TouchableOpacity,
  Screen,
  Divider,
  Row,
  Icon,
  View,
  Caption,
  Text,
  Button
} from '@shoutem/ui';

import * as firebase from 'firebase';

import { connect } from 'react-redux';
import { navigatePush } from '../../reducers/redux';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

import Database from '../../database/Database';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height


const styles = {
  container: {
    flex: 1,                            // Take up all screen
    backgroundColor: '#F65A41',         // Background color
  },
  text: {
    marginHorizontal: 20,               // Add horizontal margin
    color: 'white',                   // Semi-transparent text
    textAlign: 'center',                // Center
    fontFamily: 'Avenir',
    fontSize: 18,
    marginBottom: 20
  },
  button: {
    marginTop: 20,
    marginBottom: 20
  },
  title: {
    color: 'white',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10
  }
};

let data = {
  classes: [],
  teachers: {
    lab: [],
    lecture: []
  },
  grades: []
}

class ThinkScene extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.renderClassRow           = this.renderClassRow.bind(this);
    this.renderLabTeacherRow      = this.renderLabTeacherRow.bind(this);
    this.renderLectureTeacherRow  = this.renderLectureTeacherRow.bind(this);
    this.renderGradeRow           = this.renderGradeRow.bind(this);
    this.goToCreateGrade          = this.goToCreateGrade.bind(this);
  }

  async componentWillMount() {
    data = await this.getData();
    this.forceUpdate();
  }

  async getData() {
    let student = await AsyncStorage.getItem('currentStudent');

    let data = await Promise.all([Database.getLoggedInStudentGroupSchedule(JSON.parse(student).group), Database.getTeachers(), Database.getLoggedInStudentGrades(JSON.parse(student).uid)]);

    let schedule = data[0].val().schedule;
    let teachers = data[1].val();
    let grades   = data[2].val();

    grades = Object.keys(grades).map(function (key) { return grades[key]; });


    let groupTeachers = {
      lab: [],
      lecture: []
    };
    let classes = [];

    schedule.map(function(scheduleDay) {
      scheduleDay.map(function(scheduleItem) {
        if (scheduleItem.type === 'lecture') {
          classes.push(scheduleItem);

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


    return {
      classes: classes,
      teachers: groupTeachers,
      grades: grades
    }
  }

  renderClassRow(course) {
    return (
      <View>
        <Row styleName="small">
          <Icon name="news" />
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Subtitle>{course.name}</Subtitle>
            </View>
          </View>
        </Row>
        <Divider styleName="line"></Divider>
      </View>
    )
  };

  renderLabTeacherRow(teacher) {
    return (
      <TouchableOpacity>
        <Row>
          <Icon name="laptop" />
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Subtitle>{teacher.name}</Subtitle>
            </View>
            <Text numberOfLines={1}>{teacher.class}</Text>
            <Caption styleName="multiline">{teacher.emailAddress}</Caption>
            <Caption numberOfLines={1}>{teacher.website}</Caption>

          </View>
        </Row>
        <Divider styleName="line"></Divider>
      </TouchableOpacity>
    )
  }

  renderLectureTeacherRow(teacher) {
    return (
      <TouchableOpacity>
        <Row>
          <Icon name="news" />
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Subtitle>{teacher.name}</Subtitle>
            </View>
            <Text numberOfLines={1}>{teacher.class}</Text>
            <Caption styleName="multiline">{teacher.emailAddress}</Caption>
            <Caption numberOfLines={1}>{teacher.website}</Caption>

          </View>
        </Row>
        <Divider styleName="line"></Divider>
      </TouchableOpacity>
    )
  };

  renderGradeRow(grade) {
    let icon = "";
    if (grade.type === 'HOMEWORK' || grade.type === 'TEST') {
      icon = "laptop";
    } else {
      icon = "news"
    }
    return (
      <View>
        <Row styleName="small">
          <Icon name={icon} />
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Subtitle>{grade.class}</Subtitle>
              <Caption>{grade.grade}</Caption>
            </View>
            <Caption>{grade.type}     ·    {grade.date}</Caption>
          </View>
        </Row>
        <Divider styleName="line"></Divider>
      </View>

    )
  }

  goToCreateGrade() {
    const propsObject = this.props;
    const grade = {};
    grade.key = "CreateGradeScene";
    grade.title = "Add a new grade";

    propsObject.onButtonPress(grade);
  }

  render() {
    const { onButtonPress } = this.props;

    return (
      <Screen>
        <NavigationBar title="Semester Overview" />
        <View style={styles.container}>
          <Tabs>
            {/* First tab */}
            <View title="TEACHERS" style={styles.content}>
              <ScrollView>
              <Title style={styles.title}>· Laboratory teachers</Title>
              <ScrollView>
                <ListView
                  data={ data.teachers.lab }
                  renderRow = {teacher => this.renderLabTeacherRow(teacher)}>
                </ListView>
              </ScrollView>
              <Title style={styles.title}>· Lecture teachers</Title>
              <ScrollView>
                <ListView
                  data={ data.teachers.lecture }
                  renderRow = {course => this.renderLectureTeacherRow(course)}>
                </ListView>
              </ScrollView>
              </ScrollView>
            </View>
            {/* Second tab */}
            <View title="CLASSES" style={styles.content}>
              <ScrollView>
                <ListView
                  data={ data.classes }
                  renderRow = {course => this.renderClassRow(course)}>
                </ListView>
              </ScrollView>
            </View>
            {/* Third tab */}
            <View title="GRADES" style={styles.content}>
              <ScrollView>
                <View styleName="horizontal h-center">
                  <Button styleName="dark" style={styles.button} onPress={() => this.goToCreateGrade()}>
                    <Icon name="edit" />
                    <Text>ADD NEW GRADE</Text>
                  </Button>
                </View>
                <ListView
                  data={ data.grades }
                  renderRow = {grade => this.renderGradeRow(grade)}>
                </ListView>
              </ScrollView>
            </View>

          </Tabs>
        </View>
      </Screen>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (grade) => {
    dispatch(navigatePush({
      key: grade.key,
      title: grade.title,
    }, { grade }));
  },
});

export default connect(
	undefined,
	mapDispatchToProps
)(ThinkScene);
