import { Component, OnInit } from '@angular/core';
import { MenusService } from 'src/app/services/menus.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Menu } from 'src/app/models/menu.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  menus: Menu[] = [];
  loading = false;
  error = '';
  restaurantId: number | null = null;
  restaurantName: string | null = null;

  constructor(
    private restaurantsService: RestaurantsService,
    private menusService: MenusService,
    private router: Router,
    private route: ActivatedRoute       // 🔥 Necesario para leer restaurantId
  ) { }

  ngOnInit(): void {

    this.restaurantId = Number(this.route.snapshot.paramMap.get('restaurantId'));

    if (this.restaurantId) {
      this.loadMenusByRestaurant(this.restaurantId);
      this.loadRestaurantName(this.restaurantId);
    } else {
      this.loadAllMenus();
    }
  }

  // 🔥 Cargar todos los menús (lo que ya tenías)
  loadAllMenus() {
    this.loading = true;
    this.menusService.list().subscribe({
      next: (data) => {
        this.menus = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar menús';
        this.loading = false;
      }
    });
  }

  // 🔥 Nuevo: Cargar los menús de un restaurante específico
  loadMenusByRestaurant(id: number) {
    this.loading = true;

    this.menusService.getMenusByRestaurant(id).subscribe({
      next: (data) => {
        this.menus = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar menús del restaurante';
        this.loading = false;
      }
    });
  }

  loadRestaurantName(id: number) {
    this.restaurantsService.view(id).subscribe({
      next: (restaurant) => this.restaurantName = restaurant.name,
      error: () => this.restaurantName = ''
    });
  }

  delete(id: number) {
    this.menusService.delete(id).subscribe(() => {
      this.menus = this.menus.filter(m => m.id !== id);
    });
  }

  update(id: number) {
    this.router.navigate(['/menus/update', id]);
  }

  create() {
    this.router.navigate(['/menus/create']);
  }
}
