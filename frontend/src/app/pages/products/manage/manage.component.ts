import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1: view, 2: create, 3: update
  product: Product;
  theFormGroup: FormGroup;
  trySend: boolean;
  category: string[] = [
  "Comida Rápida",
  "Comida Internacional",
  "Comida Tradicional",
  "Comida Saludable",
  "Postres",
  "Bebidas",
  "Desayunos",
  "Almuerzos",
  "Cenas",
  "Snacks"
];
  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.trySend = false;
    this.product = { id: 0 };
    this.configFormGroup();

  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    if (this.activatedRoute.snapshot.params.id) {
      this.product.id = this.activatedRoute.snapshot.params.id;
      this.getProduct(this.product.id);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      id: [{ value: 0, disabled: true }], // ID no editable
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(1)]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getProduct(id: number) {
    this.productsService.view(id).subscribe({
      next: (response) => {
        this.product = response;

        this.theFormGroup.patchValue({
          id: this.product.id,
          name: this.product.name,
          description: this.product.description,
          category: this.product.category,
          price: this.product.price
        });
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      }
    });
  }

  back() {
    this.router.navigate(['/products/list']);
  }

  create() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'error',
      });
      return;
    }

    const productData = this.theFormGroup.getRawValue();

    this.productsService.create(productData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Creado!',
          text: 'Producto creado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/products/list']);
      },
      error: (error) => {
        console.error('Error creating product:', error);
      }
    });
  }

  update() {
    this.trySend = true;

    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, completa todos los campos requeridos.',
        icon: 'error',
      });
      return;
    }

    const productData = this.theFormGroup.getRawValue();

    this.productsService.update(productData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Actualizado!',
          text: 'Producto actualizado correctamente.',
          icon: 'success',
        });
        this.router.navigate(['/products/list']);
      },
      error: (error) => {
        console.error('Error updating product:', error);
      }
    });
  }
}
