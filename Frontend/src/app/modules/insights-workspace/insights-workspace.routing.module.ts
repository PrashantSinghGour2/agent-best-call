import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsightsWorkspaceComponent } from './insights-workspace.component';

const routes: Routes = [
  {
    path: '',
    component: InsightsWorkspaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsightsWorkspaceRoutingModule { }
