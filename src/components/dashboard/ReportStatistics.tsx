
import type { ReportSummary } from './SummaryCards';
import type { PendingReport } from './PendingReports';
import styles from './ReportStatistics.module.css';

type ReportStatisticsProps = {
  summary: ReportSummary | null;
  reports: PendingReport[] | null;
};

const statusConfig = [
  { key: 'pending', label: 'Pendientes', color: '#D97706' },
  { key: 'approved', label: 'Aprobados', color: '#059669' },
  { key: 'rejected', label: 'Rechazados', color: '#DC2626' },
] as const;

const categoryColors = [
  '#2563EB',
  '#18B6A4',
  '#8B5CF6',
  '#F59E0B',
  '#EC4899',
  '#0EA5E9',
];

function createPieSlice(startAngle: number, endAngle: number) {
  const center = 110;
  const radius = 96;

  const start = {
    x: center + radius * Math.cos((startAngle * Math.PI) / 180),
    y: center + radius * Math.sin((startAngle * Math.PI) / 180),
  };

  const end = {
    x: center + radius * Math.cos((endAngle * Math.PI) / 180),
    y: center + radius * Math.sin((endAngle * Math.PI) / 180),
  };

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
}

export default function ReportStatistics({
  summary,
  reports,
}: ReportStatisticsProps) {
  const categoryCounts = new Map<string, number>();

  for (const report of reports ?? []) {
    categoryCounts.set(
      report.category,
      (categoryCounts.get(report.category) ?? 0) + 1
    );
  }

  const sortedCategories = [...categoryCounts.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  const totalCategories = reports?.length ?? 0;

  let currentAngle = -90;

  const slices = sortedCategories.map(([name, count], index) => {
    const percentage = (count / totalCategories) * 100;
    const angle = (count / totalCategories) * 360;

    const slice = {
      name,
      count,
      percentage,
      color: categoryColors[index % categoryColors.length],
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };

    currentAngle += angle;

    return slice;
  });

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Estadísticas de reportes</h2>

      <div className={styles.grid}>
        <article className={styles.card}>
          <h3>Distribución por estado</h3>

          {summary === null ? (
            <p className={styles.empty}>
              Las estadísticas estarán disponibles al conectar el backend.
            </p>
          ) : (
            <>
              <div className={styles.barChart}>
                <div className={styles.yAxis}>
                  {[100, 75, 50, 25, 0].map((value) => (
                    <span key={value}>{value}%</span>
                  ))}
                </div>

                <div className={styles.chartContent}>
                  <div className={styles.plotArea}>
                    {[0, 25, 50, 75, 100].map((value) => (
                      <div
                        key={value}
                        className={styles.gridLine}
                        style={{ bottom: `${value}%` }}
                      />
                    ))}

                    <div className={styles.barColumns}>
                      {statusConfig.map((status) => {
                        const count = summary[status.key];

                        const percentage =
                          summary.total > 0
                            ? (count / summary.total) * 100
                            : 0;

                        return (
                          <div
                            key={status.key}
                            className={styles.barColumn}
                          >
                            <span
                              className={styles.barValue}
                              style={{
                                bottom: `calc(${percentage}% + 8px)`,
                              }}
                            >
                              {count.toLocaleString('es-MX')}
                            </span>

                            <div
                              className={styles.bar}
                              style={{
                                height: `${percentage}%`,
                                backgroundColor: status.color,
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={styles.xLabels}>
                    {statusConfig.map((status) => (
                      <span key={status.key}>
                        {status.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className={styles.note}>
                Porcentaje respecto a {summary.total} reportes.
              </p>
            </>
          )}
        </article>

        <article className={styles.card}>
          <h3>Categorías de reportes pendientes</h3>

          {reports === null ? (
            <p className={styles.empty}>
              Las categorías estarán disponibles al conectar el backend.
            </p>
          ) : slices.length === 0 ? (
            <p className={styles.empty}>
              No hay reportes pendientes en la muestra.
            </p>
          ) : (
            <>
              <div className={styles.pieLayout}>
                <svg
                  className={styles.pieChart}
                  viewBox="0 0 220 220"
                  role="img"
                  aria-label="Distribución de reportes pendientes por categoría"
                >
                  {slices.map((slice) =>
                    slice.percentage === 100 ? (
                      <circle
                        key={slice.name}
                        cx="110"
                        cy="110"
                        r="96"
                        fill={slice.color}
                      />
                    ) : (
                      <path
                        key={slice.name}
                        d={createPieSlice(
                          slice.startAngle,
                          slice.endAngle
                        )}
                        fill={slice.color}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    )
                  )}
                </svg>

                <ul className={styles.legend}>
                  {slices.map((slice) => (
                    <li key={slice.name} className={styles.legendItem}>
                      <span
                        className={styles.legendColor}
                        style={{ backgroundColor: slice.color }}
                      />

                      <div className={styles.legendText}>
                        <span className={styles.categoryName}>
                          {slice.name}
                        </span>

                        <span className={styles.categoryValue}>
                          {slice.count} reportes (
                          {Math.round(slice.percentage)}%)
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <p className={styles.note}>
                Basado en {totalCategories} reportes de la muestra.
              </p>
            </>
          )}
        </article>
      </div>
    </section>
  );
}