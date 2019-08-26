import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserGroupComponent } from './user-group/user-group.component';
import { MainComponent } from './main.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserAuthorizationComponent } from './user-authorization/user-authorization.component';
import { ConnectedUsersComponent } from './connected-users/connected-users.component';

const routes: Routes = [
  { path: '', redirectTo: 'default', pathMatch: 'full'},
  { path: 'default', component: MainComponent },
  { path: 'user-group',  pathMatch: 'full', component: UserGroupComponent },
  { path: 'user-management',  pathMatch: 'full', component: UserManagementComponent },
  { path: 'roles',  pathMatch: 'full', component: UserRolesComponent },
  { path: 'authorization',  pathMatch: 'full', component: UserAuthorizationComponent },
  { path: 'connected-users',  pathMatch: 'full', component: ConnectedUsersComponent },
  // { path: 'user-management',  pathMatch: 'full', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
