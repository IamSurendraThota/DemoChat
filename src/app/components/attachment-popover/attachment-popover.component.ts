import { Component, OnInit } from '@angular/core';
import { PopoverController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

@Component({
  selector: 'app-attachment-popover',
  templateUrl: './attachment-popover.component.html',
  styleUrls: ['./attachment-popover.component.scss'],
})
export class AttachmentPopoverComponent implements OnInit {

  constructor(
    public popoverController: PopoverController,
    private platform: Platform,
    private filePath: FilePath,
    private webview: WebView,
    private camera: Camera) { }

  ngOnInit() { }

  public openCamera() {
    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.popoverController.dismiss(imageData);
    }, (err) => {
      console.log(err);
      this.popoverController.dismiss();
    });
  }

  public openGallery() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 300,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: 0,
      saveToPhotoAlbum: false,
      allowEdit: false
    }

    this.camera.getPicture(options).then((imageData) => {
      debugger;
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(imageData).then((fileUrl) => {
          this.popoverController.dismiss(fileUrl);
        }, (error) => {
          console.log(error);
          this.popoverController.dismiss();
        });
      } else {
        this.popoverController.dismiss(imageData);
      }

    }, (err) => {
      console.log(err);
      this.popoverController.dismiss();
    });
  }

}
