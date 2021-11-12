import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { Geolocation } from '@capacitor/geolocation';
import { Geofence } from '@ionic-native/geofence/ngx';
import { LocationService } from '../location.service';
import { DatePipe } from '@angular/common';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationLog {
  employeeId: number;
  latitude: number;
  longitude: number;
  message: string;
  locationTime: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  messageCount = 0;
  location: Location = undefined;
  flag1 = false;
  flag2 = false;
  alerts = [];
  constructor(private data: DataService, private geofence: Geofence,
     private locationService: LocationService, private datepipe: DatePipe) {
    this.geofence.initialize().then(
      () => {
        console.log('Geofence Plugin Ready');
        this.flag1 = true;
      },
      (err) => console.log(err)
    );
  }

  ngOnInit() {
    this.printCurrentPosition();
    this.addGeofence();
  }

  /* ngOnDestroy() {
    this.geofence.removeAll();
  } */

  refresh(ev) {
    setTimeout(() => {
      ev.detail.complete();
    }, 3000);
  }

  async printCurrentPosition(): Promise<void> {
    const coordinates = await Geolocation.getCurrentPosition();
    this.location = {
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude
    };
    console.log('Current position:', coordinates);
    const rand = Math.floor(Math.random() * 4) + 1;
    const timestamp = this.datepipe.transform(new Date(), 'yyyy-MM-ddThh:mm:ssZ');
    const data: LocationLog = {
      employeeId: rand,
      latitude: this.location.latitude,
      longitude: this.location.longitude,
      message: 'new message',
      locationTime: timestamp
    };
    /*
    const formdata = new FormData();
     formdata.append('employeeId', rand);
    formdata.append('latitude', this.location.latitude.toString());
    formdata.append('longitude', this.location.longitude.toString());
    formdata.append('message', 'new message');
    formdata.append('locationTime', timestamp); */

    this.locationService.sendLocation(data).then(response => {
      if (response) {
        console.log(response);
      }
    });

  };

  async addGeofence(): Promise<void> {
    //options describing geofence
    const fence = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3748acdb', //any unique ID
      latitude:       23.7747012, //center of geofence radius
      longitude:      90.4185318,
      radius:         100, //radius to edge of geofence in meters
      transitionType: 3, //see 'Transition Types' below
      notification: { //notification settings
        id: 1, //any unique ID
        title: 'You crossed a fence!', //notification title
        text: 'You just went near the Hatirjhil park.', //notification body
        smallIcon: 'res://assets/icon/favicon.png',
        icon: 'res://assets/icon/favicon.png',
        openAppOnClick: true //open app when notification is tapped
      }
    };

    const fence2 = {
      id: '69ca1b88-6fbe-4e80-a4d4-ff4d3948acab', //any unique ID
      latitude:       23.774394, //center of geofence radius
      longitude:      90.419825,
      radius:         30, //radius to edge of geofence in meters
      transitionType: 3, //see 'Transition Types' below
      /* notification: { //notification settings
        id: 2, //any unique ID
        title: 'Goodbye!', //notification title
        text: 'You left house.', //notification body
        smallIcon: 'res://public/assets/icon/favicon.png',
        icon: 'res://public/assets/icon/favicon.png',
        openAppOnClick: true //open app when notification is tapped
      } */
    };

    this.geofence.addOrUpdate([fence, fence2]).then(
       () => {
         console.log('Geofences added');
         this.flag2 = true;
       },
       (err) => console.log('Geofence failed to add' + err)
    );

    this.geofence.onTransitionReceived().subscribe(response => {
      response.map((resp) => {
        this.alerts.push(resp.notification.text);
      });
    });

   /*  this.geofence.getWatched().then((geofencesJson) => {
      const geofences = JSON.parse(geofencesJson);
      console.log(geofencesJson);
    }); */
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }

  getMessageCount(): number {
    return this.data.getMessageCount();
  }

}
