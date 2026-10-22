
import styles from './SummaryCards.module.css';

export type ReportSummary = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

type SummaryCardsProps = {
  summary: ReportSummary | null;
};

const metrics = [
  { key: 'total', label: 'Total de reportes' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'approved', label: 'Aprobados' },
  { key: 'rejected', label: 'Rechazados' },
] as const;

export default function SummaryCards({
  summary,
}: SummaryCardsProps) {
  return (
    <section id="dashboard-summary" className={styles.section}>
      <h2 className={styles.title}>Resumen general</h2>

      <div className={styles.grid}>
        {metrics.map((metric) => (
          <article key={metric.key} className={styles.card}>
            <div className={styles.icon}>
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {metric.key === 'total' && (
                  <>
                    <path d="M7 3h8l4 4v14H7z" />
                    <path d="M15 3v5h4" />
                    <path d="M10 13h6M10 17h6" />
                  </>
                )}

                {metric.key === 'pending' && (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </>
                )}

                {metric.key === 'approved' && (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12l3 3 5-6" />
                  </>
                )}

                {metric.key === 'rejected' && (
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 9l6 6M15 9l-6 6" />
                  </>
                )}
              </svg>
            </div>

            <p className={styles.label}>{metric.label}</p>

            <p className={styles.value}>
              {summary
                ? summary[metric.key].toLocaleString('es-MX')
                : 'N/D'}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
