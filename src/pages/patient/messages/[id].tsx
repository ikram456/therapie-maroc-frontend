import { Layout } from '@/components/common/Layout';
import { Chat } from '@/components/patient/Chat';
import { useRouter } from 'next/router';

export default function ChatPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <Chat connectionId={id as string} />
    </Layout>
  );
}
