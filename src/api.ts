import axios from 'axios';
import type { ApplicationUpdateType, EmailVerifyType, OtpVerifyType } from './schemas';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  sendOtp: async (data: EmailVerifyType) => {
    const response = await apiClient.post('/application/send-otp', data);
    return response.data;
  },
  verifyOtp: async (data: OtpVerifyType) => {
    const response = await apiClient.post('/application/verify-otp', data);
    return response.data;
  },
  updateApplication: async (data: ApplicationUpdateType) => {
    const response = await apiClient.patch('/application', data);
    return response.data;
  }
};
