import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FlatPage } from './flat.page';
import { MessageComponentModule } from '../message/message.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessageComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: FlatPage
      }
    ])
  ],
  declarations: [FlatPage]
})
export class FlatPageModule {}
