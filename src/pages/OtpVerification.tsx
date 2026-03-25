import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useOnboarding } from '../context/OnboardingContext';
import { api } from '../api';
import { EmailVerifySchema, OtpVerifySchema } from '../schemas';

export const OtpVerification: React.FC = () => {
  const { updateState, nextStep } = useOnboarding();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = EmailVerifySchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      await api.sendOtp({ email });
      setStep('otp');
    } catch (err: any) {
      console.log('err', err)
      setError(err.response?.data?.message || 'Failed to send OTP. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = OtpVerifySchema.safeParse({ email, otp });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const resp = await api.verifyOtp({ email, otp });
      const details = resp.applicationDetails || {};
      updateState({
        email,
        basicInfo: details.basicInfo,
        screeningInfo: details.screeningInfo,
        selectedPlan: details.selectedPlan,
        status: resp.status
      });
      nextStep(); // Move to Step 1 (Basic Info)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-center w-full" style={{ minHeight: '80vh' }}>
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-2">Welcome Back</h2>
        <p className="text-center text-muted mb-6">
          {step === 'email' ? 'Enter your email to continue onboarding.' : 'Enter the OTP sent to your email.'}
        </p>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="flex-col">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error || undefined}
              required
            />
            <Button type="submit" isLoading={isLoading} className="mt-4">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex-col">
            <Input
              label="One-Time Password"
              type="text"
              placeholder="1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={error || undefined}
              required
              maxLength={6}
            />
            <Button type="submit" isLoading={isLoading} className="mt-4">
              Verify
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setStep('email'); setOtp(''); setError(null); }}
              className="mt-2"
              disabled={isLoading}
            >
              Change Email
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
