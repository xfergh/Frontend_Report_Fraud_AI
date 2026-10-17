
'use client';

import type { PendingReport } from './PendingReports';
import styles from './ReportDetails.module.css';

export type ReviewDecision = 'pending' | 'approved' | 'rejected';

type ReportDetailsProps = {
  report: PendingReport | null;
  preview: boolean;
  message: string;
  onDecision: (decision: ReviewDecision) => void;
  onEvidence: (nombreArchivo: string) => void;
};

export default function ReportDetails({
  report,
  preview,
  message,
  onDecision,
  onEvidence,
}: ReportDetailsProps) {
  return (
    <section id="report-details" className={styles.section}>
      <h2 className={styles.title}>Detalle del reporte</h2>

      {message && (
        <p className={styles.message} role="status">
          {message}
        </p>
      )}

      {!report ? (
        <div className={styles.empty}>
          Selecciona un reporte pendiente para consultar sus detalles.
        </div>
      ) : (
        <article className={styles.card}>
          <div className={styles.header}>
            <div>
              <span className={styles.reportId}>{report.id}</span>
              <h3>Información del reporte</h3>
            </div>

            <span className={styles.status}>En revisión</span>
          </div>

          <div className={styles.information}>
            <div>
              <span className={styles.label}>Categoría</span>
              <p>{report.category}</p>
            </div>

            <div>
              <span className={styles.label}>Subcategoría</span>
              <p>{report.subcategory ?? 'No especificada'}</p>
            </div>

            <div>
              <span className={styles.label}>Plataforma</span>
              <p>{report.platform}</p>
            </div>

            <div>
              <span className={styles.label}>Fecha</span>
              <p>{report.date}</p>
            </div>

            <div>
              <span className={styles.label}>Entidad reportada</span>
              <p>{report.reportedEntity ?? 'No especificada'}</p>
            </div>

            <div>
              <span className={styles.label}>Publicación</span>
              <p>
                {report.anonymous
                  ? 'Anónima'
                  : 'No anónima'}
              </p>
            </div>

          </div>

          <div className={styles.block}>
            <h3>Descripción del fraude</h3>
            <p className={styles.description}>
              {report.description}
            </p>
          </div>

          <div className={styles.block}>
            <h3>Evidencias adjuntas</h3>

            {report.evidenceNames?.length ? (
              <ul className={styles.evidenceList}>
                {report.evidenceNames.map((name, index) => (
                  <li key={`${name}-${index}`}>
                    <button
                      type="button"
                      onClick={() => onEvidence(name)}
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.note}>
                No hay evidencias disponibles para este reporte.
              </p>
            )}
            
          </div>

          <div className={styles.footer}>
            <p className={styles.note}>
              {preview
                ? 'Acciones de demostración. Los cambios no se envían al servidor.'
                : 'Selecciona una acción para actualizar el estado del reporte.'}
            </p>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.pendingButton}
                onClick={() => onDecision('pending')}
              >
                Mantener en revisión
              </button>

              <button
                type="button"
                className={styles.rejectButton}
                onClick={() => onDecision('rejected')}
              >
                Rechazar
              </button>

              <button
                type="button"
                className={styles.approveButton}
                onClick={() => onDecision('approved')}
              >
                Aprobar
              </button>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}
