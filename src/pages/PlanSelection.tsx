import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useOnboarding } from '../context/OnboardingContext';
import type { PlanType } from '../context/OnboardingContext';
import classNames from 'classnames';

const PLANS: { id: PlanType; title: string; price: number; interval: string; description: string }[] = [
  { id: 'Monthly', title: 'Monthly Plan', price: 99, interval: 'mo', description: 'Flexible access billed monthly.' },
  { id: 'Quarterly', title: 'Quarterly Plan', price: 249, interval: '3 mo', description: 'Save 16% with a 3-month commitment.' },
  { id: 'Annual', title: 'Annual Plan', price: 899, interval: 'yr', description: 'Best value. Save 24% billed yearly.' },
];

export const PlanSelection: React.FC = () => {
  const { state, updateState, nextStep, prevStep } = useOnboarding();
  const [selectedPlan, setSelectedPlan] = useState<PlanType | undefined>(state.selectedPlan);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) {
      setError('Please select a plan to continue');
      return;
    }
    setError(null);
    updateState({ selectedPlan });
    nextStep();
  };

  return (
    <Card className="w-full" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="mb-2 text-center">Choose Your Plan</h2>
      <p className="text-muted mb-8 text-center">You are eligible! Select a subscription plan that works for you.</p>

      <form onSubmit={handleSubmit} className="flex-col gap-lg">
        <div className="flex-row gap-lg" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={classNames('plan-card', selectedPlan === plan.id && 'selected')}
              onClick={() => { setSelectedPlan(plan.id); setError(null); }}
              style={{ minWidth: '220px' }}
            >
              <h3>{plan.title}</h3>
              <div className="price">
                ${plan.price}<span>/{plan.interval}</span>
              </div>
              <p style={{ fontSize: '0.9rem', flex: 1 }}>{plan.description}</p>
              
              <div className="mt-6 flex-center w-full">
                <div 
                  className={classNames('checkbox-input')} 
                  style={{ borderRadius: '50%', margin: 0 }}
                  data-checked={selectedPlan === plan.id}
                >
                  {selectedPlan === plan.id && (
                    <div style={{ width: '10px', height: '10px', background: 'var(--bg-primary)', borderRadius: '50%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && <div className="error-message text-center mt-4 w-full justify-center">{error}</div>}

        <div className="flex-row mt-8" style={{ justifyContent: 'space-between' }}>
          <Button type="button" variant="secondary" onClick={prevStep} style={{ width: 'auto' }}>
            Back
          </Button>
          <Button type="submit" style={{ width: 'auto' }}>
            Review & Submit
          </Button>
        </div>
      </form>
    </Card>
  );
};
