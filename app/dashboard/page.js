"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

      useEffect(() => {
        if (status === "unauthenticated") {
          router.push("/");
        }
      }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-2xl">Loading</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">

                <div className="bg-gray-300 rounded-lg shadow-lg p-6 mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Welcome, {session?.user?.name}
                        </h1>
                    </div>
                    <button
                        onClick={() => signOut()}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="bg-gray-300 rounded-lg shadow-lg p-8">

                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                        Choose Analysis Type
                    </h2>

                    <div className="flex justify-around">
                        <div
                            onClick={() => router.push("/mbti")}
                            className="bg-gray-400 flex items-center rounded-lg p-8 hover:scale-105 transition transform shadow-xl"
                        >
                            <h3 className="text-center text-white text-2xl font-bold mb-2 ">MBTI Type</h3>
                        </div>

                        <div
                            onClick={() => router.push("/big5")}
                            className="bg-gray-400 flex items-center rounded-lg p-8 hover:scale-105 transition transform shadow-xl"
                        >
                            <h3 className="text-2xl font-bold mb-2">Big Five</h3>
                        </div>
                    </div>

                </div>
                
            </div>
        </div>
    );
}