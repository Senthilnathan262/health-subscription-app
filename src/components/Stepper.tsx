import React from 'react';
import classNames from 'classnames';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  steps: string[];
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex-row mb-8 relative" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '2px',
          background: 'var(--border-color)',
          zIndex: 0,
          transform: 'translateY(-50%)'
        }}
      >
        <div 
          style={{
            height: '100%',
            background: 'var(--accent-primary)',
            width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * 100}%`,
            transition: 'width var(--transition-bounce)'
          }}
        />
      </div>

      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;
        const isCompleted = currentStep > stepNum;

        return (
          <div key={index} className="flex-col flex-center relative" style={{ zIndex: 1 }}>
            <div 
              className={classNames(
                'flex-center',
                {
                  'bg-accent-primary': isActive || isCompleted,
                }
              )}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isActive ? 'var(--accent-primary)' : isCompleted ? 'var(--success)' : 'var(--bg-tertiary)',
                color: isActive || isCompleted ? '#000' : 'var(--text-muted)',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                border: `2px solid ${isActive || isCompleted ? 'transparent' : 'var(--border-color)'}`,
                fontWeight: 600,
                transition: 'all var(--transition-normal)',
                marginBottom: '8px'
              }}
            >
              {isCompleted ? <Check size={18} strokeWidth={3} /> : stepNum}
            </div>
            <span 
              style={{
                fontSize: '0.8rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                position: 'absolute',
                top: '100%',
                width: '100px',
                textAlign: 'center',
                transition: 'color var(--transition-normal)'
              }}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};
