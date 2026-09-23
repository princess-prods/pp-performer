import { TestBed } from '@angular/core/testing';
import { YotiService } from './yoti.service';

// Store original fetch
const originalFetch = global.fetch;

describe('YotiService', () => {
  let service: YotiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YotiService);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    service.reset();
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

  describe('createSession (real API)', () => {
    let mockFetch: jest.Mock;

    beforeEach(() => {
      mockFetch = jest.fn();
      global.fetch = mockFetch;
    });

    it('should create a session successfully', async () => {
      const mockSession = {
        sessionId: 'real-session-123',
        clientSessionToken: 'real-token-456',
        clientSessionTokenTtl: 600,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: { data: mockSession } }),
      });

      const session = await service.createSession(
        'https://example.com/success',
        'https://example.com/error'
      );

      expect(session).toEqual(mockSession);
      expect(service.session()).toEqual(mockSession);
      expect(service.state()).toBe('verifying');
      expect(mockFetch).toHaveBeenCalledWith('/api/trpc/yoti.createSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: 'https://example.com/success',
          errorUrl: 'https://example.com/error',
        }),
      });
    });

    it('should handle API error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(
        service.createSession(
          'https://example.com/success',
          'https://example.com/error'
        )
      ).rejects.toThrow('Failed to create verification session');

      expect(service.state()).toBe('failed');
      expect(service.error()).toBe('Failed to create verification session');
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        service.createSession(
          'https://example.com/success',
          'https://example.com/error'
        )
      ).rejects.toThrow('Network error');

      expect(service.state()).toBe('failed');
      expect(service.error()).toBe('Network error');
    });

    it('should handle non-Error throw', async () => {
      mockFetch.mockRejectedValueOnce('string error');

      await expect(
        service.createSession(
          'https://example.com/success',
          'https://example.com/error'
        )
      ).rejects.toBe('string error');

      expect(service.state()).toBe('failed');
      expect(service.error()).toBe('Unknown error');
    });
  });

  describe('verifyAge (real API)', () => {
    let mockFetch: jest.Mock;

    beforeEach(async () => {
      mockFetch = jest.fn();
      global.fetch = mockFetch;
      // Create a mock session first
      await service.createMockSession();
    });

    it('should verify age successfully when verified is true', async () => {
      const mockVerification = {
        verified: true,
        dateOfBirth: '1990-05-15',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: { data: mockVerification } }),
      });

      const result = await service.verifyAge();

      expect(result).toEqual(mockVerification);
      expect(service.verificationResult()).toEqual(mockVerification);
      expect(service.state()).toBe('completed');
    });

    it('should handle verification failure when verified is false', async () => {
      const mockVerification = {
        verified: false,
        reason: 'User is under 18',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: { data: mockVerification } }),
      });

      const result = await service.verifyAge();

      expect(result).toEqual(mockVerification);
      expect(service.state()).toBe('failed');
      expect(service.error()).toBe('User is under 18');
    });

    it('should handle verification failure with no reason', async () => {
      const mockVerification = {
        verified: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: { data: mockVerification } }),
      });

      const result = await service.verifyAge();

      expect(result).toEqual(mockVerification);
      expect(service.state()).toBe('failed');
      expect(service.error()).toBe('Age verification failed');
    });

    it('should throw error when no session exists', async () => {
      service.reset();

      await expect(service.verifyAge()).rejects.toThrow('No active session');
    });

    it('should handle API error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(service.verifyAge()).rejects.toThrow('Failed to verify age');

      expect(service.state()).toBe('failed');
      expect(service.error()).toBe('Failed to verify age');
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(service.verifyAge()).rejects.toThrow('Network error');

      expect(service.state()).toBe('failed');
      expect(service.error()).toBe('Network error');
    });

    it('should handle non-Error throw', async () => {
      mockFetch.mockRejectedValueOnce('string error');

      await expect(service.verifyAge()).rejects.toBe('string error');

      expect(service.state()).toBe('failed');
      expect(service.error()).toBe('Unknown error');
    });
  });

  describe('handleIframeMessage additional cases', () => {
    let mockFetch: jest.Mock;

    beforeEach(async () => {
      mockFetch = jest.fn();
      global.fetch = mockFetch;
      await service.createMockSession();
    });

    it('should handle success message (no eventCode) and call verifyAge', async () => {
      const mockVerification = { verified: true, dateOfBirth: '1990-01-01' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: { data: mockVerification } }),
      });

      const event = new MessageEvent('message', {
        origin: 'https://api.yoti.com',
        data: {},
      });

      service.handleIframeMessage(event);

      expect(service.state()).toBe('completed');

      // Wait for verifyAge to complete
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    it('should log unknown event codes', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const event = new MessageEvent('message', {
        origin: 'https://api.yoti.com',
        data: { eventCode: 'UNKNOWN_EVENT' },
      });

      service.handleIframeMessage(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Yoti iframe event:',
        'UNKNOWN_EVENT'
      );

      consoleSpy.mockRestore();
    });
  });
});
