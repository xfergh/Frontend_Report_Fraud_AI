import styles from './ReportHistory.module.css';

export type ReviewHistoryEntry = {
  id: string;
  category: string;
  subcategory: string;
  platform: string;
  status: 'approved' | 'rejected';
  date: string;
};

type ReportHistoryProps = {
  entries: ReviewHistoryEntry[];
};

export default function ReportHistory({
  entries,
}: ReportHistoryProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        Historial de reportes
      </h2>

      <p className={styles.subtitle}>
        Reportes procesados por el administrador.
      </p>

      {entries.length === 0 ? (
        <div className={styles.empty}>
          No hay reportes procesados todavía.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reporte</th>
                <th>Categoría</th>
                <th>Subcategoría</th>
                <th>Plataforma</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className={styles.reportId}>
                    {entry.id}
                  </td>

                  <td>{entry.category}</td>

                  <td>{entry.subcategory}</td>

                  <td>{entry.platform}</td>

                  <td>
                    <span
                      className={
                        entry.status === 'approved'
                          ? styles.approved
                          : styles.rejected
                      }
                    >
                      {entry.status === 'approved'
                        ? 'Aprobado'
                        : 'Rechazado'}
                    </span>
                  </td>

                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}