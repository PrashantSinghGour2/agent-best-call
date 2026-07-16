import { Injectable } from '@angular/core';
import { TenantCrossDomainParamsService } from '@niceltd/cxone-client-platform-services';
import { HttpUtils } from '@niceltd/cxone-core-services';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsightsDataService {

  constructor(public httpUtils: HttpUtils) { }

  public loadACDBaseURL() : Promise<string> {
    return TenantCrossDomainParamsService.instance.getTenantBaseUrl().then(res => {
      return res.niceBaseUrl;
    });
  }

  public getMonitoringFrequencyData(startDate: string, endDate: string, timeZone: string): Promise<any> {
    return this.loadACDBaseURL().then(() => {
      return this.httpUtils
        .apiPost(
          '/sup-data-insights-provider/v1/supervisor-metrics/monitoring-frequency',
          {
            startDateTime: startDate + 'T00:00:00.000',
            endDateTime: endDate + 'T23:59:59.999',
            timeZone: timeZone
          },
          false
        )
        .pipe(
          map(monitoringData => {
            return monitoringData;
          })
        )
        .toPromise();
    });
  }

  public getInterventionData(startDate: string, endDate: string, timeZone: string): Promise<any> {
    return this.loadACDBaseURL().then(() => {
      return this.httpUtils
        .apiPost(
          '/sup-data-insights-provider/v1/supervisor-metrics/intervention-impact',
          {
            startDateTime: startDate + 'T00:00:00.000',
            endDateTime: endDate + 'T23:59:59.999',
            timeZone: timeZone
          },
          false
        )
        .pipe(
          map(monitoringData => {
            return monitoringData;
          })
        )
        .toPromise();
    });
  }

}
