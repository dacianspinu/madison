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

const thirdTab = "GRADES";

class ConversationsScene extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.goToConversation = this.goToConversation.bind(this);
  }

  goToConversation() {
      const propsObject = this.props;
      const conversation = {};
      conversation.key = "ConversationDetailsScene";
      conversation.title = "Radulescu Vlad";

      propsObject.onButtonPress(conversation);
  }

  goToCreateConversation() {
    const propsObject = this.props;

    const conversation = {};
    conversation.key = "CreateNewConversationScene";
    conversation.title = "Create new conversation";

    propsObject.onButtonPress(conversation);
  }


  render() {
    const { onButtonPress } = this.props;

    return (
      <Screen>
        <NavigationBar title="Conversations"  />
          <View styleName="horizontal h-center">
            <Button styleName="dark" style={styles.content} onPress={() => this.goToCreateConversation()}>
              <Icon name="comment" />
              <Text>START NEW CONVERSATION</Text>
            </Button>
          </View>
          <View styleName="horizontal" style={styles.content}>
            <Button styleName="confirmation" onPress={() => this.goToConversation()}>
              <Row>
                <View styleName="vertical">
                  <View styleName="horizontal space-between">
                    <Subtitle>Rădulescu Vlad</Subtitle>
                    <Caption>27.06.2017</Caption>
                  </View>
                  <Text styleName="multiline">Text for conversation</Text>
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
)(ConversationsScene);
