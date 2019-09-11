import { Component, ViewEncapsulation } from '@angular/core';
import * as firebase from 'firebase';
import { Conversation } from '../model/conversation';
import * as moment from 'moment';
import { PopoverController } from '@ionic/angular';
import { ContactsPopoverComponent } from '../components/contacts-popover/contacts-popover.component';
import { NavigationExtras, Router } from '@angular/router';
import { Contact } from '../model/contact';
import { ChatService } from '../service/chat.service';
import { ContactsService } from '../service/contacts.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomePage {


  private currentUser: Contact;

  public conversations: Conversation[] = [];

  public ref: firebase.database.Reference;

  constructor(
    public popoverController: PopoverController,
    public chatService: ChatService,
    public contactService: ContactsService,
    public router: Router) {

    this.contactService.getCurrentUser().then((currentUser) => {
      this.currentUser = currentUser;
      this.ref = firebase.database().ref('conversations/' + this.currentUser.uid);
      this.ref.on('value', conversations => {
        this.conversations = [];
        conversations.forEach(data => {
          this.conversations.push({
            key: data.key,
            channelType: data.val().channelType,
            isNew: data.val().isNew,
            lastMessageText: data.val().lastMessageText,
            recipient: data.val().recipient,
            recipient_fullname: data.val().recipient_fullname,
            sender: data.val().sender,
            sender_fullname: data.val().sender_fullname,
            timestamp: data.val().timestamp
          })
        });
        this.conversations.sort((c1, c2) => c2.timestamp - c1.timestamp);
        console.log(this.conversations);
      });
    }, (error) => {

    });
  }

  async openContacts(ev: any) {
    const popover = await this.popoverController.create({
      component: ContactsPopoverComponent,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  goToConversation(chat: Conversation) {
    this.getRecipientContactbyConversationID(chat).then((selectedContact) => {
      const navigationExtras: NavigationExtras = {
        state: {
          selectedConversation: chat,
          selectedContact: selectedContact
        }
      };
      this.router.navigate(['one-to-one-chat'], navigationExtras);
    });

  }

  private getRecipientContactbyConversationID(con: Conversation): Promise<Contact> {
    return new Promise((resolve, reject) => {
      let recipentUID: string;
      if (con.recipient === this.currentUser.uid) {
        recipentUID = con.sender;
      } else {
        recipentUID = con.recipient;
      }
      var contactRef = firebase.database().ref('contacts');

      contactRef.orderByChild('uid').equalTo(recipentUID).once('value', contacts => {
        resolve(this.getFirstContact(contacts));
      });


    });
  }

  private getFirstContact(contacts: firebase.database.DataSnapshot): Contact {
    var contact: Contact[] = [];
    if (contacts === null) {
      return null
    } else {
      contacts.forEach(data => {
        contact.push({
          email: data.val().email,
          firstname: data.val().firstname,
          imageurl: data.val().imageurl,
          lastname: data.val().lastname,
          uid: data.val().uid,
          timestamp: data.val().timestamp
        })
      });
    }
    if (contact && contact.length > 0) {
      return contact[0];
    } else {
      return null;
    }
  }

  public getUserNameByConversation(conversation: Conversation): string {
    if (this.currentUser.uid === conversation.sender) {
      return conversation.recipient_fullname;
    } else {
      return conversation.sender_fullname;
    }
  }

  public getContactByUID(conversation: Conversation) {
    if (this.currentUser.uid === conversation.sender) {
      return this.contactService.getContactByUid(conversation.recipient);
    } else {
      return this.contactService.getContactByUid(conversation.sender);
    }
  }
}
