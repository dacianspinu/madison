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


const styles = {
  // App container
  container: {
    flex: 1,                            // Take up all screen
    backgroundColor: '#F65A41',         // Background color
  },
  // Tab content container
  content: {
  },
  // Content header
  header: {
    color: 'white',
    textAlign: 'center',               // White color
    fontFamily: 'Avenir',               // Change font family
    fontSize: 20,                       // Bigger font size
    marginTop: 40
  },
  // Content text
  text: {
    marginHorizontal: 20,               // Add horizontal margin
    color: 'white',                   // Semi-transparent text
    textAlign: 'center',                // Center
    fontFamily: 'Avenir',
    fontSize: 18,
    marginBottom: 20
  },
};

const thirdTab = "GRADES";

class AnnouncementsScene extends Component {
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
        <NavigationBar title="Announcements" />
        <View>
          <Row>
            <Image
              styleName="small-avatar top"
              source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
            />
            <View styleName="vertical">
              <View styleName="horizontal space-between">
                <Subtitle>SECRETARIAT</Subtitle>
                <Caption>20 minutes ago</Caption>
              </View>
              <Text styleName="multiline">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap. Hashtag typewriter banh mi, squid keffiyeh High.</Text>
            </View>
          </Row>
          <Row>
            <Image
              styleName="small-avatar top"
              source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
            />
            <View styleName="vertical">
              <View styleName="horizontal space-between">
                <Subtitle>SECRETARIAT</Subtitle>
                <Caption>20 minutes ago</Caption>
              </View>
              <Text styleName="multiline">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap. Hashtag typewriter banh mi, squid keffiyeh High.</Text>
            </View>
          </Row>
          <Row>
            <Image
              styleName="small-avatar top"
              source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
            />
            <View styleName="vertical">
              <View styleName="horizontal space-between">
                <Subtitle>SECRETARIAT</Subtitle>
                <Caption>20 minutes ago</Caption>
              </View>
              <Text styleName="multiline">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap. Hashtag typewriter banh mi, squid keffiyeh High.</Text>
            </View>
          </Row>
          <Row>
            <Image
              styleName="small-avatar top"
              source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
            />
            <View styleName="vertical">
              <View styleName="horizontal space-between">
                <Subtitle>SECRETARIAT</Subtitle>
                <Caption>20 minutes ago</Caption>
              </View>
              <Text styleName="multiline">Banjo tote bag bicycle rights, High Life sartorial cray craft beer whatever street art fap. Hashtag typewriter banh mi, squid keffiyeh High.</Text>
            </View>
          </Row>
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
)(AnnouncementsScene);
