// Letter Generation Service for NHS Plastic Surgery Triage System

export interface PatientData {
  fullName: string;
  title: string; // Mr/Mrs/Ms/Dr etc.
  surname: string;
  addressLine1: string;
  addressLine2?: string;
  postcode: string;
  nhsNumber: string;
  dateOfBirth: string;
  gpPractice: string;
  medications?: string[];
  medicalConditions?: string[];
  allergies?: string[];
}

export interface AppointmentDetails {
  date: string;
  time: string;
  location: string;
  clinicName: string;
  consultantName: string;
  department: string;
  contactPhone: string;
  contactEmail: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  category: 'urgent' | 'routine' | 'non-priority';
  template: string;
}

export const letterTemplates: LetterTemplate[] = [
  {
    id: 'urgent-appointment',
    name: 'Urgent Skin Lesion Assessment',
    category: 'urgent',
    template: `[Hospital/Trust Letterhead]
Plastic Surgery Department
NHS Lothian
[Hospital Address]
[Postcode]
[Phone Number]
[Email Address]

[Date]

PRIVATE AND CONFIDENTIAL

To: {{patientTitle}} {{patientFullName}}
{{addressLine1}}
{{addressLine2}}
{{postcode}}

Appointment Notification – Urgent Skin Lesion Assessment

Dear {{patientTitle}} {{patientSurname}},

We are writing to inform you that your recent referral to the Plastic Surgery Department for assessment of a skin lesion has now been reviewed.

As part of our commitment to delivering timely and effective care, NHS Lothian is piloting a Smart AI-assisted triage system. This system, which is closely monitored and validated by our consultant plastic surgeons, has assessed your referral and determined that your condition requires urgent evaluation.

You have therefore been scheduled for an appointment at our See and Treat Skin Lesion Clinic, where we aim to assess—and if appropriate—treat your lesion on the same day.

Your Appointment Details:
Date: {{appointmentDate}}
Time: {{appointmentTime}}
Location: {{appointmentLocation}}
Clinic Name: {{clinicName}}

Important Information Before You Attend:
To help us prepare for your appointment and ensure your safety during any possible procedures, please contact our team immediately if you:

• Are taking any blood-thinning (anticoagulant) medications such as warfarin, apixaban, or rivaroxaban
• Have a pacemaker or implantable device
• Have any other medical concerns or queries

Please contact our Waiting List Office or Plastic Surgery Secretary on:
📞 {{contactPhone}}
📧 {{contactEmail}}

We kindly ask that you arrive 10–15 minutes before your appointment time. If you are unable to attend on the date provided, please contact us as soon as possible so we can reschedule your appointment and offer the slot to another patient.

Thank you for your attention, and we look forward to seeing you at the clinic.

Yours sincerely,

{{consultantName}}
On behalf of the Plastic Surgery Department
NHS Lothian

---
Reference: {{referenceNumber}}
Generated: {{generationDate}}
AI Disclaimer: This letter was generated using AI-assisted triage technology, validated by clinical professionals.`
  },
  {
    id: 'routine-appointment',
    name: 'Routine Appointment Notification',
    category: 'routine',
    template: `[Hospital/Trust Letterhead]
Plastic Surgery Department
NHS Lothian
[Hospital Address]
[Postcode]
[Phone Number]
[Email Address]

[Date]

PRIVATE AND CONFIDENTIAL

To: {{patientTitle}} {{patientFullName}}
{{addressLine1}}
{{addressLine2}}
{{postcode}}

Plastic Surgery Appointment Notification

Dear {{patientTitle}} {{patientSurname}},

Thank you for your referral to the Plastic Surgery Department. We have reviewed your case and would like to offer you an appointment for assessment.

Your Appointment Details:
Date: {{appointmentDate}}
Time: {{appointmentTime}}
Location: {{appointmentLocation}}
Consultant: {{consultantName}}
Department: {{department}}

Before Your Appointment:
Please bring with you:
• A list of all current medications
• Any relevant previous medical records
• Photo identification (NHS card or driving license)

If you have any of the following, please inform us before your appointment:
• Blood-thinning medications (warfarin, apixaban, rivaroxaban)
• Pacemaker or other implantable devices
• Known allergies or adverse reactions

Contact Information:
If you need to reschedule or have questions, please contact:
📞 {{contactPhone}}
📧 {{contactEmail}}

Please arrive 15 minutes before your appointment time. If you cannot attend, please give us at least 48 hours notice so we can offer the appointment to another patient.

We look forward to seeing you.

Yours sincerely,

{{consultantName}}
Plastic Surgery Department
NHS Lothian

---
Reference: {{referenceNumber}}
Generated: {{generationDate}}`
  },
  {
    id: 'information-request',
    name: 'Additional Information Required',
    category: 'routine',
    template: `[Hospital/Trust Letterhead]
Plastic Surgery Department
NHS Lothian
[Hospital Address]
[Postcode]
[Phone Number]
[Email Address]

[Date]

PRIVATE AND CONFIDENTIAL

To: {{patientTitle}} {{patientFullName}}
{{addressLine1}}
{{addressLine2}}
{{postcode}}

Request for Additional Information

Dear {{patientTitle}} {{patientSurname}},

Thank you for your referral to the Plastic Surgery Department. 

We have reviewed your referral, however, we require some additional information before we can proceed with scheduling your appointment.

Required Information:
{{additionalInfoRequired}}

Please arrange with your GP practice to provide this information, or you may contact us directly using the details below.

Once we receive the additional information, we will review your case and contact you within 10 working days to arrange your appointment.

Contact Information:
📞 {{contactPhone}}
📧 {{contactEmail}}

We apologize for any inconvenience and appreciate your cooperation in ensuring we can provide you with the best possible care.

Yours sincerely,

{{consultantName}}
Plastic Surgery Department
NHS Lothian

---
Reference: {{referenceNumber}}
Generated: {{generationDate}}`
  }
];

export class LetterGenerationService {
  
  static generateLetter(
    templateId: string, 
    patientData: PatientData, 
    appointmentDetails: AppointmentDetails,
    additionalData?: Record<string, string>
  ): string {
    const template = letterTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Letter template '${templateId}' not found`);
    }

    let letterContent = template.template;
    const currentDate = new Date().toLocaleDateString('en-GB');
    const referenceNumber = `PLS-${Date.now().toString().slice(-8)}`;

    // Replace patient data placeholders
    letterContent = letterContent
      .replace(/{{patientTitle}}/g, patientData.title)
      .replace(/{{patientFullName}}/g, patientData.fullName)
      .replace(/{{patientSurname}}/g, patientData.surname)
      .replace(/{{addressLine1}}/g, patientData.addressLine1)
      .replace(/{{addressLine2}}/g, patientData.addressLine2 || '')
      .replace(/{{postcode}}/g, patientData.postcode)
      .replace(/{{nhsNumber}}/g, patientData.nhsNumber);

    // Replace appointment data placeholders
    letterContent = letterContent
      .replace(/{{appointmentDate}}/g, appointmentDetails.date)
      .replace(/{{appointmentTime}}/g, appointmentDetails.time)
      .replace(/{{appointmentLocation}}/g, appointmentDetails.location)
      .replace(/{{clinicName}}/g, appointmentDetails.clinicName)
      .replace(/{{consultantName}}/g, appointmentDetails.consultantName)
      .replace(/{{department}}/g, appointmentDetails.department)
      .replace(/{{contactPhone}}/g, appointmentDetails.contactPhone)
      .replace(/{{contactEmail}}/g, appointmentDetails.contactEmail);

    // Replace system data placeholders
    letterContent = letterContent
      .replace(/{{generationDate}}/g, currentDate)
      .replace(/{{referenceNumber}}/g, referenceNumber);

    // Replace any additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        letterContent = letterContent.replace(placeholder, value);
      });
    }

    return letterContent;
  }

  static generateLetterPreview(
    templateId: string,
    urgencyCategory: 'urgent' | 'routine' | 'non-priority'
  ): string {
    // Sample data for preview
    const samplePatient: PatientData = {
      fullName: 'John Michael Smith',
      title: 'Mr',
      surname: 'Smith',
      addressLine1: '123 Example Street',
      addressLine2: 'Example District',
      postcode: 'EH1 2AB',
      nhsNumber: '123 456 7890',
      dateOfBirth: '15/03/1975',
      gpPractice: 'Example Medical Centre'
    };

    const sampleAppointment: AppointmentDetails = {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB'),
      time: urgencyCategory === 'urgent' ? '09:30 AM' : '2:30 PM',
      location: 'Royal Infirmary of Edinburgh, Plastic Surgery Unit, Level 3',
      clinicName: urgencyCategory === 'urgent' ? 'See and Treat Skin Lesion Clinic' : 'General Plastic Surgery Clinic',
      consultantName: 'Mr. James Richardson',
      department: 'Plastic Surgery',
      contactPhone: '0131 536 1000',
      contactEmail: 'plastic.surgery@nhslothian.scot.nhs.uk'
    };

    return this.generateLetter(templateId, samplePatient, sampleAppointment);
  }

  static downloadLetter(letterContent: string, filename: string): void {
    const blob = new Blob([letterContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  static printLetter(letterContent: string): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>NHS Letter</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6; 
                margin: 40px;
                max-width: 800px;
              }
              pre { 
                white-space: pre-wrap; 
                font-family: Arial, sans-serif;
              }
            </style>
          </head>
          <body>
            <pre>${letterContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }
}

export default LetterGenerationService;
