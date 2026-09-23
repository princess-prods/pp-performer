import { TestBed } from '@angular/core/testing';
import { YotiService } from './yoti.service';

describe('YotiService', () => {
  let service: YotiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YotiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initial state', () => {
    it('should have idle state', () => {
      expect(service.state()).toBe('idle');
    });

    it('should have null session', () => {
      expect(service.session()).toBeNull();
    });

    it('should have null error', () => {
      expect(service.error()).toBeNull();
    });

    it('should have null verification result', () => {
      expect(service.verificationResult()).toBeNull();
    });

    it('should not be verifying', () => {
      expect(service.isVerifying()).toBe(false);
    });

    it('should not be verified', () => {
      expect(service.isVerified()).toBe(false);
    });
  });

  describe('mock mode', () => {
    it('should be in mock mode in test environment', () => {
      // In test environment, production is false, so mock mode is true
      expect(service.isMockMode()).toBe(true);
    });

    describe('createMockSession', () => {
      it('should create a mock session', async () => {
        const session = await service.createMockSession();

        expect(session).toBeDefined();
        expect(session.sessionId).toContain('mock-session-');
        expect(session.clientSessionToken).toContain('mock-token-');
        expect(session.clientSessionTokenTtl).toBe(600);
      });

      it('should update state to verifying', async () => {
        await service.createMockSession();

        expect(service.state()).toBe('verifying');
      });

      it('should store the session', async () => {
        const session = await service.createMockSession();

        expect(service.session()).toEqual(session);
      });
    });

    describe('mockVerifySuccess', () => {
      it('should set verification result to verified', async () => {
        await service.createMockSession();
        await service.mockVerifySuccess();

        expect(service.verificationResult()?.verified).toBe(true);
        expect(service.verificationResult()?.dateOfBirth).toBe('1990-01-15');
      });

      it('should update state to completed', async () => {
        await service.createMockSession();
        await service.mockVerifySuccess();

        expect(service.state()).toBe('completed');
      });

      it('should set isVerified to true', async () => {
        await service.createMockSession();
        await service.mockVerifySuccess();

        expect(service.isVerified()).toBe(true);
      });
    });

    describe('mockVerifyFailure', () => {
      it('should set verification result to not verified', async () => {
        await service.createMockSession();
        await service.mockVerifyFailure('Too young');

        expect(service.verificationResult()?.verified).toBe(false);
        expect(service.verificationResult()?.reason).toBe('Too young');
      });

      it('should update state to failed', async () => {
        await service.createMockSession();
        await service.mockVerifyFailure();

        expect(service.state()).toBe('failed');
      });

      it('should set error message', async () => {
        await service.createMockSession();
        await service.mockVerifyFailure('Custom error');

        expect(service.error()).toBe('Custom error');
      });

      it('should set isVerified to false', async () => {
        await service.createMockSession();
        await service.mockVerifyFailure();

        expect(service.isVerified()).toBe(false);
      });
    });
  });

  describe('getIframeUrl', () => {
    it('should return correct Yoti iframe URL', () => {
      const session = {
        sessionId: 'test-session-123',
        clientSessionToken: 'test-token-456',
        clientSessionTokenTtl: 600,
      };

      const url = service.getIframeUrl(session);

      expect(url).toBe(
        'https://api.yoti.com/idverify/v1/web/index.html?sessionID=test-session-123&sessionToken=test-token-456'
      );
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', async () => {
      // First create a session and verify
      await service.createMockSession();
      await service.mockVerifySuccess();

      // Then reset
      service.reset();

      expect(service.state()).toBe('idle');
      expect(service.session()).toBeNull();
      expect(service.error()).toBeNull();
      expect(service.verificationResult()).toBeNull();
    });
  });

  describe('handleIframeMessage', () => {
    it('should ignore messages from non-Yoti origins', () => {
      const event = new MessageEvent('message', {
        origin: 'https://example.com',
        data: { eventCode: 'CANCELLED' },
      });

      service.handleIframeMessage(event);

      // State should remain idle
      expect(service.state()).toBe('idle');
    });

    it('should handle CANCELLED event', async () => {
      await service.createMockSession();

      const event = new MessageEvent('message', {
        origin: 'https://api.yoti.com',
        data: { eventCode: 'CANCELLED' },
      });

      service.handleIframeMessage(event);

      expect(service.state()).toBe('idle');
      expect(service.error()).toBe('Verification was cancelled');
    });

    it('should handle ERROR event', async () => {
      await service.createMockSession();

      const event = new MessageEvent('message', {
        origin: 'https://api.yoti.com',
        data: { eventCode: 'ERROR' },
      });

      service.handleIframeMessage(event);

      expect(service.state()).toBe('failed');
      expect(service.error()).toBe('An error occurred during verification');
    });
  });

  describe('isVerifying computed signal', () => {
    it('should be true when creating-session', async () => {
      // Start creating session but don't await
      const promise = service.createMockSession();

      // Check immediately - should be creating-session
      expect(service.isVerifying()).toBe(true);

      await promise;
    });

    it('should be true when verifying', async () => {
      await service.createMockSession();

      expect(service.isVerifying()).toBe(true);
    });

    it('should be false when completed', async () => {
      await service.createMockSession();
      await service.mockVerifySuccess();

      expect(service.isVerifying()).toBe(false);
    });

    it('should be false when failed', async () => {
      await service.createMockSession();
      await service.mockVerifyFailure();

      expect(service.isVerifying()).toBe(false);
    });
  });
});
