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

class ThinkScene extends Component {
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
        <NavigationBar title="Semester Overview" />
        <View style={styles.container}>
          <Tabs>
            {/* First tab */}
            <View title="TEACHERS" style={styles.content}>
              <TouchableOpacity onPress={() => onButtonPress({key: "HomeworkScene", title: "Tema ML"})}>
                <Row>
                <Image
                  styleName="small-avatar top"
                  source={{ uri: 'https://shoutem.github.io/img/ui-toolkit/examples/image-11.png' }}
                />
                <View styleName="vertical">
                  <View styleName="horizontal space-between">
                    <Subtitle>Radulescu Vlad</Subtitle>
                    <Caption>ACSO</Caption>
                  </View>
                  <Caption styleName="multiline">Teacher short bio</Caption>
                </View>
                </Row>
              </TouchableOpacity>
            </View>
            {/* Second tab */}
            <View title="CLASSES" style={styles.content}>
              <Text style={styles.header}>
                You lucky guy ...
              </Text>
              <Text style={styles.text}>
                You have no tests these days
              </Text>
            </View>
            {/* Third tab */}
            <View title={thirdTab} style={styles.content}>
              <Row styleName="small">
                <Icon name="laptop" />
                <View styleName="vertical">
                  <View styleName="horizontal space-between">
                    <Subtitle>ACSO</Subtitle>
                    <Caption>7.50</Caption>
                  </View>
                  <Caption>Examen/Test/Tema     ·    23.05.2017</Caption>
                </View>
              </Row>
              <Row styleName="small">
                <Icon name="news" />
                <View styleName="vertical">
                  <View styleName="horizontal space-between">
                    <Subtitle>ACSO</Subtitle>
                    <Caption>7.50</Caption>
                  </View>
                  <Caption>Examen/Test/Tema     ·    23.05.2017</Caption>
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
)(ThinkScene);
