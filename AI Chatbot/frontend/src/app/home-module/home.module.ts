import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { components, providers } from './declarations';
import { RouterModule } from '@angular/router';
import { routes } from './routes';

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [providers],
})
export class HomeModule {}
