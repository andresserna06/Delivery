import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IssueService } from 'src/app/services/issue.service';
import { Issue } from 'src/app/models/issue.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-issue',
  templateUrl: './manage-issue.component.html',
  styleUrls: ['./manage-issue.component.scss']
})
export class ManageComponent implements OnInit {
  mode!: number; // 1: view, 2: create, 3: update
  issue: Issue;
  theFormGroup: FormGroup;
  trySend: boolean;
  motoId!: number; // motoId de la moto actual
  issueId!: number; // id del issue para update/view

  constructor(
    private activatedRoute: ActivatedRoute,
    private issueService: IssueService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.trySend = false;
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activatedRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) this.mode = 1;
    else if (currentUrl.includes('create')) this.mode = 2;
    else if (currentUrl.includes('update')) this.mode = 3;

    // Dependiendo del modo, obtenemos parámetros
    if (this.mode === 2) {
      // Crear → necesitamos motoId
      const paramMoto = this.activatedRoute.snapshot.paramMap.get('motoId');
      this.motoId = paramMoto ? Number(paramMoto) : 0;

      // Inicializamos motorcycle_id en el formulario
      this.theFormGroup.patchValue({ motorcycle_id: this.motoId });
    } else if (this.mode === 3 || this.mode === 1) {
      // Update o view → necesitamos issueId
      const paramId = this.activatedRoute.snapshot.paramMap.get('id');
      this.issueId = paramId ? Number(paramId) : 0;

      if (this.issueId) this.getIssue(this.issueId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      id: [{ value: 0, disabled: true }],
      description: ['', [Validators.required, Validators.minLength(5)]],
      issue_type: ['Falla mecánica', [Validators.required]],
      status: ['Pendiente', [Validators.required]],
      motorcycle_id: [0, [Validators.required]]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getIssue(id: number) {
    this.issueService.view(id).subscribe({
      next: res => {
        this.issue = res;
        this.motoId = this.issue.motorcycle_id;

        this.theFormGroup.patchValue({
          id: this.issue.id,
          description: this.issue.description,
          issue_type: this.issue.issue_type,
          status: this.issue.status,
          motorcycle_id: this.issue.motorcycle_id
        });
      },
      error: err => console.error('Error fetching issue:', err)
    });
  }


  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete todos los campos requeridos', 'error');
      return;
    }

    const payload = this.theFormGroup.getRawValue();
    this.issueService.create(payload).subscribe({
      next: () => {
        Swal.fire('Creado', 'Issue registrado correctamente', 'success');
        this.back();
      },
      error: err => console.error('Error creating issue:', err)
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error', 'Complete todos los campos requeridos', 'error');
      return;
    }

    const payload = this.theFormGroup.getRawValue();
    this.issueService.update(payload).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Issue actualizado correctamente', 'success');
        this.back();
      },
      error: err => console.error('Error updating issue:', err)
    });
  }

  back() {
    // Volvemos al listado de issues de la moto
    this.router.navigate([`/issues/motoId/${this.motoId}`]);
  }

}
