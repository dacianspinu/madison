import React, { Component } from 'react';
import {Dimensions, StyleSheet, AsyncStorage} from 'react-native';

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
  }
};

const thirdTab = "EXAMS";

let data = {
  homeworks: []
};

class ThinkScene extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.renderHomework = this.renderHomework.bind(this);
  }

  async componentWillMount() {
    data = await this.getData();
    this.forceUpdate();
  };

  async getData() {
    try {
      let student = await AsyncStorage.getItem('currentStudent');
      let homeworks = await Database.getLoggedInStudentHomeworks(JSON.parse(student).group);
      return {
        homeworks: homeworks.val()
      }
    } catch (error) {
      console.log(error);
    }
  };

  renderHomework(homework) {

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
      </TouchableOpacity>
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
              <View styleName="horizontal h-center">
                <Button styleName="dark" style={styles.button}>
                  <Icon name="comment" />
                  <Text>ADD NEW HOMEWORK</Text>
                </Button>
              </View>
              <ListView
                data={ data.homeworks }
                renderRow = {homework => this.renderHomework(homework)}
              />
            </View>
            {/* Second tab */}
            <View title="TESTS" style={styles.content}>
              <Row styleName="small">
                <Icon name="pin" />
                <View styleName="vertical">
                  <View styleName="horizontal space-between">
                    <Subtitle>ACSO</Subtitle>
                    <Caption>24.06.2017 · 16:00 - 16:45</Caption>
                  </View>
                  <Caption>C2 · Radulescu Vlad</Caption>
                </View>
              </Row>
            </View>
            {/* Third tab */}
            <View title={thirdTab} style={styles.content}>
              <Row styleName="small">
                <Icon name="pin" />
                <View styleName="vertical">
                  <View styleName="horizontal space-between">
                    <Subtitle>ACSO</Subtitle>
                    <Caption>24.06.2017 · 16:00 - 16:45</Caption>
                  </View>
                  <Caption>C2 · Radulescu Vlad</Caption>
                </View>
              </Row>
            </View>

          </Tabs>
        </View>
      </Screen>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (homework) => {
    console.log(homework);
    dispatch(navigatePush({
      key: "HomeworkScene",
      title: homework.title,
    }, { homework }));
  },
});

export default connect(
	undefined,
	mapDispatchToProps
)(ThinkScene);
