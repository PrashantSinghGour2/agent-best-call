/* eslint-disable max-lines */
// TODO: CXSUP-255722 — Refactor: extract chart-building/ECharts helpers into a utility module
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { SharedConstants } from '../../shared/constants/shared.constant';
import { EChartsOption } from 'echarts';
import { TranslationPipe } from '@niceltd/cxone-core-services';
import { IconSvgService, UserPreferencesService } from '@niceltd/cxone-client-platform-services';
import SwiperCore, { Navigation } from 'swiper';
import { ModalService } from '@niceltd/sol/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { insightsWorkspaceConstants } from './constants/insights-workspace.const';
import { TableViewModalComponent } from './components/table-view-modal/table-view-modal.component';
import { GamificationModalComponent } from '../../shared/modals/gamification-modal/gamification-modal.component';
import { BarChartData, BestCallAgent, SessionInfo } from './models/insight-info-model';
import { BestCallAwardStateService } from './services/best-call-award-state.service';

const BEST_CALL_MOCK_AGENTS: BestCallAgent[] = [
  { agent: 'Meena Rao', ticket: 'CRM-48213', score: 9.5, tint: '#3B5BDB', userId: 'usr-48213',
    reason: 'Turned an angry 3rd-contact refund call fully positive without a single hold.',
    summary: 'Customer called angry about a delayed refund (3rd contact). Acknowledged the frustration immediately, checked status live instead of holding, expedited the refund, and confirmed before ending. Sentiment went strongly negative to positive.' },
  { agent: 'David Okafor', ticket: 'CRM-48097', score: 9.2, tint: '#0C8599', userId: 'usr-48097',
    reason: 'Saved a cancelling customer by fixing the root billing error on first contact.',
    summary: 'Customer opened intending to cancel over repeated overcharges. Found the misapplied plan, corrected it live, credited the difference, and re-earned trust. No transfer, retained on the call.' },
  { agent: 'Priya Sharma', ticket: 'CRM-47820', score: 9.0, tint: '#B45309', userId: 'usr-47820',
    reason: 'Walked a frustrated customer through a router fix cleanly, no callback since.',
    summary: 'Connectivity issue after an outage. Calmly diagnosed a config problem, guided the customer step by step, verified the fix on the line, and set expectations for stability.' },
  { agent: 'Carlos Mendez', ticket: 'CRM-47755', score: 8.9, tint: '#7048E8', userId: 'usr-47755',
    reason: 'De-escalated a demand-for-supervisor call and resolved it himself.',
    summary: 'Customer opened by demanding a supervisor. Acknowledged the anger, took ownership, and worked the problem through. The customer ended the call thanking him by name. No escalation needed.' },
  { agent: 'Aisha Khan', ticket: 'CRM-47611', score: 8.8, tint: '#188A5B', userId: 'usr-47611',
    reason: 'Resolved a multi-part account issue on first contact with zero repeat effort.',
    summary: 'Customer had three linked problems across billing and access. Handled all three in one call without asking the customer to repeat themselves, closing every thread cleanly.' },
  { agent: 'Liam O\'Brien', ticket: 'CRM-47588', score: 8.6, tint: '#C2255C', userId: 'usr-47588',
    reason: 'Handled a sensitive bereavement account change with standout empathy.',
    summary: 'Customer needed to close a deceased relative\'s account. Paused, expressed genuine condolence, and handled the paperwork gently without making the customer repeat details.' },
  { agent: 'Sofia Rossi', ticket: 'CRM-47402', score: 8.4, tint: '#2565E6', userId: 'usr-47402',
    reason: 'Fixed the fault and matched the customer to a better-fit plan in one call.',
    summary: 'Customer reported slow service. Resolved the fault, then noticed a plan mismatch and proactively moved the customer to a better fit. Resolution plus proactive value, all first contact.' },
  { agent: 'Kenji Tanaka', ticket: 'CRM-47298', score: 8.1, tint: '#C4511E', userId: 'usr-47298',
    reason: 'Solved a stubborn technical fault without a single transfer.',
    summary: 'Recurring device error that had bounced between teams before. Kept it on his own line, isolated the cause, and applied a lasting fix rather than another temporary workaround.' },
  { agent: 'Grace Adeyemi', ticket: 'CRM-47155', score: 7.9, tint: '#6741D9', userId: 'usr-47155',
    reason: 'Found a refund workaround when the standard path was blocked.',
    summary: 'System wouldn\'t process a legitimate refund the normal way. Found an approved alternative route, kept the customer informed throughout, and confirmed the credit before closing.' },
  { agent: 'Tom Becker', ticket: 'CRM-47010', score: 7.6, tint: '#0B7285', userId: 'usr-47010',
    reason: 'Cleanly resolved a plan-change request the customer expected to be painful.',
    summary: 'Customer braced for a difficult plan change. Made it simple, explained the proration clearly, and completed it on the call. Customer noted how easy it was compared to past experiences.' }
];
import { InsightsDataService } from './services/insights-data.service';
import { ApplicationPathService } from '../../core/services/application-path/application-path.service';
import moment from 'moment';
SwiperCore.use([Navigation]);
@Component({
  selector: 'app-insights-workspace',
  template: `
<div class="insights-container" (click)="insightContainer()" #host
(keydown.enter)="insightContainer()">
   <header class="header">
      {{ 'insightsWorkspace.title' | translate }}
   </header>
   <section class="sub-header">
      {{ 'insightsWorkspace.subTitle' | translate }}
   </section>
   <!-- Best Call of the Week -->
   <section class="best-call-of-week">
      <header class="best-call-header">
         <span class="best-call-header-title">
            <sol-icon icon="supervisorApplicationIconsPath#icon-award" [style]="iconStyle.monitoringFrequency" [ariaHidden]="true"></sol-icon>
            {{ 'insightsWorkspace.bestCallOfWeek.title' | translate }}
         </span>
         <sol-button
            [variant]="'tertiary'"
            [size]="'medium'"
            [icon]="bestCallMenuIcon"
            [buttonMatMenuTriggerFor]="actionsMenuBestCall.menu"
            #bestCallTooltip="solTooltip" solTooltip
            [placement]="'top'" [interactive]="true"
            [solTooltip]="'insightsWorkspace.moreOptions' | translate">
         </sol-button>
         <ng-template #bestCallMenuIcon>
            <sol-icon icon="supervisorApplicationIconsPath#icon-icon-player-menu" [ariaHidden]="true"></sol-icon>
         </ng-template>
      </header>
      <sol-menu #actionsMenuBestCall="menu" variant="narrow" [menuItems]="bestCallTableView"></sol-menu>
      <div class="best-call-content">
         <div class="best-call-agent-row">
            <span class="best-call-avatar" [style.background]="topBestCallAgent?.tint">
               {{ getInitials(topBestCallAgent?.agent) }}
            </span>
            <div class="best-call-agent-meta">
               <div class="best-call-agent-name">{{ topBestCallAgent?.agent }}</div>
               <div class="best-call-ticket">{{ topBestCallAgent?.ticket }}</div>
            </div>
            <div class="best-call-score-block">
               <span class="best-call-score">{{ topBestCallAgent?.score?.toFixed(1) }}<span class="best-call-score-max">/10</span></span>
               <span class="best-call-score-label">{{ 'insightsWorkspace.bestCallOfWeek.bestCallScore' | translate }}</span>
            </div>
         </div>
         <p class="best-call-reason">{{ topBestCallAgent?.reason }}</p>
         <div class="best-call-actions">
            <button
               class="best-call-award-btn"
               [class.best-call-award-btn--awarded]="awardedAgents.has(topBestCallAgent?.ticket)"
               [disabled]="awardedAgents.has(topBestCallAgent?.ticket) || pendingAwardTickets.has(topBestCallAgent?.ticket)"
               (click)="giveAward(topBestCallAgent?.ticket)"
               [attr.aria-label]="(awardedAgents.has(topBestCallAgent?.ticket) ? 'insightsWorkspace.bestCallOfWeek.awarded' : 'insightsWorkspace.bestCallOfWeek.giveAward') | translate">
               {{ (awardedAgents.has(topBestCallAgent?.ticket) ? 'insightsWorkspace.bestCallOfWeek.awarded' : 'insightsWorkspace.bestCallOfWeek.giveAward') | translate }}
            </button>
         </div>
      </div>
   </section>

   <div class="impact">{{ 'insightsWorkspace.impact' | translate }}
      <span role="menu" class="dropdown" tabindex="0"  (menuClosed)="onMenuClosed()" [matMenuTriggerFor]="actionsMenu1.menu"
         #toggle="matMenuTrigger" [attr.aria-label]="'insightsWorkspace.impact' | translate" (keyup.enter)="!toggle.menuOpen ? toggle.openMenu(): ''">
         {{dropDownLabel}}
         <sol-icon [icon]="(toggle.menuOpen) ? 'supervisorApplicationIconsPath#icon-arrow-up' : 'supervisorApplicationIconsPath#icon-arrow-down'" [style]="iconStyle.arrowIcon" [ariaHidden]="true"></sol-icon>
      </span>
   </div>
   <div class="date-wrapper-container" *ngIf="displayCalender" [ngStyle]="{ 'left': sidebarClose ? '13rem' : '25rem'}">
      <app-date-range-wrapper [mode]="mode" [type]="type" [displayleftPanel]="displayLeftPanel"
         [daysDisabled]="daysDisabled" (listSelected)="listSelected($event)" [min]="min" [max]="max"
         (dateSelected)="dateSelected($event)">
      </app-date-range-wrapper>
   </div>
   <sol-menu #actionsMenu1="menu" variant="narrow" [menuItems]="value"></sol-menu>
   <ng-container *ngIf="!isSpinner">
      <div class="empty-state-wrapper" *ngIf="!showMonitoringFrequency">
         <div class="empty-state">
            <div class="empty-state-icon">
               <sol-icon [icon]="errorIcon" [style]="iconStyle.emptyStateIcon" [ariaHidden]="true"></sol-icon>
            </div>
            <div class="empty-state-message">{{ 'insightsWorkspace.emptyStateMessage' | translate }}</div>
            <div class="empty-state-sub-message">{{ 'insightsWorkspace.emptyStateSubMessage' | translate }}</div>
            <div class="empty-state-sub-message">{{ 'insightsWorkspace.emptyStateSubMessage2' | translate }}</div>
            <span role="button" class="reload-link" (click)="loadInsightsWorkspaceData('monitoringFrequency')">{{ 'insightsWorkspace.reload' | translate }}</span>
         </div>
      </div>
   </ng-container>
   <ng-container *ngIf="isSpinner">
      <span class="spinner spinner-bounce-middle"></span>
   </ng-container>
   <ng-container *ngIf="!isSpinner">
      <section class="monitoring-frequency" *ngIf="showMonitoringFrequency">
         <header class="monitoring-header">
            <span class="monitoring-header-title">
               <sol-icon icon="supervisorApplicationIconsPath#icon-plan_Monitoring" [style]="iconStyle.monitoringFrequency" [ariaHidden]="true"></sol-icon>
               {{ 'insightsWorkspace.monitoringFrequency.title' | translate }}
            </span>
            <sol-button *ngIf="this.filteredData?.length"
            [variant]="'tertiary'"
            [size]="'medium'"
            [icon]="menuArrowIcon" [buttonMatMenuTriggerFor]="actionsMenu2.menu"
            #tooltip="solTooltip" solTooltip
            [placement]="'top'" [interactive]="true"
            [solTooltip]="'insightsWorkspace.moreOptions' | translate" [arrow]="arrow"></sol-button>
            <ng-template #menuArrowIcon>
               <sol-icon icon="supervisorApplicationIconsPath#icon-icon-player-menu" [ariaHidden]="true"></sol-icon>
            </ng-template>
         </header>
         <sol-menu #actionsMenu2="menu" variant="narrow"
            [menuItems]="monitoringFrequencyTableView"></sol-menu>
            <div class="left-section">
               <div class="star-icon">
                  <sol-icon [icon]="sparkIcon" [style]="iconStyle.sparkIcon" [ariaHidden]="true"></sol-icon>
               </div>
               <span *ngIf="filteredData?.length else monitoringFrequencyEmptyMessage">
                  <swiper #swiper [loop]="true" [autoHeight]="true" [allowTouchMove]="false"
                     [navigation]="{ prevEl: '.swiper-button-prev1-monitoringFrequency', nextEl: '.swiper-button-next1-monitoringFrequency' }"
                     (slideChange)="onSlideChange($event, 'monitoringFrequency')">
                     <ng-template swiperSlide *ngFor="let slide of monitorFrequencySlider">
                        <div class="monitoring-template">
                           <div *ngIf="slide?.header" class="sub-headers"> {{ slide.header }}</div>
                           <div class="more-sessions">{{ slide.moreSession }}
                              <span class="sub-headers" *ngIf="slide?.fromLiveMonitoring">{{slide?.fromLiveMonitoring}}</span>
                              <span class="sub-headers" *ngIf="slide?.fullStop"> {{ slide.fullStop }}</span>
                           </div>
                           <div class="sub-headers"> {{ slide.targetGoal }}
                              <span class="more-sessions" *ngIf="slide.selfAlerts"> {{ slide.selfAlerts }}</span>
                              <span *ngIf="slide.fromAlerts"> {{ slide.fromAlerts }}</span>
                           </div>
                        </div>
                     </ng-template>
                  </swiper>
                  <div class="page-number-section" *ngIf="this.monitorFrequencySlider?.length > 1">
                     <sol-button
                     [id]="'px-monitoringFrequency-prev'"
                     [ngClass]="'swiper-button-prev1-monitoringFrequency'"
                     [variant]="'tertiary'"
                     [size]="'small'"
                     [icon]="leftArrowIcon"
                     [style]="iconStyle.numberArrowIcon"
                     #tooltip="solTooltip" solTooltip
                     [placement]="'top'" [interactive]="true"
                     [solTooltip]="'insightsWorkspace.previousInsight' | translate" [arrow]="arrow"></sol-button>
                     <ng-template #leftArrowIcon>
                        <sol-icon icon="supervisorApplicationIconsPath#icon-arrow-left" [ariaHidden]="true"></sol-icon>
                     </ng-template>
                     <span class="page-count">{{currentSlideMonitoringFrequency}}/{{monitorFrequencySlider.length}}</span>
                     <sol-button
                     [id]="'px-monitoringFrequency-next'"
                     [ngClass]="'swiper-button-next1-monitoringFrequency'"
                     [variant]="'tertiary'"
                     [size]="'small'"
                     [icon]="rightArrowIcon"
                     [style]="iconStyle.numberArrowIcon"
                     #tooltip="solTooltip" solTooltip
                     [placement]="'top'" [interactive]="true"
                     [solTooltip]="'insightsWorkspace.nextInsight' | translate" [arrow]="arrow"></sol-button>
                     <ng-template #rightArrowIcon>
                        <sol-icon icon="supervisorApplicationIconsPath#icon-arrow-right" [ariaHidden]="true"></sol-icon>
                     </ng-template>
                  </div>
                  <div class="row widgets" role="list" [attr.aria-label]="'insightsWorkspace.sessionStats' | translate">
                     <div class="col-md-4 col-sm-6 col-xs-12 col-no-space" *ngFor="let session of sessions" role="listitem">
                        <div class="mini-stat clearfix sessions">
                           <sol-icon [icon]="session.icon" [style]="iconStyle.insightIcon" [ariaHidden]="true"></sol-icon>
                           <div class="mini-stat-info">
                              {{ session.title }}
                              <span class="mini-stat-info-value">{{ session.value }} <span
                                class="mini-stat-info-percentage">{{ session.percentage }} </span></span>
                           </div>
                        </div>
                     </div>
                  </div>
               </span>
               <ng-template #monitoringFrequencyEmptyMessage>
                  <div class="empty-message">
                     {{ 'insightsWorkspace.emptyMessage' | translate }}
                  </div>
               </ng-template>
            </div>
            <div class="freq-graph">
             @if (echartsAreasplineOptions) {
               <div
                  echarts
                  class="insights-workspace-chart-width"
                  [options]="echartsAreasplineOptions"
                  style="height: 260px;">
               </div>
             }
            </div>
      </section>
   </ng-container>

   <ng-container *ngIf="interventionSpinner">
      <span class="spinner spinner-bounce-middle"></span>
   </ng-container>
   <ng-container  *ngIf="!interventionSpinner" >
      <section class="intervention-impact" *ngIf="showInterventionImpact">
         <header class="intervention-header">
            <span class="intervention-impact-title">
               <sol-icon icon="supervisorApplicationIconsPath#icon-Icons_svg_scheduling-unit" [style]="iconStyle.monitoringFrequency" [ariaHidden]="true"></sol-icon>
               {{ 'insightsWorkspace.interventionImpact.title' | translate }}
            </span>
            <sol-button *ngIf="this.filteredInterventionData?.length"
            [variant]="'tertiary'"
            [size]="'medium'"
            [icon]="menuArrowIcon" [buttonMatMenuTriggerFor]="actionsMenu3.menu"
            #tooltip="solTooltip" solTooltip
            [placement]="'top'" [interactive]="true"
            [solTooltip]="'insightsWorkspace.moreOptions' | translate" [arrow]="arrow"></sol-button>
            <ng-template #menuArrowIcon>
               <sol-icon icon="supervisorApplicationIconsPath#icon-icon-player-menu" [ariaHidden]="true"></sol-icon>
            </ng-template>
         </header>
         <sol-menu #actionsMenu3="menu" variant="narrow"
            [menuItems]="interventionImpactTableView"></sol-menu>
         <div class="left-section">
            <div class="star-icon">
               <sol-icon [icon]="sparkIcon" [style]="iconStyle.sparkIcon" [ariaHidden]="true"></sol-icon>
            </div>
            <span *ngIf="this.filteredInterventionData?.length ; else interventionImpactEmptyMessage">
               <swiper #swiper [loop]="true" [autoHeight]="true" [allowTouchMove]="false"
                  [navigation]="{ prevEl: '.swiper-button-prev1-interventionImpact', nextEl: '.swiper-button-next1-interventionImpact' }"
                  (slideChange)="onSlideChange($event,'interventionImpact')">
                  <ng-template swiperSlide *ngFor="let slide of interventionImpactSlider">
                     <div class="intervention-template">
                        <div *ngIf="slide?.header" class="sub-headers"> {{ slide.header }}</div>
                        <div class="more-sessions">{{ slide.moreSession }}
                           <span class="sub-headers" *ngIf="slide?.fromLiveMonitoring">{{slide?.fromLiveMonitoring}}</span>
                           <span class="sub-headers" *ngIf="slide?.fullStop"> {{ slide.fullStop }}</span>
                        </div>
                        <div class="sub-headers"> {{ slide.timePeriod }}
                           <span class="more-sessions" *ngIf="slide.selfAlerts"> {{ slide.selfAlerts }}</span>
                           <span *ngIf="slide.fromAlerts"> {{ slide.fromAlerts }}</span>
                        </div>
                     </div>
                  </ng-template>
               </swiper>
               <div class="page-number-section" *ngIf="this.interventionImpactSlider?.length > 1">
                  <sol-button
                     [id]="'px-interventionImpact-prev'"
                     [ngClass]="'swiper-button-prev1-interventionImpact'"
                     [variant]="'tertiary'"
                     [size]="'small'"
                     [icon]="leftArrowIcon"
                     [style]="iconStyle.numberArrowIcon"
                     #tooltip="solTooltip" solTooltip
                     [placement]="'top'" [interactive]="true"
                     [solTooltip]="'insightsWorkspace.previousInsight' | translate" [arrow]="arrow"></sol-button>
                     <ng-template #leftArrowIcon>
                        <sol-icon icon="supervisorApplicationIconsPath#icon-arrow-left" [ariaHidden]="true">
                     </sol-icon>
                     </ng-template>
                  <span class="page-count">{{currentSlideInterventionImpact}}/{{interventionImpactSlider.length}}</span>
                  <sol-button
                     [id]="'px-interventionImpact-next'"
                     [ngClass]="'swiper-button-next1-interventionImpact'"
                     [variant]="'tertiary'"
                     [size]="'small'"
                     [icon]="rightArrowIcon"
                     [style]="iconStyle.numberArrowIcon"
                     #tooltip="solTooltip" solTooltip
                     [placement]="'top'" [interactive]="true"
                     [solTooltip]="'insightsWorkspace.nextInsight' | translate" [arrow]="arrow"></sol-button>
                  <ng-template #rightArrowIcon>
                        <sol-icon icon="supervisorApplicationIconsPath#icon-arrow-right" [ariaHidden]="true"></sol-icon>
                  </ng-template>
               </div>
               <div class="info-message">
                  <sol-icon icon="supervisorApplicationIconsPath#icon-info" [style]="iconStyle.infoIcon" [ariaHidden]="true"></sol-icon>
                  <span>
                     {{ 'insightsWorkspace.interventionImpact.infoMessage' | translate }}<br>
                     {{ 'insightsWorkspace.interventionImpact.infoAssistSubMessage' | translate }}
                   </span>
               </div>
            </span>
            <ng-template #interventionImpactEmptyMessage>
               <div class="empty-message">
                  {{ 'insightsWorkspace.emptyMessage' | translate }}
               </div>
            </ng-template>
         </div>
         <div class="freq-graph">
            @if (echartsBarOptions) {
               <div
                  echarts
                  class="insights-workspace-chart-width"
                  [options]="echartsBarOptions"
                  style="height: 300px;">
               </div>
            }
         </div>
      </section>
      <div class="empty-state-wrapper" *ngIf="!showInterventionImpact">
         <div class="empty-state">
            <div class="empty-state-icon">
              <sol-icon [icon]="errorIcon" [style]="iconStyle.emptyStateIcon"></sol-icon>
            </div>
            <div class="empty-state-message">{{ 'insightsWorkspace.emptyStateMessage' | translate }}</div>
            <div class="empty-state-sub-message">{{ 'insightsWorkspace.emptyStateSubMessage' | translate }}</div>
            <div class="empty-state-sub-message">{{ 'insightsWorkspace.emptyStateSubMessage2' | translate }}</div>
            <span role="button" class="reload-link" (click)="loadInsightsWorkspaceData('interventionImpact')">{{ 'insightsWorkspace.reload' | translate }}</span>
         </div>
      </div>
   </ng-container>

</div>
  `,
  styleUrl: './insights-workspace.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsightsWorkspaceComponent implements OnInit, AfterViewInit, OnDestroy {
  public supervisorApplicationIconsPath;
  public errorIcon: string;
  public sparkIcon: string;
  public iconStyle = SharedConstants.iconStyle;
  public duration = 7;
  public sessions = [];
  public value = [];
  public monitoringFrequencyTableView = [];
  public interventionImpactTableView = [];
  public echartsBarOptions: EChartsOption;
  public echartsAreasplineOptions: EChartsOption;
  public selfActionTotalDurationList : number[] = [];
  private otherSupervisorActionDataTotalDurationList : number[] = [];
  public showMonitoringFrequency = true;
  public showInterventionImpact = true;
  public dropDownLabel = this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.lastSevenDays);
  public mode: 'inline';
  public type: 'range-selection';
  public daysDisabled = [0, 6];
  public displayCalender = false;
  private differenceInDays = 0;
  private startDate:Date;
  private endDate: Date;
  public currentSlideMonitoringFrequency = 1;
  public currentSlideInterventionImpact = 1;
  public monitorFrequencySlider = [];
  public interventionImpactSlider;
  public mockApiData:any;
  private interventionData:any;
  public filteredData = [];
  private filteredPeerData = [];
  public filteredInterventionData = [];
  public barChartData = [];
  private today: Date = new Date();
  private yesterday: string;
  private lastSevenDays: string;
  public isSpinner = true;
  public interventionSpinner = true;
  public bestCallAgents: BestCallAgent[] = BEST_CALL_MOCK_AGENTS;
  public topBestCallAgent: BestCallAgent = this.bestCallAgents[0];
  public awardedAgents: ReadonlySet<string> = new Set<string>();
  public pendingAwardTickets: Set<string> = new Set<string>();
  public bestCallTableView = [];
  private readonly destroy$ = new Subject<void>();
  private maxTotalCount: number;
  public min: Date | null = null;
  public max: Date | null = null;
  private interventionImpactMaxTotalCount : number;
  private interventionImpactMaxCountlist: number[];
  @ViewChild('host', { static: true }) host: ElementRef;
  public sidebarClose: boolean;
  private isCustomDate: boolean;
  public timeZone = moment.tz.guess();
  private readonly seriesIndexMap: { [key: string]: number } = {
    [this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.improvedSentiment)]: 0,
    [this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.declinedSentiment)]: 1,
    [this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.noChange)]: 2,
    [this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.untrackedSentiments)]: 3
  };

  constructor(
    private translationPipe: TranslationPipe,
    private cd: ChangeDetectorRef,
    private solModalService: ModalService,
    private insightsDataService: InsightsDataService,
    private applicationPathService: ApplicationPathService,
    private bestCallAwardStateService: BestCallAwardStateService
  ) {
    this.setUserPreferences();
  }

  public setUserPreferences() : void {
    UserPreferencesService.instance.getPreference(SharedConstants.preferenceName.insightsWorkspace)
    .then(insightsWorkspace => {
    insightsWorkspace = JSON.parse(insightsWorkspace);
    this.dropDownLabel = insightsWorkspace?.dropDownLabel || this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.lastSevenDays);
    this.duration = insightsWorkspace?.duration || 7;
    this.isCustomDate = insightsWorkspace?.customDate || false;
    this.startDate = this.isCustomDate ? insightsWorkspace?.startDate : new Date();
    this.endDate = this.isCustomDate ? insightsWorkspace?.endDate : new Date();
    this.min = this.isCustomDate ? new Date(insightsWorkspace?.startDate) : null;
    this.max = this.isCustomDate ? new Date(insightsWorkspace?.endDate): null;
    this.differenceInDays = this.isCustomDate ? this.duration : 0;
    }).catch(error => console.error('Error:', error));
  }

  ngOnInit(): void {
    this.supervisorApplicationIconsPath = this.applicationPathService.getApplicationIconPath();
    const illustrationsIconsPath = IconSvgService.instance.getIconsSpriteDataUrl('illustrations');
    this.errorIcon = `${illustrationsIconsPath}#icon-error_occur`;
    this.sparkIcon = `${illustrationsIconsPath}#icon-spark`;
    this.value = this.initializeMenuItems();
    this.bestCallTableView = this.initializeBestCallTableView();
    this.bestCallAwardStateService.awardedTickets$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tickets => {
        this.awardedAgents = tickets;
        this.cd.detectChanges();
      });
    this.loadInsightsWorkspaceData('interventionImpact');
    this.loadInsightsWorkspaceData('monitoringFrequency');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {    let resizeTimeout: any;
    const observer = new ResizeObserver(entries => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      this.displayCalender = false;
      this.cd.detectChanges();
      resizeTimeout = setTimeout(() => {
        const width = entries[0].contentRect.width;
        if (width > 1400) {
          this.sidebarClose = true;
        } else {
          this.sidebarClose = false;
        }
      }, 300); // Wait for 100ms after last resize event
    });

    observer.observe(this.host.nativeElement);
  }

  public getPastDate(days: number, referenceDate: Date = new Date()): string {
    const pastDate = new Date(referenceDate);
    pastDate.setDate(referenceDate.getDate() - days);
    return moment(pastDate).format('YYYY-MM-DD');
  }

  public getMaxCount(filterData: any, peerData: any): number {
    const selfActionDataCounts = filterData?.map(item => item.totalCount) ?? [];
    const otherSupervisorActionDataCounts = peerData?.map(item => item.avgCount) ?? [];
    // Combine both arrays and find the maximum totalCount
    const allCounts = peerData.length > 0 ? [...selfActionDataCounts, ...otherSupervisorActionDataCounts] : selfActionDataCounts;
    return Math.max(...allCounts);
  }

  public async getMonitoringFreqData(startDate: string, endDate: string): Promise<void> {
    this.isSpinner = true;
    try {
      const data = await this.insightsDataService.getMonitoringFrequencyData(startDate, endDate, this.timeZone);
      if (data !== null) {
        this.isSpinner = false;
        this.mockApiData = data.monitoringFrequency;
        this.mockApiData.selfActionData = this.setMissingInsightsWorkspaceData(
          startDate,
          endDate,
          'selfActionData',
          this.mockApiData?.selfActionData
        );
        this.mockApiData.otherSupervisorActionData = this.setMissingInsightsWorkspaceData(
          startDate,
          endDate,
          'otherSupervisorActionData',
          this.mockApiData?.otherSupervisorActionData
        );
        this.filteredData = this.mockApiData?.selfActionData;
        this.maxTotalCount = this.getMaxCount(this.filteredData, this.mockApiData?.otherSupervisorActionData);
        this.monitorFrequencySlider = this.setMonitorFrequencySlider();
        this.sessions = this.initializeSessions();
        this.setAreasplineChartData();
        this.monitoringFrequencyTableView = this.createTableViewConfig('MonitoringFrequency');
        this.cd.markForCheck();
        this.showMonitoringFrequency = true;
      } else {
        this.isSpinner = false;
        this.showMonitoringFrequency = true;
        this.filteredData = [];
        this.mockApiData = [];
        this.setAreasplineChartData();
        this.cd.markForCheck();
      }
    } catch (error) {
      this.isSpinner = false;
      this.showMonitoringFrequency = false;
      this.cd.markForCheck();
      console.error('Error:', error);
    }
  }

  public setMissingInsightsWorkspaceData(startDate: string, endDate: string, actionName: string, data: any[]): any[] {
    const templates = {
      selfActionData: {
        date: '2024-07-01',
        timeInterval: '00:00-23:59',
        totalCount: 0,
        actions: [
          { name: 'Digital Monitor', count: 0, totalDuration: 0, source: 'alert' },
          { name: 'Voice Monitor', count: 0, totalDuration: 0, source: 'livemonitoring' },
          { name: 'Screen Monitor', count: 0, totalDuration: 0, source: 'livemonitoring' },
          { name: 'Digital Monitor', count: 0, totalDuration: 0, source: 'livemonitoring' },
          { name: 'Voice Monitor', count: 0, totalDuration: 0, source: 'alert' },
          { name: 'Screen Monitor', count: 0, totalDuration: 0, source: 'alert' }
        ]
      },
      otherSupervisorActionData: {
        date: '2024-07-01',
        timeInterval: '00:00-23:59',
        totalOtherSupervisors: 0,
        totalDuration: 0,
        totalCount: 0,
        avgCount: 0
      },
      interventionData: {
        date: '2024-07-01',
        timeInterval: '00:00-23:59',
        totalCount: 0,
        outcomes: [
          {
            name: 'Improved',
            count: 0,
            source: 'alert'
          },
          {
            name: 'Declined',
            count: 0,
            source: 'alert'
          },
          {
            name: 'Neutral',
            count: 0,
            source: 'alert'
          },
          {
            name: 'Unmonitored Sentiment',
            count: 0,
            source: 'alert'
          },
          {
            name: 'Improved',
            count: 0,
            source: 'live monitoring'
          },
          {
            name: 'Declined',
            count: 0,
            source: 'live monitoring'
          },
          {
            name: 'Neutral',
            count: 0,
            source: 'live monitoring'
          },
          {
            name: 'Unmonitored Sentiment',
            count: 0,
            source: 'live monitoring'
          }
        ]
      }
    };
    const template = templates[actionName] || {};
    if (startDate === endDate) {
      return Array.from({ length: 25 }, (_, i) => {
        const interval = `${i.toString().padStart(2, '0')}:00-${((i + 1) % 24).toString().padStart(2, '0')}:00`;
        const existingData = data.find(res => res.timeInterval === interval);
        if (actionName === 'selfActionData' || actionName === 'otherSupervisorActionData') {
        this.getSelfActionDataTotalDuration(actionName, existingData);
        }
        return existingData ? { ...existingData, date: startDate} : { ...template, timeInterval: interval, date: startDate};
      });
    }
    const currentDate = new Date(startDate);
    const result = [];
    while (currentDate <= new Date(endDate)) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const existingData = data.find(res => res.date === dateStr);
      if (actionName === 'selfActionData' || actionName === 'otherSupervisorActionData') {
      this.getSelfActionDataTotalDuration(actionName, existingData);
      }
      result.push(existingData || { ...template, date: dateStr });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }
  public getSelfActionDataTotalDuration(actionName: string, existingData: any): void {
    switch (actionName) {
      case 'selfActionData':{
        const selfTotalDuration = existingData?.actions?.reduce((acc, action) => acc + action.totalDuration, 0) || 0;
        this.selfActionTotalDurationList.push(selfTotalDuration);
        break;
      }
      case 'otherSupervisorActionData': {
        const otherTotalDuration = existingData?.totalDuration || 0;
        this.otherSupervisorActionDataTotalDurationList.push(otherTotalDuration);
        break;
      }
    }
  }

  public async getInterventionBarData(startDate: string, endDate: string): Promise<void> {
    this.interventionSpinner = true;
    try {
      const data = await this.insightsDataService.getInterventionData(startDate, endDate, this.timeZone);
      if (data !== null) {
        this.interventionSpinner = false;
        this.interventionData = data?.interventionImpact;
        this.interventionData.interventionData = this.setMissingInsightsWorkspaceData(
          startDate,
          endDate,
          'interventionData',
          this.interventionData?.interventionData
        );
        this.interventionImpactSlider = this.setInterventionImpactSlider();
        this.interventionImpactTableView = this.createTableViewConfig('InterventionImpact');
        this.showInterventionImpact = true;
        this.setBarChartOptions();
        this.cd.markForCheck();
      } else {
        this.interventionSpinner = false;
        this.showInterventionImpact = true;
        this.interventionData = [];
        this.setBarChartOptions();
        this.cd.markForCheck();
      }
    } catch (error) {
      this.interventionSpinner = false;
      this.showInterventionImpact = false;
      this.cd.markForCheck();
      console.error('Error:', error);
    }
  }

  public reloadMonitoringData(): void {
    this.getMonitoringFreqData(this.yesterday, this.lastSevenDays);
  }

  public reloadBarChartData(): void {
    this.getInterventionBarData(this.yesterday, this.lastSevenDays);
  }

  public createTableViewConfig(type: string): any[] {
    if (type === 'MonitoringFrequency') {
      this.filteredData = this.filteredData.map((data, index) => ({
        ...data,
        totalDuration: this.selfActionTotalDurationList[index],
        yourAverage: `${this.selfActionTotalDurationList[index] ? moment.utc(60 * 1000 * (this.selfActionTotalDurationList[index] / data.totalCount)).format('mm:ss') : '00:00'}`,
        peerData: {...this.filteredPeerData[index]}
      }));
    }
    return [
      {
        label: this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.viewAsATable),
        callbackFn: () => {
          this.solModalService.open(TableViewModalComponent, {
            width: '960px',
            disableClose: true,
            data: {
              type: type,
              filteredData: type === 'MonitoringFrequency' ? this.filteredData : this.filteredInterventionData,
              selectedDate: this.dropDownLabel
            }
          });
        }
      }
    ];
  }
  public setMonitorFrequencySlider() {
    const slides = [
      {
        header: this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide1.header),
        moreSession: `${Math.abs(this.mockApiData?.insightsData?.peerCountComparisonPercent)}${this.translationPipe.transform(
          this.mockApiData?.insightsData?.peerCountComparisonPercent > 0
            ? insightsWorkspaceConstants.monitorFrequencySlider.slide1.moreSession
            : insightsWorkspaceConstants.monitorFrequencySlider.slide1.lessSession
        )}`,
        targetGoal: this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide1.targetGoal)
      },
      {
        header: this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide2.header),
        moreSession: `${Math.abs(this.mockApiData?.insightsData?.selfCountComparisonPercent)}${this.translationPipe.transform(
          this.mockApiData?.insightsData?.selfCountComparisonPercent > 0
            ? insightsWorkspaceConstants.monitorFrequencySlider.slide2.moreSession
            : insightsWorkspaceConstants.monitorFrequencySlider.slide2.lessSession
        )}`,
        targetGoal: this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide2.targetGoal)
      },
      {
        header: this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide3.header),
        moreSession: this.mockApiData?.insightsData?.peerDurationAvgComparison?.includes('-') ? this.mockApiData?.insightsData?.peerDurationAvgComparison?.replace(/-/g, '') + this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide3.lessSession) : this.mockApiData?.insightsData?.peerDurationAvgComparison + this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide3.moreSession),
        targetGoal: this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide3.targetGoal)
      },
      {
        header: this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide4.header),
        ...(this.mockApiData?.insightsData?.selfMonitorFromLiveMonitoringPercent > 0 && {
          moreSession: this.mockApiData?.insightsData?.selfMonitorFromLiveMonitoringPercent +
          this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide4.moreSession),
          fromLiveMonitoring: this.getFromLiveMonitoringText('monitorFrequencySlider', this.mockApiData?.insightsData?.selfMonitorFromAlertPercent)
        }),
        ...(this.mockApiData?.insightsData?.selfMonitorFromLiveMonitoringPercent > 0 &&
           this.mockApiData?.insightsData?.selfMonitorFromAlertPercent !== 0 && {
          targetGoal: this.translationPipe.transform(insightsWorkspaceConstants.monitorFrequencySlider.slide4.targetGoal)
        }),
        ...(this.mockApiData?.insightsData?.selfMonitorFromAlertPercent !== 0 && {
          selfAlerts: this.mockApiData?.insightsData?.selfMonitorFromAlertPercent + '%',
          fromAlerts: this.translationPipe.transform(
            this.mockApiData?.insightsData?.selfMonitorFromLiveMonitoringPercent > 0
              ? insightsWorkspaceConstants.monitorFrequencySlider.slide4.fromAlerts
              : insightsWorkspaceConstants.monitorFrequencySlider.slide4.onlyFromAlerts
          )
        })
      }
    ];
    // Define conditions for each slide`
    const conditions = [
      this.mockApiData?.insightsData?.peerCountComparisonPercent !== null && this.mockApiData?.insightsData?.peerCountComparisonPercent !== 0,
      this.mockApiData?.insightsData?.selfCountComparisonPercent !== null && this.mockApiData?.insightsData?.selfCountComparisonPercent !== 0,
      this.mockApiData?.insightsData?.peerDurationAvgComparison !== null && this.mockApiData?.insightsData?.peerDurationAvgComparison !== 0,
      this.mockApiData?.insightsData?.selfMonitorFromLiveMonitoringPercent !== null, this.mockApiData?.insightsData?.selfMonitorFromAlertPercent !== null
     ];

    // Filter slides based on conditions
    return slides.filter((slide, index) => conditions[index]);
  }
  public setInterventionImpactSlider() {
    const slides = [
      {
        header: this.translationPipe.transform(insightsWorkspaceConstants.interventionImpactSlider.slide1.header),
        moreSession: `${Math.abs(this.interventionData?.insightsData?.sentiment?.selfImprovedPercent)}${this.translationPipe.transform(
            this.interventionData?.insightsData?.sentiment?.selfImprovedPercent > 0
              ? insightsWorkspaceConstants.interventionImpactSlider.slide1.moreSession
              : insightsWorkspaceConstants.interventionImpactSlider.slide1.lessSession
          )}`,
        timePeriod: this.translationPipe.transform(insightsWorkspaceConstants.interventionImpactSlider.slide1.timePeriod)
      },
      {
        header: this.translationPipe.transform(insightsWorkspaceConstants.interventionImpactSlider.slide2.header),
        moreSession: `${Math.abs(this.interventionData?.insightsData?.sentiment?.peerImprovedComparisonPercent)}${this.translationPipe.transform(
            this.interventionData?.insightsData?.sentiment?.peerImprovedComparisonPercent > 0
              ? insightsWorkspaceConstants.interventionImpactSlider.slide2.moreSession
              : insightsWorkspaceConstants.interventionImpactSlider.slide2.lessSession
          )}`,
        timePeriod: this.translationPipe.transform(insightsWorkspaceConstants.interventionImpactSlider.slide2.timePeriod)
      },
      {
        header: this.translationPipe.transform(insightsWorkspaceConstants.interventionImpactSlider.slide3.header),
        moreSession: `${Math.abs(this.interventionData?.insightsData?.selfCountComparisonPercent)}${this.translationPipe.transform(
            this.interventionData?.insightsData?.selfCountComparisonPercent > 0
              ? insightsWorkspaceConstants.interventionImpactSlider.slide3.moreSession
              : insightsWorkspaceConstants.interventionImpactSlider.slide3.lessSession
          )}`,
        timePeriod: this.translationPipe.transform(insightsWorkspaceConstants.interventionImpactSlider.slide3.timePeriod)
      },
      {
        ...(this.interventionData?.insightsData?.selfInterventionFromLiveMonitoringPercent > 0 && {
          moreSession: this.interventionData?.insightsData?.selfInterventionFromLiveMonitoringPercent +
          this.translationPipe.transform(insightsWorkspaceConstants.interventionImpactSlider.slide4.moreSession),
          fromLiveMonitoring: this.getFromLiveMonitoringText('interventionImpactSlider', this.interventionData?.insightsData?.selfInterventionFromAlertPercent)
        }),
        ...(this.interventionData?.insightsData?.selfInterventionFromLiveMonitoringPercent > 0 &&
           this.interventionData?.insightsData?.selfInterventionFromAlertPercent !== 0 && {
          timePeriod: this.translationPipe.transform(insightsWorkspaceConstants.interventionImpactSlider.slide4.timePeriod)
        }),
        ...(this.interventionData?.insightsData?.selfInterventionFromAlertPercent !== 0 && {
          selfAlerts: this.interventionData?.insightsData?.selfInterventionFromAlertPercent + '%',
          fromAlerts: this.translationPipe.transform(
            this.interventionData?.insightsData?.selfInterventionFromLiveMonitoringPercent > 0
              ? insightsWorkspaceConstants.interventionImpactSlider.slide4.fromAlerts
              : insightsWorkspaceConstants.interventionImpactSlider.slide4.onlyFromAlerts
          )
        })
        }
    ];

    const conditions = [
      this.interventionData?.insightsData?.sentiment?.selfImprovedPercent !== null &&
      this.interventionData?.insightsData?.sentiment?.selfImprovedPercent !== 0,
      this.interventionData?.insightsData?.sentiment?.peerImprovedComparisonPercent !== null &&
        this.interventionData?.insightsData?.sentiment?.peerImprovedComparisonPercent !== 0,
      (this.interventionData && typeof this.interventionData === 'object' && this.interventionData.insightsData?.selfCountComparisonPercent !== null &&
        this.interventionData.insightsData?.selfCountComparisonPercent !== 0),
      (this.interventionData?.insightsData?.selfInterventionFromAlertPercent) ||
      (this.interventionData?.insightsData?.selfInterventionFromLiveMonitoringPercent)
    ];

    // Filter slides based on conditions
    return slides.filter((slide, index) => conditions[index]);
  }

  public onSlideChange(event: any, value: string): void {
    switch (value) {
      case 'monitoringFrequency':
        this.currentSlideMonitoringFrequency = event[0].realIndex + 1;
        break;
      case 'interventionImpact':
        this.currentSlideInterventionImpact = event[0].realIndex + 1;
        break;
    }
  }

  public initializeSessions(): SessionInfo[] {
    let totalCount = 0;
    let totalVoiceMonitorCount = 0;
    let totalDigitalMonitorCount = 0;
    let totalScreenMonitorCount = 0;
    this.filteredData = this.mockApiData.selfActionData;
    this.filteredPeerData = this.mockApiData.otherSupervisorActionData;
    this.filteredData?.forEach(data => {
      totalCount += data.totalCount;
      data?.actions?.forEach(action => {
        switch (action.name) {
          case 'Voice Monitor':
            totalVoiceMonitorCount += action.count;
            break;
          case 'Digital Monitor':
            totalDigitalMonitorCount += action.count;
            break;
          case 'Screen Monitor':
            totalScreenMonitorCount += action.count;
            break;
        }
      });
    });
    const calculatePercentage = (partialCount: number, count: number): number =>
      totalCount ? parseFloat(((partialCount / count) * 100).toFixed(2)) : 0;
    const sessionsObj = {
      voiceSessionsPercentage: calculatePercentage(totalVoiceMonitorCount, totalCount),
      digitalSessionsPercentage: calculatePercentage(totalDigitalMonitorCount, totalCount),
      screenMonitoringPercentage: calculatePercentage(totalScreenMonitorCount, totalCount)
    };

    let sessionInfolist = [
      {
        icon: 'supervisorApplicationIconsPath#icon-monitor',
        alt: 'voice monitoring',
        title: this.translationPipe.transform(insightsWorkspaceConstants.session.voiceSessions),
        value: totalVoiceMonitorCount,
        percentage: '(' + sessionsObj.voiceSessionsPercentage + '%)'
      },
      {
        icon: 'supervisorApplicationIconsPath#icon-eye',
        alt: 'screen-monitor',
        title: this.translationPipe.transform(insightsWorkspaceConstants.session.digitalSessions),
        value: totalDigitalMonitorCount,
        percentage: '(' + sessionsObj.digitalSessionsPercentage + '%)'
      },
      {
        icon: 'supervisorApplicationIconsPath#icon-screen',
        alt: 'digital-view',
        title: this.translationPipe.transform(insightsWorkspaceConstants.session.screenMonitoring),
        value: totalScreenMonitorCount,
        percentage: '(' + sessionsObj.screenMonitoringPercentage + '%)'
      }
    ];
    sessionInfolist = sessionInfolist.filter(data => data.value);
    return sessionInfolist.length > 1 ? sessionInfolist : [];
  }

  public insightContainer(): void {
     this.displayCalender = false;
  }

  public initializeMenuItems() {
    const setDropDown = (label, duration = null, showDivider = false) => ({
      label,
      callbackFn: item => {
        this.selfActionTotalDurationList = [];
        this.otherSupervisorActionDataTotalDurationList = [];
        this.currentSlideInterventionImpact = 1;
        this.currentSlideMonitoringFrequency = 1;
        if (item.label !== this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.customDates)) {
          const startDate = this.getPastDate(duration, this.today);
          this.getMonitoringFreqData(startDate, this.yesterday);
          this.getInterventionBarData(startDate, this.yesterday);
          this.min = null;
          this.max = null;
        }
        this.setDuration(item, duration);
      },
      id: 'px-' + label.replace(/\s/g, '-').toLowerCase(),
      ...(showDivider && { showDivider })
    });

    return [
      setDropDown(this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.yesterday), 1),
      setDropDown(this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.lastSevenDays), 7),
      setDropDown(this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.lastFourteenDays), 14),
      setDropDown(this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.lastThirtyDays), 30, true),
      setDropDown(this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.customDates), 45)
    ];
  }

  public setDuration(item, duration): void {
    if (item.label !== this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.customDates) && duration !== null) {
      this.dropDownLabel = item.label;
      this.duration = duration;
      UserPreferencesService.instance.setPreference(SharedConstants.preferenceName.insightsWorkspace, { dropDownLabel: this.dropDownLabel, duration: this.duration, startDate: this.startDate, endDate: this.endDate, customDate: false});
    }
    this.displayCalender = item.label === this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.customDates);
    this.cd.markForCheck();
  }

  // eslint-disable-next-line max-lines-per-function
  public setAreasplineChartData(): void {
    const componentDuration = this.duration;
    const formatAreasplineChartLabel = this.formatAreasplineChartLabel.bind(this);
    const formatAreasplineTooltip = this.formatAreasplineTooltip.bind(this);
    const isDataAvailable = this.filteredData?.length > 0;
    const maxTotalCount = this.maxTotalCount;

    const yourSessionsData = this.generateAreasplineChartData('yourSessions');
    const peerAverageData = this.generateAreasplineChartData('peerAverage');

    this.echartsAreasplineOptions = {
        title: {
          text: !isDataAvailable ? this.translationPipe.transform(insightsWorkspaceConstants.charts.noDataAvailable) : '',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#79797A',
            fontSize: 14
          }
        },
        legend: {
          show: isDataAvailable,
          bottom: 0,
          itemWidth: 12,
          itemHeight: 5,
          textStyle: {
            fontSize: 10,
            color: '#79797A'
          },
          emphasis: {
            selectorLabel: {
              show: true
            }
          },
          selectedMode: true
        },
        grid: {
          left: '5%',
          right: '4%',
          top: '3%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          axisLine: {
            show: true
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            hideOverlap: true,
            showMaxLabel: true,
            showMinLabel: true,
            formatter: (value) => {
              return formatAreasplineChartLabel(value, componentDuration);
            }
          }
        },
        yAxis: {
          type: 'value',
          name: this.translationPipe.transform(insightsWorkspaceConstants.charts.areasplineChartYAxisTitle),
          nameLocation: 'middle',
          nameGap: 25,
          nameTextStyle: {
            color: '#666666',
            fontSize: 12,
            fontWeight: 'normal'
          },
          nameRotate: 90,
          min: 0,
          interval: isDataAvailable ? Math.ceil(maxTotalCount / 5) : 30,
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            if (!isDataAvailable) return '';
            const xValue = params[0].value[0];
            return formatAreasplineTooltip({ chart: { series: [
              { name: this.translationPipe.transform(insightsWorkspaceConstants.charts.splineChart.yourSessions), data: yourSessionsData.map((d, i) => ({ x: d[0], y: d[1], index: i })) },
              { name: this.translationPipe.transform(insightsWorkspaceConstants.charts.splineChart.peerAverage), data: peerAverageData.map((d, i) => ({ x: d[0], y: d[1], index: i })) }
            ]}}, xValue);
          }
        },
        series: [
          {
            name: this.translationPipe.transform(insightsWorkspaceConstants.charts.splineChart.peerAverage),
            type: 'line',
            data: peerAverageData,
            smooth: true,
            lineStyle: {
              color: '#808080',
              width: 2
            },
            showSymbol: false,
            itemStyle: {
              color: '#808080'
            },
            emphasis: {
              focus: 'series',
              lineStyle: {
                width: 3,
                shadowBlur: 2,
                shadowColor: 'rgba(128, 128, 128, 0.5)'
              }
            },
            blur: {
              lineStyle: {
                opacity: 0.2
              },
              areaStyle: {
                opacity: 0.1
              }
            }
          },
          {
            name: this.translationPipe.transform(insightsWorkspaceConstants.charts.splineChart.yourSessions),
            type: 'line',
            data: yourSessionsData,
            smooth: true,
            showSymbol: false,
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(0, 158, 217, 0.5)' },
                  { offset: 1, color: 'rgba(0, 158, 217, 0)' }
                ]
              }
            },
            lineStyle: {
              color: '#009ED9',
              width: 2
            },
            itemStyle: {
              color: '#009ED9'
            },
            emphasis: {
              focus: 'series',
              lineStyle: {
                width: 3,
                shadowBlur: 2,
                shadowColor: 'rgba(0, 158, 217, 0.5)'
              },
              areaStyle: {
                opacity: 0.8
              }
            },
            blur: {
              lineStyle: {
                opacity: 0.2
              },
              areaStyle: {
                opacity: 0.1
              }
            }
          }
        ]
      };
      this.cd.detectChanges();
    }

  public formatAreasplineTooltip(series: any, x: number): string {
    let tooltip: string = `<span style="font-size:14px;color:#767676;font-weight:400;line-height:15px;">${moment(x).format('dddd, MMMM D, YYYY')}</span><br/>`;
    let peerAverage: string = '';
    series.chart.series.forEach(seriesElement => {
      seriesElement.data.forEach((dataPoint, _index) => {
        if (dataPoint.x === x) {
          const totalDuration = this.selfActionTotalDurationList[_index] || 1;
          const totalCount = this.filteredData[_index]?.totalCount || 1;
          switch (seriesElement.name) {
            case this.translationPipe.transform(insightsWorkspaceConstants.charts.splineChart.yourSessions):
              tooltip += `${this.translationPipe.transform(insightsWorkspaceConstants.charts.splineChart.avgDurationPerContact)}: ${dataPoint.y ?
                moment.utc(60 * 1000 * (totalDuration / totalCount)).format('mm:ss') : '00:00'} minutes<br/>${seriesElement.name}: ${dataPoint.y}<br/>`;
              break;
            case this.translationPipe.transform(insightsWorkspaceConstants.charts.splineChart.peerAverage):
              peerAverage = `${seriesElement.name}: ${dataPoint.y}<br/>`;
          }
        }
      });
    });
    return tooltip + peerAverage;
  }
  public formatAreasplineChartLabel(value: number, componentDuration: number) {
    const date = new Date(value);
    if (componentDuration === 1) {
      return moment(value).format('h A');
    } else if (componentDuration <= 20) {
      return moment(date.getTime()).format('MMM D');
    } else {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      return moment(startOfWeek.getTime()).format('MMM D');
    }
  }

  public generateAreasplineChartData(name: string): [number, number][] {
    const data = [];
    let points, timeUnit, date, value;
    switch (this.duration) {
      case 1:
        points = 25;
        break;
      case 7:
        points = 7;
        break;
      case 14:
        points = 14;
        break;
      case 30:
        points = 30;
        break;
      default:
        points = this.differenceInDays;
        break;
    }
    if (this.duration === 1) {
      timeUnit = 'hours';
    } else {
      timeUnit = 'days';
    }
    if (this.filteredData?.length) {
      for (let i = 0; i < points; i++) {
        if (name === 'peerAverage') {
          date = new Date(this.filteredPeerData[i]?.date);
          value = this.filteredPeerData[i]?.avgCount;
        } else {
          date = new Date(this.filteredData[i]?.date);
          value = this.filteredData[i]?.totalCount;
        }
        const formatedDate =
          timeUnit === 'hours'
            ? Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), i)
            : Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        data.push([formatedDate, value]);
      }
      return data;
    } else {
      for (let i = 0; i < points; i++) {
        date = new Date(this.startDate || this.yesterday);
        if (timeUnit === 'days') {
          const setDurationValue = this.startDate ? 0 : this.duration;
          date.setDate(date.getDate() - setDurationValue + i + 1);
         }
        const formatedDate =
          timeUnit === 'hours'
            ? Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), i)
            : Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        data.push([formatedDate, 0]);
      }
      return data;
    }
  }

  private setBarChartOptions(): void {
    const componentDuration = this.duration;
    this.barChartData = this.getBarChartData();
    const formatBarChartTooltip = this.formatBarChartTooltip.bind(this);
    const isDataAvailable = this.filteredInterventionData?.length > 0;
    const maxTotalCount = this.interventionImpactMaxTotalCount;

    const improvedData = this.barChartData.map(d => d.data[0]).reverse();
    const declinedData = this.barChartData.map(d => d.data[1]).reverse();
    const noChangeData = this.barChartData.map(d => d.data[2]).reverse();
    const untrackedData = this.barChartData.map(d => d.data[3]).reverse();
    const emptyBarData = this.barChartData.map(d => {
      const total = d.data[0] + d.data[1] + d.data[2] + d.data[3];
      return (isDataAvailable && total === 0) ? maxTotalCount : 0;
    }).reverse();

    this.echartsBarOptions = {
      title: {
        text: !isDataAvailable ? this.translationPipe.transform(insightsWorkspaceConstants.charts.noDataAvailable) : '',
        left: 'center',
        top: 'middle',
        textStyle: {
          color: '#666666',
          fontSize: 14
        }
      },
      legend: {
        show: isDataAvailable,
        bottom: 0,
        itemWidth: 12,
        itemHeight: 5,
        textStyle: {
          fontSize: 10,
          color: '#666666'
        },
        data: [
          this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.improvedSentiment),
          this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.noChange),
          this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.declinedSentiment)
        ],
        selectedMode: false
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '1%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        min: 0,
        interval: isDataAvailable ? Math.ceil(maxTotalCount / 4) : 30,
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E3E4E5'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#666666'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: this.barChartData.map(d => d.name).reverse(),
        axisLine: {
          show: true,
          lineStyle: {
            color: '#666666',
            width: 1,
            type: 'solid'
          },
          onZero: false
        },
        z: 10,
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          if (!params) return '';
          const categoryIndex = params.dataIndex;
          const selectedObject = this.barChartData[this.barChartData.length - 1 - categoryIndex];
          const xValue = selectedObject.name;
          const total = selectedObject.data.reduce((sum, val) => sum + val, 0);

          if (total === 0) {
            const untrackedSeriesName = this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.untrackedSentiments);
            const seriesData = {
              name: untrackedSeriesName,
              data: this.barChartData.map(d => ({ category: d.name, y: d.data[3] }))
            };
            return formatBarChartTooltip(seriesData, xValue, 0, componentDuration);
          } else {
            const dataIndex = this.seriesIndexMap[params.seriesName] ?? 0;
            const seriesData = {
              name: params.seriesName,
              data: this.barChartData.map(d => ({ category: d.name, y: d.data[dataIndex] }))
            };
            return formatBarChartTooltip(seriesData, xValue, params.value, componentDuration);
          }
        }
      },
      series: [
        {
          type: 'bar',
          stack: 'total',
          data: emptyBarData,
          itemStyle: {
            color: insightsWorkspaceConstants.colors.barChart.transparent,
            borderRadius: [0, 5, 5, 0]
          },
          emphasis: {
            itemStyle: {
              color: insightsWorkspaceConstants.colors.barChart.emptyBarHover,
              borderRadius: [0, 5, 5, 0]
            }
          },
          barWidth: 16
        },
        {
          name: this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.improvedSentiment),
          type: 'bar',
          stack: 'total',
          data: improvedData,
          itemStyle: {
            color: insightsWorkspaceConstants.colors.barChart.improved,
            borderRadius: [0, 5, 5, 0]
          },
          emphasis: {
            itemStyle: {
              color: insightsWorkspaceConstants.colors.barChart.improved
            }
          },
          barWidth: 16
        },
        {
          name: this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.noChange),
          type: 'bar',
          stack: 'total',
          data: noChangeData,
          itemStyle: {
            color: insightsWorkspaceConstants.colors.barChart.noChange,
            borderRadius: [0, 5, 5, 0]
          },
          emphasis: {
            itemStyle: {
              color: insightsWorkspaceConstants.colors.barChart.noChange
            }
          },
          barWidth: 16
        },
        {
          name: this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.declinedSentiment),
          type: 'bar',
          stack: 'total',
          data: declinedData,
          itemStyle: {
            color: insightsWorkspaceConstants.colors.barChart.declined,
            borderRadius: [0, 5, 5, 0]
          },
          emphasis: {
            itemStyle: {
              color: insightsWorkspaceConstants.colors.barChart.declined
            }
          },
          barWidth: 16
        },
        {
          name: this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.untrackedSentiments),
          type: 'bar',
          stack: 'total',
          data: untrackedData,
          itemStyle: {
            color: insightsWorkspaceConstants.colors.barChart.transparent,
            borderRadius: [0, 5, 5, 0]
          },
          emphasis: {
            itemStyle: {
              color: insightsWorkspaceConstants.colors.barChart.emptyBarHover,
              borderRadius: [0, 5, 5, 0]
            }
          },
          barWidth: 16,
          showBackground: false
        }
      ]
    };
  }

  public formatBarChartTooltip(series, x, y, componentDuration): string {
    let tooltip;
    if (series.name === this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.untrackedSentiments)) {
      const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
      const dates = JSON.stringify(x);
      let finalDate;
      if (componentDuration > 1 && dates?.includes('-')) {
        const arr = dates.split('-');
        const startDate = new Date(arr[0] + ', 2024').toLocaleDateString('en-US', options);
        const endDate = new Date(arr[1] + ', 2024').toLocaleDateString('en-US', options);
        finalDate = `${startDate} - <br/> ${endDate} `;
      } else if (componentDuration === 1) {
        const today = new Date();
        today.setDate(today.getDate() - 1);
        finalDate = today.toLocaleDateString('en-US', options);
      } else {
        finalDate = new Date(x + ', 2024').toLocaleDateString('en-US', options);
      }
      const selectedObject = this.barChartData.find(element => element.name === x);
      tooltip = `${finalDate}<br/> ${this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.improvedSentiment)}: ${
        selectedObject?.data[0]
      }<br/> ${this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.noChange)}: ${
        selectedObject?.data[2]
      }<br/> ${this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.declinedSentiment)}: ${
        selectedObject?.data[1]
      } <br/><b> ${this.translationPipe.transform(insightsWorkspaceConstants.charts.barChart.totalSessions)}: ${selectedObject.data.reduce(
        (sum, value) => sum + value,
        0
      )} </b><br/> *${series.name}: ${selectedObject?.data[3]}`;
    } else {
      tooltip = `<b>${series.name}</b><br/>`;
      series.data.forEach(p => {
        tooltip += y === p.y && p.category === x ? `<b>${p.category}: ${p.y}</b><br/>` : `${p.category}: ${p.y}<br/>`;
      });
    }
    return tooltip;
  }

  public getBarChartData(): BarChartData[] {
    let data = [];
    const duration = this.duration;
    this.filteredInterventionData = this.interventionData?.interventionData;
    const today = new Date();
    let interval: number; // Interval in days or hours
      switch (duration) {
        case 1: // Last 1 day (Hourly intervals)
         this.interventionImpactMaxCountlist = [];
          interval = 4; // Interval in hours
          today.setHours(0, 0, 0, 0); // Set today to 12:00 AM
          for (let i = 0; i < 24; i += interval) {
            const startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 1);
            startDate.setHours(i, 0, 0, 0); // Set start hour
            const endDate = new Date(today);
            endDate.setHours(i + interval, 59, 59, 999); // Set end hour to the end of the interval
            const utcOffset = startDate.getTimezoneOffset() * 60000;
            const start = moment(startDate.getTime() - utcOffset).format('h A');
            const end = moment(endDate.getTime() - utcOffset).format('h A');
            data.push({
              name: `${start} - ${end}`,
              data: this.getInterventionData(i, interval)
            });
          }
          break;
        case 7:
         this.interventionImpactMaxCountlist = [];
          data = [...this.daysCalculation(7, today, 7)];
          break;
        case 14:
          this.interventionImpactMaxCountlist = [];
          data = [...this.daysCalculation(14, today, 14)];
          break;
        case 30: // Last 30 days
         this.interventionImpactMaxCountlist = [];
          data = [...this.getLastMonth()];
          break;
        default: {
          // Custom date range
          this.interventionImpactMaxCountlist = [];
          data = [...this.getCustomDate(6)];
          break;
        }
      }
      this.filteredInterventionData?.forEach((_, index) => {
        const [improvedSentiment, declinedSentiment, noChange, untrackedChange] = this.getInterventionDataForWeek(index);
        this.filteredInterventionData[index] = {
          ...this.filteredInterventionData[index],
          improvedSentiment,
          declinedSentiment,
          noChange,
          untrackedChange
        };
      });
      this.interventionImpactMaxTotalCount = Math.max(...this.interventionImpactMaxCountlist);
      return data;
  }

  public getInterventionData(index: number, diff: number): number[] {
    let improvedSentiment = 0;
    let declinedSentiment = 0;
    let noChange = 0;
    let untrackedChange = 0;
    for (let i = 0; i < diff; i++) {
      if (index < this.filteredInterventionData?.length) {
        const data = this.filteredInterventionData[index++]?.outcomes;
        for (const element of data) {
          switch (element.name) {
            case 'Improved':
              improvedSentiment += element.count;
              break;
            case 'Declined':
              declinedSentiment += element.count;
              break;
            case 'Neutral':
              noChange += element.count;
              break;
            default:
              untrackedChange += element.count;
              break;
          }
        }
      }
    }
    this.interventionImpactMaxCountlist.push(improvedSentiment+declinedSentiment+noChange+untrackedChange);
    return [improvedSentiment, declinedSentiment, noChange, untrackedChange];
  }

  public getInterventionDataForWeek(i: number): number[] {
    let improvedSentiment = 0;
    let declinedSentiment = 0;
    let noChange = 0;
    let untrackedChange = 0;
    if (this.filteredInterventionData?.length) {
      this.filteredInterventionData[i]?.outcomes.forEach(element => {
        switch (element.name) {
          case 'Improved':
            improvedSentiment += element.count;
            break;
          case 'Declined':
            declinedSentiment += element.count;
            break;
          case 'Neutral':
            noChange += element.count;
            break;
          default:
            untrackedChange += element.count;
            break;
        }
      });
    }
    this.interventionImpactMaxCountlist.push(improvedSentiment+declinedSentiment+noChange+untrackedChange);
    return [improvedSentiment, declinedSentiment, noChange, untrackedChange];
  }

  public daysCalculation(numberOfBars, today, duration) {
    const data = [];
    let labelName;
    for (let i = 0; i < numberOfBars; i++) {
      const inatalDate: Date = new Date();
      const yesterday = new Date(this.yesterday);
      yesterday.setDate(yesterday.getDate() - duration + 1);
      const interventionDate = (this.filteredInterventionData?.length && this.filteredInterventionData[i]?.date)? new Date(this.filteredInterventionData[i].date) : new Date(inatalDate.setDate(yesterday.getDate() + i));
      const date = new Date(interventionDate.getTime());
      if (duration <= 7) {
        labelName = moment(date.getTime()).format('MMM D');
      } else {
        const startDate = (this.filteredInterventionData?.length && this.filteredInterventionData[i + 1]?.date) ? new Date(this.filteredInterventionData[i + 1].date) : new Date(inatalDate.setDate(yesterday.getDate() + i + 1));
        const endDate = (this.filteredInterventionData?.length && this.filteredInterventionData[i]?.date) ? new Date(this.filteredInterventionData[i].date) : new Date(inatalDate.setDate(yesterday.getDate() + i));
        const startLabel = moment(startDate.getTime()).format('MMM D');
        const endLabel = moment(endDate.getTime()).format('MMM D');
        labelName = `${startLabel} - ${endLabel}`;
        ++i;
      }
      data.push({
        name: labelName,
        data: duration <= 7 ? this.getInterventionDataForWeek(i) : this.getInterventionData(i - 1, 2)
      });
    }
    return data.reverse();
  }

  public getLastMonth(): BarChartData[] {
    const data = [];
    let labels;
    for (let i = 0; i < this.duration; i += 5) {
      const initalStartDate = new Date(this.yesterday);
      const startDate = (this.filteredInterventionData?.length && this.filteredInterventionData[i + 5 - 1]?.date) ? new Date(this.filteredInterventionData[i + 5 - 1].date) : new Date(initalStartDate.setDate(initalStartDate.getDate() - this.duration + i + 5));
      const initalendDate = new Date(this.yesterday);
      const endDate = (this.filteredInterventionData?.length && this.filteredInterventionData[i]?.date) ? new Date(this.filteredInterventionData[i].date) : new Date(initalendDate.setDate(initalendDate.getDate()- this.duration + i + 1));
      const startLabel = moment(startDate.getTime()).format('MMM D');
      const endLabel = moment(endDate.getTime()).format('MMM D');
      labels = `${startLabel} - ${endLabel}`;
      data.push({
        name: labels,
        data: this.getInterventionData(i, 5)
      });
    }
    return data.reverse();
  }

  public getCustomDate(weeks: number): BarChartData[] {
    const data = [];
    let labelName;
    let division;
    let dataPointIndex = 0;
    if (this.differenceInDays <= 7) {
      division = this.differenceInDays;
      weeks = this.differenceInDays;
    } else {
      division = Math.round(this.differenceInDays / 6);
    }
    for (let i = 0; i < weeks; i++) {
      const date = new Date(this.startDate);
      if (this.differenceInDays <= 8) {
        date.setDate(this.startDate.getDate() + 1 + i);
        labelName = moment(date.getTime()).format('MMM D');
        data.push({
          name: labelName,
          data: this.getInterventionDataForWeek(i)
        });
      } else {
        if (dataPointIndex >= (this.filteredInterventionData?.length || this.differenceInDays)) {
          break;
        }
        const inatalStartDate: Date = new Date(this.startDate);
        const startDate = (this.filteredInterventionData?.length && this.filteredInterventionData[dataPointIndex + division - 1]?.date) ? new Date(this.filteredInterventionData[dataPointIndex + division - 1].date) : new Date(inatalStartDate.setDate(inatalStartDate.getDate() + dataPointIndex + division + 1));
        const inatalEndDate = new Date(this.startDate);
        const endDate = (this.filteredInterventionData?.length && this.filteredInterventionData[dataPointIndex]?.date) ? new Date(this.filteredInterventionData[dataPointIndex].date) : new Date(inatalEndDate.setDate(inatalEndDate.getDate() + dataPointIndex + 1));
        const startLabel = moment(startDate.getTime()).format('MMM D');
        const endLabel = moment(endDate.getTime()).format('MMM D');
        labelName = `${startLabel} - ${endLabel}`;
        data.push({
          name: labelName,
          data: this.getInterventionData(dataPointIndex, division)
        });
        dataPointIndex += division;
      }
    }
    return data.reverse();
  }

  public formatDateRange(startDate: Date, endDate: Date) {
    return `${moment(startDate.getTime()).format('MMM D')} - ${moment(endDate.getTime()).format('MMM D')}`;
  }

  public getDifferenceInDays(start: Date, end: Date): number {
    const diffInMs = end.getTime() - start.getTime();
    return diffInMs / (1000 * 60 * 60 * 24) + 1;
  }

  public listSelected(value) {
    this.displayCalender = false;
    if (value !== null) {
      this.duration = value;
      const stDate = this.getPastDate(this.duration, this.today);
      this.getMonitoringFreqData(stDate, this.yesterday);
      this.getInterventionBarData(stDate, this.yesterday);
      switch (this.duration) {
        case 1:
          this.dropDownLabel = this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.yesterday);
          break;
        case 7:
          this.dropDownLabel = this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.lastSevenDays);
          break;
        case 14:
          this.dropDownLabel = this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.lastFourteenDays);
          break;
        case 30:
          this.dropDownLabel = this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.lastThirtyDays);
          break;
        default:
          this.dropDownLabel = this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.yesterday);
          break;
      }
      this.min = null;
      this.max = null;
    }
  }

  public getFormattedDateRange(start: Date, end: Date): string {
    const startDay = start.getDate();
    const startMonth = start.toLocaleString('default', { month: 'long' });
    const startYear = start.getFullYear();

    const endDay = end.getDate();
    const endMonth = end.toLocaleString('default', { month: 'long' });
    const endYear = end.getFullYear();

    if (startYear !== endYear) {
      return `${startDay} ${startMonth} ${startYear} – ${endDay} ${endMonth} ${endYear}`;
    } else if (startMonth !== endMonth) {
      return `${startDay} ${startMonth} – ${endDay} ${endMonth} ${endYear}`;
    } else {
      return `${startDay} – ${endDay} ${startMonth} ${endYear}`;
    }
  }

  public dateSelected(value): void {
    this.startDate = value.start;
    this.endDate = value.end;
    this.differenceInDays = this.getDifferenceInDays(value.start, value.end);
    this.duration = this.differenceInDays;
    this.dropDownLabel = this.getFormattedDateRange(value.start, value.end);
    this.displayCalender = false;
    this.min = value.start;
    this.max = value.end;
    UserPreferencesService.instance.setPreference(SharedConstants.preferenceName.insightsWorkspace, { dropDownLabel: this.dropDownLabel, duration: this.duration, startDate: this.startDate, endDate: this.endDate, customDate: true});
    const stDate = moment(value.start).format('YYYY-MM-DD');
    const enDate = moment(value.end).format('YYYY-MM-DD');
    this.getMonitoringFreqData(stDate, enDate);
    this.getInterventionBarData(stDate, enDate);
  }
  // do not remove this method
  public onMenuClosed(): void {
    console.log('menu has been closed');
  }

  public loadInsightsWorkspaceData(value: string): void {
    let startDate: string, endDate: string;
    const yesterdayDate = new Date(this.today);
    yesterdayDate.setDate(this.today.getDate() - 1);
    this.yesterday = moment(yesterdayDate).format('YYYY-MM-DD');
    if (this.isCustomDate) {
      const todayDate = moment();
      const selectedStartDate = moment(this.startDate);
      const daysSinceStartDate = todayDate.diff(selectedStartDate, 'days');
      if (daysSinceStartDate > 90) {
        this.isCustomDate = false;
        UserPreferencesService.instance.setPreference(SharedConstants.preferenceName.insightsWorkspace, {
          dropDownLabel: this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.yesterday),
          duration: 1,
          startDate: this.yesterday,
          endDate: this.yesterday,
          customDate: false
        });
      } else {
        startDate = moment(this.startDate).format('YYYY-MM-DD');
        endDate = moment(this.endDate).format('YYYY-MM-DD');
      }
    } else {
      endDate = this.yesterday;
      startDate = this.getPastDate(this.duration, this.today);
    }
    switch (value) {
      case 'monitoringFrequency':
        this.getMonitoringFreqData(startDate, endDate);
        break;
      case 'interventionImpact':
        this.getInterventionBarData(startDate, endDate);
        break;
    }
  }

  // Helper function to add conditionally fullstop
private getFromLiveMonitoringText(sliderKey: string, alertPercent: number): string {
  const fromLiveMonitoring = this.translationPipe.transform(insightsWorkspaceConstants[sliderKey].slide4.fromLiveMonitoring);
  const fullStop = this.translationPipe.transform(insightsWorkspaceConstants[sliderKey].slide4.fullStop);
  return alertPercent === 0 ? fromLiveMonitoring + fullStop : fromLiveMonitoring;
}

public getInitials(name: string): string {
  if (!name) { return ''; }
  return name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
}

public giveAward(ticket: string): void {
  if (!ticket || this.awardedAgents.has(ticket) || this.pendingAwardTickets.has(ticket)) { return; }
  const agent = this.bestCallAgents.find(a => a.ticket === ticket);
  this.pendingAwardTickets = new Set(this.pendingAwardTickets);
  this.pendingAwardTickets.add(ticket);
  this.cd.markForCheck();
  this.solModalService.open(GamificationModalComponent, {
    width: '1280px',
    disableClose: true,
    data: { userId: agent?.userId }
  }).subscribe((result) => {
    this.pendingAwardTickets = new Set(this.pendingAwardTickets);
    this.pendingAwardTickets.delete(ticket);
    if (result === true) {
      this.bestCallAwardStateService.markAwarded(ticket);
    }
    this.cd.detectChanges();
  });
}

public initializeBestCallTableView(): any[] {
  return [
    {
      label: this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.viewAsATable),
      callbackFn: () => {
        this.solModalService.open(TableViewModalComponent, {
          width: '960px',
          disableClose: true,
          data: {
            type: 'BestCallOfWeek',
            agents: this.bestCallAgents,
            agentCount: this.bestCallAgents.length
          }
        });
      }
    }
  ];
}

}
