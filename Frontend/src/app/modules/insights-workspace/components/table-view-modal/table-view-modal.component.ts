import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalModule, ModalService } from '@niceltd/sol/modal';
import { insightsWorkspaceConstants } from '../../constants/insights-workspace.const';
import { TranslationPipe, TranslationModule} from '@niceltd/cxone-core-services';
import { GamificationModalComponent } from '../../../../shared/modals/gamification-modal/gamification-modal.component';
import { BestCallAwardStateService } from '../../services/best-call-award-state.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-table-view-modal',
  standalone: true,
  imports: [CommonModule, ModalModule, TranslationModule],
  template: `
<sol-modal (closed)="onClose()" (dismissed)="onDismiss()">
  <sol-modal-header [ngSwitch]="data.type">
    <span *ngSwitchCase="monitoringFrequencyTitle">{{'insightsWorkspace.monitoringFrequency.monitoringFrequencyTableView'
      | translate}}</span>
    <span *ngSwitchCase="interventionImpactTitle">{{'insightsWorkspace.interventionImpact.interventionImpactTableView'
      | translate }}</span>
    <span *ngSwitchCase="bestCallOfWeekTitle">{{'insightsWorkspace.bestCallOfWeek.tableViewTitle' | translate}}</span>
  </sol-modal-header>
  <sol-modal-body>
    <ng-container *ngIf="data.type !== bestCallOfWeekTitle">
      <p class="common-text"><span> {{'insightsWorkspace.dateOfThe' | translate}} </span> {{ data.selectedDate }}</p>
      <div class="table-container">
        <table class="table table-rounded">
          <thead>
            <tr [ngSwitch]="data.type">
              <th>{{( data.selectedDate === yesterdayTitle ? 'insightsWorkspace.timeText' : 'insightsWorkspace.dateText') | translate}}</th>
              <ng-container *ngSwitchCase="monitoringFrequencyTitle">
                <th >{{'insightsWorkspace.monitoringFrequency.yourSessions'
                  | translate}}</th>
                <th >{{'insightsWorkspace.monitoringFrequency.peerSessions'
                    | translate}}</th>
                <th >{{'insightsWorkspace.monitoringFrequency.yourSessionsAverage'
                    | translate}}</th>
              </ng-container>
              <ng-container *ngSwitchCase="interventionImpactTitle">
                <th>{{'insightsWorkspace.interventionImpact.barChart.improvedSentiment' | translate}}</th>
                <th>{{'insightsWorkspace.interventionImpact.barChart.declinedSentiment' | translate}}</th>
                <th>{{'insightsWorkspace.interventionImpact.barChart.noChange' | translate}}</th>
                <th>{{'insightsWorkspace.interventionImpact.barChart.unmonitoredSentiment' | translate}}</th>
                <th>{{'insightsWorkspace.interventionImpact.barChart.totalInterventions' | translate}}</th>
              </ng-container>
            </tr>
          </thead>
          <tbody class="table-group-divider table-body-scroll">
            <tr *ngFor="let value of data.filteredData" [ngSwitch]="data.type">
              <td>{{ data.selectedDate === yesterdayTitle ? value.timeInterval : getformatedDate(value.date)}}</td>
              <ng-container *ngSwitchCase="monitoringFrequencyTitle">
                <td >{{value.totalCount}}</td>
                <td >{{value.peerData.avgCount}}</td>
                <td >{{value.yourAverage}}</td>
              </ng-container>
              <ng-container *ngSwitchCase="interventionImpactTitle">
                <td>{{value.improvedSentiment}}</td>
                <td>{{value.declinedSentiment}}</td>
                <td>{{value.noChange}}</td>
                <td>{{value.untrackedChange}}</td>
                <td>{{value.totalCount}}</td>
              </ng-container>
            </tr>
          </tbody>
        </table>
      </div>
    </ng-container>

    <ng-container *ngIf="data.type === bestCallOfWeekTitle">
      <p class="common-text">{{ 'insightsWorkspace.bestCallOfWeek.tableSubtitle' | translate }} · {{ data.agentCount }} agents</p>
      <div class="table-container">
        <table class="table table-rounded best-call-table">
          <thead>
            <tr>
              <th>{{ 'insightsWorkspace.bestCallOfWeek.srNo' | translate }}</th>
              <th>{{ 'insightsWorkspace.bestCallOfWeek.crmTicket' | translate }}</th>
              <th>{{ 'insightsWorkspace.bestCallOfWeek.agentName' | translate }}</th>
              <th>{{ 'insightsWorkspace.bestCallOfWeek.summaryOfBestCall' | translate }}</th>
              <th class="text-center">{{ 'insightsWorkspace.bestCallOfWeek.score' | translate }}</th>
              <th class="text-center">{{ 'insightsWorkspace.bestCallOfWeek.award' | translate }}</th>
            </tr>
          </thead>
          <tbody class="table-group-divider table-body-scroll">
            <tr *ngFor="let agent of data.agents; let i = index" class="best-call-row">
              <td class="text-center sr-no">{{ i + 1 }}</td>
              <td class="ticket-cell">{{ agent.ticket }}</td>
              <td class="agent-cell">
                <span class="agent-avatar" [style.background]="agent.tint">{{ getInitials(agent.agent) }}</span>
                <span class="agent-name">{{ agent.agent }}</span>
              </td>
              <td class="summary-cell">{{ agent.summary }}</td>
              <td class="text-center">
                <span class="score-badge" [class.score-badge--high]="agent.score >= 9" [class.score-badge--mid]="agent.score >= 8 && agent.score < 9">
                  {{ agent.score.toFixed(1) }}
                </span>
              </td>
              <td class="text-center">
                <button
                  class="best-call-award-btn"
                  [class.best-call-award-btn--awarded]="awardedAgents.has(agent.ticket)"
                  [disabled]="awardedAgents.has(agent.ticket) || pendingAwardTickets.has(agent.ticket)"
                  (click)="giveAward(agent.ticket)">
                  {{ (awardedAgents.has(agent.ticket) ? 'insightsWorkspace.bestCallOfWeek.awarded' : 'insightsWorkspace.bestCallOfWeek.giveAward') | translate }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ng-container>
  </sol-modal-body>
</sol-modal>
  `,
  styleUrl: './table-view-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TableViewModalComponent implements OnInit, OnDestroy {
  public monitoringFrequencyTitle: string = 'MonitoringFrequency';
  public interventionImpactTitle: string = 'InterventionImpact';
  public bestCallOfWeekTitle: string = 'BestCallOfWeek';
  public yesterdayTitle: string = this.translationPipe.transform(insightsWorkspaceConstants.dropdownLabel.yesterday);
  public awardedAgents: ReadonlySet<string> = new Set<string>();
  public pendingAwardTickets: Set<string> = new Set<string>();
  private readonly destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private solModalService: ModalService,
    private translationPipe: TranslationPipe,
    private cd: ChangeDetectorRef,
    private bestCallAwardStateService: BestCallAwardStateService
  ) {}

  ngOnInit(): void {
    this.bestCallAwardStateService.awardedTickets$
      .pipe(takeUntil(this.destroy$))
      .subscribe(tickets => {
        this.awardedAgents = tickets;
        this.cd.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onDismiss(): void {
    this.solModalService.close(false);
  }
  public onClose(): void {
    this.solModalService.close(true);
  }
  public truncateString(str: string, length: number = 20): string {
    if (str.length > length) {
      return str.substring(0, length) + '...';
    }
    return str;
  }
  public getformatedDate(value: string): string {
    const date = new Date(value);
    const options: any = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/(\d{2} \w{3}) (\d{4})/, '$1, $2');
  }
  public getInitials(name: string): string {
    if (!name) { return ''; }
    return name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();
  }
  public giveAward(ticket: string): void {
    if (!ticket || this.awardedAgents.has(ticket) || this.pendingAwardTickets.has(ticket)) { return; }
    const agent = this.data.agents?.find((a: any) => a.ticket === ticket);
    this.pendingAwardTickets = new Set(this.pendingAwardTickets);
    this.pendingAwardTickets.add(ticket);
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
}
