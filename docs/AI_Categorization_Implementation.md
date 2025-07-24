# AI Triage Categorization System Implementation

This document explains how the AI categorization system has been enhanced to follow the expert-defined Plastic Surgery Urgency Categorization Rules.

## Overview

The AI categorization system now strictly follows the clinical guidelines established by plastic surgery domain experts. The system categorizes cases into three priority levels based on specific clinical indicators and timeframes.

## Category Definitions

### 🔴 URGENT (Score 8-10, Within 2 weeks)
**Clinical Indicators:**
- Suspected malignancy
- Large lesions (>6mm for pigmented lesions)
- Rapidly enlarging or changing lesions
- Bleeding or ulcerated lesions
- Non-healing lesions or ulcers
- Lesions fixed to underlying structures
- Pigmented lesions with irregular features (asymmetry, variegated color)
- Nodular lesions with telangiectasia
- History of skin cancer (BCC, SCC, Melanoma)
- Elderly patients (≥70) with suspicious lesions
- Immunocompromised patients (transplant recipients)
- Head/face lesions with high-risk features
- History of excessive sun exposure/tanning with suspicious features
- Lymphadenopathy (neck, axilla, groin swelling)
- Functional compromise (vision, breathing, speech, hearing, smell, eating)
- Untreated cancer
- Pre-treatment planning for cancer reconstruction
- Hand issues seriously affecting Activities of Daily Living (ADL)

**GP Language Indicators:**
- "GP concerned about malignancy"
- "Urgent - Within 2 weeks"
- "Immediately"
- "ASAP"
- "Suspicious lesion"

### 🟡 ROUTINE (Score 5-7, Within 6 weeks)
**Clinical Indicators:**
- Slowly growing lesions
- Long-standing lesions with minimal change
- Cystic lesions
- Lipomas
- Actinic (solar) keratosis
- Large seborrheic keratosis
- Cosmetic or appearance concerns
- Planning reconstruction post-cancer treatment
- Hand cases NOT compromising ADL
- Scars, abnormal scars, and keloids

**GP Language Indicators:**
- "Soon - Within 4–6 weeks"
- "Expedite"
- "Within 6 weeks"
- "Moderate priority"

### 🟢 NON_PRIORITY (Score 2-4, Routine scheduling)
**Clinical Indicators:**
- Cosmetic or appearance concerns only
- Stable lesions with no recent changes
- Abnormal scars or keloids (stable)
- Seborrheic keratosis (large but stable)
- Actinic keratosis (stable)
- Lipomas (stable)
- Cystic lesions (stable)

**GP Language Indicators:**
- "Routine"
- "When convenient"
- "No urgency"
- "Cosmetic only"

## AI Implementation Features

### 1. Enhanced Keyword Detection
The system automatically scans clinical descriptions and extracted document text for specific keywords:

**Urgent Keywords:**
- malignancy, malignant, cancer, carcinoma, melanoma
- bleeding, ulcerated, rapid, growing, changing, enlarging
- urgent, "2 week", "two week", immediately, asap
- suspicious, irregular, asymmetric, variegated
- fixed, attached, lymph, node, swelling
- immunocompromised, transplant, immunosuppressed
- head, face, functional, vision, breathing, speech, hearing, eating
- "activities of daily living", "adl"

**Routine Keywords:**
- routine, soon, "4-6 week", "6 week", expedite
- cyst, lipoma, seborrheic, actinic, keratosis
- scar, keloid, cosmetic, appearance

**Non-Priority Keywords:**
- "cosmetic only", "appearance only", "when convenient"
- "no urgency", stable, "long-standing", "no change"

### 2. Age-Based Risk Assessment
- Patients ≥70 years with suspicious lesions automatically receive higher urgency weighting
- Immunocompromised status (transplant patients) triggers urgent categorization

### 3. Visual Analysis Integration
When images are uploaded, the AI analyzes visual features:
- Irregular borders → Urgent indicator
- Asymmetric shape → Urgent indicator
- Bleeding/ulceration → Urgent indicator
- Dark/black coloration → Urgent indicator
- Variegated colors → Urgent indicator
- Large size → Higher urgency

### 4. GP Assessment Language Processing
The system specifically looks for NHS referral language patterns:
- Urgent referral language → URGENT category
- Standard referral language → ROUTINE category
- Routine referral language → NON_PRIORITY category

## Confidence Scoring

The AI provides confidence scores based on:

- **High Confidence (≥80%)**: Clear clinical indicators present, multiple supporting factors
- **Medium Confidence (50-79%)**: Some indicators present, may need clinical review
- **Low Confidence (<50%)**: Weak indicators, manual review recommended

## Quality Assurance

### Validation Rules
1. All categorizations must reference specific clinical indicators from the expert guidelines
2. Confidence scores reflect the strength of clinical evidence
3. Rationale must explain the categorization using medical terminology
4. Edge cases default to ROUTINE for safety

### Clinical Override
- Final clinical priority should always be determined by the receiving specialist team
- AI assessment serves as a recommendation tool, not a replacement for clinical judgment
- Complex cases may require multi-disciplinary team review regardless of AI categorization

## Technical Implementation

### Model Configuration
- Primary model: GPT-4o for optimal clinical reasoning
- Fallback model: GPT-4o-mini for faster processing
- Temperature: 0.2 (low for consistent, deterministic responses)
- Max tokens: 300 (sufficient for categorization response)

### Input Processing
1. Clinical description analysis
2. Document text extraction and keyword scanning
3. Image analysis (if provided)
4. Context building with detected indicators
5. AI categorization with expert rule compliance
6. Confidence scoring and rationale generation

### Output Format
```json
{
  "category": "URGENT|ROUTINE|NON_PRIORITY",
  "confidence": 0.85,
  "rationale": "Clinical reasoning referencing specific indicators"
}
```

## Benefits of Expert Rule Integration

1. **Clinical Accuracy**: Follows established plastic surgery protocols
2. **Consistency**: Standardized categorization across all cases
3. **Transparency**: Clear rationale linking to clinical indicators
4. **Safety**: Conservative approach with appropriate defaults
5. **Efficiency**: Automated detection of key clinical factors
6. **Quality**: Confidence scoring helps identify cases needing review

## Future Enhancements

1. **Learning Feedback**: Incorporate clinician feedback to improve accuracy
2. **Specialty-Specific Rules**: Extend to other surgical specialties
3. **Risk Stratification**: More granular urgency levels
4. **Integration**: Direct connection to NHS referral systems
5. **Monitoring**: Track categorization accuracy and outcomes

This implementation ensures that AI-powered triage follows evidence-based clinical protocols while maintaining the flexibility for clinical oversight and decision-making.
