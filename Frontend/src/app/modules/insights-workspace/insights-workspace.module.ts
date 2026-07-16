import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsightsWorkspaceRoutingModule } from './insights-workspace.routing.module';
import { InsightsWorkspaceComponent } from './insights-workspace.component';
import { MenuModule } from '@niceltd/sol/menu';
import { ButtonModule } from '@niceltd/sol/button';
import { MatMenuModule } from '@angular/material/menu';
import { DateRangePickerModule } from '@niceltd/sol/date-range-picker';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from '@niceltd/sol/calendar';
import { TranslationModule } from '@niceltd/cxone-core-services';
import { SpinnerModule } from '@niceltd/sol/spinner';
import { SwiperModule } from 'swiper/angular';
import { TooltipModule } from '@niceltd/sol/tooltip';
import { DateRangeWrapperComponent } from './components/date-range-wrapper/date-range-wrapper.component';
import { IconModule } from '@niceltd/sol/icon';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    InsightsWorkspaceComponent, DateRangeWrapperComponent
  ],
  imports: [
    CommonModule,
    InsightsWorkspaceRoutingModule,
    NgxEchartsModule,
    MenuModule,
    ButtonModule,
    MatMenuModule,
    DateRangePickerModule,
    FormsModule,
    CalendarModule,
    TranslationModule,
    SpinnerModule,
    SwiperModule,
    TooltipModule,
    IconModule
  ]
})
export class InsightsWorkspaceModule { }
