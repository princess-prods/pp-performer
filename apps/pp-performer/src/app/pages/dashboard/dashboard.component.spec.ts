import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/auth.service';
import { signal } from '@angular/core';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockAuthService: {
    user: ReturnType<typeof signal>;
    signOut: jest.Mock;
  };

  beforeEach(async () => {
    mockAuthService = {
      user: signal({
        id: '123',
        email: 'test@example.com',
        user_metadata: {
          avatar_url: 'https://example.com/avatar.jpg',
        },
      }),
      signOut: jest.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display welcome heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome to your Dashboard');
  });

  it('should display user email', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('test@example.com');
  });

  it('should display user avatar when available', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const avatar = compiled.querySelector('img[alt="Profile"]') as HTMLImageElement;
    expect(avatar).toBeTruthy();
    expect(avatar?.src).toBe('https://example.com/avatar.jpg');
  });

  it('should not display avatar when not available', () => {
    mockAuthService.user.set({
      id: '123',
      email: 'test@example.com',
      user_metadata: {},
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const avatar = compiled.querySelector('img[alt="Profile"]');
    expect(avatar).toBeFalsy();
  });

  it('should display sign out button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent).toContain('Sign Out');
  });

  it('should call signOut when button clicked', async () => {
    await component.signOut();

    expect(mockAuthService.signOut).toHaveBeenCalled();
  });

  it('should display application status card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Application Status');
    expect(compiled.textContent).toContain('Not yet submitted');
  });

  it('should display age verification card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Age Verification');
    expect(compiled.textContent).toContain('Pending verification');
  });

  it('should display next steps card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Next Steps');
    expect(compiled.textContent).toContain('Complete your profile');
  });

  it('should display logo in header', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('header img') as HTMLImageElement;
    expect(logo).toBeTruthy();
    expect(logo?.alt).toBe('Princess Prods');
  });
});
