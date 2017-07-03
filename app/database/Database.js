import * as firebase from "firebase";
const moment = require('moment');
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

    static getLoggedInStudent(userId) {
      let path = "/students/" + userId;

      return firebase.database().ref(path).once('value');
    };

    static getLoggedInStudentGroupSchedule(groupId, year) {
      let path = "/groups/" + year + groupId;
      console.log(path)

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

      return firebase.database().ref(path);
    };

    static getCurrentStudentTests(studentId) {
      let path = "/students/" + studentId + '/tests';

      return firebase.database().ref(path);
    };

    static getCurrentStudentExams(year) {
      let path = "/exams/years/" + (year-1);

      return firebase.database().ref(path);
    };

    static saveGradeToStudentProfile(studentId, data) {
      let path = "/students/" + studentId + '/grades';

      return firebase.database().ref(path).push(data);
    };

    static getLoggedInStudentGrades(studentId) {
      let path = "/students/" + studentId + '/grades';

      return firebase.database().ref(path);
    };

    static getAnnouncementsForStudentYear(year) {
      let path = "/announcements/year_" + year;

      return firebase.database().ref(path);
    }

    static getAnnouncementsForAllStudents() {
      let path = "/announcements/all";

      return firebase.database().ref(path);
    };

    static createConversation(studentUid) {
      let conversationsPath = "/conversations";
      return firebase.database().ref(conversationsPath).push().key;
    };

    static addMessageToConversation(conversationUid, message) {
      let path = "/conversations/" + conversationUid + "/messages";

      return firebase.database().ref(path).push(message);
    };

    static getMessagesForConversation(conversationUid) {
      let path = "/conversations/" + conversationUid + "/messages";
      return firebase.database().ref(path);
    };

    static updateConversationsListForStudent(conversationUid, studentId) {
      let path = "/students/" + studentId + "/conversations";

      let conversationObject = {
        conversationId: conversationUid
      };

      return firebase.database().ref(path).push(conversationObject);
    };

    static getCurrentStudentConversations(studentId) {
      let path = "/students/" + studentId + "/conversations";

      return firebase.database().ref(path);
    };

    static getConversationMessages(conversationId) {
      let path = "/conversations/" + conversationId;

      return firebase.database().ref(path).once('value');
    }

    static updateConversationWithParticipants(conversationUid, teacher, student) {
      let path = "/conversations/" + conversationUid;

      return firebase.database().ref(path).update({
        "teacher": teacher,
        "student": JSON.parse(student)
      })
    }

    static updateLastMessagesSyncForStudent(studentUid) {
      let path = "/students/" + studentUid + "/conversations";
      return firebase.database().ref(path).update({
        "lastUpdate": firebase.database.ServerValue.TIMESTAMP
      })
    };

    static updateConversationsListForTeacher(conversationUid, teacherId) {
      let path = "/teachers/" + teacherId + "/conversations";

      let conversationObject = {
        conversationId: conversationUid
      };

      return firebase.database().ref(path).push(conversationObject);
    }
}

module.exports = Database;
