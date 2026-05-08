import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function VideoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [ready, setReady] = useState(false);
  useEffect(() => { if (id) setReady(true); }, [id]);
  if (!ready) return <div style={{background:'#111',minHeight:'100vh',color:'white',display:'flex',alignItems:'center',justifyContent:'center'}}>Chargement...</div>;
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#111',display:'flex',flexDirection:'column'}}>
      <div style={{background:'#1a1a2e',padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1 style={{color:'white',margin:0}}>Session video</h1>
        <button onClick={()=>router.push('/patient/sessions')} style={{background:'#e53e3e',color:'white',border:'none',padding:'8px 20px',borderRadius:'8px',cursor:'pointer'}}>Quitter</button>
      </div>
      <iframe src={`https://meet.jit.si/therapie-maroc-${id}`} allow="camera; microphone; fullscreen; speaker; display-capture" style={{flex:1,border:'none',width:'100%'}} />
    </div>
  );
}
