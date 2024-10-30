import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { heroes } from './mocks/super-heroes.mock';
import { NewSuperHero } from './models/new-hero.model';
import { SuperHero } from './models/super-hero.model';

@Injectable()
export class SuperHeroService {
  getHeroes(): Observable<SuperHero[]> {
    return of(heroes());
  }

  getHeroById(id: number): Observable<SuperHero | undefined> {
    const hero = heroes().find((h) => h.id === id);
    return of(hero);
  }

  searchHeroes(term: string): Observable<SuperHero[]> {
    const termLower = term.toLowerCase().trim();
    const filteredHeroes = heroes().filter((hero) =>
      hero.name.toLowerCase().includes(termLower)
    );
    return of(filteredHeroes);
  }

  addHero(hero: NewSuperHero): Observable<SuperHero> {
    const maxId = heroes().reduce((max, hero) => Math.max(max, hero.id), 0);
    const newHero = { ...hero, id: maxId + 1 };
    heroes.update((heroes) => [newHero, ...heroes]);
    return of(newHero);
  }

  updateHero(updatedHero: SuperHero): Observable<SuperHero> {
    heroes.update((heroes) =>
      heroes.map((h) => (h.id === updatedHero.id ? updatedHero : h))
    );
    return of(updatedHero);
  }

  deleteHero(id: number): Observable<boolean> {
    heroes.update((heroes) => heroes.filter((h) => h.id !== id));
    return of(true);
  }
}
