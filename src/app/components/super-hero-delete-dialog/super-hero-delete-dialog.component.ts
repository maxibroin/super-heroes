import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-super-hero-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './super-hero-delete-dialog.component.html',
  styleUrls: ['./super-hero-delete-dialog.component.scss'],
})
export class SuperHeroDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuperHeroDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { heroName: string }
  ) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
