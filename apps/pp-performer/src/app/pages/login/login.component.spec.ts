import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth.service';
import { signal } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: {
    isAuthenticated: ReturnType<typeof signal<boolean>>;
    signInWithGoogle: jest.Mock;
  };
  let router: Router;

  const createMockActivatedRoute = (queryParams: Record<string, string> = {}) => ({
    snapshot: {
      queryParamMap: {
        get: (key: string) => queryParams[key] ?? null,
      },
    },
  });

  beforeEach(async () => {
    mockAuthService = {
      isAuthenticated: signal(false),
      signInWithGoogle: jest.fn().mockResolvedValue(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterModule.forRoot([])],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: createMockActivatedRoute(),
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the login form', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Welcome Back');
  });

  it('should display Google sign in button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent).toContain('Continue with Google');
  });

  it('should redirect to dashboard if already authenticated', async () => {
    mockAuthService.isAuthenticated.set(true);

    // Reset TestBed to create fresh component
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterModule.forRoot([])],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: createMockActivatedRoute(),
        },
      ],
    }).compileComponents();

    const newRouter = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();

    expect(newRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  describe('error handling from URL params', () => {
    it('should show auth_failed error message from URL', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [LoginComponent, RouterModule.forRoot([])],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          {
            provide: Router,
            useValue: { navigate: jest.fn() },
          },
          {
            provide: ActivatedRoute,
            useValue: createMockActivatedRoute({ error: 'auth_failed' }),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.errorMessage).toBe('Authentication failed. Please try again.');
    });

    it('should show unexpected error message from URL', async () => {
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [LoginComponent, RouterModule.forRoot([])],
        providers: [
          { provide: AuthService, useValue: mockAuthService },
          {
            provide: Router,
            useValue: { navigate: jest.fn() },
          },
          {
            provide: ActivatedRoute,
            useValue: createMockActivatedRoute({ error: 'unexpected' }),
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.errorMessage).toBe('An unexpected error occurred. Please try again.');
    });
  });

  describe('signInWithGoogle', () => {
    it('should call authService.signInWithGoogle', async () => {
      await component.signInWithGoogle();

      expect(mockAuthService.signInWithGoogle).toHaveBeenCalled();
    });

    it('should set isLoading to true when signing in', () => {
      component.signInWithGoogle();

      expect(component.isLoading).toBe(true);
    });

    it('should clear error message when signing in', () => {
      component.errorMessage = 'Some error';

      component.signInWithGoogle();

      expect(component.errorMessage).toBe('');
    });

    it('should set error message on failure', async () => {
      mockAuthService.signInWithGoogle.mockRejectedValue(new Error('Failed'));

      await component.signInWithGoogle();

      expect(component.errorMessage).toBe('Failed to sign in. Please try again.');
      expect(component.isLoading).toBe(false);
    });
  });

  it('should allow setting error message', () => {
    component.errorMessage = 'Test error';
    expect(component.errorMessage).toBe('Test error');
  });

  it('should have back to home link', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backLink = compiled.querySelector('a[routerLink="/"]');
    expect(backLink?.textContent).toContain('Back to home');
  });
});
