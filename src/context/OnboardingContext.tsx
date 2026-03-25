import React, { createContext, useContext, useState, useEffect } from 'react';
import type { BasicInfoType, ScreeningInfoType } from '../schemas';

export type PlanType = 'Monthly' | 'Quarterly' | 'Annual';

export interface ApplicationState {
  email: string | null;
  currentStep: number;
  basicInfo?: BasicInfoType;
  screeningInfo?: ScreeningInfoType;
  selectedPlan?: PlanType;
  isEligible: boolean;
  status?: string;
}

interface OnboardingContextProps {
  state: ApplicationState;
  updateState: (updates: Partial<ApplicationState>) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  checkEligibility: (screening: ScreeningInfoType) => boolean;
}

const STORAGE_KEY = 'health_onboarding_session';

const defaultState: ApplicationState = {
  email: null,
  currentStep: 0,
  isEligible: true,
};

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ApplicationState>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse session storage state', e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<ApplicationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  const prevStep = () => setState((prev) => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  
  const reset = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  };

  const checkEligibility = (screening: ScreeningInfoType): boolean => {
    const { conditions, diabetesControlled, recentCardiacEvent } = screening;
    
    // Ineligible Rules
    if (conditions.includes('Diabetes') && diabetesControlled === false) return false;
    if (conditions.includes('Heart Disease') && recentCardiacEvent === true) return false;
    
    // 3 combination rule
    const criticalCombos = ['Diabetes', 'High Blood Pressure', 'Sleep Apnea'];
    const matches = conditions.filter(c => criticalCombos.includes(c));
    if (matches.length === 3) return false;

    return true;
  };

  return (
    <OnboardingContext.Provider value={{ state, updateState, nextStep, prevStep, reset, checkEligibility }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
