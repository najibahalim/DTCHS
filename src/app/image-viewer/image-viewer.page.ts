import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.page.html',
  styleUrls: ['./image-viewer.page.scss'],
})
export class ImageViewerPage implements OnInit {

  imagePath: string;
  constructor(private navParams: NavParams) { }

  ngOnInit() {
    this.imagePath = this.navParams.data.imageUrl;
  }

}
