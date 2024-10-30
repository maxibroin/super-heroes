import { signal } from '@angular/core';
import { SuperHero } from '../models/super-hero.model';

export const heroes = signal<SuperHero[]>([
  { id: 20, name: 'Vision', power: 'Intangibilidad' },
  { id: 19, name: 'Scarlet Witch', power: 'Manipulación de la realidad' },
  { id: 18, name: 'Cyborg', power: 'Tecnología integrada' },
  { id: 17, name: 'Ant-Man', power: 'Cambio de tamaño' },
  { id: 16, name: 'Doctor Strange', power: 'Magia' },
  { id: 15, name: 'Black Panther', power: 'Agilidad felina' },
  { id: 14, name: 'Capitana Marvel', power: 'Absorción de energía' },
  { id: 13, name: 'Wolverine', power: 'Regeneración' },
  { id: 12, name: 'Green Lantern', power: 'Anillo de poder' },
  { id: 11, name: 'Black Widow', power: 'Espionaje' },
  { id: 10, name: 'Hulk', power: 'Fuerza descomunal' },
  { id: 9, name: 'Thor', power: 'Control del trueno' },
  { id: 8, name: 'Iron Man', power: 'Armadura tecnológica' },
  { id: 7, name: 'Capitán América', power: 'Fuerza mejorada' },
  { id: 6, name: 'Aquaman', power: 'Control del agua' },
  { id: 5, name: 'Flash', power: 'Supervelocidad' },
  { id: 4, name: 'Batman', power: 'Inteligencia' },
  { id: 3, name: 'Wonder Woman', power: 'Fuerza sobrehumana' },
  { id: 2, name: 'Spiderman', power: 'Telaraña' },
  { id: 1, name: 'Superman', power: 'Vuelo' },
]);
