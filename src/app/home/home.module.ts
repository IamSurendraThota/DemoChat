import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ComponentModule } from '../components/component.module';
import { ChatService } from '../service/chat.service';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  imports: [
    CommonModule,
    ComponentModule,
    FormsModule,
    IonicImageLoader,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [ChatService],
  declarations: [HomePage]
})
export class HomePageModule { }
