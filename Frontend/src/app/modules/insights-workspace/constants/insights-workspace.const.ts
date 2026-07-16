export class insightsWorkspaceConstants {
  public static colors: any = {
    barChart: {
      improved: '#0ac57c',
      noChange: '#4cbae5',
      declined: '#f6384e',
      emptyBarHover: 'rgba(76, 186, 229, 0.2)',
      transparent: 'transparent'
    }
  };

  public static dropdownLabel: any = {
    yesterday: 'insightsWorkspace.dropdownLabels.yesterday',
    lastSevenDays: 'insightsWorkspace.dropdownLabels.lastSevenDays',
    lastFourteenDays: 'insightsWorkspace.dropdownLabels.lastFourteenDays',
    lastThirtyDays: 'insightsWorkspace.dropdownLabels.lastThirtyDays',
    customDates: 'insightsWorkspace.dropdownLabels.customDates',
    viewAsATable: 'insightsWorkspace.dropdownLabels.viewAsATable'
  };
  public static session: any = {
    voiceSessions: 'insightsWorkspace.monitoringFrequency.session.voiceSessions',
    digitalSessions: 'insightsWorkspace.monitoringFrequency.session.digitalSessions',
    screenMonitoring: 'insightsWorkspace.monitoringFrequency.session.screenMonitoring'
  };

  public static charts: any = {
    areasplineChartYAxisTitle: 'insightsWorkspace.monitoringFrequency.areasplineChart.yAxisTitle',
    noDataAvailable: 'insightsWorkspace.noDataAvailable',
    barChart: {
      subtitle: 'insightsWorkspace.interventionImpact.barChart.subtitle',
      untrackedSentiments: 'insightsWorkspace.interventionImpact.barChart.untrackedSentiments',
      noChange: 'insightsWorkspace.interventionImpact.barChart.noChange',
      declinedSentiment: 'insightsWorkspace.interventionImpact.barChart.declinedSentiment',
      improvedSentiment: 'insightsWorkspace.interventionImpact.barChart.improvedSentiment',
      totalSessions: 'insightsWorkspace.interventionImpact.barChart.totalSessions'
    },
    splineChart: {
      peerAverage: 'insightsWorkspace.monitoringFrequency.areasplineChart.peerAverage',
      yourSessions: 'insightsWorkspace.monitoringFrequency.areasplineChart.yourSessions',
      avgDurationPerContact: 'insightsWorkspace.monitoringFrequency.avgDurationPerContact'
    }
  };
  public static monitorFrequencySlider: any = {
    slide1: {
      header: 'insightsWorkspace.monitoringFrequency.slides.slide1.header',
      moreSession: 'insightsWorkspace.monitoringFrequency.slides.slide1.moreSession',
      lessSession: 'insightsWorkspace.monitoringFrequency.slides.slide1.lessSession',
      targetGoal: 'insightsWorkspace.monitoringFrequency.slides.slide1.targetGoal'
    },
    slide2: {
      header: 'insightsWorkspace.monitoringFrequency.slides.slide2.header',
      moreSession: 'insightsWorkspace.monitoringFrequency.slides.slide2.moreSession',
      lessSession: 'insightsWorkspace.monitoringFrequency.slides.slide2.lessSession',
      targetGoal: 'insightsWorkspace.monitoringFrequency.slides.slide2.targetGoal'
    },
    slide3: {
      header: 'insightsWorkspace.monitoringFrequency.slides.slide3.header',
      moreSession: 'insightsWorkspace.monitoringFrequency.slides.slide3.moreSession',
      lessSession: 'insightsWorkspace.monitoringFrequency.slides.slide3.lessSession',
      targetGoal: 'insightsWorkspace.monitoringFrequency.slides.slide3.targetGoal'
    },
    slide4: {
      header: 'insightsWorkspace.monitoringFrequency.slides.slide4.header',
      moreSession: 'insightsWorkspace.monitoringFrequency.slides.slide4.moreSession',
      fromLiveMonitoring: 'insightsWorkspace.monitoringFrequency.slides.slide4.fromLiveMonitoring',
      targetGoal: 'insightsWorkspace.monitoringFrequency.slides.slide4.targetGoal',
      fromAlerts: 'insightsWorkspace.monitoringFrequency.slides.slide4.fromAlerts',
      onlyFromAlerts: 'insightsWorkspace.monitoringFrequency.slides.slide4.onlyFromAlerts',
      fullStop: 'insightsWorkspace.monitoringFrequency.slides.slide4.fullStop'
    }
  };
  public static interventionImpactSlider: any = {
    slide1: {
      header: 'insightsWorkspace.interventionImpact.slides.slide1.header',
      moreSession: 'insightsWorkspace.interventionImpact.slides.slide1.moreSession',
      lessSession: 'insightsWorkspace.interventionImpact.slides.slide1.lessSession',
      timePeriod: 'insightsWorkspace.interventionImpact.slides.slide1.timePeriod'
    },
    slide2: {
      header: 'insightsWorkspace.interventionImpact.slides.slide2.header',
      moreSession: 'insightsWorkspace.interventionImpact.slides.slide2.moreSession',
      lessSession: 'insightsWorkspace.interventionImpact.slides.slide2.lessSession',
      timePeriod: 'insightsWorkspace.interventionImpact.slides.slide2.timePeriod'
    },
    slide3: {
      header: 'insightsWorkspace.interventionImpact.slides.slide3.header',
      moreSession: 'insightsWorkspace.interventionImpact.slides.slide3.moreSession',
      lessSession: 'insightsWorkspace.interventionImpact.slides.slide3.lessSession',
      timePeriod: 'insightsWorkspace.interventionImpact.slides.slide3.timePeriod'
    },
    slide4: {
      moreSession: 'insightsWorkspace.interventionImpact.slides.slide4.moreSession',
      fromLiveMonitoring: 'insightsWorkspace.interventionImpact.slides.slide4.fromLiveMonitoring',
      timePeriod: 'insightsWorkspace.interventionImpact.slides.slide4.timePeriod',
      fromAlerts: 'insightsWorkspace.interventionImpact.slides.slide4.fromAlerts',
      onlyFromAlerts: 'insightsWorkspace.interventionImpact.slides.slide4.onlyFromAlerts',
      fullStop: 'insightsWorkspace.interventionImpact.slides.slide4.fullStop'
    }
  };
}