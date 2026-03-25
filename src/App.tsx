import { useOnboarding } from './context/OnboardingContext';
import { Stepper } from './components/Stepper';
import { OtpVerification } from './pages/OtpVerification';
import { BasicInfo } from './pages/BasicInfo';
import { HealthScreening } from './pages/HealthScreening';
import { PlanSelection } from './pages/PlanSelection';
import { ReviewSubmit } from './pages/ReviewSubmit';
import { ApplicationView } from './pages/ApplicationView';
import { Ineligible } from './pages/Ineligible';
import { Card } from './components/Card';

const STEPS = ['Basic Info', 'Health Screening', 'Plan Selection', 'Review'];

const AppContent = () => {
  const { state } = useOnboarding();

  // If user is not authenticated, show OTP
  if (!state.email) {
    return (
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        <h1 className="text-center" style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Health Plus
        </h1>
        <OtpVerification />
      </div>
    );
  }

  // If user is ineligible, stop flow
  if (!state.isEligible) {
    return (
      <div className="container" style={{ padding: '2rem 1.5rem' }}>
         <h1 className="text-center" style={{ marginBottom: '1rem', opacity: 0.8 }}>
          Health Plus
        </h1>
        <Ineligible />
      </div>
    );
  }

  // Render specific step
  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
      case 1:
        return <BasicInfo />;
      case 2:
        return <HealthScreening />;
      case 3:
        return <PlanSelection />;
      case 4:
        return <ReviewSubmit />;
      case 5:
        return (
          <div className="flex-center w-full" style={{ minHeight: '60vh' }}>
            <Card className="text-center animate-fade-in" style={{ maxWidth: '500px' }}>
              <div 
                style={{
                  width: '64px', height: '64px', borderRadius: '50%', background: 'var(--success)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                  color: '#000'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="mb-2">Application Submitted!</h2>
              <p className="text-muted">Thank you for subscribing to Health Plus. You will receive a confirmation email shortly.</p>
            </Card>
          </div>
        );
      default:
        return <BasicInfo />;
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 className="text-center" style={{ fontSize: '2rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Health Plus Onboarding
        </h1>
        {state.currentStep >= 1 && state.currentStep <= 4 && state.status?.toLowerCase() !== 'completed' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Stepper currentStep={state.currentStep} steps={STEPS} />
          </div>
        )}
      </header>
      
      <main className="flex-col" style={{ flex: 1 }}>
        <div key={state.currentStep} className="animate-fade-in w-full">
          {state.status?.toLowerCase() === 'completed' ? <ApplicationView /> : renderStep()}
        </div>
      </main>
    </div>
  );
};

export const App = () => {
  return <AppContent />;
};

export default App;
