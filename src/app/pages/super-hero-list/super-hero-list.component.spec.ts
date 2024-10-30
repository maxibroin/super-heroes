import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SuperHeroService } from '../../services/super-hero/super-hero.service';
import { SuperHeroListComponent } from './super-hero-list.component';

describe('SuperHeroListComponent', () => {
  let component: SuperHeroListComponent;
  let fixture: ComponentFixture<SuperHeroListComponent>;

  const mockHeroes = [
    { id: 1, name: 'Superman', power: 'Flight' },
    { id: 2, name: 'Spiderman', power: 'Web-slinging' },
    { id: 3, name: 'Batman', power: 'Intelligence' },
    { id: 4, name: 'Wonder Woman', power: 'Strength' },
    { id: 5, name: 'Flash', power: 'Speed' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperHeroListComponent, NoopAnimationsModule, MatDialogModule],
      providers: [{ provide: SuperHeroService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperHeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load heroes on init', () => {
      spyOn(component, 'loadHeroes');
      //@ts-ignore
      spyOn(component, 'setupSearch');
      component.ngOnInit();
      expect(component.loadHeroes).toHaveBeenCalled();
      //@ts-ignore
      expect(component.setupSearch).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should call updatePagedHeroes when page changes', () => {
      spyOn(component, 'updatePagedHeroes');
      component.onPageChange({ pageIndex: 1, pageSize: 2, length: 2 });
      expect(component.currentPage).toBe(1);
      expect(component.pageSize).toBe(2);
      expect(component.updatePagedHeroes).toHaveBeenCalled();
    });
  });

  describe('Search', () => {
    it('should search heroes with term', () => {
      spyOn(component, 'updatePagedHeroes');
      const searchResult = [mockHeroes[0]];

      const searchHeroesSpy = spyOn(
        //@ts-ignore
        component.superHeroService,
        'searchHeroes'
      ).and.returnValue(of(searchResult));

      component.searchTerm = 'Super';
      component.onSearch();

      expect(searchHeroesSpy).toHaveBeenCalledWith('Super');
      expect(component.heroes().length).toBe(1);
      expect(component.totalHeroes()).toBe(1);
      expect(component.updatePagedHeroes).toHaveBeenCalled();
    });

    it('should reload all heroes when search term is empty', () => {
      spyOn(component, 'loadHeroes');
      component.searchTerm = '';
      component.onSearch();

      expect(component.loadHeroes).toHaveBeenCalled();
    });
  });

  describe('CRUD Operations', () => {
    it('should handle hero addition', () => {
      spyOn(component, 'loadHeroes');
      const newHero = { id: 3, name: 'Batman', power: 'Intelligence' };

      //@ts-ignore
      const openDialogSpy = spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(newHero),
      } as any);

      const addHeroSpy = spyOn(
        //@ts-ignore
        component.superHeroService,
        'addHero'
      ).and.returnValue(of(newHero));

      component.onAdd();
      expect(openDialogSpy).toHaveBeenCalled();
      expect(addHeroSpy).toHaveBeenCalledWith(newHero);
      expect(component.loadHeroes).toHaveBeenCalled();
    });

    it('should handle hero deletion', () => {
      spyOn(component, 'loadHeroes');
      //@ts-ignore
      const openDialogSpy = spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(true),
      } as any);

      const deleteHeroSpy = spyOn(
        //@ts-ignore
        component.superHeroService,
        'deleteHero'
      ).and.returnValue(of(true));

      component.onDelete(mockHeroes[0]);

      expect(openDialogSpy).toHaveBeenCalled();
      expect(deleteHeroSpy).toHaveBeenCalledWith(mockHeroes[0].id);
      expect(component.loadHeroes).toHaveBeenCalled();
    });

    it('should handle hero update', () => {
      spyOn(component, 'loadHeroes');
      const updatedHero = { ...mockHeroes[0], name: 'Superman Updated' };
      //@ts-ignore
      const openDialogSpy = spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of(updatedHero),
      } as any);

      const updateHeroSpy = spyOn(
        //@ts-ignore
        component.superHeroService,
        'updateHero'
      ).and.returnValue(of(updatedHero));

      component.onEdit(mockHeroes[0]);

      expect(openDialogSpy).toHaveBeenCalled();
      expect(updateHeroSpy).toHaveBeenCalledWith(updatedHero);
      expect(component.loadHeroes).toHaveBeenCalled();
    });
  });

  describe('Search', () => {
    it('should debounce and filter duplicate search terms', fakeAsync(() => {
      const searchSpy = spyOn(component, 'onSearch');

      // Simular múltiples cambios rápidos
      component.searchControl.setValue('Super');
      component.searchControl.setValue('Super'); // Valor duplicado
      component.searchControl.setValue('Superman');

      // No debería haber llamadas inmediatas
      expect(searchSpy).not.toHaveBeenCalled();

      // Avanzar 100ms
      tick(100);
      expect(searchSpy).not.toHaveBeenCalled();

      // Avanzar los 300ms completos
      tick(200);
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(component.searchTerm).toBe('Superman');
    }));

    it('should handle empty search term', fakeAsync(() => {
      const searchSpy = spyOn(component, 'onSearch');

      component.searchControl.setValue('');

      tick(300);
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(component.searchTerm).toBe('');
    }));

    it('should handle null search term as empty string', fakeAsync(() => {
      const searchSpy = spyOn(component, 'onSearch');

      component.searchControl.setValue(null);

      tick(300);
      expect(searchSpy).toHaveBeenCalledTimes(1);
      expect(component.searchTerm).toBe('');
    }));
  });

  describe('Load Heroes', () => {
    it('should load heroes and update signals correctly', () => {
      const getHeroesSpy = spyOn(
        //@ts-ignore
        component.superHeroService,
        'getHeroes'
      ).and.returnValue(of(mockHeroes));

      component.loadHeroes();

      expect(getHeroesSpy).toHaveBeenCalled();
      expect(component.heroes()).toEqual(mockHeroes);
      expect(component.totalHeroes()).toBe(mockHeroes.length);
    });

    it('should update paged heroes after loading', () => {
      component.pageSize = 2;
      component.currentPage = 0;

      const getHeroesSpy = spyOn(
        //@ts-ignore
        component.superHeroService,
        'getHeroes'
      ).and.returnValue(of(mockHeroes));

      component.loadHeroes();

      expect(getHeroesSpy).toHaveBeenCalled();
      expect(component.pagedHeroes()).toEqual(mockHeroes.slice(0, 2));
    });

    it('should handle empty hero list', () => {
      const getHeroesSpy = spyOn(
        //@ts-ignore
        component.superHeroService,
        'getHeroes'
      ).and.returnValue(of([]));

      component.loadHeroes();

      expect(getHeroesSpy).toHaveBeenCalled();
      expect(component.heroes()).toEqual([]);
      expect(component.totalHeroes()).toBe(0);
      expect(component.pagedHeroes()).toEqual([]);
    });
  });

  describe('Update Paged Heroes', () => {
    it('should show first page correctly', () => {
      component.heroes.set(mockHeroes);
      component.currentPage = 0;
      component.pageSize = 2;

      component.updatePagedHeroes();

      expect(component.pagedHeroes()).toEqual([mockHeroes[0], mockHeroes[1]]);
    });

    it('should show middle page correctly', () => {
      component.heroes.set(mockHeroes);
      component.currentPage = 1;
      component.pageSize = 2;

      component.updatePagedHeroes();

      expect(component.pagedHeroes()).toEqual([mockHeroes[2], mockHeroes[3]]);
    });

    it('should show last page with remaining heroes', () => {
      component.heroes.set(mockHeroes);
      component.currentPage = 2;
      component.pageSize = 2;

      component.updatePagedHeroes();

      expect(component.pagedHeroes()).toEqual([mockHeroes[4]]);
    });

    it('should handle empty page when start index exceeds heroes length', () => {
      component.heroes.set(mockHeroes);
      component.currentPage = 10;
      component.pageSize = 2;

      component.updatePagedHeroes();

      expect(component.pagedHeroes()).toEqual([]);
    });

    it('should handle empty heroes array', () => {
      component.heroes.set([]);
      component.currentPage = 0;
      component.pageSize = 2;

      component.updatePagedHeroes();

      expect(component.pagedHeroes()).toEqual([]);
    });
  });
});
