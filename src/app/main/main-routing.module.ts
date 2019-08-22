import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { UserGroupComponent } from './user-group/user-group.component';

const routes: Routes = [
  { path: '', redirectTo: 'user-group',  pathMatch: 'full'},
  { path: 'user-group',  pathMatch: 'full', component: UserGroupComponent },
  // { path: 'user-management',  pathMatch: 'full', component: MainComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
