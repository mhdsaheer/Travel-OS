import { Link, useNavigate } from '@tanstack/react-router';
import { Briefcase, Eye, EyeOff, LogIn } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Chunky } from './ui';
import { readIdentity } from '@/lib/portal-auth';
import { roleNames, portalPath } from '@/lib/portals';
import type { Role } from '@/lib/types';

const descriptions: Record<Role, string> = { agent: 'Enquiries, trips and customers', manager: 'Your team, bookings and reports', finance: 'Invoices, payments and collections', admin: 'Users, roles and agency settings' };
const field = 'h-12 w-full rounded-xl border border-input bg-card px-4 font-medium outline-none focus:border-primary';
export function PortalLogin({ role }: { role: Role }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [show, setShow] = useState(false);
  const [forgot, setForgot] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [correctRole, setCorrectRole] = useState<Role | null>(null);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(''); setNotice(''); setCorrectRole(null);
    try {
      if (forgot) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password?portal=${role}` });
        if (error) throw error;
        setNotice('If an account exists for this email, a password reset link has been sent.');
      } else {
        const login = email.trim().toLowerCase();
        const result = await supabase.auth.signInWithPassword({ email: login.includes('@') ? login : `${login}@demo.travelos`, password });
        if (result.error) throw new Error('The email or password is incorrect. Please try again.');
        let identity;
        try { identity = await readIdentity(); } catch (error) { await supabase.auth.signOut(); throw error; }
        if (!identity) throw new Error('Sign-in could not be completed. Please try again.');
        if (identity.role !== role) {
          await supabase.auth.signOut(); setPassword(''); setCorrectRole(identity.role); setError(`This account belongs to the ${roleNames[identity.role]} portal. Please sign in there.`);
        } else { await navigate({ to: portalPath(role, 'home') }); }
      }
    } catch (error) { setError(error instanceof Error ? error.message : 'Please try again.'); }
    finally { setBusy(false); }
  };
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
    <div className="w-full max-w-sm space-y-6">
      <Link to="/" className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Briefcase className="h-5 w-5" /></span><span className="text-lg font-semibold">TravelOS</span></Link>
      <div><h1 className="text-2xl font-semibold">{forgot ? 'Forgot password' : `${roleNames[role]} login`}</h1><p className="mt-1 text-sm text-muted-foreground">{descriptions[role]}</p></div>
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-2 text-sm font-semibold"><span>{forgot ? 'Email' : 'Username or email'}</span><input className={field} type={forgot ? 'email' : 'text'} autoComplete="username" autoCapitalize="none" value={email} onChange={e => setEmail(e.target.value)} required /></label>
        {!forgot && <label className="block space-y-2 text-sm font-semibold"><span>Password</span><div className="relative"><input className={`${field} pe-12`} type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /><Chunky type="button" variant="ghost" size="icon" className="absolute end-1 top-1" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Chunky></div></label>}
        {error && <div role="alert" className="space-y-3 rounded-xl border border-border bg-danger-soft p-3 text-sm text-danger"><p>{error}</p>{correctRole && <Link to={`/${correctRole}/login`} className="inline-flex font-semibold underline">Go to {roleNames[correctRole]} login</Link>}</div>}
        {notice && <p role="status" className="rounded-xl bg-success-soft p-3 text-sm text-success">{notice}</p>}
        <Chunky type="submit" block disabled={busy}><LogIn className="h-4 w-4" />{busy ? 'Please wait…' : forgot ? 'Send reset link' : 'Sign in'}</Chunky>
      </form>
      <div className="flex items-center justify-between gap-3 text-sm"><Chunky variant="ghost" size="sm" onClick={() => { setForgot(!forgot); setError(''); setNotice(''); }}>{forgot ? 'Back to login' : 'Forgot password?'}</Chunky><Link to="/" className="font-medium text-muted-foreground">Choose portal</Link></div>
    </div>
  </main>;
}