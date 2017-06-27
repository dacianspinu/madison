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
  }

  render() {
    const { onButtonPress } = this.props;

    return (
      <Screen>
        <NavigationBar title="Conversations"  />
          <View styleName="horizontal h-center">
            <Button styleName="dark" style={styles.content}>
              <Icon name="comment" />
              <Text>START NEW CONVERSATION</Text>
            </Button>
          </View>
          <View styleName="horizontal" style={styles.content}>
            <Button styleName="confirmation">
              <Row>
                <Image
                  styleName="small-avatar top"
                  source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
                />
                <View styleName="vertical">
                  <View styleName="horizontal space-between">
                    <Subtitle>Dustin Malone</Subtitle>
                    <Caption>20 minutes ago</Caption>
                  </View>
                  <Text styleName="multiline">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap. Hashtag typewriter banh mi, squid keffiyeh High.</Text>
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
