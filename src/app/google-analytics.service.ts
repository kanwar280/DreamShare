import { Injectable } from '@angular/core';

declare let gtag: Function; // Declare the gtag function to be used in the service

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalyticsService {

  constructor() {}

  // Track page view
  trackPageView(url: string): void {
    gtag('config', 'G-3J4KM7XDR1', {
      page_path: url,
    });
  }

  // Track events
  trackEvent(eventName: string, eventParams: { [key: string]: any }): void {
    gtag('event', eventName, eventParams);
  }
}