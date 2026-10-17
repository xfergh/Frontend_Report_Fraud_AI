
import type { PendingReport } from './PendingReports';
import styles from './ReportHistory.module.css';

export type ReviewHistoryEntry = {
  report: PendingReport;
  decision: 'approved' | 'rejected';
  reviewedAt: string;
};

type ReportHistoryProps = {
  entries: ReviewHistoryEntry[] | null;
};

export default function ReportHistory({
  entries,
}: ReportHistoryProps) {
  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <div>
          <h2>Historial de reportes</h2>
          <p>Reportes procesados por el administrador.</p>
        </div>

        {entries !== null && (
          <span className={styles.counter}>
            {entries.length} procesados
          </span>
        )}
      </div>

      {entries === null ? (
        <div className={styles.empty}>
          El historial estará disponible al conectar el backend.
        </div>
      ) : entries.length === 0 ? (
        <div className={styles.empty}>
          Todavía no has aprobado ni rechazado reportes en esta sesión.
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Reporte</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Plataforma</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha de revisión</th>
                </tr>
              </thead>

              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.report.id}>
                    <td className={styles.reportId}>
                      {entry.report.id}
                    </td>

                    <td>{entry.report.category}</td>

                    <td>{entry.report.platform}</td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          entry.decision === 'approved'
                            ? styles.approved
                            : styles.rejected
                        }`}
                      >
                        {entry.decision === 'approved'
                          ? 'Aprobado'
                          : 'Rechazado'}
                      </span>
                    </td>

                    <td>{entry.reviewedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={styles.note}>
            Historial de demostración. Los registros se reinician
            al actualizar la página.
          </p>
        </>
      )}
    </section>
  );
}
