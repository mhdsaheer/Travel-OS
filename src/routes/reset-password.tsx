import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Chunky } from '@/components/app/ui';
import { isRole, portalHead } from '@/lib/portals';
export const Route = createFileRoute('/reset-password')({ head: () => portalHead('Reset password', 'Set a new password for your TravelOS account.'), component: ResetPassword });
function ResetPassword() {
  const [ready, setReady] = useState(false); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false); const [loginPath, setLoginPath] = useState('/auth');
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const portal = new URLSearchParams(window.location.search).get('portal');
    if (isRole(portal)) setLoginPath(`/${portal}/login`);
    if (hash.get('type') !== 'recovery') { setMessage('Open the password reset link from your email to continue.'); return; }
    const access_token = hash.get('access_token'); const refresh_token = hash.get('refresh_token');
    if (!access_token || !refresh_token) { setMessage('This reset link is invalid. Request a new one.'); return; }
    void supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => { window.history.replaceState(null, '', window.location.pathname + window.location.search); if (error) setMessage('This reset link has expired. Request a new one.'); else setReady(true); });
  }, []);
  const submit = async (event: FormEvent) => { event.preventDefault(); setBusy(true); setMessage(''); const { error } = await supabase.auth.updateUser({ password }); if (error) setMessage(error.message); else { await supabase.auth.signOut(); setDone(true); setReady(false); setMessage('Password updated. You can now sign in.'); } setBusy(false); };
  return <main className="flex min-h-screen items-center justify-center px-5"><div className="w-full max-w-sm space-y-5"><h1 className="text-2xl font-semibold">Reset password</h1>{message && <p role={done ? 'status' : 'alert'} className="text-sm text-muted-foreground">{message}</p>}{ready && <form className="space-y-4" onSubmit={submit}><label className="block space-y-2 text-sm font-semibold"><span>New password</span><input type="password" minLength={8} required autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-input bg-card px-4" /></label><Chunky block type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save password'}</Chunky></form>}<Link to={loginPath} className="text-sm font-semibold text-primary">Back to login</Link></div></main>;
}