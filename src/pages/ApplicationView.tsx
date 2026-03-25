import React from 'react';
import { Card } from '../components/Card';
import { useOnboarding } from '../context/OnboardingContext';

export const ApplicationView: React.FC = () => {
  const { state } = useOnboarding();

  if (!state.basicInfo || !state.screeningInfo || !state.selectedPlan) {
    return <div>Application details are incomplete.</div>;
  }

  return (
    <Card className="w-full" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-2 text-center text-primary">Your Application</h2>
      <p className="text-muted mb-8 text-center">Your health subscription application is completed.</p>

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

      <div className="mt-8 text-center text-success w-full" style={{ padding: '1rem', background: 'var(--success-bg, rgba(46, 213, 115, 0.1))', color: 'var(--success)', borderRadius: 'var(--border-radius-sm)' }}>
        <span style={{ fontWeight: 600 }}>Status: Confirmed & Completed</span>
      </div>
    </Card>
  );
};
