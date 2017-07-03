import React, { Component } from 'react';
import {Dimensions, StyleSheet, AsyncStorage, ScrollView} from 'react-native';

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
import Database from '../../../database/Database';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

const styles = {
  content: {
    marginTop: 20,
    marginBottom: 20
  },
};

let student = "";

class ConversationsScene extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.goToConversation = this.goToConversation.bind(this);
    this.state = {
      conversations: []
    }
  }

  async componentDidMount() {
    this.getConversations()
  }

  goToConversation(conversation) {
    const { onButtonPress } = this.props;
    let newConversationDetails = {
      key: "ConversationDetailsScene",
      title: conversation.teacher.name,
      teacher: conversation.teacher,
      new: false,
      conversationId: conversation.id
    }

    onButtonPress(newConversationDetails);
  }

  goToCreateConversation() {
    const propsObject = this.props;

    const conversation = {};
    conversation.key = "CreateNewConversationScene";
    conversation.title = "Create new conversation";

    propsObject.onButtonPress(conversation);
  }

  renderConversationRow(conversation) {
    let lastMessage = conversation.messages.reverse()[0];
    if (lastMessage.sender === JSON.parse(student).firstName + ' ' + JSON.parse(student).lastName) {
      lastMessage.sender = "You"
    }
    return (
      <View>
        <Button styleName="confirmation" onPress={() => this.goToConversation(conversation)}>
          <Row>
            <View styleName="vertical">
              <View styleName="horizontal space-between">
                <Subtitle>{conversation.teacher.name}</Subtitle>
                <Caption>{lastMessage.sentAt}</Caption>
              </View>
              <Text styleName="multiline">{lastMessage.sender}: {lastMessage.content}</Text>
            </View>
          </Row>
        </Button>

        <Divider styleName="line"></Divider>
      </View>
    )
  }

  async getConversations() {
    let self = this;
    student = await AsyncStorage.getItem('currentStudent');
    let promises = await Promise.all([Database.getCurrentStudentConversations(JSON.parse(student).uid)]);


    promises[0].on('value', function(snapshot) {
      let conversationIds = snapshot.val();
      let conversations = [];

      if (conversationIds) {
        conversationIds = Object.keys(conversationIds).map(function (key) { return conversationIds[key]; });
        let numberOfConversations = conversationIds.length - 1;
        let iterator = 0;
        conversationIds.forEach(async function(conversationId) {
          if (typeof conversationId === 'object') {
            let conversation = await Database.getConversationMessages(conversationId.conversationId);
            conversation = conversation.val();
            conversation.id = conversationId.conversationId;
            conversation.messages = Object.keys(conversation.messages).map(function (key) { return conversation.messages[key]; });
            conversations.push(conversation);
            iterator++;
            if (iterator === numberOfConversations) {
              self.setState({conversations: conversations});
            }
          }
        });

      }
    });
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
              <ListView
                data={ this.state.conversations.reverse() }
                renderRow = {conversation => this.renderConversationRow(conversation)}>
              </ListView>
      </Screen>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (conversation) => {
    dispatch(navigatePush({
      key: conversation.key,
      title: conversation.title,
    }, { conversation }));
  },
});

export default connect(
	undefined,
	mapDispatchToProps
)(ConversationsScene);
