"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const signUpAction = async (formData: FormData) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const username = formData.get("username") as string;
  const fullName = formData.get("full_name") as string;
  const birthDate = formData.get("birth_date") as string;
  const gender = formData.get("gender") as string;
  const location = formData.get("location") as string;

  try {
    // 1. Vérification des champs requis
    if (!email || !password || !username || !fullName || !birthDate || !gender) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "Tous les champs obligatoires doivent être remplis"
      );
    }

    // 2. Inscription de l'utilisateur
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          username,
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      console.error('Signup error:', signUpError);
      return encodedRedirect(
        "error",
        "/sign-up",
        signUpError.message
      );
    }

    if (!user) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "Erreur lors de la création du compte"
      );
    }

    // 3. Création du profil
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
        full_name: fullName,
        birth_date: birthDate,
        gender,
        location,
      });

    if (profileError) {
      console.error('Profile error:', profileError);
      return encodedRedirect(
        "error",
        "/sign-up",
        "Erreur lors de la création du profil"
      );
    }

    return encodedRedirect(
      "success",
      "/sign-up",
      "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte."
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return encodedRedirect(
      "error",
      "/sign-up",
      "Une erreur inattendue s'est produite"
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
