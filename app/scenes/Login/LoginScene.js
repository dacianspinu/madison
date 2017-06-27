import React, { Component } from 'react';
import {Dimensions, StyleSheet, Image, AsyncStorage} from 'react-native';

import * as firebase from 'firebase';

import {
  ListView,
  Tile,
  Title,
  Subtitle,
  TouchableOpacity,
  Screen,
  Divider,
  TextInput,
  FormGroup,
  View,
  Caption,
  Button,
  Text,
  Icon
} from '@shoutem/ui';

import { connect } from 'react-redux';
import { navigatePush } from '../../reducers/redux';

import Database from '../../database/Database';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height



const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center',
    width: width
  },
  logo: {
    height: 20/100 * height,
    width: 100/100 * width,
    resizeMode: 'contain',
  },

});

const innerWrapper =  {
  alignItems: 'center',
  justifyContent: 'center',

};

const formInput = {
  marginTop: 20,
  height: 50,
  width: 90/100 * width,
  marginLeft: 5/100 * width
};

const button = {
  marginTop: 40
}

class LoginScene extends Component {
  static propTypes = {
    navigateToOverview: React.PropTypes.func
  }

  constructor(props) {
    super(props);

    this.state = {
      emailAddress: '',
      accountPassword: ''
    };

    this.authenticateUser = this.authenticateUser.bind(this);
    this.setUserInStorage = this.setUserInStorage.bind(this);
  }

  authenticateUser(email, pass) {
    var self = this;
    firebase.auth().signInWithEmailAndPassword(email, pass)
      .then(function(response) {
        Database.getLoggedInStudent(response.uid).then(function(userSnapshot) {
          const student = userSnapshot.val();
          self.setUserInStorage(student);
        })
      }, function(error) {
        alert(error.message);
      });
  };

  async setUserInStorage(student) {
    const { navigateToOverview } = this.props;
    try {
        await AsyncStorage.setItem('currentStudent', JSON.stringify(student));
        navigateToOverview();
    }
    catch(e){
        console.log('caught error', e);
    }
  }


  render() {
    return (
        <Image source={require('./assets/bg.jpg')} style={styles.backgroundImage}>
          <View styleName="fill-parent" style={innerWrapper}>
            <Image source={require('./assets/logo.png')} style={styles.logo}></Image>
            <TextInput
              placeholder="Username or Email"
              style={formInput}
              onChangeText={(emailAddress) => this.setState({emailAddress})}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              style={formInput}
              secureTextEntry
              onChangeText={(accountPassword) => this.setState({accountPassword})}
            />
            <Button style={button} onPress={() => this.authenticateUser(this.state.emailAddress, this.state.accountPassword)}>
              <Text>LOG IN</Text>
            </Button>
          </View>
        </Image>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  navigateToOverview: () => {
    dispatch(navigatePush({
      key: 'OverviewScene',
      title: 'Overview',
    }, {}));
  },
});


export default connect(
	undefined,
	mapDispatchToProps
)(LoginScene);
