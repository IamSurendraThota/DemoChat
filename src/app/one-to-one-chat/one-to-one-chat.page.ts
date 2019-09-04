import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Conversation } from '../model/conversation';
import * as firebase from 'firebase';
import { Message, MessageType } from '../model/message';
import { Contact } from '../model/contact';
import { ChatService } from '../service/chat.service';
import { IonContent, PopoverController } from '@ionic/angular';
import { AttachmentPopoverComponent } from '../components/attachment-popover/attachment-popover.component';
import { File } from '@ionic-native/file/ngx';

export interface sendAttachments {
  id: number;
  loadPercentage: number;
  subTitle: string;
};


@Component({
  selector: 'app-one-to-one-chat',
  templateUrl: './one-to-one-chat.page.html',
  styleUrls: ['./one-to-one-chat.page.scss'],
})
export class OneToOneChatPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;

  public convsersation: Conversation;
  public selectedUser: Contact;
  public messagesRef: firebase.database.Reference;

  public messagesList: Message[] = [];
  private limit: number = 10;

  public sendAttachments: sendAttachments[] = [];

  public input: string;

  public messagesLength: number;
  //remove harcode
  private currentUser: Contact;
  phone_model = 'iPhone';

  constructor(
    public chatService: ChatService,
    public popoverController: PopoverController,
    private file: File,
    private router: Router) {
    this.currentUser = this.chatService.getCurrentUser();
    if (this.router.getCurrentNavigation().extras.state) {
      this.convsersation = this.router.getCurrentNavigation().extras.state.selectedConversation;
      this.selectedUser = this.router.getCurrentNavigation().extras.state.selectedContact;
      if (this.convsersation) {
        this.messagesRef = firebase.database().ref('messages/' + this.convsersation.key);

        this.messagesRef.on('value', msgs => {
          this.messagesLength = msgs.numChildren();
        });

        this.messagesRef.orderByChild('timestamp').limitToLast(this.limit).on('value', messages => {
          let messagesList = [];
          messages.forEach(message => {
            messagesList.push({
              key: message.key,
              channel_type: message.val().channel_type,
              recipient: message.val().recipient,
              recipient_fullname: message.val().recipient_fullname,
              sender: message.val().sender,
              sender_fullname: message.val().sender_fullname,
              status: message.val().status,
              content: message.val().content,
              timestamp: message.val().timestamp,
              type: message.val().type
            })
          });
          this.messagesList = messagesList;
          setTimeout(() => { this.content.scrollToBottom(); }, 200);
          console.log(this.messagesList);
        });
      }
    }
  }

  ngOnInit() { }

  private loadMessages(extraLimit: number = 0, event?: any) {
    this.limit += extraLimit;
    this.messagesRef.orderByChild('timestamp').limitToLast(this.limit).on('value', messages => {
      let messagesList = [];
      messages.forEach(message => {
        messagesList.push({
          key: message.key,
          channel_type: message.val().channel_type,
          recipient: message.val().recipient,
          recipient_fullname: message.val().recipient_fullname,
          sender: message.val().sender,
          sender_fullname: message.val().sender_fullname,
          status: message.val().status,
          content: message.val().content,
          timestamp: message.val().timestamp,
          type: message.val().type
        })
      });
      this.messagesList = messagesList;

      if (this.messagesList.length == this.messagesLength) {
        event.target.disabled = true;
      }

      if (event) {
        event.target.complete();
      }
      // setTimeout(() => { this.content.scrollToBottom(); }, 200);
      console.log(this.messagesList);
    });
  }

  loadData(event) {
    this.loadMessages(10, event);
  }

  public send(): void {
    if (this.input) {
      var newMessage: Message = {
        channel_type: 'direct',
        sender: this.currentUser.uid,
        sender_fullname: this.currentUser.firstname + ' ' + this.currentUser.lastname,
        recipient: this.selectedUser.uid,
        recipient_fullname: this.selectedUser.firstname + ' ' + this.selectedUser.lastname,
        type: MessageType.Text,
        status: 'sent',
        content: this.input,
        timestamp: +new Date()
      }

      this.sendMessage(newMessage);
      this.input = '';

      setTimeout(() => { this.content.scrollToBottom(); }, 200);
    }
  }

  private sendMessage(newMessage: Message) {
    if (this.convsersation === null) {
      var senderAllConversations = firebase.database().ref('conversations/' + this.currentUser.uid);
      var recieverAllConversations = firebase.database().ref('conversations/' + this.selectedUser.uid);

      var newConversation: Conversation = {
        channelType: 'direct',
        isNew: true,
        lastMessageText: newMessage.content,
        recipient: this.selectedUser.uid,
        recipient_fullname: this.selectedUser.firstname + ' ' + this.selectedUser.lastname,
        sender: this.currentUser.uid,
        sender_fullname: this.currentUser.firstname + ' ' + this.currentUser.lastname,
        timestamp: +new Date()
      }

      senderAllConversations.push(newConversation).then((snap) => {
        newConversation.key = snap.key;
        this.convsersation = newConversation;
        firebase.database().ref('conversations/' + this.selectedUser.uid + '/' + this.convsersation.key).update(this.convsersation);
        this.messagesRef = firebase.database().ref('messages/' + this.convsersation.key);
        this.messagesRef.push(newMessage);
        this.loadMessages();
      })
    } else {
      this.convsersation.isNew = false;
      this.convsersation.lastMessageText = newMessage.content;
      this.convsersation.recipient = this.selectedUser.uid;
      this.convsersation.recipient_fullname = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
      this.convsersation.sender = this.currentUser.uid;
      this.convsersation.sender_fullname = this.currentUser.firstname + ' ' + this.currentUser.lastname;
      this.convsersation.timestamp = +new Date()
      firebase.database().ref('conversations/' + this.currentUser.uid + '/' + this.convsersation.key).update(this.convsersation);
      firebase.database().ref('conversations/' + this.selectedUser.uid + '/' + this.convsersation.key).update(this.convsersation);
      this.messagesRef.push(newMessage);
    }
  }

  public isSender(uID: string): boolean {
    return this.currentUser.uid != uID;
  }

  public async openAttchments(ev) {
    const popover = await this.popoverController.create({
      component: AttachmentPopoverComponent,
      event: ev,
      translucent: true
    });

    popover.onDidDismiss()
      .then((result) => {
        console.log(result);
        if (result.data) {
          this.makeFileIntoBlob(result.data).then((blobFile) => {
            this.uploadToFirebase(blobFile).then((fileSnap) => {
              fileSnap.ref.getDownloadURL().then((downloadUrl) => {
                var newAttachment: Message = {
                  channel_type: 'direct',
                  sender: this.currentUser.uid,
                  sender_fullname: this.currentUser.firstname + ' ' + this.currentUser.lastname,
                  recipient: this.selectedUser.uid,
                  recipient_fullname: this.selectedUser.firstname + ' ' + this.selectedUser.lastname,
                  type: MessageType.Image,
                  status: 'sent',
                  content: downloadUrl,
                  timestamp: + new Date()
                }

                this.sendMessage(newAttachment);
              });
            });
          });
        }
      });
    return await popover.present();
  }

  private uploadToFirebase(_imageBlobInfo): Promise<firebase.storage.UploadTaskSnapshot> {
    console.log("uploadToFirebase");
    let newAttachement: sendAttachments = {
      id: this.sendAttachments.length + 1,
      loadPercentage: 0,
      subTitle: 'Sending Image'
    };
    this.sendAttachments.push(newAttachement);
    return new Promise((resolve, reject) => {
      let fileRef = firebase.storage()
        .ref("images/" + _imageBlobInfo.fileName);
      let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      uploadTask.on(
        "state_changed",
        (_snap: any) => {
          let percentage = (_snap.bytesTransferred / _snap.totalBytes) * 100;
          newAttachement.loadPercentage = percentage;
          console.log(
            "progess " + percentage
          );
        },
        _error => {
          console.log(_error);
          reject(_error);
        },
        () => {
          // completion...
          const index: number = this.sendAttachments.findIndex(x => x.id == newAttachement.id);
          this.sendAttachments.splice(index, 1);
          resolve(uploadTask.snapshot);
        }
      );
    });
  }

  // FILE STUFF
  private makeFileIntoBlob(_imagePath): Promise<any> {

    return new Promise((resolve, reject) => {
      debugger;
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;
          // get the path..
          let path = nativeURL
            .substring(0, nativeURL.lastIndexOf("/"));
          fileName = name;
          // we are provided the name, so now read the file 
          // into a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });

          // pass back blob and the name of the file for saving
          // into fire base
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => {
          console.log(e);
          reject(e);
        });
    });
  }

}
