'use client';

import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import {
  crearAdministrador,
  errorMessage,
  logout,
} from '@/lib/api';
import styles from './DashboardHeader.module.css';

type NavigationSection = 'summary' | 'reports' | 'statistics' | 'history';

const navigation: { id: string; label: string; key: NavigationSection }[] = [
  { id: 'dashboard-summary', label: 'Resumen', key: 'summary' },
  { id: 'pending-reports', label: 'Reportes', key: 'reports' },
  { id: 'dashboard-statistics', label: 'Estadísticas', key: 'statistics' },
  { id: 'dashboard-history', label: 'Historial', key: 'history' },
];

function NavigationIcon({ section }: { section: NavigationSection }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {section === 'summary' && (
        <>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v11h14V9" />
          <path d="M9 20v-7h6v7" />
        </>
      )}
      {section === 'reports' && (
        <>
          <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          <path d="M14 3v6h5M9 13h6M9 17h6" />
        </>
      )}
      {section === 'statistics' && (
        <>
          <path d="M4 20V12M10 20V4M16 20v-9M22 20v-5" />
          <path d="M2 20h20" />
        </>
      )}
      {section === 'history' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}
    </svg>
  );
}

export default function DashboardHeader() {
  const headerRef = useRef<HTMLElement | null>(null);
  const navInnerRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] =
    useState<NavigationSection>('summary');

  useEffect(() => {
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      const topBoundary = (headerRef.current?.offsetHeight ?? 0) + 36;
      let current: NavigationSection = 'summary';

      for (const item of navigation) {
        const target = document.getElementById(item.id);
        if (target && target.getBoundingClientRect().top <= topBoundary) {
          current = item.key;
        }
      }

      const historySection = document.getElementById('dashboard-history');
      const nearPageEnd =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 8;

      if (
        nearPageEnd &&
        historySection &&
        historySection.getBoundingClientRect().top < window.innerHeight
      ) {
        current = 'history';
      }

      setActiveSection(current);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);


  useEffect(() => {
    const updateIndicator = () => {
      const nav = navInnerRef.current;
      const selected = nav?.querySelector<HTMLAnchorElement>(
        '[aria-current="location"]',
      );
      if (!nav || !selected) return;

      nav.style.setProperty('--rf-active-left', `${selected.offsetLeft}px`);
      nav.style.setProperty('--rf-active-width', `${selected.offsetWidth}px`);
      nav.style.setProperty('--rf-active-opacity', '1');
      nav.dataset.indicatorReady = 'true';
    };

    const frame = window.requestAnimationFrame(updateIndicator);
    window.addEventListener('resize', updateIndicator);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeSection]);

  function navigateToSection(event: MouseEvent<HTMLAnchorElement>, id: string, key: NavigationSection) {
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    setActiveSection(key);
    target.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  const [showCreateAdmin, setShowCreateAdmin] =
    useState(false);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function abrirModal() {
    setError('');
    setSuccess('');
    setShowCreateAdmin(true);
  }

  function cerrarModal() {
    if (sending) return;

    setShowCreateAdmin(false);
    setError('');
    setSuccess('');
  }

  async function handleCreateAdmin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const nombreUsuario = String(
      form.get('nombreUsuario') ?? '',
    ).trim();

    const correoElectronico = String(
      form.get('correoElectronico') ?? '',
    ).trim();

    const contrasena = String(
      form.get('contrasena') ?? '',
    );

    const confirmarContrasena = String(
      form.get('confirmarContrasena') ?? '',
    );

    setError('');
    setSuccess('');

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSending(true);

    try {
      const admin = await crearAdministrador({
        nombreUsuario,
        correoElectronico,
        contrasena,
      });

      setSuccess(
        `Administrador ${admin.correoElectronico} creado correctamente.`,
      );

      formElement.reset();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <header className={styles.header} ref={headerRef}>
        <div className={styles.container}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>
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
            <span className={styles.brandName}>
              ReportFraud<span>AI</span>
            </span>
          </div>

          <nav className={styles.nav} aria-label="Secciones del panel">
            <div className={styles.navInner} ref={navInnerRef}>
              {navigation.map((item) => (
                <a
                  key={item.key}
                  href={`#${item.id}`}
                  onClick={(event) =>
                    navigateToSection(event, item.id, item.key)
                  }
                  className={`${styles.navLink} ${activeSection === item.key ? styles.navLinkActive : ''}`}
                  aria-current={activeSection === item.key ? 'location' : undefined}
                >
                  <span className={styles.navIcon}>
                    <NavigationIcon section={item.key} />
                  </span>
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </nav>

          <div className={styles.actions}>
            <span className={styles.role}>Administrador</span>
            <button
              className={styles.createAdminButton}
              type="button"
              onClick={abrirModal}
            >
              Crear administrador
            </button>
            <button
              className={styles.logoutButton}
              type="button"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {showCreateAdmin && (
        <div className={styles.modalBackdrop}>
          <section className={styles.modal}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Crear administrador</h2>
                <p>
                  Registra una nueva cuenta con rol de
                  administrador.
                </p>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={cerrarModal}
                disabled={sending}
              >
                ×
              </button>
            </div>

            <form
              className={styles.adminForm}
              onSubmit={handleCreateAdmin}
            >
              <label>
                Nombre de usuario
                <input
                  name="nombreUsuario"
                  type="text"
                  required
                />
              </label>

              <label>
                Correo electrónico
                <input
                  name="correoElectronico"
                  type="email"
                  required
                />
              </label>

              <label>
                Contraseña
                <input
                  name="contrasena"
                  type="password"
                  required
                />
              </label>

              <label>
                Confirmar contraseña
                <input
                  name="confirmarContrasena"
                  type="password"
                  required
                />
              </label>

              {error && (
                <p className={styles.errorMessage}>
                  {error}
                </p>
              )}

              {success && (
                <p className={styles.successMessage}>
                  {success}
                </p>
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={cerrarModal}
                  disabled={sending}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={sending}
                >
                  {sending
                    ? 'Creando…'
                    : 'Crear administrador'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}