import { useState } from 'react';
import Footer from '../components/Footer';

function Contact() {
  const [message, setMessage] = useState('');
  const [showTips, setShowTips] = useState(false);

  const handleToggleTips = () => {
    setShowTips((current) => !current);
  };

  return (
    <div className="container page-contact">
      <section className="page-section">
        <h1>Contact</h1>
        <p>Use the form below to send a message and see your typing reflected immediately.</p>
      </section>

      <section className="contact-section">
        <form className="contact-form">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            rows={6}
          />
          <div className="form-meta">
            <span>Character Count: {message.length}</span>
            <span>Remaining: {Math.max(0, 250 - message.length)}</span>
          </div>
        </form>

        <aside className="contact-preview">
          <h2>Live Preview</h2>
          <p>{message || 'Your message preview will appear here.'}</p>
          <button type="button" className="button button-secondary" onClick={handleToggleTips}>
            {showTips ? 'Hide Help' : 'Show Help'}
          </button>
          {showTips && (
            <div className="help-box">
              <p>Use the contact form to describe your project or ask about internships.</p>
              <p>Keep the message concise and friendly for the best response.</p>
            </div>
          )}
        </aside>
      </section>

      <Footer year={new Date().getFullYear()} />
    </div>
  );
}

export default Contact;
