import { Layout } from '@/components/common/Layout';
import { TherapistDashboard } from '@/components/therapist/TherapistDashboard';

export default function TherapistDashboardPage() {
  return (
    <Layout requireAuth allowedRoles={['THERAPIST']}>
      <TherapistDashboard />
    </Layout>
  );
}
