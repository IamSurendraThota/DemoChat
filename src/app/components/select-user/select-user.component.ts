import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as firebase from 'firebase';
import { Contact } from 'src/app/model/contact';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectUserComponent implements OnInit {

  public contactsRef = firebase.database().ref('contacts/');
  public contacts: Contact[] = [];

  constructor(public popoverController: PopoverController, ) {
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
      this.contacts = contactsList;
      console.log(this.contacts);
    });
  }

  ngOnInit() { }

  public goToUserChat(contact: Contact) {
    this.popoverController.dismiss(contact);
  }

}
