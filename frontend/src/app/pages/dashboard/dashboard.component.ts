import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading: boolean = false;
  restaurants: any[] = [];
  error: string | null = null;

  constructor(
    private restaurantsService: RestaurantsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRestaurants();
  }

  getRestaurants() {
    this.loading = true;

    this.restaurantsService.list().subscribe({
      next: (r) => {
        this.restaurants = r;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los restaurantes.';
        console.error(err);
        this.loading = false;
      }
    });
  }
  select(id: number) {
  this.router.navigate(['/menus/restaurant', id]);
  }


}
