import { useState } from 'react';
import { EMAIL } from '../data/content.js';

const FORM_URL = 'https://formspree.io/f/mwvjzvod';

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState(null);
  async function submit(e) {
    e.preventDefault();
    const f = e.currentTarget, d = Object.fromEntries(new FormData(f));
    if (d._gotcha) return;
    setSending(true);
    try {
      const r = await fetch(FORM_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...d, _subject: 'Portfolio contact from ' + d.name, _replyto: d.email }) });
      if (!r.ok) throw 0;
      setMsg({ text: 'Thanks, ' + d.name + '. Your message was sent.', color: '#5df0a8' }); f.reset();
    } catch { setMsg({ text: 'Message not sent. Please use the email link on this page.', color: '#ffd27a' }) }
    setSending(false);
  }
  return (
    <section className="section" id="contact"><div className="contact">
      <div data-reveal=""><p className="eyebrow">Contact</p><h2>Let's build something.</h2><p>Have a project, a collaboration, or a question about my work? I'd like to hear from you.</p>
        <a className="mail" id="em" href={'mailto:' + EMAIL}>{EMAIL}</a>
        <div className="links"><a href="https://github.com/Aditya-CS-ui" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.linkedin.com/in/aditya-gaurav-973aa7321" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div>
      <form id="cf" data-reveal="" style={{ '--rd': '120ms' }} onSubmit={submit}>
        <label htmlFor="fn">Name</label><input id="fn" name="name" autoComplete="name" required />
        <label htmlFor="fe">Email</label><input id="fe" name="email" type="email" autoComplete="email" required />
        <label htmlFor="fg">Message</label><textarea id="fg" name="message" required></textarea>
        <input className="hp" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <p><button className="btn btn-primary" id="sb" type="submit" style={{ marginTop: '1.2rem' }} disabled={sending}>{sending ? 'Sending...' : 'Send message'}</button></p>
        <p id="fm" role="status" aria-live="polite" style={msg ? { color: msg.color } : undefined}>{msg && msg.text}</p></form></div></section>
  );
}
