import * as firebase from "firebase";

class Database {
    static initializeApplication() {
      const firebaseConfig = {
        apiKey: "AIzaSyDwZZdrKUPepuOMDAghffLRV0FEHuiLX5k",
        authDomain: "madison-94c98.firebaseapp.com",
        databaseURL: "https://madison-94c98.firebaseio.com",
        projectId: "madison-94c98",
        storageBucket: "madison-94c98.appspot.com",
        messagingSenderId: "149029231877"
      };

      const firebaseApp = firebase.initializeApp(firebaseConfig);

      return firebaseApp;
    };

    /**
     * Sets a users mobile number
     * @param userId
     * @param mobile
     * @returns {firebase.Promise<any>|!firebase.Promise.<void>}
     */
    static setUserMobile(userId, mobile) {

        let userMobilePath = "/user/" + userId + "/details";

        return firebase.database().ref(userMobilePath).set({
            mobile: mobile
        })
    };

    static getLoggedInStudent(userId) {
      let path = "/students/" + userId;

      return firebase.database().ref(path).once('value');
    };

    static getLoggedInStudentGroupSchedule(groupId) {
      let path = "/groups/" + groupId;

      return firebase.database().ref(path).once('value');
    };

    static getTeacherById(teacherId) {
      let path = "/teachers/" + teacherId;

      return firebase.database().ref(path).once('value');
    };

    static getLoggedInStudentHomeworks(groupId) {
      let path = "/groups/" + groupId + '/homeworks';

      return firebase.database().ref(path).once('value');
    };

    static getTeachers() {
      let path = "/teachers";

      return firebase.database().ref(path).once('value');
    }

}

module.exports = Database;
