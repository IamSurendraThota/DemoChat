import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OneToOneChatPage } from './one-to-one-chat.page';
import { ComponentModule } from '../components/component.module';
import { File } from '@ionic-native/file/ngx';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { IonicImageLoader } from 'ionic-image-loader';

const routes: Routes = [
  {
    path: '',
    component: OneToOneChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentModule,
    IonicImageLoader,
    IonicModule,
        NgCircleProgressModule.forRoot({
          radius: 100,
          outerStrokeWidth: 16,
          innerStrokeWidth: 8,
          outerStrokeColor: "#78C000",
          innerStrokeColor: "#C7E596",
          animationDuration: 300
        }),
    RouterModule.forChild(routes)
  ],
  providers: [File],
  declarations: [OneToOneChatPage]
})
export class OneToOneChatPageModule { }
