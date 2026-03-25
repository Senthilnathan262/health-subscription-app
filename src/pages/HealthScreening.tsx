import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SelectionCard } from '../components/SelectionCard';
import { useOnboarding } from '../context/OnboardingContext';
import { ScreeningInfoSchema } from '../schemas';
import type { ScreeningInfoType } from '../schemas';

const ALL_CONDITIONS = ['Diabetes', 'High Blood Pressure', 'Sleep Apnea', 'Heart Disease', 'None'] as const;

export const HealthScreening: React.FC = () => {
  const { state, updateState, nextStep, prevStep, checkEligibility } = useOnboarding();
  const [formData, setFormData] = useState<Partial<ScreeningInfoType>>(state.screeningInfo || {
    conditions: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (formData.conditions?.includes('None')) {
      if (formData.conditions.length > 1) {
        setFormData(prev => ({ ...prev, conditions: ['None'] }));
      }
    }
  }, [formData.conditions]);

  const toggleCondition = (condition: string) => {
    setFormData(prev => {
      const current = prev.conditions || [];
      if (condition === 'None') return { ...prev, conditions: ['None'], diabetesControlled: undefined, recentCardiacEvent: undefined };
      
      const newConditions = current.includes(condition as any)
        ? current.filter(c => c !== condition)
        : [...current.filter(c => c !== 'None'), condition as any];
        
      const updates: any = { conditions: newConditions };
      if (!newConditions.includes('Diabetes')) updates.diabetesControlled = undefined;
      if (!newConditions.includes('Heart Disease')) updates.recentCardiacEvent = undefined;
      
      return { ...prev, ...updates };
    });
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsed = ScreeningInfoSchema.safeParse(formData);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err: any) => {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    const isEligible = checkEligibility(parsed.data);
    updateState({ screeningInfo: parsed.data, isEligible });
    
    // Only proceed to next screen visually if eligible. If not, the App.tsx will intercept it,
    // actually wait, let's just proceed to nextStep because App.tsx intercepts it seamlessly.
    nextStep();
  };

  const hasDiabetes = formData.conditions?.includes('Diabetes');
  const hasHeartDisease = formData.conditions?.includes('Heart Disease');

  return (
    <Card className="w-full" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-2">Health Screening</h2>
      <p className="text-muted mb-6">Determine your eligibility based on medical history.</p>

      <form onSubmit={handleSubmit} className="flex-col gap-xl">
        <div className="form-group">
          <label className="form-label mb-2">Do you currently have any of the following conditions? (Select all that apply)</label>
          <div className="flex-col gap-sm">
            {ALL_CONDITIONS.map(condition => (
              <React.Fragment key={condition}>
                <SelectionCard
                  title={condition}
                  selected={formData.conditions?.includes(condition)}
                  onClick={() => toggleCondition(condition)}
                />
                
                {/* Nested flow for Diabetes */}
                {condition === 'Diabetes' && hasDiabetes && (
                  <div className="animate-fade-in pl-4 border-l-2 ml-4 mt-2" style={{ borderColor: 'var(--border-color)', paddingLeft: '1rem' }}>
                    <label className="form-label mb-2 text-primary" style={{ fontSize: '0.9rem' }}>Is your diabetes currently under medical control?</label>
                    <div className="flex-col gap-sm">
                      <SelectionCard
                        title="Yes"
                        type="radio"
                        selected={formData.diabetesControlled === true}
                        onClick={() => setFormData(prev => ({ ...prev, diabetesControlled: true }))}
                        style={{ padding: '0.75rem' }}
                      />
                      <SelectionCard
                        title="No"
                        type="radio"
                        selected={formData.diabetesControlled === false}
                        onClick={() => setFormData(prev => ({ ...prev, diabetesControlled: false }))}
                        style={{ padding: '0.75rem' }}
                      />
                    </div>
                    {errors.diabetesControlled && <span className="error-message mt-2">{errors.diabetesControlled}</span>}
                  </div>
                )}

                {/* Nested flow for Heart Disease */}
                {condition === 'Heart Disease' && hasHeartDisease && (
                  <div className="animate-fade-in pl-4 border-l-2 ml-4 mt-2" style={{ borderColor: 'var(--border-color)', paddingLeft: '1rem' }}>
                    <label className="form-label mb-2 text-primary" style={{ fontSize: '0.9rem' }}>Have you had any cardiac events in the past 12 months?</label>
                    <div className="flex-col gap-sm">
                      <SelectionCard
                        title="Yes"
                        type="radio"
                        selected={formData.recentCardiacEvent === true}
                        onClick={() => setFormData(prev => ({ ...prev, recentCardiacEvent: true }))}
                        style={{ padding: '0.75rem' }}
                      />
                      <SelectionCard
                        title="No"
                        type="radio"
                        selected={formData.recentCardiacEvent === false}
                        onClick={() => setFormData(prev => ({ ...prev, recentCardiacEvent: false }))}
                        style={{ padding: '0.75rem' }}
                      />
                    </div>
                    {errors.recentCardiacEvent && <span className="error-message mt-2">{errors.recentCardiacEvent}</span>}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          {errors.conditions && <span className="error-message mt-2">{errors.conditions}</span>}
        </div>

        <div className="flex-row mt-4" style={{ justifyContent: 'space-between' }}>
          <Button type="button" variant="secondary" onClick={prevStep} style={{ width: 'auto' }}>
            Back
          </Button>
          <Button type="submit" style={{ width: 'auto' }}>
            Continue to Plans
          </Button>
        </div>
      </form>
    </Card>
  );
};
