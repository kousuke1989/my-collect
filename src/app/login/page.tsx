"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-[0.3em] text-ink">MY-COLE</h1>
          <p className="text-xs tracking-[0.3em] text-ink/40 uppercase mt-1">ログイン</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs tracking-widest text-ink/50 uppercase block mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-violet"
            />
          </div>
          <div>
            <label className="text-xs tracking-widest text-ink/50 uppercase block mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-violet"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-sand py-3 text-xs tracking-[0.3em] uppercase font-bold hover:bg-violet transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "ログイン"}
          </button>
        </form>

        <p className="text-center text-xs text-ink/40">
          アカウントをお持ちでない方は{" "}
          <a href="/register" className="text-violet underline">新規登録</a>
        </p>
      </div>
    </main>
  );
}