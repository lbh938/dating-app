import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
      <div className="w-full max-w-sm">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Connexion</h1>
          <p className="text-gray-500 text-lg">
            Pas encore de compte ?{" "}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </div>

        {/* Formulaire */}
        <form className="space-y-4">
          <div className="space-y-2">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              name="password"
              placeholder="Mot de passe"
              required
              className="w-full px-4 py-3.5 rounded-full border border-gray-200 dark:border-gray-800 bg-transparent focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
            />
            <div className="text-right">
              <Link 
                href="/forgot-password"
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <SubmitButton
            formAction={signInAction}
            pendingText="Connexion en cours..."
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full py-3.5 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Se connecter
          </SubmitButton>

          <FormMessage message={searchParams} />
        </form>
      </div>
    </div>
  );
}
