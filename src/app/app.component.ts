import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Tasty recipies!'

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoLogin()
  }


}
