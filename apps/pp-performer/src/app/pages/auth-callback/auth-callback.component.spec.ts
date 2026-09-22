import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthCallbackComponent } from './auth-callback.component';
import * as supabaseClient from '../../core/supabase.client';

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;
  let router: Router;
  let mockSupabase: {
    auth: {
      getSession: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      },
    };

    jest
      .spyOn(supabaseClient, 'getSupabase')
      .mockReturnValue(mockSupabase as unknown as ReturnType<typeof supabaseClient.getSupabase>);

    await TestBed.configureTestingModule({
      imports: [AuthCallbackComponent],
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display loading spinner', () => {
    fixture = TestBed.createComponent(AuthCallbackComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.animate-spin')).toBeTruthy();
    expect(compiled.textContent).toContain('Completing sign in...');
  });

  it('should redirect to dashboard on successful session', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: '123' }, access_token: 'token' } },
      error: null,
    });

    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect to login when no session', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to login with error on auth error', async () => {
    mockSupabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Auth error' },
    });

    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { error: 'auth_failed' },
    });
  });

  it('should redirect to login with unexpected error on exception', async () => {
    mockSupabase.auth.getSession.mockRejectedValue(new Error('Network error'));

    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { error: 'unexpected' },
    });
  });
});
