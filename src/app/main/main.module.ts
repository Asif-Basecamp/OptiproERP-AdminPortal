import { NgModule } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { HttpClient } from '@angular/common/http';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { UserGroupComponent } from './user-group/user-group.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserAuthorizationComponent } from './user-authorization/user-authorization.component';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { ConnectedUsersComponent } from './connected-users/connected-users.component';
import { TenantComponent } from './tenant/tenant.component';
import { TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SplitterModule } from '@progress/kendo-angular-layout';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    ExcelModule,
    FormsModule,
    DialogsModule,
    DropDownsModule,
    MainRoutingModule,
    FlexLayoutModule,
    TreeViewModule,
    SplitterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: false
    }),  
  ],
  providers: [LowerCasePipe],
  declarations: [MainComponent, UserGroupComponent, UserManagementComponent, 
    UserAuthorizationComponent, UserRolesComponent, ConnectedUsersComponent, TenantComponent]
})
export class MainModule { }
