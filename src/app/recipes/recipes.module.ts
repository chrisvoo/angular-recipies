import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipesComponent } from './recipes.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { ShortenPipe } from '../pipes/shorten.pipe';
import { RecipesRoutingModule } from './recipes.routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    RecipeStartComponent,
    RecipeEditComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShortenPipe
  ],
  exports: [
    ShortenPipe
  ],
  imports: [
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    RecipesRoutingModule
  ],
  providers: []
})
export class RecipesModule { }
