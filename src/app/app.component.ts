import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

declare var cordova;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      this.initializeLocalNotifications();
      this.initializeOneSignal();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  initializeOneSignal(){
    let vm=this;
    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      // running some code in the background when app is kill, then push local notification
      vm.setNotification();
    };

    window["plugins"].OneSignal
      .startInit("713dacdb-03d2-40ba-84ef-010e219e007e", "YOUR_GOOGLE_PROJECT_NUMBER_IF_ANDROID")
      .handleNotificationOpened(notificationOpenedCallback)
      .inFocusDisplaying(window["plugins"].OneSignal.OSInFocusDisplayOption.None)
      .handleNotificationReceived(notificationOpenedCallback)
      .endInit();

  }
  initializeLocalNotifications() {
    var vm = this;
    console.log("--initializeLocalNotifications--1");
    // this.checkLocalNotificationPermission();
    cordova.plugins.notification.local.on("click", function (obj) {
      console.log("--initializeLocalNotifications--2 click", obj);


    });

    cordova.plugins.notification.local.on("trigger", (res) => {
      console.log("--initializeLocalNotifications--3 auth trigger", res);

    });
    cordova.plugins.notification.local.getTriggered(function (notifications) {

    });
  }
  setNotification() {
    let notifications = [];
    let template = {
      id: 1,
      title: 'Good weather in your area',
      launch: true,
      foreground: true,
      trigger: {at: new Date(new Date().getTime() + 3600)},
    }
    notifications.push(template)
    cordova.plugins.notification.local.schedule(notifications);
  }
}

