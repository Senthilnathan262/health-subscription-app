import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useOnboarding } from '../context/OnboardingContext';

export const Ineligible: React.FC = () => {
  const { updateState, prevStep } = useOnboarding();

  const handleBack = () => {
    updateState({ isEligible: true });
    prevStep(); // Assuming prepStep is safe, or explicitly currentStep: 2
  };

  return (
    <div className="flex-center w-full" style={{ minHeight: '60vh' }}>
      <Card className="text-center animate-fade-in" style={{ maxWidth: '500px' }}>
        <h2 className="mb-4" style={{ color: 'var(--warning)' }}>Additional Review Required</h2>
        <p className="mb-6">
          Based on your medical screening, we cannot automatically approve your subscription plan at this time.
        </p>
        <p className="text-muted mb-8" style={{ fontSize: '0.9rem' }}>
          If you believe this is an error or would like to discuss your specific case, please contact our support team.
        </p>

        <div className="flex-row gap-md justify-center w-full" style={{ justifyContent: 'center' }}>
          <Button variant="secondary" onClick={handleBack} style={{ flex: 1 }}>
            Go Back
          </Button>
          <Button onClick={() => alert('Contacting support...')} style={{ flex: 1 }}>
            Contact Support
          </Button>
        </div>
      </Card>
    </div>
  );
};
