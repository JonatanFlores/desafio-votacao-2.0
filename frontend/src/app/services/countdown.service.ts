import { Injectable } from '@angular/core';
import { Observable, interval, map, startWith, takeWhile } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  startCountdown(endDate: string): Observable<string> {
    const endDateMillis = new Date(endDate).getTime();
    return interval(1000).pipe(
      startWith(0),
      map(() => {
        const now = Date.now();
        const timeLeft = endDateMillis - now;
        return timeLeft;
      }),
      takeWhile((timeLeft) => timeLeft >= 0),
      map((timeLeft) => {
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      })
    );
  }
}
