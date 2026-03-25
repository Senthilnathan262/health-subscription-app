import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useOnboarding } from '../context/OnboardingContext';
import { api } from '../api';

export const ReviewSubmit: React.FC = () => {
  const { state, updateState, prevStep } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await api.updateApplication({
        email: state.email!,
        basicInfo: state.basicInfo,
        screeningInfo: state.screeningInfo,
        selectedPlan: state.selectedPlan,
        action: 'submit'
      });
      // Move to a success 'step' (step 5)
      updateState({ currentStep: 5 });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!state.basicInfo || !state.screeningInfo || !state.selectedPlan) {
    return <div>Missing information. Please go back and complete the form.</div>;
  }

  return (
    <Card className="w-full" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-2 text-center">Review & Submit</h2>
      <p className="text-muted mb-8 text-center">Please review your details before final submission.</p>

      <div className="flex-col gap-lg text-left">
        <div className="p-4" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-md)' }}>
          <h3 className="mb-4 text-primary" style={{ fontSize: '1.2rem' }}>Basic Information</h3>
          <p><strong>Name:</strong> {state.basicInfo.fullName}</p>
          <p><strong>Age:</strong> {state.basicInfo.age}</p>
          <p><strong>Country:</strong> {state.basicInfo.country}</p>
        </div>

        <div className="p-4" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-md)' }}>
          <h3 className="mb-4 text-primary" style={{ fontSize: '1.2rem' }}>Health Screening</h3>
          <p><strong>Conditions:</strong> {state.screeningInfo.conditions.join(', ')}</p>
          {state.screeningInfo.conditions.includes('Diabetes') && (
            <p className="mt-2"><strong>Diabetes Controlled:</strong> {state.screeningInfo.diabetesControlled ? 'Yes' : 'No'}</p>
          )}
          {state.screeningInfo.conditions.includes('Heart Disease') && (
            <p className="mt-2"><strong>Recent Cardiac Event:</strong> {state.screeningInfo.recentCardiacEvent ? 'Yes' : 'No'}</p>
          )}
        </div>

        <div className="p-4" style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--accent-secondary)' }}>
          <h3 className="mb-4 text-primary" style={{ fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>Selected Plan</h3>
          <p className="text-xl" style={{ fontSize: '1.5rem', fontWeight: 600 }}>{state.selectedPlan} Plan</p>
        </div>
      </div>

      {error && <div className="error-message text-center mt-6 w-full justify-center">{error}</div>}

      <div className="flex-row mt-8" style={{ justifyContent: 'space-between' }}>
        <Button variant="secondary" onClick={prevStep} style={{ width: 'auto' }} disabled={isLoading}>
          Back to Edit
        </Button>
        <Button onClick={handleSubmit} style={{ width: 'auto' }} isLoading={isLoading}>
          Confirm & Submit
        </Button>
      </div>
    </Card>
  );
};
