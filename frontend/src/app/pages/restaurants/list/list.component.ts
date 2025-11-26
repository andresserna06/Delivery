import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  restaurants: Restaurant[] = []; // ⚠ inicializar como array vacío
  loading = false;
  error = '';

  constructor(private restaurantsServices: RestaurantsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.restaurantsServices.list().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); // confirma que llegan
        this.restaurants = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar restaurantes';
        this.loading = false;
      }
    });
  }

  delete(id: number) {
    // ejemplo simple
    this.restaurantsServices.delete(id).subscribe(() => {
      this.restaurants = this.restaurants.filter(p => p.id !== id);
    });
  }
  update(id: number) {
    this.router.navigate(['/restaurants/update', id]);
  }
  create() {
    this.router.navigate(['/restaurants/create']);

  }
  
}
