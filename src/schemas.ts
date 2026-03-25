import { z } from 'zod';

export const EmailVerifySchema = z.object({
  email: z.string().email('Invalid email address'),
});
export type EmailVerifyType = z.infer<typeof EmailVerifySchema>;

export const OtpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().min(4, 'OTP must be at least 4 characters'),
});
export type OtpVerifyType = z.infer<typeof OtpVerifySchema>;

export const BasicInfoSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(18, 'You must be at least 18 years old'),
  country: z.string().min(2, 'Country must be valid'),
});
export type BasicInfoType = z.infer<typeof BasicInfoSchema>;

export const ScreeningInfoSchema = z.object({
  conditions: z.array(z.enum(['Diabetes', 'High Blood Pressure', 'Sleep Apnea', 'Heart Disease', 'None'])),
  diabetesControlled: z.boolean().optional(),
  recentCardiacEvent: z.boolean().optional(),
}).refine(data => {
  if (data.conditions.includes('Diabetes') && data.diabetesControlled === undefined) return false;
  return true;
}, { message: "diabetesControlled is required when Diabetes is selected", path: ['diabetesControlled'] })
.refine(data => {
  if (data.conditions.includes('Heart Disease') && data.recentCardiacEvent === undefined) return false;
  return true;
}, { message: "recentCardiacEvent is required when Heart Disease is selected", path: ['recentCardiacEvent'] });

export type ScreeningInfoType = z.infer<typeof ScreeningInfoSchema>;

export const ApplicationUpdateSchema = z.object({
  email: z.string().email(),
  basicInfo: BasicInfoSchema.optional(),
  screeningInfo: ScreeningInfoSchema.optional(),
  selectedPlan: z.enum(['Monthly', 'Quarterly', 'Annual']).optional(),
  action: z.enum(['save', 'submit']).optional()
});
export type ApplicationUpdateType = z.infer<typeof ApplicationUpdateSchema>;
