import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';
import { LocationLog } from './home/home.page';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  baseUrl = 'https://875c-103-56-5-196.ngrok.io';

  constructor(private http: HTTP) { }

  sendLocation(data: LocationLog): Promise<any> {
    const headers = {
      contentType: 'application/x-www-form-urlencoded'
    };
    const url = `${this.baseUrl}/api/locationlogs/`;
    return this.http.post(url, data, headers);
  }
}
