import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { SuperHeroDeleteDialogComponent } from '../../components/super-hero-delete-dialog/super-hero-delete-dialog.component';
import { SuperHeroFormComponent } from '../../components/super-hero-form/super-hero-form.component';
import { SuperHero } from '../../services/super-hero/models/super-hero.model';
import { SuperHeroService } from '../../services/super-hero/super-hero.service';
@Component({
  selector: 'app-super-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [SuperHeroService],
  templateUrl: './super-hero-list.component.html',
  styleUrls: ['./super-hero-list.component.scss'],
})
export class SuperHeroListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'power', 'actions'];
  heroes = signal<SuperHero[]>([]);
  pagedHeroes = signal<SuperHero[]>([]);
  totalHeroes = signal<number>(0);
  pageSize = 10;
  currentPage = 0;
  searchTerm = '';
  searchControl = new FormControl('');
  subscription = new Subscription();

  constructor(
    private superHeroService: SuperHeroService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadHeroes();
    this.setupSearch();
  }

  private setupSearch() {
    this.subscription.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((value) => {
          this.searchTerm = value || '';
          this.onSearch();
        })
    );
  }

  loadHeroes() {
    this.subscription.add(
      this.superHeroService.getHeroes().subscribe((heroes) => {
        this.heroes.set(heroes);
        this.totalHeroes.set(heroes.length);
        this.updatePagedHeroes();
      })
    );
  }

  updatePagedHeroes() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedHeroes.set(this.heroes().slice(start, end));
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagedHeroes();
  }

  onSearch() {
    if (this.searchTerm) {
      this.subscription.add(
        this.superHeroService
          .searchHeroes(this.searchTerm)
          .subscribe((heroes) => {
            this.heroes.set(heroes);
            this.totalHeroes.set(heroes.length);
            this.currentPage = 0;
            this.updatePagedHeroes();
          })
      );
    } else {
      this.loadHeroes();
    }
  }

  onEdit(hero: SuperHero) {
    const dialogRef = this.dialog.open(SuperHeroFormComponent, {
      width: '300px',
      data: { hero: hero },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.subscription.add(
          this.superHeroService.updateHero(result).subscribe(() => {
            this.searchTerm = '';
            this.searchControl.setValue('');
            this.loadHeroes();
          })
        );
      }
    });
  }

  onDelete(hero: SuperHero) {
    const dialogRef = this.dialog.open(SuperHeroDeleteDialogComponent, {
      width: '300px',
      data: { heroName: hero.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.subscription.add(
          this.superHeroService.deleteHero(hero.id).subscribe(() => {
            this.searchTerm = '';
            this.searchControl.setValue('');
            this.loadHeroes();
          })
        );
      }
    });
  }

  onAdd() {
    const dialogRef = this.dialog.open(SuperHeroFormComponent, {
      width: '300px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.subscription.add(
          this.superHeroService.addHero(result).subscribe(() => {
            this.searchTerm = '';
            this.searchControl.setValue('');
            this.loadHeroes();
          })
        );
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
