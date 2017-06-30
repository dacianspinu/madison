import React, { Component } from 'react';
import {Dimensions, StyleSheet, AsyncStorage, ScrollView} from 'react-native';

import Tabs from './../components/Tabs';

import {
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
  Text
} from '@shoutem/ui';

import * as firebase from 'firebase';
import Database from '../../database/Database';
import { connect } from 'react-redux';
import { navigatePush } from '../../reducers/redux';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height


const styles = {
  // App container
  container: {
    flex: 1,                            // Take up all screen
    backgroundColor: '#7FB9BA',         // Background color
  },
  // Tab content container
  button: {
    marginTop: 20,
    marginBottom: 20
  },
  multilineText: {
    fontSize: 12
  }
};

const thirdTab = "EXAMS";

class ThinkScene extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.renderHomeworkRow = this.renderHomeworkRow.bind(this);
    this.goToCreateHomework = this.goToCreateHomework.bind(this);

    this.renderTestRow = this.renderTestRow.bind(this);

    this.state = {
      homeworks: [
        {
          name: "Waiting ..."
        }
      ],
      tests: [
        {
          class: "Waiting ..."
        }
      ],
      exams: [
        {
          name: "Waiting ...",
          when: {
            A: "...",
            B: "..."
          }
        }
      ]
    }
  }

  async componentWillMount() {
    await this.getData();
  };

  async getData() {
    let self = this;
    try {
      let student = await AsyncStorage.getItem('currentStudent');
      let promises = await Promise.all([Database.getCurrentStudentHomeworks(JSON.parse(student).uid), Database.getCurrentStudentTests(JSON.parse(student).uid), Database.getCurrentStudentExams(JSON.parse(student).year)]);

      let homeworks = [];
      let tests = [];
      let exams = [];

      promises[0].on('value', function(snapshot) {
        homeworks = snapshot.val();
        homeworks = Object.keys(homeworks).map(function (key) { return homeworks[key]; });
        self.setState({homeworks: homeworks.reverse()});
      })

      promises[1].on('value', function(snapshot) {
        tests = snapshot.val();
        tests = Object.keys(tests).map(function (key) { return tests[key]; });
        self.setState({tests: tests.reverse()});
      })

      promises[2].on('value', function(snapshot) {
        exams = snapshot.val();
        self.setState({exams: exams});
      });

    } catch (error) {
      console.log(error);
    }
  };

  goToCreateHomework() {
    const propsObject = this.props;
    const homework = {};
    homework.key = "CreateHomeworkScene";
    homework.title = "Create a new homework";

    propsObject.onButtonPress(homework);
  };

  goToCreateTest() {
    const propsObject = this.props;
    const homework = {};

    homework.key = "CreateTestScene";
    homework.title = "Add a new test";

    propsObject.onButtonPress(homework);
  }

  renderHomeworkRow(homework) {
    const { onButtonPress } = this.props;
    homework.key = "HomeworkScene";
    return (
      <TouchableOpacity onPress={() => onButtonPress(homework)}>
        <Row styleName="small" >
          <Icon name="edit" />
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Subtitle>{homework.name}</Subtitle>
              <Caption>{homework.dueDate}</Caption>
            </View>
          </View>
        </Row>
        <Divider styleName="line"></Divider>
      </TouchableOpacity>
    )
  }

  renderTestRow(test) {
    return (
      <TouchableOpacity>
        <Row styleName="small" >
          <Icon name="edit" />
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Subtitle>{test.class}</Subtitle>
              <Caption>{test.dueDate}</Caption>
            </View>
            <Text styleName="multiline" style={styles.multilineText}>{test.notes}</Text>
          </View>
        </Row>
        <Divider styleName="line"></Divider>
      </TouchableOpacity>
    )
  }

  renderExamRow(exam) {
    return (
        <Row>
          <Icon name="news" />
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Subtitle>{exam.name}</Subtitle>
            </View>
            <Caption>{exam.day} - {exam.where} </Caption>
            <Caption>Semiyear A : {exam.when.A.start} - {exam.when.A.end}</Caption>
            <Caption>Semiyear B : {exam.when.B.start} - {exam.when.B.end}</Caption>
        </View>
      </Row>
    )
  }
  render() {
    const { onButtonPress } = this.props;

    return (
      <Screen>
        <NavigationBar title="Think about these " />
        <View style={styles.container}>
          <Tabs>
            {/* First tab */}
            <View title="HOMEWORKS" style={styles.content}>
              <ScrollView>
                <View styleName="horizontal h-center">
                  <Button styleName="dark" style={styles.button} onPress={() => this.goToCreateHomework()}>
                    <Icon name="edit" />
                    <Text>ADD NEW HOMEWORK</Text>
                  </Button>
                </View>
                  <ListView
                    data={ this.state.homeworks }
                    renderRow = {homework => this.renderHomeworkRow(homework)}
                    style = {styles.list}
                  />
              </ScrollView>
            </View>
            {/* Second tab */}
            <View title="TESTS" style={styles.content}>
              <ScrollView>
                <View styleName="horizontal h-center">
                  <Button styleName="dark" style={styles.button} onPress={() => this.goToCreateTest()}>
                    <Icon name="edit" />
                    <Text>ADD NEW TEST</Text>
                  </Button>
                </View>
                  <ListView
                    data={ this.state.tests }
                    renderRow = {test => this.renderTestRow(test)}
                    style = {styles.list}
                  />
              </ScrollView>
            </View>
            {/* Third tab */}
            <View title={thirdTab} style={styles.content}>
              <ScrollView>
                <ListView
                  data={ this.state.exams }
                  renderRow = {exam => this.renderExamRow(exam)}
                  style = {styles.list}
                />
              </ScrollView>
            </View>

          </Tabs>
        </View>
      </Screen>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (homework) => {
    dispatch(navigatePush({
      key: homework.key,
      title: homework.title,
    }, { homework }));
  },
});

export default connect(
	undefined,
	mapDispatchToProps
)(ThinkScene);
