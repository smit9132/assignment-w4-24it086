import { useState } from 'react';
import Footer from '../components/Footer';

function Contact() {
  const [message, setMessage] = useState('');
  const [showTips, setShowTips] = useState(false);

  const emailAddress = 'smitsanjava.demo@gmail.com';

  const handleToggleTips = () => {
    setShowTips((current) => !current);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent('Hello, Smit!');
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="container page-contact">
      <section className="page-section">
        <p className="section-kicker">A good conversation starts here</p>
        <h1>Let’s talk.</h1>
        <p>
          Share an idea, ask about my work, or just say hello. Your message will
          open as a draft in your email app so you can send it when you’re ready.
        </p>
      </section>

      <section className="contact-section">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-heading">
            <span className="form-step">01</span>
            <div>
              <h2>Leave a note</h2>
              <p>Your message stays on your device until you send it.</p>
            </div>
          </div>
          <label htmlFor="message">Your message</label>
          <textarea
            id="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Hi Smit, I wanted to reach out about..."
            rows={7}
            maxLength={250}
            required
            aria-describedby="message-count"
          />
          <div className="form-meta" id="message-count">
            <span>{message.length} / 250 characters</span>
            <span>{250 - message.length} left</span>
          </div>
          <button className="button button-primary contact-submit" type="submit" disabled={!message.trim()}>
            Continue to email <span aria-hidden="true">↗</span>
          </button>
          <p className="email-fallback">
            Prefer email? <a href={`mailto:${emailAddress}`}>{emailAddress}</a>
          </p>
        </form>

        <aside className="contact-preview">
          <p className="section-kicker">02 · Live preview</p>
          <h2>A little peek at your note.</h2>
          <p className={message ? 'preview-message' : 'preview-message is-empty'}>
            {message || 'Your message will appear here as you write.'}
          </p>
          <button type="button" className="button button-secondary" onClick={handleToggleTips}>
            {showTips ? 'Hide writing tips' : 'Show writing tips'}
          </button>
          {showTips && (
            <div className="help-box">
              <p>A few details about your idea or question help me give you a useful reply.</p>
              <p>Keep it casual — there’s no special format needed.</p>
            </div>
          )}
        </aside>
      </section>

      <Footer year={new Date().getFullYear()} />
    </div>
  );
}

export default Contact;
