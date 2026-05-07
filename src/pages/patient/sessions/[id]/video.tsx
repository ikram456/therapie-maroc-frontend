import { Layout } from '@/components/common/Layout';
import { VideoSession } from '@/components/patient/VideoSession';
import { useRouter } from 'next/router';

export default function VideoSessionPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;

  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <VideoSession sessionId={id as string} />
    </Layout>
  );
}
