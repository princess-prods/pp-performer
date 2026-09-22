# Age Verification Integration

## Requirement

Age verification must occur **before collecting any personal information**. This is both an ethical requirement and a legal compliance matter (WV law requires qualifying age-verification methods for adult content businesses).

## Recommended Providers

### 1. Yoti (Recommended)
- **Why**: Privacy-by-design, widely used in adult industry (OnlyFans uses Yoti)
- **Method**: Facial age estimation + digital ID wallet
- **Privacy**: Users verify age without handing over personal documents to us
- **Coverage**: 800M+ verifications, global
- **Pricing**: Enterprise (estimated $1.50-$3.00/verification)
- **Docs**: https://developers.yoti.com/age-verification/overview

### 2. Veriff
- **Why**: High success rate (95% first attempt), global coverage
- **Method**: Document scanning + biometrics
- **Coverage**: 10,000+ ID documents, 190+ countries, 45 languages
- **Pricing**: Starts at $49/month, custom pricing for age verification API
- **Docs**: https://www.veriff.com/

### 3. AgeChecked
- **Why**: Government-certified (UK), built for regulated industries
- **Method**: Multiple verification methods
- **Coverage**: UK-focused, expanding

## Implementation Requirements

### What We Store
```typescript
interface AgeVerification {
  is_verified_18: boolean;
  verification_timestamp: Date;
  verification_provider: string;
  verification_id: string;  // Provider's reference ID
}
```

### What We DO NOT Store
- Government ID images
- Driver's license numbers
- Social Security numbers
- Date of birth
- Selfie images
- Any biometric data

The third-party provider handles all sensitive identity verification. We receive only a boolean confirmation and reference ID.

## User Flow

1. User lands on app
2. Age gate screen: "You must be 18 years of age or older to continue"
3. User clicks "Verify Age"
4. Redirect to Yoti/Veriff widget (embedded or popup)
5. User completes verification with provider
6. Provider returns: `{ verified: true, verification_id: "..." }`
7. We store verification status
8. User proceeds to Step 1 of the stepper

## Legal Notes

- WV statute requires "qualifying age-verification method" for adult content businesses
- Statute limits retention of identifying information collected for verification
- Third-party verification satisfies these requirements while minimizing our liability
- Online verification is for recruitment inquiry only; actual performer onboarding requires separate, more rigorous identity verification with government ID (2257 compliance)

## Technical Integration

Example with Yoti:
```typescript
// After Yoti verification callback
const verificationResult = await yotiClient.verifyAge(token);

if (verificationResult.verified) {
  await db.insert(performers).values({
    isVerified18: true,
    // ... other fields collected in subsequent steps
  });
}
```

See Yoti developer documentation for full integration guide.
