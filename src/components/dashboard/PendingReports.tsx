
'use client';

import { useMemo, useState } from 'react';
import styles from './PendingReports.module.css';

export type PendingReport = {
  id: string;
  category: string;
  platform: string;
  date: string;
  description: string;
  evidenceNames?: string[];
};

type PendingReportsProps = {
  reports: PendingReport[] | null;
  selectedId: string | null;
  onSelect: (report: PendingReport) => void;
  notice?: string;
};


export default function PendingReports({
  reports,
  selectedId,
  onSelect,
  notice,
}: PendingReportsProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');

  const categories = useMemo(() => {
    return [
      'Todas',
      ...new Set(reports?.map((report) => report.category) ?? []),
    ];
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (!reports) return [];

    return reports.filter((report) => {
      const term = search.toLowerCase();

      const matchesSearch =
        report.id.toLowerCase().includes(term) ||
        report.category.toLowerCase().includes(term) ||
        report.platform.toLowerCase().includes(term);

      const matchesCategory =
        category === 'Todas' || report.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [reports, search, category]);

  return (
    <section id="pending-reports" className={styles.section}>
      <div className={styles.heading}>
        <h2>Reportes pendientes</h2>
        <p>Reportes que requieren revisión administrativa.</p>
      </div>
      
      {notice && (
        <p className={styles.notice} role="status">
          {notice}
        </p>
      )}

      {reports === null ? (
        <div className={styles.empty}>
          Los reportes estarán disponibles al conectar el backend.
        </div>
      ) : (
        <>
          <div className={styles.controls}>
            <div className={styles.searchField}>
              <label htmlFor="report-search">Buscar reporte</label>
              <input
                id="report-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ID, categoría o plataforma"
              />
            </div>

            <div className={styles.filterField}>
              <label htmlFor="category-filter">Categoría</label>
              <select
                id="category-filter"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Reporte</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Plataforma</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className={
                      selectedId === report.id
                        ? styles.selectedRow
                        : ''
                    }
                  >
                    <td className={styles.reportId}>{report.id}</td>
                    <td>{report.category}</td>
                    <td>{report.platform}</td>
                    <td>{report.date}</td>
                    <td>
                      <button
                        type="button"
                        className={styles.selectButton}
                        aria-pressed={selectedId === report.id}
                        onClick={() => onSelect(report)}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReports.length === 0 && (
              <div className={styles.empty}>
                No se encontraron reportes pendientes.
              </div>
            )}
          </div>

          {selectedId && (
            <p className={styles.selection}>
              Reporte seleccionado: {selectedId}
            </p>
          )}

          <p className={styles.results}>
            Mostrando {filteredReports.length} de {reports.length} reportes
          </p>
        </>
      )}
    </section>
  );
}
