
import { notFound } from 'next/navigation';
import DashboardView from '@/components/dashboard/DashboardView';

export default function PreviewPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound();
  }

  return <DashboardView preview />;
}
