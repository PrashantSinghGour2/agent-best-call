import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BestCallAwardStateService {
  private readonly _awardedTickets = new Set<string>();
  private readonly _awardedTickets$ = new BehaviorSubject<ReadonlySet<string>>(this._awardedTickets);

  public readonly awardedTickets$ = this._awardedTickets$.asObservable();

  public isAwarded(ticket: string): boolean {
    return this._awardedTickets.has(ticket);
  }

  public markAwarded(ticket: string): void {
    this._awardedTickets.add(ticket);
    this._awardedTickets$.next(new Set(this._awardedTickets));
  }
}
