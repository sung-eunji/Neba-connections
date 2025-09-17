/**
 * @description This file defines the Request for Quote modal component with complete form functionality.
 * It handles form validation, Supabase database operations, email notifications, and deduplication logic.
 * The modal integrates with the email notification API and provides proper user feedback for all states.
 */
import React, { useState } from 'react';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { supabase } from '../libs/supabase';
import { CheckCircle } from 'lucide-react';

export const RfqModal = ({ isOpen, onClose, productOfInterest = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    productOfInterest: productOfInterest,
    quantity: '',
    deliveryRegion: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Update form data when productOfInterest changes
  React.useEffect(() => {
    if (productOfInterest && productOfInterest !== formData.productOfInterest) {
      setFormData((prev) => ({ ...prev, productOfInterest }));
    }
  }, [productOfInterest]);

  const deliveryRegions = [
    { value: 'EU', label: 'European Union' },
    { value: 'Africa', label: 'Africa' },
    { value: 'South America', label: 'South America' },
    { value: 'North America', label: 'North America' },
    { value: 'Asia', label: 'Asia' },
    { value: 'Other', label: 'Other' },
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
    if (!formData.productOfInterest.trim())
      newErrors.productOfInterest = 'Product of interest is required';
    if (!formData.quantity || formData.quantity < 1)
      newErrors.quantity = 'Quantity must be at least 1';
    if (!formData.deliveryRegion)
      newErrors.deliveryRegion = 'Delivery region is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setIsDuplicate(false);
    setSubmitMessage('Checking for duplicate submissions...');

    try {
      // Check for duplicate submissions first
      const { data: existingRfqs, error: checkError } = await supabase
        .from('68b2e58b15e830f524e9f204_rfqs')
        .select('id, email_sent')
        .eq('email', formData.email.trim().toLowerCase())
        .eq('email_sent', true);

      if (checkError) {
        console.error('Error checking duplicates:', checkError);
        throw checkError;
      }

      if (existingRfqs && existingRfqs.length > 0) {
        setIsDuplicate(true);
        setErrors({
          email:
            'You have already submitted a request with this email address. Our team will contact you soon!',
        });
        setIsSubmitting(false);
        return;
      }

      // Send email notification
      const projectId = import.meta.env.VITE_PROJECT_ID;
      const userEmail = import.meta.env.VITE_USER_EMAIL;

      const emailSubject = '[NEBA RFQ] NEW REQUEST FOR QUOTE NOTIFICATION';
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
          <div style="background:#0F172A; color:#fff; padding:16px; text-align:center;">
            <img src="https://heyboss.heeyo.ai/user-assets/Brand%20initial%20Simple%20Logo_mgafQ8wt.png" alt="Neba Connections Logo" style="height:50px; margin-bottom:8px;">
            <h2 style="margin:0;">Neba Connections</h2>
          </div>
          <div style="padding:16px; background:#fafafa;">
            <h3 style="color:#0F172A; margin-top:0;">New Request for Quote</h3>
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
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Product:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${
                formData.productOfInterest
              }</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Quantity:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${
                formData.quantity
              }</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Delivery Region:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;">${
                formData.deliveryRegion
              }</td></tr>
              <tr><td style="padding:8px; border-bottom:1px solid #eee;"><strong>Message:</strong></td><td style="padding:8px; border-bottom:1px solid #eee;"><pre style="white-space:pre-wrap; font-family:inherit;">${
                formData.message || 'None'
              }</pre></td></tr>
            </table>
          </div>
          <div style="background:#f0f0f0; color:#555; padding:12px; font-size:12px; text-align:center;">
            RFQ submitted at ${new Date().toLocaleString()}<br>
            Neba Connections
          </div>
        </div>
      `;

      let emailSent = false;
      let emailSentAt = null;

      setSubmitMessage('Sending notification email...');

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

      setSubmitMessage('Saving your request...');

      // Save to database
      const { error: dbError } = await supabase
        .from('68b2e58b15e830f524e9f204_rfqs')
        .insert({
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          product_of_interest: formData.productOfInterest,
          quantity: parseInt(formData.quantity),
          delivery_region: formData.deliveryRegion,
          message: formData.message || null,
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
        productOfInterest: '',
        quantity: '',
        deliveryRegion: '',
        message: '',
      });
    } catch (error) {
      console.error('RFQ submission error:', error);
      setErrors({
        submit:
          'An error occurred while submitting your request. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrors({});
    onClose();
  };

  if (isSuccess || isDuplicate) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={
          isSuccess ? 'Request Submitted Successfully' : 'Already Submitted'
        }
        size="md"
      >
        <div
          className="text-center py-8"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <CheckCircle
            className={`w-20 h-20 mx-auto mb-6 transition-all duration-500 ${
              isSuccess ? 'text-green-500 animate-pulse' : 'text-blue-500'
            }`}
          />
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isSuccess ? 'Thank You!' : 'We Got Your Request!'}
          </h3>
          <p className="text-slate-600 mb-8 text-lg leading-relaxed">
            {isSuccess
              ? 'Your request for quote has been submitted successfully. Our team will review your request and get back to you within 24-48 hours.'
              : 'We already have your request in our system. Our team will contact you soon with your quote!'}
          </p>
          <div className="space-y-4">
            <Button
              onClick={handleClose}
              variant="primary"
              className="w-full transform hover:scale-105 transition-transform duration-200"
            >
              Close
            </Button>
            {isSuccess && (
              <p className="text-sm text-slate-500">
                Need to submit another request?{' '}
                <button
                  onClick={handleClose}
                  className="text-secondary hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  Click here
                </button>
              </p>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Request a Quote"
      size="lg"
    >
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Product of Interest"
            name="productOfInterest"
            value={formData.productOfInterest}
            onChange={handleInputChange}
            error={errors.productOfInterest}
            required
            placeholder="e.g., FJ-4075 Dark Blue Denim"
          />

          <Input
            label="Quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            error={errors.quantity}
            required
            placeholder="Minimum order quantity"
            min="1"
          />
        </div>

        <Input
          label="Delivery Region"
          name="deliveryRegion"
          type="select"
          value={formData.deliveryRegion}
          onChange={handleInputChange}
          error={errors.deliveryRegion}
          required
          options={deliveryRegions}
          placeholder="Select delivery region"
        />

        <Input
          label="Additional Message"
          name="message"
          type="textarea"
          value={formData.message}
          onChange={handleInputChange}
          error={errors.message}
          placeholder="Tell us more about your requirements, timeline, or any specific questions..."
          rows={4}
        />

        {errors.submit && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        <div
          className="flex justify-end space-x-4"
          aria-live="polite"
          aria-atomic="true"
        >
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
            className="transition-all duration-200 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            aria-describedby={submitMessage ? 'submit-message' : undefined}
          >
            {isSubmitting ? 'Submitting Request...' : 'Submit RFQ'}
          </Button>
        </div>

        {submitMessage && (
          <div
            id="submit-message"
            className="mt-4 text-center text-sm text-slate-600"
            role="status"
            aria-live="polite"
          >
            {submitMessage}
          </div>
        )}
      </form>
    </Modal>
  );
};
