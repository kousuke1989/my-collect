"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <main className="min-h-screen bg-sand flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-black tracking-[0.3em] text-ink">MY-COLE</h1>
          <p className="text-sm text-ink/60">確認メールを送信しました。</p>
          <p className="text-xs text-ink/40">メール内のリンクをクリックして登録を完了してください。</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-[0.3em] text-ink">MY-COLE</h1>
          <p className="text-xs tracking-[0.3em] text-ink/40 uppercase mt-1">新規登録</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
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
            <label className="text-xs tracking-widest text-ink/50 uppercase block mb-1">パスワード（6文字以上）</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-violet"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-sand py-3 text-xs tracking-[0.3em] uppercase font-bold hover:bg-violet transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "登録する"}
          </button>
        </form>

        <p className="text-center text-xs text-ink/40">
          すでにアカウントをお持ちの方は{" "}
          <a href="/login" className="text-violet underline">ログイン</a>
        </p>
      </div>
    </main>
  );
}