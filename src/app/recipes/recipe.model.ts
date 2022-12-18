import { Ingredient } from "../shared/ingredient.model";

export class Recipe {
  public id: number;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor();
  constructor(id?: number, name?: string, description?: string, imagePath?: string, ingredients?: Ingredient[]);
  constructor(
    id?: number,
    name?: string,
    description?: string,
    imagePath?: string,
    ingredients?: Ingredient[]
    ) {
      this.id = id ?? 0
      this.name = name ?? '';
      this.description = description ?? '';
      this.imagePath = imagePath ?? '';
      this.ingredients = ingredients ?? [];
  }
}
