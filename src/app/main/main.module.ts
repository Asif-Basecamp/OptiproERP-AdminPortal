import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserGroupComponent } from './user-group/user-group.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    FlexLayoutModule
  ],
  declarations: [UserGroupComponent]
})
export class MainModule { }
