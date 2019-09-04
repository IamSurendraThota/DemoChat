import { Injectable } from '@angular/core';
import { Contact } from '../model/contact';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  public getCurrentUser(): Contact {
    let currentUser: Contact = {
      email: "test@gmail.com",
      firstname: "User",
      imageurl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
      lastname: '4',
      timestamp: 1516276972508,
      uid: "-Llkbus5QJVOx3SuIhB3"
    };

    return currentUser;
  }
}
