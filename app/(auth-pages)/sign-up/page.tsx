'use client';
import { signUpAction } from "@/app/actions";
import { FormMessage } from "@/components/form-message";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from 'next/navigation';

interface SignUpFormData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  birth_date: string;
  gender: string;
  location: string;
}

export default function Signup() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const error = searchParams.get('error');

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    username: '',
    full_name: '',
    birth_date: '',
    gender: '',
    location: '',
  });

  const updateFormData = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        return formData.email && formData.password;
      case 2:
        return formData.username && formData.full_name;
      case 3:
        return formData.birth_date && formData.gender;
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });
    await signUpAction(form);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Informations de connexion</h2>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
            />
            <Input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              minLength={6}
              required
              className="w-full px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Profil personnel</h2>
            <Input
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={(e) => updateFormData('username', e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
            />
            <Input
              name="full_name"
              type="text"
              placeholder="Nom complet"
              value={formData.full_name}
              onChange={(e) => updateFormData('full_name', e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <Input
              type="date"
              name="birth_date"
              placeholder="Date de naissance"
              value={formData.birth_date}
              onChange={(e) => updateFormData('birth_date', e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={(e) => updateFormData('gender', e.target.value)}
              required
              className="w-full px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
            >
              <option value="">Sélectionnez votre genre</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
            <Input
              name="location"
              type="text"
              placeholder="Localisation"
              value={formData.location}
              onChange={(e) => updateFormData('location', e.target.value)}
              className="w-full px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
          <p className="text-gray-500 text-lg">
            Déjà inscrit ?{" "}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>

        {message && (
          <div className="mb-6">
            <FormMessage message={message} error={error === 'true'} />
          </div>
        )}

        <div className="flex justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-3 h-3 rounded-full mx-1 ${
                stepNumber === step
                  ? 'bg-blue-500'
                  : stepNumber < step
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}

          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Précédent
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                Terminer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
