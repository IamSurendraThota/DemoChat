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



@NgModule({
  declarations: [ContactsPopoverComponent, MomentPipe, AttachmentPopoverComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  providers: [ChatService, Camera, WebView, FilePath],
  exports: [MomentPipe],
  entryComponents: [ContactsPopoverComponent, AttachmentPopoverComponent]
})
export class ComponentModule {

  goToUserChat(contact: Contact) {

  }
}
