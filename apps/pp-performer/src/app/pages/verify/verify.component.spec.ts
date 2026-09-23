import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { VerifyComponent } from './verify.component';
import { YotiService } from '../../core/yoti.service';

describe('VerifyComponent', () => {
  let component: VerifyComponent;
  let fixture: ComponentFixture<VerifyComponent>;
  let yotiService: YotiService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyComponent],
      providers: [provideRouter([{ path: 'login', component: VerifyComponent }])],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyComponent);
    component = fixture.componentInstance;
    yotiService = TestBed.inject(YotiService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    yotiService.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initial state', () => {
    it('should show start verification button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('button')?.textContent).toContain(
        'Start Verification'
      );
    });

    it('should display age verification required heading', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain(
        'Age Verification Required'
      );
    });

    it('should list requirements', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const listItems = compiled.querySelectorAll('li');
      expect(listItems.length).toBe(3);
    });

    it('should show mock mode indicator in development', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Development mode');
    });
  });

  describe('startVerification', () => {
    it('should call createMockSession in mock mode', async () => {
      const spy = jest.spyOn(yotiService, 'createMockSession');

      await component.startVerification();

      expect(spy).toHaveBeenCalled();
    });

    it('should update view to show mock verification UI', async () => {
      await component.startVerification();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('Mock Verification Mode');
    });

    it('should call createSession when not in mock mode', async () => {
      jest.spyOn(yotiService, 'isMockMode').mockReturnValue(false);
      const createSessionSpy = jest
        .spyOn(yotiService, 'createSession')
        .mockResolvedValue({
          sessionId: 'test-session',
          clientSessionToken: 'test-token',
          clientSessionTokenTtl: 600,
        });

      await component.startVerification();

      expect(createSessionSpy).toHaveBeenCalledWith(
        expect.stringContaining('/verify?status=success'),
        expect.stringContaining('/verify?status=error')
      );
    });
  });

  describe('mock verification UI', () => {
    beforeEach(async () => {
      await component.startVerification();
      fixture.detectChanges();
    });

    it('should show simulate success button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const successBtn = Array.from(compiled.querySelectorAll('button')).find(
        (btn) => btn.textContent?.includes('Simulate Success')
      );
      expect(successBtn).toBeTruthy();
    });

    it('should show simulate failure button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const failBtn = Array.from(compiled.querySelectorAll('button')).find(
        (btn) => btn.textContent?.includes('Simulate Failure')
      );
      expect(failBtn).toBeTruthy();
    });

    it('should show cancel button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const cancelBtn = Array.from(compiled.querySelectorAll('button')).find(
        (btn) => btn.textContent?.includes('Cancel')
      );
      expect(cancelBtn).toBeTruthy();
    });
  });

  describe('mockSuccess', () => {
    it('should show success state', async () => {
      await component.startVerification();
      await component.mockSuccess();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain(
        'Verification Complete'
      );
    });

    it('should show continue button', async () => {
      await component.startVerification();
      await component.mockSuccess();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const continueBtn = Array.from(compiled.querySelectorAll('button')).find(
        (btn) => btn.textContent?.includes('Continue to Sign In')
      );
      expect(continueBtn).toBeTruthy();
    });
  });

  describe('mockFailure', () => {
    it('should show failure state', async () => {
      await component.startVerification();
      await component.mockFailure();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain(
        'Verification Failed'
      );
    });

    it('should show try again button', async () => {
      await component.startVerification();
      await component.mockFailure();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const tryAgainBtn = Array.from(compiled.querySelectorAll('button')).find(
        (btn) => btn.textContent?.includes('Try Again')
      );
      expect(tryAgainBtn).toBeTruthy();
    });

    it('should display error message', async () => {
      await component.startVerification();
      await component.mockFailure();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('under 18');
    });
  });

  describe('cancel', () => {
    it('should return to idle state', async () => {
      await component.startVerification();
      fixture.detectChanges();

      component.cancel();
      fixture.detectChanges();

      expect(yotiService.state()).toBe('idle');
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('h1')?.textContent).toContain(
        'Age Verification Required'
      );
    });
  });

  describe('tryAgain', () => {
    it('should reset state and return to idle', async () => {
      await component.startVerification();
      await component.mockFailure();
      fixture.detectChanges();

      component.tryAgain();
      fixture.detectChanges();

      expect(yotiService.state()).toBe('idle');
    });
  });

  describe('continueToLogin', () => {
    it('should navigate to login page', async () => {
      const navigateSpy = jest.spyOn(router, 'navigate');

      await component.startVerification();
      await component.mockSuccess();

      component.continueToLogin();

      expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('iframeUrl computed signal', () => {
    it('should return null when no session', () => {
      expect(component.iframeUrl()).toBeNull();
    });

    it('should return sanitized URL when session exists', async () => {
      await component.startVerification();

      const url = component.iframeUrl();
      expect(url).toBeTruthy();
    });
  });

  describe('lifecycle', () => {
    it('should add message event listener on init', () => {
      const addSpy = jest.spyOn(window, 'addEventListener');
      component.ngOnInit();
      expect(addSpy).toHaveBeenCalledWith('message', expect.any(Function));
    });

    it('should remove message event listener on destroy', () => {
      const removeSpy = jest.spyOn(window, 'removeEventListener');
      component.ngOnDestroy();
      expect(removeSpy).toHaveBeenCalledWith('message', expect.any(Function));
    });
  });

  describe('messageHandler', () => {
    it('should delegate message events to yotiService', () => {
      const handleMessageSpy = jest.spyOn(yotiService, 'handleIframeMessage');
      const event = new MessageEvent('message', {
        origin: 'https://api.yoti.com',
        data: { eventCode: 'CANCELLED' },
      });

      // Trigger the private messageHandler by dispatching a message event
      window.dispatchEvent(event);

      expect(handleMessageSpy).toHaveBeenCalledWith(event);
    });
  });
});
