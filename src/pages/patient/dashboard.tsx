import { Layout } from '@/components/common/Layout';
import { PatientDashboard } from '@/components/patient/PatientDashboard';

export default function PatientDashboardPage() {
  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <PatientDashboard />
    </Layout>
  );
}
