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
  Text,
  TextInput
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
const moment = require('moment');

let student = "";
const styles = {
  content: {
    height: 60
  },
  startConversationButton: {
    marginBottom: 10,
    marginTop: 10,
    width: 60/100 * width,
    backgroundColor: "#22C064",
  },
  messageBox: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width
  },
  scrollViewWrapper: {
    height: height - 185
  },
  message: {
    marginBottom: 10,
    marginTop: 0
  }
};

class ConversationDetailsScene extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }

    this.sendMessage = this.sendMessage.bind(this);
    this.renderMessageRow = this.renderMessageRow.bind(this);
  }

  async sendMessage() {
    const teacherId = this.props.conversation.teacher.id;
    const message = {
      sender: JSON.parse(student).firstName + ' ' + JSON.parse(student).lastName,
      content: this.state.messageContent,
      sentAt: moment().format('D.MM.YYYY')
    }

    const conversationUid = this.props.conversation.conversationId;
    this.setState({messageContent: ""});
    Database.addMessageToConversation(conversationUid, message);
    if (this.props.conversation.new) {
      Database.updateConversationsListForStudent(conversationUid, JSON.parse(student).uid);
      Database.updateConversationsListForTeacher(conversationUid, this.props.conversation.teacher.id);
      Database.updateConversationWithParticipants(conversationUid, this.props.conversation.teacher, student);
      Database.updateLastMessagesSyncForStudent(JSON.parse(student).uid);
      this.props.conversation.new = false;
    } else {
      Database.updateLastMessagesSyncForStudent(JSON.parse(student).uid);
    }
  }

  async componentWillMount() {
    await this.getMessagesForConversation(this.props.conversation.conversationId);
  }

  async getMessagesForConversation(conversationId) {
    let self = this;
    student = await AsyncStorage.getItem('currentStudent');
    let promises = await Promise.all([Database.getMessagesForConversation(conversationId)]);

    promises[0].on('value', function(snapshot) {
      messages = snapshot.val();
      if (messages) {
        messages = Object.keys(messages).map(function (key) { return messages[key]; });
        self.setState({messages: messages});
      }
    });
  }

  renderMessageRow(message) {
    let currentStudentName = JSON.parse(student).firstName + ' ' + JSON.parse(student).lastName;
    if (message.sender === currentStudentName) {
        message.sender = "You"
    }
    return (
      <View>
        <Divider styleName="line"></Divider>
        <Row>
          <View styleName="vertical">
            <View styleName="horizontal space-between">
              <Caption>{message.sender} said ...</Caption>
              <Caption>{message.sentAt}</Caption>
            </View>
            <Text styleName="multiline">{message.content}</Text>
          </View>
        </Row>
        <Divider styleName="line" style={{marginBottom: 10}}></Divider>
      </View>
    )
  }

  render() {
    const { onButtonPress } = this.props;

    return (
      <Screen>
        <NavigationBar title={this.props.conversation.title}  />
        <View style = {styles.scrollViewWrapper}>
          <ScrollView>
            <ListView
              data={ this.state.messages }
              renderRow = {message => this.renderMessageRow(message)}>
            </ListView>
          </ScrollView>
        </View>
        <Divider styleName="line"></Divider>
        <View style = {styles.messageBox}>
          <TextInput multiline={true} style = {styles.content} autoCorrect = {false} onChangeText={(messageContent) => this.setState({messageContent})} defaultValue={this.state.messageContent}></TextInput>
          <View styleName="horizontal h-center">
            <Button styleName="dark"  style={styles.startConversationButton} onPress={() => this.sendMessage('lab')}>
              <Icon name="edit" style = {{color: 'white'}}/>
              <Text style = {{color: 'white'}}>SEND</Text>
            </Button>
          </View>
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
