import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'    
  },  
  { path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),    
    data: { showHeader: true, showSidebar: true, showFooter:false, compactLayout:false }
  },
  {
    path: 'login',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),    
    data: { showHeader: false, showSidebar: false, showFooter:false, compactLayout:false }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
