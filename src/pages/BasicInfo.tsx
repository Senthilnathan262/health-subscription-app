import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useOnboarding } from '../context/OnboardingContext';
import { BasicInfoSchema } from '../schemas';
import type { BasicInfoType } from '../schemas';

export const BasicInfo: React.FC = () => {
  const { state, updateState, nextStep } = useOnboarding();
  const [formData, setFormData] = useState<Partial<BasicInfoType>>(state.basicInfo || {
    fullName: '',
    age: undefined,
    country: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? (value ? Number(value) : undefined) : value }));
    // clear error for this field
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsed = BasicInfoSchema.safeParse(formData);
    if (!parsed.success) {
      const newErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err: any) => {
        if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    updateState({ basicInfo: parsed.data });
    nextStep();
  };

  return (
    <Card className="w-full" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="mb-2">Basic Information</h2>
      <p className="text-muted mb-6">Please provide some basic details to get started.</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName || ''}
          onChange={handleChange}
          error={errors.fullName}
        />
        
        <Input
          label="Age"
          name="age"
          type="number"
          placeholder="25"
          value={formData.age || ''}
          onChange={handleChange}
          error={errors.age}
        />
        
        <Input
          label="Country of Residence"
          name="country"
          placeholder="United States"
          value={formData.country || ''}
          onChange={handleChange}
          error={errors.country}
        />

        <div className="flex-row mt-8" style={{ justifyContent: 'flex-end' }}>
          <Button type="submit" style={{ width: 'auto' }}>
            Continue to Screening
          </Button>
        </div>
      </form>
    </Card>
  );
};
