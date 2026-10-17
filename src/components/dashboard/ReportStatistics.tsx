import type { ReportSummary } from './SummaryCards';
import type { PendingReport } from './PendingReports';
import type { EstadisticasReportesApi } from '@/lib/api';
import styles from './ReportStatistics.module.css';

type ReportStatisticsProps = {
  summary: ReportSummary | null;
  reports: PendingReport[] | null;
  statistics: EstadisticasReportesApi | null;
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

const sexoColors = [
  '#8B5CF6',
  '#2563EB',
  '#14B8A6',
  '#F59E0B',
  '#EC4899',
];

const edadColors = [
  '#60A5FA',
  '#818CF8',
  '#A78BFA',
  '#F59E0B',
  '#34D399',
];

const plataformaColors = [
  '#2563EB',
  '#14B8A6',
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

type DistributionItem = {
  label: string;
  cantidad: number;
  color?: string;
};

function DistributionBars({ items }: { items: DistributionItem[] }) {
  const total = items.reduce((sum, item) => sum + item.cantidad, 0);

  if (items.length === 0) {
    return <p className={styles.empty}>No hay datos disponibles.</p>;
  }

  return (
    <div className={styles.distribution}>
      {items.map((item) => {
        const percentage =
          total > 0 ? (item.cantidad / total) * 100 : 0;

        return (
          <div key={item.label} className={styles.distributionItem}>
            <div className={styles.distributionHeader}>
              <span>{item.label}</span>
              <span>
                {item.cantidad} ({Math.round(percentage)}%)
              </span>
            </div>

            <div className={styles.distributionTrack}>
              <div
                className={styles.distributionFill}
                style={{
                  width: `${percentage}%`,
                  backgroundColor: item.color ?? '#2563EB',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function buildPieData(items: DistributionItem[], colors: string[]) {
  const total = items.reduce((sum, item) => sum + item.cantidad, 0);

  let currentAngle = -90;

  return items.map((item, index) => {
    const percentage =
      total > 0 ? (item.cantidad / total) * 100 : 0;

    const angle =
      total > 0 ? (item.cantidad / total) * 360 : 0;

    const slice = {
      ...item,
      percentage,
      color: colors[index % colors.length],
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };

    currentAngle += angle;

    return slice;
  });
}

export default function ReportStatistics({
  summary,
  reports,
  statistics,
}: ReportStatisticsProps) {
  const categoryCounts = new Map<string, number>();

  for (const report of reports ?? []) {
    categoryCounts.set(
      report.category,
      (categoryCounts.get(report.category) ?? 0) + 1,
    );
  }

  const sortedCategories = [...categoryCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  );

  const totalCategories = reports?.length ?? 0;

  let currentAngle = -90;

  const categorySlices = sortedCategories.map(([name, count], index) => {
    const percentage =
      totalCategories > 0 ? (count / totalCategories) * 100 : 0;

    const angle =
      totalCategories > 0 ? (count / totalCategories) * 360 : 0;

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

  const sexoItems: DistributionItem[] =
    statistics?.porSexo.map((item, index) => ({
      label: item.sexo,
      cantidad: item.cantidad,
      color: sexoColors[index % sexoColors.length],
    })) ?? [];

  const edadItems: DistributionItem[] =
    statistics?.porRangoEdad.map((item, index) => ({
      label: item.rango,
      cantidad: item.cantidad,
      color: edadColors[index % edadColors.length],
    })) ?? [];

  const plataformaItems: DistributionItem[] =
    statistics?.porPlataforma.map((item, index) => ({
      label: item.plataforma,
      cantidad: item.cantidad,
      color: plataformaColors[index % plataformaColors.length],
    })) ?? [];

  const sexoSlices = buildPieData(sexoItems, sexoColors);

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
                      <span key={status.key}>{status.label}</span>
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
          ) : categorySlices.length === 0 ? (
            <p className={styles.empty}>No hay reportes pendientes.</p>
          ) : (
            <>
              <div className={styles.pieLayout}>
                <svg
                  className={styles.pieChart}
                  viewBox="0 0 220 220"
                  role="img"
                  aria-label="Distribución de reportes pendientes por categoría"
                >
                  {categorySlices.map((slice) =>
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
                          slice.endAngle,
                        )}
                        fill={slice.color}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    ),
                  )}
                </svg>

                <ul className={styles.legend}>
                  {categorySlices.map((slice) => (
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
                Basado en {totalCategories} reportes pendientes.
              </p>
            </>
          )}
        </article>

        <article className={styles.card}>
          <h3>Reportes por sexo</h3>

          {statistics === null ? (
            <p className={styles.empty}>
              Las estadísticas estarán disponibles al conectar el backend.
            </p>
          ) : sexoSlices.length === 0 ? (
            <p className={styles.empty}>No hay datos disponibles.</p>
          ) : (
            <>
              <div className={styles.pieLayout}>
                <svg
                  className={styles.miniPieChart}
                  viewBox="0 0 220 220"
                  role="img"
                  aria-label="Distribución de reportes por sexo"
                >
                  {sexoSlices.map((slice) =>
                    slice.percentage === 100 ? (
                      <circle
                        key={slice.label}
                        cx="110"
                        cy="110"
                        r="96"
                        fill={slice.color}
                      />
                    ) : (
                      <path
                        key={slice.label}
                        d={createPieSlice(
                          slice.startAngle,
                          slice.endAngle,
                        )}
                        fill={slice.color}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    ),
                  )}
                </svg>

                <ul className={styles.legend}>
                  {sexoSlices.map((slice) => (
                    <li key={slice.label} className={styles.legendItem}>
                      <span
                        className={styles.legendColor}
                        style={{ backgroundColor: slice.color }}
                      />

                      <div className={styles.legendText}>
                        <span className={styles.categoryName}>
                          {slice.label}
                        </span>
                        <span className={styles.categoryValue}>
                          {slice.cantidad} reportes (
                          {Math.round(slice.percentage)}%)
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <p className={styles.note}>
                Distribución según los datos registrados por los usuarios reportantes.
              </p>
            </>
          )}
        </article>

        <article className={styles.card}>
          <h3>Reportes por rango de edad</h3>

          {statistics === null ? (
            <p className={styles.empty}>
              Las estadísticas estarán disponibles al conectar el backend.
            </p>
          ) : (
            <>
              <DistributionBars items={edadItems} />
              <p className={styles.note}>
                Rango de edad calculado a partir de la fecha de nacimiento registrada.
              </p>
            </>
          )}
        </article>

        <article className={`${styles.card} ${styles.wideCard}`}>
          <h3>Reportes por plataforma</h3>

          {statistics === null ? (
            <p className={styles.empty}>
              Las estadísticas estarán disponibles al conectar el backend.
            </p>
          ) : (
            <>
              <DistributionBars items={plataformaItems} />
              <p className={styles.note}>
                Plataformas más frecuentes entre los reportes registrados.
              </p>
            </>
          )}
        </article>
      </div>
    </section>
  );
}
