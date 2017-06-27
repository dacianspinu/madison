import React, { Component } from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';

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

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  container: {
    fontSize: 14,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    lineHeight: 20,
    marginBottom: 30
  }
});

const shStyles = {
  view: {
    marginTop: 20
  },
  title: {
    marginBottom: 10,
    color: '#656565'
  },
  divider: {
    borderColor: "#656565"
  },
  homeworkContent: {
    marginLeft: 10,
    marginTop: 10,
    color: '#505050'
  },
};
export default class HomeworkScene extends Component {
  static propTypes = {
    homework: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { homework } = this.props;
    return (
      <Screen>
        <NavigationBar title={homework.name.toUpperCase()} />
          <Divider styleName="line"></Divider>
          <View>
            <Row styleName="small" >
              <Icon name="edit" />
              <View styleName="vertical">
                <View styleName="horizontal ">
                  <Subtitle>Due Date    ·    </Subtitle>
                  <Caption>{homework.dueDate}</Caption>
                </View>
              </View>
            </Row>
            <Divider styleName="line"></Divider>
            <Row styleName="small" >
              <Icon name="edit" />
              <View styleName="vertical">
                <View styleName="horizontal ">
                  <Subtitle>Class           ·    </Subtitle>
                  <Caption>{homework.class}</Caption>
                </View>
              </View>
            </Row>
          </View>
          <View styleName="vertical h-center" style={shStyles.view}>
            <Title style={shStyles.title}>· Homework Contents</Title>
            <Divider styleName="line" style={shStyles.divider}/>
          </View>
          <View>
            <Text style={shStyles.homeworkContent}>{homework.description}</Text>
          </View>

      </Screen>
    );
  }
};
