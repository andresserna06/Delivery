import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  products: Product[] = []; // ⚠ inicializar como array vacío
  loading = false;
  error = '';

  constructor(private productsService: ProductsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.productsService.list().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); // confirma que llegan
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error al cargar productos';
        this.loading = false;
      }
    });
  }

  delete(id: number) {
    // ejemplo simple
    this.productsService.delete(id).subscribe(() => {
      this.products = this.products.filter(p => p.id !== id);
    });
  }
  update(id: number) {
    this.router.navigate(['/products/update', id]);
  }
  create() {
    this.router.navigate(['/products/create']);
}
}
