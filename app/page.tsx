import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Contenu principal */}
      <main className="w-full">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {user ? (
            <div className="p-4 text-center text-gray-500">
              Chargement du contenu...
            </div>
          ) : (
            <div className="w-full max-w-sm px-4">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-2">
                  Bienvenue sur DateApp
                </h3>
                <p className="text-gray-500 text-lg">
                  Rejoignez-nous dès maintenant.
                </p>
              </div>
              
              <div className="space-y-4">
                <Link href="/sign-up"
                  className="flex items-center justify-center w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full py-3.5 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                  Créer un compte
                </Link>
                <Link href="/sign-in"
                  className="flex items-center justify-center w-full border border-gray-200 dark:border-gray-800 font-bold rounded-full py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  Se connecter
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
