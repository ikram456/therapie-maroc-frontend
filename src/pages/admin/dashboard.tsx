import { Layout } from '@/components/common/Layout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <Layout requireAuth allowedRoles={['ADMIN']}>
      <AdminDashboard />
    </Layout>
  );
}
