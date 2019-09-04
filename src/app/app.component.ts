import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyAz5mlUpyDpd9_45Flhjz1rMneFGuNHdZg',
  authDomain: 'testchat2-cfac0.firebaseapp.com',
  databaseURL: 'https://testchat2-cfac0.firebaseio.com',
  projectId: 'testchat2-cfac0',
  storageBucket: 'gs://testchat2-cfac0.appspot.com/',
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    firebase.initializeApp(config);
  }
}
