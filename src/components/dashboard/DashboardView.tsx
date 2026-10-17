
'use client';

import { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import SummaryCards, { type ReportSummary } from './SummaryCards';
import PendingReports, { type PendingReport } from './PendingReports';
import ReportDetails, { type ReviewDecision } from './ReportDetails';
import styles from '@/app/dashboard.module.css';
import ReportStatistics from './ReportStatistics';
import ReportHistory, { type ReviewHistoryEntry } from './ReportHistory';


type DashboardViewProps = {
  preview?: boolean;
};

const previewSummary: ReportSummary = {
  total: 128,
  pending: 23,
  approved: 91,
  rejected: 14,
};

const previewReports: PendingReport[] = [
  {
    id: 'RFA-101',
    category: 'Suplantación con IA',
    platform: 'Instagram',
    date: '08 oct 2026',
    description: 'Perfil que suplanta la identidad de otra persona.',
    evidenceNames: ['captura_perfil.png', 'conversacion.pdf'],
  },
  {
    id: 'RFA-102',
    category: 'Voz sintética',
    platform: 'WhatsApp',
    date: '07 oct 2026',
    description: 'Posible fraude mediante una voz generada artificialmente.',
    evidenceNames: ['mensaje.jpg'],
  },
  {
    id: 'RFA-103',
    category: 'Imágenes manipuladas',
    platform: 'Facebook',
    date: '06 oct 2026',
    description: 'Publicación que utiliza imágenes alteradas para engañar.',
  },
  {
    id: 'RFA-104',
    category: 'Suplantación con IA',
    platform: 'TikTok',
    date: '05 oct 2026',
    description: 'Cuenta que utiliza contenido generado para suplantar a otra persona.',
  },
  {
    id: 'RFA-105',
    category: 'Voz sintética',
    platform: 'Telegram',
    date: '04 oct 2026',
    description: 'Reporte de un mensaje de voz posiblemente manipulado.',
  },
];

export default function DashboardView({
  preview = false,
}: DashboardViewProps) {
  const [reports, setReports] = useState<PendingReport[]>(previewReports);

  const [summary, setSummary] =
    useState<ReportSummary>(previewSummary);

  const [selectedReport, setSelectedReport] =
    useState<PendingReport | null>(null);

  const [message, setMessage] = useState('');

  const [pendingMessage, setPendingMessage] = useState('');

  const [history, setHistory] = useState<ReviewHistoryEntry[]>([]);

  function handleSelect(report: PendingReport) {
    setSelectedReport(report);
    setMessage('');
    setPendingMessage('');

    requestAnimationFrame(() => {
      document.getElementById('report-details')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  function handleDecision(decision: ReviewDecision) {
    if (!preview || !selectedReport) return;

    const reportId = selectedReport.id;

    if (decision === 'pending') {
      setSelectedReport(null);
      setMessage('');

      setPendingMessage(
        `El reporte ${reportId} permanece en revisión. Acción simulada.`
      );

      requestAnimationFrame(() => {
        document.getElementById('pending-reports')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });

      return;
    }

    setReports((current) =>
      current.filter((report) => report.id !== reportId)
    );

    
    setHistory((current) => [
      {
        report: selectedReport,
        decision: decision === 'approved' ? 'approved' : 'rejected',
        reviewedAt: new Date().toLocaleString('es-MX', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...current,
    ]);

    setSummary((current) => ({
      ...current,
      pending: current.pending - 1,
      approved:
        current.approved + (decision === 'approved' ? 1 : 0),
      rejected:
        current.rejected + (decision === 'rejected' ? 1 : 0),
    }));

    setMessage(
      `El reporte ${reportId} fue ${
        decision === 'approved' ? 'aprobado' : 'rechazado'
      }. Acción simulada.`
    );

    setSelectedReport(null);
  }

  return (
    <div className={styles.dashboard}>
      <DashboardHeader />

      <main className={styles.main}>
        <section className={styles.introduction}>
          <h1>Panel de administración</h1>
          <p>Resumen y gestión de reportes</p>

          {preview && (
            <p>Vista de desarrollo. Datos de ejemplo.</p>
          )}
        </section>

        <SummaryCards
          summary={preview ? summary : null}
        />

        <PendingReports
          reports={preview ? reports : null}
          selectedId={selectedReport?.id ?? null}
          onSelect={handleSelect}
        />

        <ReportDetails
          report={selectedReport}
          preview={preview}
          message={message}
          onDecision={handleDecision}
        />
  
        <ReportStatistics
          summary={preview ? summary : null}
          reports={preview ? reports : null}
        />
        
        <ReportHistory
          entries={preview ? history : null}
        />
      </main>
    </div>
  );
}
