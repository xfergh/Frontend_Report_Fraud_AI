
'use client';

import { logout } from '@/lib/api';
import styles from './DashboardHeader.module.css';

export default function DashboardHeader() {
  return (
    <header className={styles.header}>
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

        <div className={styles.actions}>
          <span className={styles.role}>
            Administrador
          </span>

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
  );
}
