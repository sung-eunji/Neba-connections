// MUST NOT CHANGE THIS FILE!

/**
 * Form Service
 * Submits form data to the database and sends an email notification
 *
 * @example
 * // Submit a contact form
 * const result = await formService.submit('Contact Form', {
 *   'Name': 'John Doe',
 *   'Email': 'john@example.com',
 *   'Message': 'Hello world'
 * });
 */

import { supabase } from '../libs/supabase.js';

export const formService = {
  async submit(formName, formData) {
    const { data } = await supabase
      .from('68b2e58b15e830f524e9f204_form_submissions')
      .insert({
        form_name: formName,
        form_data: formData,
      });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
      <h1 style="color: #2c3e50; text-align: center; margin-bottom: 30px; font-size: 24px;">
      New Form Submission
      </h1>
      <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #34495e; margin-top: 0; margin-bottom: 20px; font-size: 18px; border-bottom: 2px solid #3498db; padding-bottom: 8px;">
      Form Details
      </h2>
      <div style="margin-bottom: 15px; padding: 12px; background-color: #e8f4fd; border-left: 4px solid #2980b9; border-radius: 4px;">
      <div style="font-weight: bold; color: #2c3e50; margin-bottom: 5px;">
      Form Name:
      </div>
      <div style="color: #34495e; font-size: 14px; word-wrap: break-word;">
      ${formName}
      </div>
      </div>
      ${Object.entries(formData)
        .map(
          ([key, value]) => `
            <div style="margin-bottom: 15px; padding: 12px; background-color: #f8f9fa; border-left: 4px solid #3498db; border-radius: 4px;">
            <div style="font-weight: bold; color: #2c3e50; margin-bottom: 5px; text-transform: capitalize;">
            ${key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase())}:
            </div>
            <div style="color: #34495e; font-size: 14px; word-wrap: break-word;">
            ${
              typeof value === 'object' ? JSON.stringify(value, null, 2) : value
            }
            </div>
            </div>
          `
        )
        .join('')}
      </div>
      <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
      <p style="color: #7f8c8d; font-size: 12px; margin: 0;">
      This email was automatically generated from your form submission.
      </p>
      </div>
      </div>
    `;

    // call api to send email
    await fetch('https://api.heybossai.com/v1/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'aws/send-email',
        inputs: {
          title: 'New Form Submission',
          body_html: emailHtml,
          receivers: import.meta.env.VITE_USER_EMAIL,
          project_id: import.meta.env.VITE_PROJECT_ID,
        },
      }),
    });

    return data;
  },
};
