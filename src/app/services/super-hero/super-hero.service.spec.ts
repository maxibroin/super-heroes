import { TestBed } from '@angular/core/testing';
import { heroes } from './mocks/super-heroes.mock';
import { NewSuperHero } from './models/new-hero.model';
import { SuperHero } from './models/super-hero.model';
import { SuperHeroService } from './super-hero.service';

describe('SuperHeroService', () => {
  let service: SuperHeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuperHeroService],
    });
    service = TestBed.inject(SuperHeroService);
    // Reset heroes state before each test
    heroes.set([
      { id: 1, name: 'Superman', power: 'Flight' },
      { id: 2, name: 'Batman', power: 'Intelligence' },
      { id: 3, name: 'Spider-Man', power: 'Web-slinging' },
    ]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getHeroes', () => {
    it('should get all heroes', (done) => {
      service.getHeroes().subscribe((result) => {
        expect(result.length).toBe(3);
        expect(result[0].name).toBe('Superman');
        done();
      });
    });
  });

  describe('getHeroById', () => {
    it('should get a hero by id', (done) => {
      service.getHeroById(2).subscribe((hero) => {
        expect(hero).toBeTruthy();
        expect(hero?.id).toBe(2);
        expect(hero?.name).toBe('Batman');
        done();
      });
    });

    it('should return undefined when hero id does not exist', (done) => {
      service.getHeroById(999).subscribe((hero) => {
        expect(hero).toBeUndefined();
        done();
      });
    });
  });

  describe('searchHeroes', () => {
    it('should search heroes by name case insensitive', (done) => {
      service.searchHeroes('SuPeR').subscribe((result) => {
        expect(result.length).toBe(1); // Superman
        expect(
          result.every((h) => h.name.toLowerCase().includes('super'))
        ).toBeTrue();
        done();
      });
    });

    it('should return empty array when search term matches no heroes', (done) => {
      service.searchHeroes('xyz').subscribe((result) => {
        expect(result.length).toBe(0);
        done();
      });
    });
  });

  describe('addHero', () => {
    it('should add a new hero', (done) => {
      const newHero: NewSuperHero = {
        name: 'Wonder Woman',
        power: 'Superhuman Strength',
      };

      service.addHero(newHero).subscribe((result) => {
        expect(result.id).toBe(4); // Next ID after existing 3
        expect(result.name).toBe('Wonder Woman');

        // Verify hero was added to the list
        service.getHeroes().subscribe((heroes) => {
          expect(heroes.length).toBe(4);
          expect(heroes[0]).toEqual(result);
          done();
        });
      });
    });
  });

  describe('updateHero', () => {
    it('should update an existing hero', (done) => {
      const updatedHero: SuperHero = {
        id: 1,
        name: 'Superman Updated',
        power: 'New Power',
      };

      service.updateHero(updatedHero).subscribe((result) => {
        expect(result).toEqual(updatedHero);

        // Verify hero was updated in the list
        service.getHeroById(1).subscribe((hero) => {
          expect(hero).toEqual(updatedHero);
          done();
        });
      });
    });
  });

  describe('deleteHero', () => {
    it('should delete a hero', (done) => {
      service.deleteHero(1).subscribe((result) => {
        expect(result).toBeTrue();

        // Verify hero was removed from the list
        service.getHeroes().subscribe((heroes) => {
          expect(heroes.length).toBe(2);
          expect(heroes.find((h) => h.id === 1)).toBeUndefined();
          done();
        });
      });
    });
  });
});
