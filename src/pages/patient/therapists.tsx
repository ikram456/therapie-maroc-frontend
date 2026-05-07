import { Layout } from '@/components/common/Layout';
import { TherapistList } from '@/components/patient/TherapistList';

export default function TherapistsPage() {
  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <TherapistList />
    </Layout>
  );
}
