import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the hero headline', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.hero-headline')?.textContent).toContain(
      'Interested in Performing?'
    );
  });

  it('should display 6 value propositions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const valueProps = compiled.querySelectorAll('.value-prop-item');
    expect(valueProps.length).toBe(6);
  });

  it('should display the CTA button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ctaButton = compiled.querySelector('.cta-button');
    expect(ctaButton).toBeTruthy();
    expect(ctaButton?.textContent?.trim()).toBe('Get Started');
  });

  it('should display trust line with year', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const trustLine = compiled.querySelector('.trust-line');
    expect(trustLine?.textContent).toContain('Trusted by performers since 2017');
  });

  it('should display age verification notice', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const ageNotice = compiled.textContent;
    expect(ageNotice).toContain('18+ only');
    expect(ageNotice).toContain('Government-issued ID');
  });

  it('should have value props with icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const icons = compiled.querySelectorAll('.value-prop-icon svg');
    expect(icons.length).toBe(6);
  });
});
