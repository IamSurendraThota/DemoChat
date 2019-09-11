import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsPopoverComponent } from './contacts-popover/contacts-popover.component';
import { IonicModule } from '@ionic/angular';
import { Contact } from '../model/contact';
import { ChatService } from '../service/chat.service';
import { MomentPipe } from '../pipe/moment.pipe';
import { AttachmentPopoverComponent } from './attachment-popover/attachment-popover.component';
import { Camera } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader.component';
import { IonicImageLoader } from 'ionic-image-loader';
import { ContactsService } from '../service/contacts.service';
import { SelectUserComponent } from './select-user/select-user.component';



@NgModule({
  declarations: [ContactsPopoverComponent, SelectUserComponent, MomentPipe, AttachmentPopoverComponent, SkeletonLoaderComponent],
  imports: [
    CommonModule,
    IonicModule,
    IonicImageLoader
  ],
  providers: [ChatService, Camera, WebView, FilePath, ContactsService],
  exports: [MomentPipe, SkeletonLoaderComponent],
  entryComponents: [ContactsPopoverComponent, AttachmentPopoverComponent, SelectUserComponent]
})
export class ComponentModule {

  goToUserChat(contact: Contact) {

  }
}
