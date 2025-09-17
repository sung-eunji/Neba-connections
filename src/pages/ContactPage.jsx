/**
 * @description This file defines the Contact page with a functional contact form and company information.
 * It includes form validation, Supabase integration, email notifications, and deduplication logic.
 * The page displays global reach information and provides multiple ways for users to get in touch.
 */
import React, { useState } from 'react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { supabase } from '../libs/supabase';
import { CheckCircle, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-secondary" />,
      title: 'Email',
      details: 'sungeunji@neba-connections.net',
      description: 'Get in touch with our team',
    },
    {
      icon: <Phone className="w-6 h-6 text-secondary" />,
      title: 'Phone',
      details: '(+33) 7 83 00 79 52',
      description: 'Speak with our experts',
    },
    {
      icon: <MapPin className="w-6 h-6 text-secondary" />,
      title: 'Headquarters',
      details: 'Fashion District, Global City',
      description: 'Visit our main office',
    },
    {
      icon: <Globe className="w-6 h-6 text-secondary" />,
      title: 'Global Reach',
      details: 'EU, Africa, South America',
      description: 'Our distribution network',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Check for duplicate submissions first
      const { data: existingContacts, error: checkError } = await supabase
        .from('68b2e58b15e830f524e9f204_contacts')
        .select('id, email_sent')
        .eq('email', formData.email.trim().toLowerCase())
        .eq('email_sent', true);

      if (checkError) {
        console.error('Error checking duplicates:', checkError);
        throw checkError;
      }

      if (existingContacts && existingContacts.length > 0) {
        setErrors({
          email:
            'You have already submitted a message with this email address. We will get back to you soon!',
        });
        setIsSubmitting(false);
        return;
      }

      // Send email notification
      const projectId = import.meta.env.VITE_PROJECT_ID;
      const userEmail = import.meta.env.VITE_USER_EMAIL;

      const emailSubject = '[NEBA CONTACT] NEW GENERAL ENQUIRY NOTIFICATION';
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
          <div style="background:#0F172A; color:#fff; padding:16px; text-align:center;">
            <img src="https://heyboss.heeyo.ai/user-assets/Brand%20initial%20Simple%20Logo_mgafQ8wt.png" alt="Neba Connections Logo" style="height:50px; margin-bottom:8px;">
            <h2 style="margin:0;">Neba Connections</h2>
          </div>
          <div style="padding:16px; background:#fafafa;">
            <h3 style="color:#0F172A; margin-top:0;">New Contact Form Submission</h3>
            <table style="width:100%; border-collapse:collapse;">
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Name:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${
                formData.name
              }</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Email:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${
                formData.email
              }</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Company:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${
                formData.company || 'Not provided'
              }</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Message:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;"><pre style="white-space:pre-wrap; font-family:inherit;">${
                formData.message
              }</pre></td></tr>
            </table>
          </div>
          <div style="background:#f0f0f0; color:#555; padding:12px; font-size:12px; text-align:center;">
            Contact form submitted at ${new Date().toLocaleString()}<br>
            Neba Connections
          </div>
        </div>
      `;

      let emailSent = false;
      let emailSentAt = null;

      try {
        const response = await fetch('https://api.heybossai.com/v1/run', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'aws/send-email',
            inputs: {
              receivers: userEmail,
              title: emailSubject,
              body_html: emailHtml,
              project_id: projectId,
            },
          }),
        });

        const emailResult = await response.json();
        if (emailResult.send_email_status === 'success') {
          emailSent = true;
          emailSentAt = new Date().toISOString();
        }
      } catch (emailError) {
        console.error('Email send failed:', emailError);
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('68b2e58b15e830f524e9f204_contacts')
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          message: formData.message,
          email_sent: emailSent,
          email_sent_at: emailSentAt,
        });

      if (dbError) throw dbError;

      setIsSuccess(true);

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact form submission error:', error);
      setErrors({
        submit:
          'An error occurred while submitting your message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-heading font-bold text-primary mb-4">
            Message Sent Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting Neba Connections. We've received your
            message and will get back to you within 24-48 hours.
          </p>
          <Button onClick={() => setIsSuccess(false)} variant="primary">
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-heading font-bold text-primary mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Ready to partner with Neba? Get in touch with our team to discuss
              your fashion distribution needs and discover how we can help grow
              your business across three continents.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {/* User Guide */}
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-green-900 mb-1">
                    Contact Form Guide
                  </h3>
                  <p className="text-sm text-green-700">
                    Fill out all required fields marked with * to send us your
                    message. We typically respond within 24-48 hours during
                    business days.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-heading font-bold text-primary mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  required
                  placeholder="Enter your full name"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                  placeholder="your.email@company.com"
                />
              </div>

              <Input
                label="Company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                error={errors.company}
                placeholder="Your company name (optional)"
              />

              <Input
                label="Message"
                name="message"
                type="textarea"
                value={formData.message}
                onChange={handleInputChange}
                error={errors.message}
                required
                placeholder="Tell us about your requirements, questions, or how we can help you..."
                rows={6}
              />

              {errors.submit && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {errors.submit}
                </div>
              )}

              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
                size="lg"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-primary mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Our team is here to help you explore partnership opportunities,
                answer questions about our products, and discuss how Neba can
                support your fashion business growth.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    {info.icon}
                    <h3 className="text-lg font-heading font-semibold text-primary ml-3">
                      {info.title}
                    </h3>
                  </div>
                  {info.title === 'Email' ? (
                    <a
                      href={`mailto:${info.details}`}
                      className="text-gray-900 font-medium mb-1 hover:text-secondary transition-colors"
                    >
                      {info.details}
                    </a>
                  ) : info.title === 'Phone' ? (
                    <a
                      href={`tel:${info.details}`}
                      className="text-gray-900 font-medium mb-1 hover:text-secondary transition-colors"
                    >
                      {info.details}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-medium mb-1">
                      {info.details}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-heading font-bold text-primary mb-4">
                Global Reach Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    European Union
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Established distribution network with strong partnerships
                    across major EU markets
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Africa</h4>
                  <p className="text-gray-600 text-sm">
                    Growing presence in key African markets with focus on
                    sustainable fashion
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">South America</h4>
                  <p className="text-gray-600 text-sm">
                    Expanding operations in South American markets with local
                    retail partnerships
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
