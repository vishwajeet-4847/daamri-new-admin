import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div
      className="flex w-screen h-screen overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif", background: '#0c0d0f' }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        html, body, #root { overflow: hidden; height: 100%; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px #181c24 inset !important; -webkit-text-fill-color: #f0ede8 !important; }
        @keyframes slowZoom { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55 }}
        className="relative flex flex-col justify-center flex-shrink-0 overflow-hidden"
        style={{
          width: '46%',
          minWidth: 340,
          background: '#111318',
          padding: '48px 52px',
          borderRight: '1px solid rgba(201,169,110,0.1)',
        }}
      >
        {/* Gold left edge */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
          background: 'linear-gradient(to bottom, transparent, #c9a96e 35%, #e8c98a 65%, transparent)',
        }} />

        {/* Ambient glows */}
        <div style={{ position:'absolute', top:-100, left:-80, width:380, height:380, borderRadius:'50%', background:'rgba(201,169,110,0.07)', filter:'blur(90px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-120, right:-60, width:380, height:380, borderRadius:'50%', background:'rgba(80,100,200,0.06)', filter:'blur(90px)', pointerEvents:'none' }} />

        {/* Brand */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          className="flex items-center gap-3 mb-12"
        >
          <div style={{
            width:46, height:46, borderRadius:12, flexShrink:0,
            background:'linear-gradient(135deg,#c9a96e,#a07840)',
            boxShadow:'0 0 24px rgba(201,169,110,0.28)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <Building2 size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:700, color:'#f0ede8', lineHeight:1 }}>
              Daamrideals
            </div>
            <div style={{ fontSize:9, letterSpacing:'0.3em', textTransform:'uppercase', color:'#c9a96e', fontWeight:600, marginTop:3 }}>
              Admin Portal
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}
          className="mb-9"
        >
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:42, fontWeight:300, lineHeight:1.1, color:'#f0ede8' }}>
            Welcome <em style={{ fontStyle:'italic', color:'#e8c98a' }}>Back</em>
          </h2>
          <p style={{ fontSize:13.5, color:'#8a8a90', marginTop:8, fontWeight:300, letterSpacing:'0.01em' }}>
            Sign in to access your admin dashboard
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }}
        >
          {error && (
            <motion.div
              initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              style={{
                background:'rgba(224,112,112,0.1)', border:'1px solid rgba(224,112,112,0.3)',
                borderRadius:8, padding:'11px 14px', fontSize:12.5, color:'#e07070',
                display:'flex', alignItems:'center', gap:8, marginBottom:18,
              }}
            >
              <AlertCircle size={15} style={{ flexShrink:0 }} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Email */}
          <div className="mb-5">
            <label style={{ display:'block', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#c9a96e', fontWeight:600, marginBottom:8 }}>
              Work Email
            </label>
            <div style={{ position:'relative' }}>
              <Mail size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#c9a96e', opacity:0.7, pointerEvents:'none' }} />
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                style={{
                  width:'100%', background:'#181c24',
                  border:'1px solid rgba(201,169,110,0.18)', borderRadius:10,
                  padding:'13px 14px 13px 42px', fontSize:14, color:'#f0ede8',
                  outline:'none', transition:'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor='rgba(201,169,110,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(201,169,110,0.07)'; }}
                onBlur={e => { e.target.style.borderColor='rgba(201,169,110,0.18)'; e.target.style.boxShadow='none'; }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-1">
            <label style={{ display:'block', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#c9a96e', fontWeight:600, marginBottom:8 }}>
              Password
            </label>
            <div style={{ position:'relative' }}>
              <Lock size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#c9a96e', opacity:0.7, pointerEvents:'none' }} />
              <input
                type={showPassword ? 'text' : 'password'} required value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width:'100%', background:'#181c24',
                  border:'1px solid rgba(201,169,110,0.18)', borderRadius:10,
                  padding:'13px 42px 13px 42px', fontSize:14, color:'#f0ede8',
                  outline:'none', transition:'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor='rgba(201,169,110,0.5)'; e.target.style.boxShadow='0 0 0 3px rgba(201,169,110,0.07)'; }}
                onBlur={e => { e.target.style.borderColor='rgba(201,169,110,0.18)'; e.target.style.boxShadow='none'; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#8a8a90', display:'flex', alignItems:'center', padding:4 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ textAlign:'right', marginTop:6 }}>
              <Link to="/reset-password" style={{ fontSize:11, color:'#8a8a90', textDecoration:'none', letterSpacing:'0.05em', cursor:'pointer', transition:'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#c9a96e')} onMouseLeave={e => (e.currentTarget.style.color = '#8a8a90')}>Forgot password?</Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width:'100%', marginTop:28, padding:'15px',
              background:'linear-gradient(135deg,#c9a96e,#a07840)',
              color:'#0c0d0f', border:'none', borderRadius:10,
              fontSize:13.5, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase',
              cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow:'0 8px 32px rgba(201,169,110,0.22)',
              transition:'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
              fontFamily:"'DM Sans',sans-serif",
            }}
          >
            {isLoading ? (
              <div style={{ width:18, height:18, border:'2px solid rgba(0,0,0,0.3)', borderTopColor:'#000', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
            ) : (
              <><span>Sign In</span><ArrowRight size={15} /></>
            )}
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
          style={{ marginTop:28, fontSize:11, color:'#3a3d48', textAlign:'center', letterSpacing:'0.05em' }}
        >
          Daamrideals Admin v2.0 Enterprise &nbsp;•&nbsp; Secure Internal Environment
        </motion.p>
      </motion.div>

      {/* ── RIGHT PANEL ── */}
      <motion.div
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.8, delay:0.2 }}
        style={{ flex:1, position:'relative', overflow:'hidden' }}
      >
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85&auto=format&fit=crop"
          alt="Luxury property"
          style={{
            width:'100%', height:'100%', objectFit:'cover', display:'block',
            filter:'brightness(0.55) saturate(0.85)',
            animation:'slowZoom 12s ease-in-out infinite alternate',
          }}
        />

        {/* Overlay */}
        <div style={{
          position:'absolute', inset:0,
          background:'linear-gradient(to right, rgba(17,19,24,0.88) 0%, rgba(17,19,24,0.25) 45%, rgba(12,13,15,0.05) 100%)',
        }} />

        {/* Caption */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
          style={{ position:'absolute', bottom:36, left:36, right:36 }}
        >
          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            background:'rgba(201,169,110,0.12)', border:'1px solid rgba(201,169,110,0.25)',
            borderRadius:100, padding:'5px 14px 5px 10px',
            fontSize:10.5, color:'#e8c98a', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:600,
            marginBottom:16,
          }}>
            <span style={{ width:6, height:6, background:'#c9a96e', borderRadius:'50%', animation:'pulse 2s infinite' }} />
            Premium Listings Live
          </div>

          <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:300, lineHeight:1.15, color:'#fff', textShadow:'0 2px 24px rgba(0,0,0,0.5)', marginBottom:16 }}>
            India's Finest<br /><em style={{ fontStyle:'italic', color:'#e8c98a' }}>Real Estate</em> Platform
          </h3>

          <div style={{ display:'flex', gap:32 }}>
            {[['1,240+','Properties'],['₹4.2Cr','Avg. Deal'],['98%','Uptime']].map(([num,lbl]) => (
              <div key={lbl}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, color:'#e8c98a' }}>{num}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.15em', marginTop:2 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}