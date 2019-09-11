import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Contact } from '../model/contact';
import { PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { SelectUserComponent } from '../components/select-user/select-user.component';

const STORAGE_CURRENT_USER = 'storecurrentuser';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  public contactsRef = firebase.database().ref('contacts/');
  public contacts: Contact[] = [];

  constructor(private storage: Storage,
    public popoverController: PopoverController) {
    this.loadContacts();
  }

  public loadContacts() {
    if (this.contacts.length === 0) {
      this.contactsRef.on('value', contacts => {
        this.contacts = [];
        contacts.forEach(data => {
          this.contacts.push({
            email: data.val().email,
            firstname: data.val().firstname,
            imageurl: data.val().imageurl,
            lastname: data.val().lastname,
            uid: data.val().uid,
            timestamp: data.val().timestamp
          })
        });
        console.log(this.contacts);
      });
    }
  }

  public getContactByUid(UserId: string): Contact {
    if (this.contacts) {
      return this.contacts.find(x => x.uid === UserId);
    } else {
      return null;
    }
  }

  public getCurrentUser(): Promise<Contact> {
    return new Promise((resolve, reject) => {
      this.storage.get(STORAGE_CURRENT_USER).then(async (data) => {

        if (data) {
          resolve(JSON.parse(data));
        } else {
          let ev = {
            target: {
              getBoundingClientRect: () => {
                return {
                  top: 100
                };
              }
            }
          };

          const popover = await this.popoverController.create({
            component: SelectUserComponent,
            backdropDismiss: false,
            keyboardClose: true,
            translucent: true,
            cssClass: 'custom-popover'
          });

          popover.onDidDismiss()
            .then((result) => {
              console.log(result);
              if (result.data) {
                let selectedContact = result.data as Contact;
                this.saveCurrentUserOnStorage(selectedContact);
                resolve(selectedContact);
              } else {
                reject('User Selection failed');
              }
            });

          await popover.present();
        }


      });

    });

    // let currentUser: Contact = {
    //   email: "test@gmail.com",
    //   firstname: "User",
    //   imageurl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    //   lastname: '4',
    //   timestamp: 1516276972508,
    //   uid: "-Llkbus5QJVOx3SuIhB3"
    // };

    // return currentUser;
  }

  saveCurrentUserOnStorage(selectedUser: Contact): Promise<Contact> {
    return new Promise((resolve) => {
      this.storage.get(STORAGE_CURRENT_USER).then((res) => {
        if (res) {
          this.storage.remove(STORAGE_CURRENT_USER);
        }
      }).then(() => {
        this.storage.set(STORAGE_CURRENT_USER, JSON.stringify(selectedUser));
        resolve();
      });
    });
  }
}
