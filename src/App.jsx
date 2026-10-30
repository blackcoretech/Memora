import { useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const sampleFiles = [
  { name: 'Summer memories', type: 'Photos', size: '2.4 GB', icon: '▧', color: 'peach', count: '248 items' },
  { name: 'Weekend video', type: 'Videos', size: '1.8 GB', icon: '▶', color: 'lilac', count: '12 items' },
  { name: 'Voice notes', type: 'Audio', size: '340 MB', icon: '♫', color: 'mint', count: '36 items' },
  { name: 'Important documents', type: 'Documents', size: '86 MB', icon: '▤', color: 'blue', count: '18 items' },
];
const categories = ['All files', 'Photos', 'Videos', 'Audio', 'Documents'];

function Mark() { return <svg className="brand-mark" viewBox="0 0 48 40" role="img" aria-label="Debe cloud"><path d="M13.2 33.5C6.8 33.5 2 28.8 2 22.8c0-5.7 4.4-10.2 10-10.7C14.2 5.8 19.2 2 25.1 2c7.1 0 12.6 5.4 13 12.2 4.7.7 7.9 4.5 7.9 9.2 0 5.7-4.4 10.1-10.4 10.1H13.2Z" fill="url(#debeCloud)"/><defs><linearGradient id="debeCloud" x1="4" y1="3" x2="43" y2="37" gradientUnits="userSpaceOnUse"><stop stopColor="#F47BB2"/><stop offset="1" stopColor="#DF438C"/></linearGradient></defs><text x="24" y="27" textAnchor="middle" fontSize="17" fontWeight="800" fontFamily="Manrope, sans-serif" fill="white">D</text></svg>; }
function Arrow() { return <span aria-hidden="true">↗</span>; }

function Demo() {
  const [active, setActive] = useState('All files');
  const [showUpload, setShowUpload] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const filtered = useMemo(() => active === 'All files' ? sampleFiles : sampleFiles.filter(f => f.type === active), [active]);
  return <div className="demo-shell">
    <div className="demo-top"><div className="demo-brand"><Mark/><b>DEBE</b></div><span className="demo-avatar">S</span></div>
    <div className="demo-body">
      <aside className="demo-sidebar"><span className="side-label">WORKSPACE</span>{['Overview','My files','Shared with me','Favourites','Recently deleted'].map((x,i)=><button key={x} className={i===1?'side-item selected':'side-item'} onClick={()=>setActive('All files')}><span>{['⌂','▧','⇄','♡','◷'][i]}</span>{x}</button>)}<div className="side-storage"><span className="side-label">YOUR STORAGE</span><b>34.6 GB <small>of 100 GB</small></b><div className="storage-track"><i/></div><small>Sample storage overview</small></div></aside>
      <section className="demo-content"><div className="demo-heading"><div><p className="eyebrow">YOUR SPACE</p><h3>Good morning, Sam <span>✦</span></h3><p className="muted">Everything that matters, in one place.</p></div><button className="button button-small" onClick={()=>setShowUpload(true)}>＋ Add files</button></div>
        <div className="storage-card"><div><span className="storage-icon">✿</span><div><b>Your space, at a glance</b><p>Make room for more memories.</p></div></div><div className="storage-number"><b>34.6 <small>GB used</small></b><div className="storage-track"><i/></div><small>Illustrative storage data</small></div></div>
        <div className="file-toolbar"><div><h4>Your files</h4><span className="muted">A little home for all your things.</span></div><button className="view-toggle">☷</button></div>
        <div className="file-tabs">{categories.map(c=><button key={c} onClick={()=>setActive(c)} className={active===c?'active':''}>{c}</button>)}</div>
        <div className="file-grid">{filtered.map(f=><button className="file-card" key={f.name} onClick={()=>setUploaded(false)}><div className={'file-art '+f.color}><span>{f.icon}</span></div><b>{f.name}</b><small>{f.count}</small><div className="file-meta"><span>{f.type}</span><span>{f.size}</span></div></button>)}</div>
        {uploaded && <div className="inline-success">Demo file added to this sample view.</div>}
      </section>
    </div>
    {showUpload && <div className="modal-backdrop" onClick={()=>setShowUpload(false)}><div className="upload-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowUpload(false)}>×</button><div className="upload-symbol">↑</div><h3>Add something lovely</h3><p>This is a product preview. No real file will be uploaded or stored.</p><button className="button full" onClick={()=>{setUploaded(true);setShowUpload(false)}}>Try the sample upload</button><small>Simulated interaction · Sample files only</small></div></div>}
  </div>;
}

function App() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyDone, setSurveyDone] = useState(false);
  const [surveyBusy, setSurveyBusy] = useState(false);
  const [surveyStatus, setSurveyStatus] = useState('');
  const [surveyEmail, setSurveyEmail] = useState('');
  const [willingToPay, setWillingToPay] = useState('maybe');
  const [preferredPlan, setPreferredPlan] = useState('undecided');
  const [storageUses, setStorageUses] = useState([]);
  const [topPriority, setTopPriority] = useState('price');
  async function join(e) {
    e.preventDefault();
    setStatus('');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('Please enter a valid email address.'); return; }
    if (!supabase) { setStatus('The waitlist is being connected. Please check back soon.'); return; }
    setBusy(true);
    const { error } = await supabase.from('waitlist').insert({ name: name.trim() || null, email: email.trim().toLowerCase(), source: 'website' });
    setBusy(false);
    if (error) setStatus(error.code === '23505' ? 'You’re already on the list. We’ll be in touch!' : 'We couldn’t save that just now. Please try again.');
    else { setSurveyEmail(email.trim().toLowerCase()); setStatus('You’re on the list. Thanks for being early!'); setEmail(''); setName(''); setSurveyOpen(true); }
  }
  async function submitInterest(e) {
    e.preventDefault();
    if (!supabase) { setSurveyStatus('The survey connection is being configured. Your waitlist place is saved.'); return; }
    setSurveyBusy(true);
    const { error } = await supabase.from('memora_interest').insert({
      email: surveyEmail,
      willing_to_pay: willingToPay,
      preferred_plan: preferredPlan,
      storage_uses: storageUses,
      top_priority: topPriority
    });
    setSurveyBusy(false);
    if (error) { setSurveyStatus('We couldn’t save your answers just now. Please try again or skip for now.'); return; }
    setSurveyDone(true);
    setSurveyStatus('Thank you. Your feedback will help shape Debe.');
  }
  function toggleStorageUse(value) {
    setStorageUses(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  }
  return <main>
    <nav className="nav container"><a href="#" className="wordmark"><Mark/><span>DEBE</span></a><div className="nav-links"><a href="#why">Why Debe</a><a href="#how">How it works</a><a href="#plans">Plans</a></div><a className="button nav-cta" href="#waitlist">Join the waitlist <Arrow/></a></nav>
    <section className="hero container"><div className="hero-copy"><div className="pill"><span/> A little more room for what matters</div><h1>Keep what<br/> <em>matters.</em></h1><p className="hero-subtitle">Free up your phone space.</p><p className="hero-text">Debe is being designed to give your photos, videos and important files a place of their own. Only remove local copies after your cloud copies are safely verified.</p><div className="hero-actions"><a className="button" href="#waitlist">Join the waitlist <Arrow/></a><button className="button button-ghost" onClick={()=>setDemoOpen(true)}>Explore the demo <span>▷</span></button></div><div className="hero-note"><span className="tiny-check">✓</span> Early access updates, no pressure.</div></div>
      <div className="hero-visual"><div className="float-tag tag-one"><span>♡</span> Keep your favourites close</div><div className="photo-stack"><div className="photo photo-back"><div className="sunset"/><span>little moments</span></div><div className="photo photo-front"><div className="photo-scene"><div className="hill hill-a"/><div className="hill hill-b"/><div className="sun"/></div><div className="photo-caption"><b>Summer, saved.</b><small>One for the memories</small></div></div><div className="cloud-bubble"><Mark/><div><b>A home for your files</b><small>All the things you love.</small></div></div></div><div className="float-tag tag-two">✦ &nbsp; Room to keep growing</div></div>
    </section>
    <section className="trust-strip"><div className="container strip-inner"><span>MADE FOR THE THINGS YOU KEEP</span><b>Photos</b><i/> <b>Videos</b><i/> <b>Documents</b><i/> <b>Little moments</b></div></section>
    <section className="section container" id="why"><div className="section-intro"><p className="eyebrow">WHY DEBE</p><h2>Less juggling.<br/><em>More keeping.</em></h2><p className="muted">A calmer way to think about the files that fill your everyday life.</p></div><div className="benefit-grid"><article className="benefit"><div className="benefit-icon pink-icon">♡</div><h3>Keep what matters</h3><p>Give your favourite photos, videos and important files a dedicated place.</p></article><article className="benefit"><div className="benefit-icon lilac-icon">⌘</div><h3>Find your things</h3><p>Imagine a simple space where your files feel organised and easy to browse.</p></article><article className="benefit"><div className="benefit-icon peach-icon">✧</div><h3>Make room again</h3><p>Our goal is to help you reclaim device space after your cloud copies are safely verified.</p></article></div></section>
    <section className="how-section" id="how"><div className="container how-grid"><div><p className="eyebrow">A SIMPLE IDEA</p><h2>Your memories.<br/><em>More breathing room.</em></h2><p className="muted">The future Debe experience is being designed around three simple steps.</p><a className="text-link" href="#waitlist">Be part of what comes next <Arrow/></a></div><div className="steps"><div className="step"><span>01</span><div><h3>Bring your files together</h3><p>Photos, videos, audio and documents in one considered space.</p></div><b>↗</b></div><div className="step"><span>02</span><div><h3>Keep them close</h3><p>Browse and access the things you care about when you need them.</p></div><b>♡</b></div><div className="step"><span>03</span><div><h3>Make room on your device</h3><p>Only remove local copies after confirming your cloud copy is safe.</p></div><b>✧</b></div></div></div></section>
    <section className="section container plans" id="plans"><div className="plans-head"><div><p className="eyebrow">ROOM TO GROW</p><h2>A space that fits<br/><em>your life.</em></h2></div><p className="muted">We’re exploring flexible storage options. These are illustrative concepts, not available subscriptions or prices.</p></div><div className="plan-cards"><article className="plan-card"><span className="plan-label">A LITTLE SPACE</span><h3>Starter</h3><p>For everyday essentials.</p><div className="plan-capacity">50 <small>GB</small></div><div className="plan-line"/><span className="plan-foot">Proposed plan · Not available yet</span></article><article className="plan-card featured"><span className="plan-label">ROOM FOR MORE</span><h3>Plus</h3><p>For a growing collection.</p><div className="plan-capacity">200 <small>GB</small></div><div className="plan-line"/><span className="plan-foot">Proposed plan · Not available yet</span></article><article className="plan-card"><span className="plan-label">LOTS TO KEEP</span><h3>Max</h3><p>For the things you never want to lose.</p><div className="plan-capacity">1 <small>TB</small></div><div className="plan-line"/><span className="plan-foot">Proposed plan · Not available yet</span></article></div></section>
    <section className="waitlist-section" id="waitlist"><div className="container waitlist-wrap"><div><p className="eyebrow">BE HERE FROM THE BEGINNING</p><h2>Good things are<br/><em>worth keeping.</em></h2><p>Join the waitlist and follow the journey as Debe takes shape.</p></div><form className="waitlist-form" onSubmit={join}><label>Your name <span>Optional</span></label><input value={name} onChange={e=>setName(e.target.value)} placeholder="What should we call you?" maxLength={80}/><label>Email address</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" maxLength={254}/><button className="button full" disabled={busy}>{busy?'Joining…':'Join the waitlist'} <Arrow/></button>{status && <p className="form-status" role="status">{status}</p>}<small>By joining, you agree to receive occasional Debe updates. You can opt out at any time.</small></form></div></section>
    {surveyOpen && <div className="survey-backdrop"><section className="survey-modal" role="dialog" aria-modal="true" aria-labelledby="survey-title"><button className="survey-close" onClick={()=>setSurveyOpen(false)} aria-label="Close survey">×</button>{!surveyDone ? <><p className="eyebrow">HELP SHAPE DEBE</p><h2 id="survey-title">A few quick questions?</h2><p className="survey-lead">Your answers help us understand what people actually need. This is optional and takes about a minute.</p><form onSubmit={submitInterest}>
      <fieldset><legend>Would you pay for cloud storage?</legend><div className="choice-row">{[['yes','Yes'],['maybe','Maybe, depending on price'],['no','No']].map(([v,l])=><button type="button" key={v} className={willingToPay===v?'choice selected':'choice'} onClick={()=>setWillingToPay(v)}>{l}</button>)}</div></fieldset>
      <fieldset><legend>Which plan would you most likely choose?</legend><div className="choice-row plan-choices">{[['starter_50gb','Starter · 50 GB'],['plus_200gb','Plus · 200 GB'],['max_1tb','Max · 1 TB'],['undecided','Not sure yet']].map(([v,l])=><button type="button" key={v} className={preferredPlan===v?'choice selected':'choice'} onClick={()=>setPreferredPlan(v)}>{l}</button>)}</div></fieldset>
      <fieldset><legend>What would you store? <small>Choose all that apply</small></legend><div className="choice-row">{['Photos','Videos','Documents','Audio','Personal backups','A bit of everything'].map(v=><button type="button" key={v} className={storageUses.includes(v)?'choice selected':'choice'} onClick={()=>toggleStorageUse(v)}>{v}</button>)}</div></fieldset>
      <fieldset><legend>What matters most to you?</legend><div className="choice-row">{[['price','Affordable pricing'],['capacity','More storage'],['privacy','Privacy and security'],['easy_access','Easy access'],['reliable_backup','Reliable backups']].map(([v,l])=><button type="button" key={v} className={topPriority===v?'choice selected':'choice'} onClick={()=>setTopPriority(v)}>{l}</button>)}</div></fieldset>
      {surveyStatus && <p className="survey-status" role="status">{surveyStatus}</p>}<button className="button full" disabled={surveyBusy}>{surveyBusy?'Saving…':'Send my answers'}</button><button type="button" className="survey-skip" onClick={()=>setSurveyOpen(false)}>Skip for now</button>
    </form></> : <div className="survey-thanks"><div className="survey-check">✓</div><h2 id="survey-title">Thank you for helping.</h2><p>{surveyStatus}</p><button className="button full" onClick={()=>setSurveyOpen(false)}>Done</button></div>}</section></div>}
    <footer className="footer container"><a href="#" className="wordmark"><Mark/><span>DEBE</span></a><div className="footer-tagline"><span>Keep what matters.</span><span>Free up your phone space.</span></div><span>© 2026 Debe · By Black Core Tech</span></footer>
    {demoOpen && <div className="demo-overlay"><div className="demo-modal"><button className="demo-close" onClick={()=>setDemoOpen(false)}>×</button><div className="demo-intro"><span className="eyebrow">INTERACTIVE PREVIEW</span><h2>Take a little look around.</h2><p>This is a simulated product demo with fictional sample files. No real files are uploaded or stored.</p></div><Demo/></div></div>}
  </main>;
}
export default App;
