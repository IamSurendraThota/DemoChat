import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Contact } from 'src/app/model/contact';
import * as firebase from 'firebase';
import { PopoverController } from '@ionic/angular';
import * as moment from 'moment';
import { Conversation } from 'src/app/model/conversation';
import { NavigationExtras, Router } from '@angular/router';
import { ContactsService } from 'src/app/service/contacts.service';


@Component({
  selector: 'app-contacts-popover',
  templateUrl: './contacts-popover.component.html',
  styleUrls: ['./contacts-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactsPopoverComponent implements OnInit {

  //remove harcode
  private currentUser: Contact;

  public contacts: Contact[] = [];

  public conversationRef: firebase.database.Reference;

  public contactsRef = firebase.database().ref('contacts/');

  constructor(
    public contactsService: ContactsService,
    public popoverController: PopoverController,
    public router: Router) {

    this.contactsRef.once('value', contacts => {
      let contactsList = [];
      contacts.forEach(data => {
        contactsList.push({
          email: data.val().email,
          firstname: data.val().firstname,
          imageurl: data.val().imageurl,
          lastname: data.val().lastname,
          uid: data.val().uid,
          timestamp: data.val().timestamp
        })
      });
      this.contactsService.getCurrentUser().then((currentUser) => {
        this.currentUser = currentUser;
        this.conversationRef = firebase.database().ref('conversations/' + this.currentUser.uid);

        this.contacts = contactsList.filter(contact => contact.uid !== this.currentUser.uid);
      });
      console.log(this.contacts);
    });
  }

  ngOnInit() { }

  public goToUserChat(contact: Contact) {
    this.getChatConversationByUID(contact.uid).then((chatResponse) => {
      const navigationExtras: NavigationExtras = {
        state: {
          selectedConversation: chatResponse,
          selectedContact: contact
        }
      };
      this.router.navigate(['one-to-one-chat'], navigationExtras);
      this.popoverController.dismiss();
    });

  }

  private getChatConversationByUID(userId: string): Promise<Conversation> {
    let cSnapshot: firebase.database.DataSnapshot;

    return new Promise((resolve, reject) => {
      this.conversationRef.orderByChild('recipient').equalTo(userId).once('value', conversationSnapshot => {
        if (conversationSnapshot.exists()) {
          cSnapshot = conversationSnapshot;
          resolve(this.getChatConversationFromSnapshot(cSnapshot));
        } else {
          this.conversationRef.orderByChild('sender').equalTo(userId).once('value', conversationSnapshot => {
            if (conversationSnapshot.exists()) {
              cSnapshot = conversationSnapshot;
              resolve(this.getChatConversationFromSnapshot(cSnapshot));
            } else {
              resolve(null);
            }
          });
        }
      });
    });

  }

  private getChatConversationFromSnapshot(conversationSnapshot: firebase.database.DataSnapshot): Conversation {
    let conversation: Conversation[] = [];

    if (conversationSnapshot === null) {
      return null
    } else {
      conversationSnapshot.forEach(data => {
        conversation.push({
          recipient_fullname: data.val().recipient_fullname,
          sender: data.val().sender,
          sender_fullname: data.val().sender_fullname,
          channelType: data.val().channelType,
          isNew: data.val().isNew,
          timestamp: data.val().timestamp,
          key: data.key,
          lastMessageText: data.val().lastMessageText,
          recipient: data.val().recipient,
        })
      });

      if (conversation && conversation.length > 0) {
        return conversation[0];
      }
    }


  }

}
