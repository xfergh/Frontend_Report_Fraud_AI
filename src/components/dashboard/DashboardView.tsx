'use client';

import { useEffect, useState } from 'react';
import { actualizarEstadoReporte,
  descargarEvidencia,
  getEvidenciasReporte,
  getEstadisticasReportes,
  getReporteDetalle,
  getReportesPendientes,
  getResumenReportes, type EstadisticasReportesApi, } from '@/lib/api';
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
    idReporte: 101,
    category: 'Suplantación con IA',
    platform: 'Instagram',
    date: '08 oct 2026',
    description: 'Perfil que suplanta la identidad de otra persona.',
    evidenceNames: ['captura_perfil.png', 'conversacion.pdf'],
  },
  {
    id: 'RFA-102',
    idReporte: 102,
    category: 'Voz sintética',
    platform: 'WhatsApp',
    date: '07 oct 2026',
    description: 'Posible fraude mediante una voz generada artificialmente.',
    evidenceNames: ['mensaje.jpg'],
  },
  {
    id: 'RFA-103',
    idReporte: 103,
    category: 'Imágenes manipuladas',
    platform: 'Facebook',
    date: '06 oct 2026',
    description: 'Publicación que utiliza imágenes alteradas para engañar.',
  },
  {
    id: 'RFA-104',
    idReporte: 104,
    category: 'Suplantación con IA',
    platform: 'TikTok',
    date: '05 oct 2026',
    description: 'Cuenta que utiliza contenido generado para suplantar a otra persona.',
  },
  {
    id: 'RFA-105',
    idReporte: 105,
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

  const [backendSummary, setBackendSummary] =
    useState<ReportSummary | null>(null);

  const [backendStatistics, setBackendStatistics] =
    useState<EstadisticasReportesApi | null>(null);

  const [selectedReport, setSelectedReport] =
    useState<PendingReport | null>(null);

  const [message, setMessage] = useState('');

  const [pendingMessage, setPendingMessage] = useState('');

  const [history, setHistory] = useState<ReviewHistoryEntry[]>([]);

  useEffect(() => {
    if (preview) {
      return;
    }

    getResumenReportes()
      .then((data) => {
        setBackendSummary({
          total: data.total,
          pending: data.pendientes,
          approved: data.aprobados,
          rejected: data.rechazados,
        });
      })
      .catch(() => {
        setBackendSummary(null);
      });
    
    getEstadisticasReportes()
      .then((data) => {
        setBackendStatistics(data);
      })
      .catch(() => {
        setBackendStatistics(null);
      });

    getReportesPendientes()
      .then((data) => {
        setReports(
          data.map((reporte) => ({
            id: `RFA-${reporte.idReporte}`,
            idReporte: reporte.idReporte,
            category: reporte.categoria,
            subcategory: reporte.subcategoria,
            platform: reporte.plataforma,
            date: new Date(
              reporte.fechaRegistro,
            ).toLocaleDateString('es-MX', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            description: reporte.descripcion,
            reportedEntity: reporte.entidadReportada,
            anonymous: reporte.publicacionAnonima,
          }))
        );
      })
      .catch(() => {
        setReports([]);
      });
  }, [preview]);

  async function handleSelect(report: PendingReport) {
    setMessage('');
    setPendingMessage('');

    if (preview) {
      setSelectedReport(report);
    } else {
      try {
        const [detalle, evidencias] = await Promise.all([
          getReporteDetalle(report.idReporte),
          getEvidenciasReporte(report.idReporte),
        ]);

        setSelectedReport({
          id: `RFA-${detalle.idReporte}`,
          idReporte: detalle.idReporte,
          category: detalle.categoria,
          subcategory: detalle.subcategoria,
          platform: detalle.plataforma,
          date: new Date(
            detalle.fechaRegistro,
          ).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }),
          description: detalle.descripcion,
          reportedEntity: detalle.entidadReportada,
          anonymous: detalle.publicacionAnonima,
          evidenceNames: evidencias.map(
            (evidencia) => evidencia.nombreArchivo,
          ),
        });
      } catch {
        setMessage(
          'No se pudo cargar el detalle del reporte.',
        );
        return;
      }
    }

    requestAnimationFrame(() => {
      document
        .getElementById('report-details')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    });
  }

  async function handleDecision(
    decision: ReviewDecision,
  ) {
    if (!selectedReport) return;

    const reportId = selectedReport.id;

    if (preview) {
      if (decision === 'pending') {
        setSelectedReport(null);
        setMessage('');

        setPendingMessage(
          `El reporte ${reportId} permanece en revisión. Acción simulada.`,
        );

        return;
      }

      setReports((current) =>
        current.filter(
          (report) => report.id !== reportId,
        ),
      );

      setSelectedReport(null);
      return;
    }

    const idEstado =
      decision === 'approved'
        ? 2
        : decision === 'rejected'
          ? 3
          : 1;

    try {
      await actualizarEstadoReporte(
        selectedReport.idReporte,
        idEstado,
      );

      if (decision === 'pending') {
        setPendingMessage(
          `El reporte ${reportId} permanece en revisión.`,
        );

        setSelectedReport(null);
        return;
      }

      setReports((current) =>
        current.filter(
          (report) =>
            report.idReporte !==
            selectedReport.idReporte,
        ),
      );

      const resumen = await getResumenReportes();

      setBackendSummary({
        total: resumen.total,
        pending: resumen.pendientes,
        approved: resumen.aprobados,
        rejected: resumen.rechazados,
      });

      setMessage(
        `El reporte ${reportId} fue ${
          decision === 'approved'
            ? 'aprobado'
            : 'rechazado'
        }.`,
      );

      setSelectedReport(null);
    } catch {
      setMessage(
        `No se pudo actualizar el estado del reporte ${reportId}.`,
      );
    }
  }

  async function handleEvidence(
    nombreArchivo: string,
  ) {
    try {
      await descargarEvidencia(nombreArchivo);
    } catch {
      setMessage(
        'No se pudo descargar la evidencia.',
      );
    }
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
          reports={reports}
          selectedId={selectedReport?.id ?? null}
          onSelect={handleSelect}
          notice={pendingMessage}
        />

        <ReportDetails
          report={selectedReport}
          preview={preview}
          message={message}
          onDecision={handleDecision}
          onEvidence={handleEvidence}
        />
  
        <ReportStatistics
          summary={preview ? summary : backendSummary}
          reports={preview ? reports : null}
          statistics={preview ? null : backendStatistics}
        />
        
        <ReportHistory
          entries={preview ? history : null}
        />
      </main>
    </div>
  );
}
