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
    };

    static getClassesForCurrentStudent(year) {
      const thisDate = new Date();
      const currentMonth = thisDate.getMonth();
      let semester;

      if (currentMonth >= 9 && currentMonth <= 2) {
        semester = 0;
      } else {
        semester = 1;
      }

      let path = '/courses/years/' + (year - 1) + '/semesters/' + semester;
      console.log(path);

      return firebase.database().ref(path).once('value');
    };

    static saveHomeworkToStudentProfile(studentId, data) {
      let path = "/students/" + studentId + '/homeworks';

      return firebase.database().ref(path).push(data);
    };

    static saveTestToStudentProfile(studentId, data) {
      let path = "/students/" + studentId + '/tests';

      return firebase.database().ref(path).push(data);
    };

    static getCurrentStudentHomeworks(studentId) {
      let path = "/students/" + studentId + '/homeworks';

      return firebase.database().ref(path).once('value');
    };

    static getCurrentStudentTests(studentId) {
      let path = "/students/" + studentId + '/tests';

      return firebase.database().ref(path).once('value');
    };

    static getCurrentStudentExams(year) {
      const thisDate = new Date();
      const currentMonth = thisDate.getMonth();
      let semester;

      if (currentMonth >= 9 && currentMonth <= 2) {
        semester = 1;
      } else {
        semester = 2;
      }

      let path = "/exams/semester/" + semester + "/years/" + (year-1);

      console.log(path);

      return firebase.database().ref(path).once('value');
    };

    static saveGradeToStudentProfile(studentId, data) {
      let path = "/students/" + studentId + '/grades';

      return firebase.database().ref(path).push(data);
    };

    static getLoggedInStudentGrades(studentId) {
      let path = "/students/" + studentId + '/grades';

      return firebase.database().ref(path).once('value');
    }

}

module.exports = Database;
