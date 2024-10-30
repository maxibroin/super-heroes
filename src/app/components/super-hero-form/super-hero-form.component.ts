import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UppercaseDirective } from '../../directives/uppercase.directive';
import { SuperHero } from '../../services/super-hero/models/super-hero.model';

@Component({
  selector: 'app-super-hero-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    UppercaseDirective,
  ],
  templateUrl: './super-hero-form.component.html',
  styleUrls: ['./super-hero-form.component.scss'],
})
export class SuperHeroFormComponent implements OnInit {
  heroForm: FormGroup;
  isEditMode: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SuperHeroFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hero?: SuperHero }
  ) {
    this.isEditMode = !!data.hero;
    this.heroForm = this.fb.group({
      name: ['', Validators.required],
      power: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.isEditMode) {
      this.heroForm.patchValue(this.data.hero!);
    }
  }

  onSubmit() {
    if (this.heroForm.valid) {
      const hero: Partial<SuperHero> = this.heroForm.value;
      if (this.isEditMode) {
        hero.id = this.data.hero!.id;
      }
      this.dialogRef.close(hero);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
