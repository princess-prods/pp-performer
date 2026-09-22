# Product Requirements: pp-performer

## Overview

pp-performer is a recruitment stepper application that collects interest information from adults interested in performing in adult video content. The application emphasizes professionalism, transparency, and informed consent.

## Design Considerations

### Mobile-First
This application will be viewed most often on mobile devices (users scanning QR codes from recruitment cards). All UI development should:
- Design for mobile viewport first, then scale up to desktop
- Use touch-friendly input controls (large tap targets, appropriate spacing)
- Ensure form inputs are easy to complete on mobile keyboards
- Test on actual mobile devices, not just browser dev tools
- Consider thumb-reachable zones for primary actions

## Stepper Flow

### Step 0: Age Verification (Gate)
- **Required before any data collection**
- Third-party age verification integration
- User must be verified 18+ to proceed
- Store only: `is_verified_18`, `verification_timestamp`

### Step 1: Basic Information
- First name
- Last name
- Email address
- Gender (select from: Male, Female, Trans Male, Trans Female, Non-Binary)

### Step 2: Experience & Social Presence
- Experience level:
  - First-time performer (new to adult content)
  - Established performer
- Social media links (all optional):
  - Instagram
  - Twitter/X
  - Reddit
  - FetLife
  - OnlyFans
  - ManyVids
  - Custom website (up to 2)

### Step 3: Acts - Mainstream & Standard
Checkboxes for acts in categories:
- **Mainstream** (frequency: Very High to High)
- **Standard** (frequency: Medium-High to Medium)

### Step 4: Acts - BDSM, Fetish & Extreme
Checkboxes for acts in categories:
- **BDSM**
- **Fetish**
- **Extreme**

### Step 5: Style Preferences
Checkboxes for production style preferences:
- Amateur
- Professional
- Gonzo
- Glamcore
- VR
- Behind the scenes

### Step 6: Review & Submit
- Summary of all entered information
- Clear consent statement
- Submit button

## Database Schema

### Social Platforms
Store social links in a junction table:
- `performer_id`
- `platform_id` (enum: Instagram, Twitter, Reddit, FetLife, OnlyFans, ManyVids, Custom)
- `url`
- `created_at`

### Experience Level
Add to performers table:
- `is_established_performer: boolean`

## Post-Submission

Display confirmation message:
> "Thank you for your interest. Submitting this form does not commit you to participating in a production. It is an inquiry only. Any production opportunity, compensation, content rights, and participation terms will be discussed and agreed upon separately."
