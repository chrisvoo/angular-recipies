import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { LOGOUT } from '../auth/store/auth.actions';
import User from '../auth/user.model';
import { DataStorageService } from '../shared/data-storage.service';
import { AppState, AuthState } from '../store/app.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isAuthenticated = false;
  private userSub!: Subscription;

  constructor(
    private storage: DataStorageService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.userSub = this.store.select('auth').pipe(
      map((auth: AuthState) => auth.user)
    ).subscribe((user: User | undefined) => {
      this.isAuthenticated = !!user;
    })
  }

  ngOnDestroy(): void {
      this.userSub.unsubscribe();
  }

  onLogOut(): void {
    this.store.dispatch(LOGOUT())
  }

  onSaveData() {
    this.storage.storeRecipes();
  }

  onFetchData() {
    this.storage.fetchRecipies().subscribe()
  }
}
