import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { LoaderComponent } from './components/loader/loader.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        LoaderComponent,
        AppComponent,
      ],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    expect(component.title).toBe('Superhéroes');
  });

  it('should render toolbar with correct title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('#title');
    expect(title?.textContent).toContain('Superhéroes');
  });

  it('should contain sidenav with navigation links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navLinks = compiled.querySelectorAll('mat-nav-list a');
    expect(navLinks.length).toBe(2);
  });

  it('should have home link with correct route', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const homeLink = compiled.querySelector('mat-nav-list a[routerLink="/"]');
    expect(homeLink).toBeTruthy();
    expect(homeLink?.querySelector('span')?.textContent).toContain('Inicio');
  });

  it('should have list link with correct route', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const listLink = compiled.querySelector(
      'mat-nav-list a[routerLink="/listado"]'
    );
    expect(listLink).toBeTruthy();
    expect(listLink?.querySelector('span')?.textContent).toContain('Listado');
  });
});
