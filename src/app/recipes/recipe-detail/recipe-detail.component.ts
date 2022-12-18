import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  public recipe: Recipe | undefined;
  private recipeId: number = 0;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.recipeId = +this.route.snapshot.params['id'];
      this.recipe = this.recipeService.getRecipeById(params['id']);
      if (!this.recipe) {
        console.log("Can't find recipe " + this.recipeId)
        this.router.navigate(['/recipe-list'])
      }
    })
  }

  toShoppingList(ingredients: Ingredient[] | undefined) {
    if (ingredients !== undefined) {
      this.recipeService.addIngredientsToShoppingList(ingredients);
    }
  }

  onRecipeEdit() {
    this.router.navigate(['edit'], { relativeTo: this.route })
  }

  onRecipeDelete() {
    this.recipeService.deleteRecipe(this.recipeId)
    this.router.navigate(['/recipe-list'])
  }
}
