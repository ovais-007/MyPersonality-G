"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession(); //react hook to get data
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Analyze Your Personality
        </h1>

        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 text-white hover:scale-105 font-bold py-3 px-6 rounded-lg flex items-center justify-center w-full"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}