
'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { errorMessage, login } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError('');
    setSending(true);
    try {
      await login(String(form.get('email')), String(form.get('password')));
      router.replace('/');
    } catch (e) {
      setError(errorMessage(e));
      setSending(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">

        <section className="login-brand">
          <div className="brand-circle brand-circle-1"></div>
          <div className="brand-circle brand-circle-2"></div>
          <div className="brand-circle brand-circle-3"></div>

          <div className="brand-content">
            <div className="brand-icon">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M24 5L39 11V22C39 32 32 39 24 43C16 39 9 32 9 22V11L24 5Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 24L22 29L31 19"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="brand-name">
              ReportFraud<span>AI</span>
            </h2>
          </div>
        </section>

        <section className="login-panel">
          <div className="login-card">
            <h1>Iniciar sesión</h1>

            <form onSubmit={handleSubmit}>
              <label>
                Correo electrónico
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </label>

              <label>
                Contraseña
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </label>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button
                className="login-button"
                type="submit"
                disabled={sending}
              >
                {sending ? 'Entrando…' : 'Entrar'}
              </button>
            </form>         
            {process.env.NODE_ENV === 'development' && (
              <button
                type="button"
                className="preview-button"
                onClick={() => router.push('/preview')}
              >
                Vista previa del panel
              </button>
            )}

          </div>
        </section>

      </div>
    </main>
  );
}
