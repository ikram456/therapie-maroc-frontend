import { Layout } from '@/components/common/Layout';
import { QuestionnaireForm } from '@/components/patient/Questionnaire';

export default function QuestionnairePage() {
  return (
    <Layout requireAuth allowedRoles={['PATIENT']}>
      <QuestionnaireForm />
    </Layout>
  );
}
