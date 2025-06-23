import React, { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useLocalization } from '../contexts/LocalizationContext';

emailjs.init("ectg_ki42cWtqTUeZ");

const Contact = () => {
  const { currentLocale } = useLocalization();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const formRef = useRef();

  const [terminalOutput, setTerminalOutput] = useState([
    { type: 'system', text: 'LN Design' },
    { type: 'system', text: 'l.n.design@hotmail.com' },
    { type: 'system', text: 'Please fill in the form fields to proceed.' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    if (value) {
      setTerminalOutput(prev => [
        ...prev,
        { type: 'input', text: `> ${name}: ${value}` }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Send user confirmation email
      const userConfirmationResult = await emailjs.sendForm(
        'service_5f78d1b',
        'template_q54neqd',
        formRef.current
      );

      const ownerNotificationResult = await emailjs.sendForm(
        'service_5f78d1b',
        'template_ilx3euo',
        formRef.current
      );

      if (userConfirmationResult.text === 'OK' && ownerNotificationResult.text === 'OK') {
        setTerminalOutput(prev => [
          ...prev,
          { type: 'system', text: 'Form submitted successfully!' },
          { type: 'system', text: 'Thank you for your message.' }
        ]);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setError('Failed to send message. Please try again.');
      setTerminalOutput(prev => [
        ...prev,
        { type: 'error', text: 'Error: Failed to send message.' }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setError(null);
    setTerminalOutput([
      { type: 'system', text: 'Welcome to the contact form terminal.' },
      { type: 'system', text: 'Please fill in the form fields to proceed.' }
    ]);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-daylight flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 md:p-12 max-w-lg w-full text-center">
          <h1 className="text-2xl md:text-h2 font-headings text-midnight mb-4">
            {currentLocale === 'nl' ? 'Bericht Verzonden!' : 'Message Sent!'}
          </h1>
          <p className="text-body text-midnight/80 mb-8">
            {currentLocale === 'nl' 
              ? 'Bedankt voor je bericht. Ik neem zo snel mogelijk contact met je op.'
              : 'Thank you for reaching out. I\'ll get back to you as soon as possible.'}
          </p>
          <button 
            onClick={resetForm} 
            className="inline-block border-2 border-midnight text-midnight px-6 py-2 rounded-lg relative overflow-hidden bg-transparent hover:bg-midnight hover:text-daylight transition-all"
          >
            {currentLocale === 'nl' ? 'Nog een bericht sturen' : 'Send Another Message'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-daylight">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Terminal Section */}
          <div className="bg-midnight rounded-xl overflow-hidden shadow-lg">
            <div className="bg-midnight/80 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <div className="text-daylight text-sm ml-4">contact-form-terminal</div>
            </div>
            <div className="p-4 font-mono text-sm text-daylight h-[400px] overflow-y-auto">
              {terminalOutput.map((line, index) => (
                <div 
                  key={index} 
                  className={`mb-2 ${
                    line.type === 'system' ? 'text-blue-400' : 
                    line.type === 'input' ? 'text-green-400' :
                    line.type === 'error' ? 'text-red-400' : 'text-daylight'
                  }`}
                >
                  {line.text}
                </div>
              ))}
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-h2 font-headings text-midnight mb-2">
                {currentLocale === 'nl' ? 'Neem Contact Op' : 'Get in touch'}
              </h1>
              <p className="text-body text-midnight/80">
                {currentLocale === 'nl' ? 'Laten we over je project praten' : 'Let\'s discuss your project'}
              </p>
              <div className="w-24 h-1 bg-midnight mx-auto mt-4"></div>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-midnight mb-2">
                  {currentLocale === 'nl' ? 'Naam' : 'Name'}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder={currentLocale === 'nl' ? 'Je naam' : 'Your name'}
                  required
                  className="w-full px-4 py-2 border border-midnight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-midnight focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-midnight mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-2 border border-midnight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-midnight focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-midnight mb-2">
                  {currentLocale === 'nl' ? 'Onderwerp' : 'Subject'}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder={currentLocale === 'nl' ? 'Waar gaat het over?' : 'What\'s this about?'}
                  required
                  className="w-full px-4 py-2 border border-midnight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-midnight focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-midnight mb-2">
                  {currentLocale === 'nl' ? 'Bericht' : 'Message'}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder={currentLocale === 'nl' ? 'Je bericht hier...' : 'Your message here...'}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-midnight/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-midnight focus:border-transparent transition-all resize-none"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full inline-block border-2 border-midnight text-midnight px-6 py-3 rounded-lg relative overflow-hidden bg-transparent hover:bg-midnight hover:text-daylight transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? (currentLocale === 'nl' ? 'Verzenden...' : 'Sending...')
                  : (currentLocale === 'nl' ? 'Verstuur Bericht' : 'Send Message')
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;