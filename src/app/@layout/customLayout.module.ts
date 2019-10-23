import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MenuModule } from '@progress/kendo-angular-menu';
import { HttpClient } from '@angular/common/http';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    RouterModule,
    MenuModule,
    DialogsModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: false
    }),
  ],
  exports: [
    // FooterComponent,
    HeaderComponent,
    SidebarComponent
  ],
  declarations: [
    // FooterComponent,
    HeaderComponent,
    SidebarComponent
  ]
})
export class CustomLayoutModule { }
