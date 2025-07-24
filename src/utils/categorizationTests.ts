/**
 * Test script to validate the enhanced AI categorization system
 * Tests integration with NHS Plastic Surgery expert guidelines
 */

import { categorizeClinicalCase, ClinicalCaseCategory } from '../services/openaiService';

// Test cases based on expert guidelines
const testCases = [
  {
    name: "Suspected Melanoma - Should be URGENT",
    clinicalDescription: "Rapidly enlarging dark pigmented lesion on patient's back, 8mm diameter, irregular border, asymmetric shape with variegated color. Patient reports recent changes in size and color over past 3 months.",
    additionalContext: {
      patientAge: "65",
      extractedDocumentText: "GP notes: Concerned about possible malignancy. Irregular pigmented lesion with recent rapid growth. Patient has history of excessive sun exposure. Requesting urgent referral within 2 weeks.",
      imageDescription: "Large irregular dark lesion with asymmetric borders and multiple colors including black, brown, and red areas"
    },
    expectedCategory: ClinicalCaseCategory.URGENT,
    expectedMinConfidence: 0.8
  },
  {
    name: "Stable Lipoma - Should be ROUTINE", 
    clinicalDescription: "Soft, mobile subcutaneous mass on patient's shoulder, approximately 3cm diameter. Patient reports it has been present for 2 years with no significant change in size.",
    additionalContext: {
      patientAge: "45",
      extractedDocumentText: "GP notes: Large lipoma, stable over 2 years. Patient requesting removal for cosmetic reasons. Can be seen within 6 weeks.",
      imageDescription: "Well-defined round soft tissue mass under the skin"
    },
    expectedCategory: ClinicalCaseCategory.ROUTINE,
    expectedMinConfidence: 0.7
  },
  {
    name: "Cosmetic Scar - Should be NON_PRIORITY",
    clinicalDescription: "Well-healed surgical scar on abdomen from previous surgery. Patient concerned about appearance but no functional issues.",
    additionalContext: {
      patientAge: "32",
      extractedDocumentText: "GP notes: Cosmetic concern only. Well-healed scar, no complications. Patient requesting scar revision when convenient. No urgency.",
      imageDescription: "Linear well-healed scar with good alignment"
    },
    expectedCategory: ClinicalCaseCategory.NON_PRIORITY,
    expectedMinConfidence: 0.7
  },
  {
    name: "Bleeding Ulcerated Lesion - Should be URGENT",
    clinicalDescription: "Ulcerated lesion on patient's nose, 12mm diameter, bleeding intermittently. Non-healing for 6 weeks despite treatment.",
    additionalContext: {
      patientAge: "72",
      extractedDocumentText: "GP notes: Non-healing ulcerated lesion, bleeding. Concerned about BCC or SCC. Patient is elderly. Urgent referral required within 2 weeks.",
      imageDescription: "Ulcerated lesion with irregular edges and areas of bleeding"
    },
    expectedCategory: ClinicalCaseCategory.URGENT,
    expectedMinConfidence: 0.8
  },
  {
    name: "Hand Function Compromise - Should be URGENT",
    clinicalDescription: "Mass on patient's palm affecting grip strength and ability to perform daily activities. Patient unable to write or hold objects properly.",
    additionalContext: {
      patientAge: "58",
      extractedDocumentText: "GP notes: Hand mass severely affecting activities of daily living. Patient cannot perform work duties. Functional compromise requires urgent assessment.",
      imageDescription: "Large mass on palm causing finger contracture"
    },
    expectedCategory: ClinicalCaseCategory.URGENT,
    expectedMinConfidence: 0.8
  }
];

/**
 * Run test suite for categorization system
 */
export const runCategorizationTests = async () => {
  console.log('🧪 Starting AI Categorization Test Suite');
  console.log('Testing integration with NHS Plastic Surgery expert guidelines\n');

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const result = await categorizeClinicalCase(
        testCase.clinicalDescription,
        testCase.additionalContext,
        'gpt-4o', // Use best model for testing
        0.2 // Low temperature for consistency
      );

      console.log(`  ✓ Category: ${result.category}`);
      console.log(`  ✓ Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`  ✓ Rationale: ${result.rationale.substring(0, 100)}...`);

      // Validate results
      const categoryMatch = result.category === testCase.expectedCategory;
      const confidenceMatch = result.confidence >= testCase.expectedMinConfidence;

      if (categoryMatch && confidenceMatch) {
        console.log(`  ✅ PASSED - Correct category and confidence\n`);
        passed++;
      } else {
        console.log(`  ❌ FAILED`);
        if (!categoryMatch) {
          console.log(`    Expected category: ${testCase.expectedCategory}, Got: ${result.category}`);
        }
        if (!confidenceMatch) {
          console.log(`    Expected confidence ≥${testCase.expectedMinConfidence}, Got: ${result.confidence}`);
        }
        console.log('');
        failed++;
      }
    } catch (error) {
      console.log(`  ❌ ERROR: ${error}\n`);
      failed++;
    }
  }

  console.log('📊 Test Results Summary:');
  console.log(`✅ Passed: ${passed}/${testCases.length}`);
  console.log(`❌ Failed: ${failed}/${testCases.length}`);
  console.log(`📈 Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);

  if (passed === testCases.length) {
    console.log('\n🎉 All tests passed! AI categorization system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the categorization logic.');
  }

  return {
    total: testCases.length,
    passed,
    failed,
    successRate: (passed / testCases.length) * 100
  };
};

/**
 * Test individual categorization
 */
export const testSingleCase = async (
  description: string, 
  context: any = {}, 
  expectedCategory?: ClinicalCaseCategory
) => {
  console.log('🔬 Testing Single Case:');
  console.log(`Description: ${description}`);
  
  const result = await categorizeClinicalCase(description, context);
  
  console.log(`Category: ${result.category}`);
  console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
  console.log(`Rationale: ${result.rationale}`);
  
  if (expectedCategory) {
    const match = result.category === expectedCategory;
    console.log(`Expected: ${expectedCategory} - ${match ? '✅ MATCH' : '❌ NO MATCH'}`);
  }
  
  return result;
};

// Export test cases for manual testing
export { testCases };
