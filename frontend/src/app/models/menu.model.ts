import { Product } from "./product.model";
import { Restaurant } from "./restaurant.model";

export class Menu {
    id?: number;
    price?: number;
    availability?: boolean;
    restaurant?: Restaurant;
    product?: Product
}
