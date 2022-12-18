import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeResolver implements Resolve<Recipe[]> {
  constructor(private dataStorage: DataStorageService, private recipeService: RecipeService) {}

  /* no need to subscribe, resolve will do for us */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Recipe[]> {
    const recipies = this.recipeService.getRecipies();
    return recipies.length === 0 ? this.dataStorage.fetchRecipies() : of(recipies);
  }
}
