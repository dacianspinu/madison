import React, { Component } from 'react';
import {Dimensions, StyleSheet, } from 'react-native';

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

import { connect } from 'react-redux';
import { navigatePush } from '../../../reducers/redux';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const styles = {
  content: {
    marginTop: 20,
  },
};

class ConversationDetailsScene extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.goToConversation = this.goToConversation.bind(this);
  }

  goToConversation() {
      const propsObject = this.props;
      const grade = {};
      grade.key = "ConversationDetails";
      grade.title = "Radulescu Vlad";

      propsObject.onButtonPress(grade);
  }


  render() {
    const { onButtonPress } = this.props;

    return (
      <Screen>
        <NavigationBar title="Radulescu Vlad"  />
          <View styleName="horizontal" style={styles.content}>
            <Button styleName="confirmation" onPress={() => this.goToConversation()}>
              <Row>
                <View styleName="vertical">
                  <View styleName="horizontal space-between">
                    <Caption>Rădulescu Vlad said ...</Caption>
                    <Caption>27.06.2017</Caption>
                  </View>
                  <Text styleName="multiline">Text for conversation</Text>
                </View>
              </Row>
            </Button>
          </View>
          <View styleName="horizontal" style={styles.content}>
            <Button styleName="confirmation" onPress={() => this.goToConversation()}>
              <Row>
                <View styleName="vertical">
                  <View styleName="horizontal space-between">
                    <Caption>You said ...</Caption>
                    <Caption>27.06.2017</Caption>
                  </View>
                  <Text styleName="multiline">First Text in a series of messages</Text>
                </View>
              </Row>
            </Button>
          </View>
      </Screen>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (type) => {
    dispatch(navigatePush({
      key: type.key,
      title: type.title,
    }, { type }));
  },
});

export default connect(
	undefined,
	mapDispatchToProps
)(ConversationDetailsScene);
