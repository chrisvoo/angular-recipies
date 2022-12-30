import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AUTO_LOGIN } from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tasty recipies!'

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AUTO_LOGIN())
  }


}
