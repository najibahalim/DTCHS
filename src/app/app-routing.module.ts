import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'message/:id',
    loadChildren: () => import('./view-message/view-message.module').then( m => m.ViewMessagePageModule)
  },
  {
    path: 'flat/:id',
    loadChildren: () => import('./flat/flat.module').then(m => m.FlatPageModule)
  },
  {
    path: 'image-viewer',
    loadChildren: () => import('./image-viewer/image-viewer.module').then( m => m.ImageViewerPageModule)
  },
  {
    path: 'addreadings',
    loadChildren: () => import('./addReadings/home/home.module').then(m => m.AddReadingsHomeModule)
  },
  {
    path: 'addMonthReading/:id',
    loadChildren: () => import('./addReadings/month/month.module').then(m => m.AddMonthReadingsModule)
  },
  {
    path: 'addFlatReading/:id',
    loadChildren: () => import('./addReadings/view-message/view-message.module').then(m => m.ViewMessagePageModule)
  },
  {
    path: 'addSectionReading/:id',
    loadChildren: () => import('./addReadings/section/section.module').then(m => m.AddSectionReadingsModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
