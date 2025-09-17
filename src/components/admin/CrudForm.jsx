/**
 * @description This component renders a dynamic form for Create/Update operations in the admin dashboard.
 * It generates form fields based on a table configuration object, supporting various data types with enhanced accessibility.
 * It integrates ReactQuill for rich text editing, includes comprehensive error handling, and manages focus for better UX.
 */
import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { AlertCircle } from 'lucide-react';

export const CrudForm = ({
  config,
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const firstInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const initialFormState = {};
    config.field_list.forEach((field) => {
      if (
        field.db_name !== 'id' &&
        field.db_name !== 'created_at' &&
        field.db_name !== 'updated_at'
      ) {
        const value = initialData ? initialData[field.db_name] : undefined;
        if (field.type === 'checkbox') {
          initialFormState[field.db_name] = value || false;
        } else if (field.type === 'tag' && field.tag_type === 'multiple') {
          initialFormState[field.db_name] = value || [];
        } else {
          initialFormState[field.db_name] =
            value === null || value === undefined ? '' : value;
        }
      }
    });
    setFormData(initialFormState);
    setErrors({});
    setTouched({});
  }, [config, initialData]);

  // Focus management
  useEffect(() => {
    const timer = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validateField = (field, value) => {
    if (field.required) {
      if (field.type === 'checkbox') {
        return value === true ? null : `${field.ui_name} is required`;
      } else if (field.type === 'tag' && field.tag_type === 'multiple') {
        return Array.isArray(value) && value.length > 0
          ? null
          : `At least one ${field.ui_name} must be selected`;
      } else {
        const stringValue = String(value || '').trim();
        return stringValue.length > 0 ? null : `${field.ui_name} is required`;
      }
    }

    // Validate URL fields
    if (
      (field.type === 'web_url' ||
        field.type === 'media_url' ||
        field.type === 'file_url') &&
      value
    ) {
      try {
        new URL(value);
        return null;
      } catch {
        return `Please enter a valid URL for ${field.ui_name}`;
      }
    }

    // Validate number fields
    if (field.type === 'number' && value !== null && value !== '') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return `${field.ui_name} must be a valid number`;
      }
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {};
    config.field_list.forEach((field) => {
      if (
        field.db_name !== 'id' &&
        field.db_name !== 'created_at' &&
        field.db_name !== 'updated_at'
      ) {
        const error = validateField(field, formData[field.db_name]);
        if (error) {
          newErrors[field.db_name] = error;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate field on blur
    const field = config.field_list.find((f) => f.db_name === name);
    if (field) {
      const error = validateField(field, formData[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    config.field_list.forEach((field) => {
      if (
        field.db_name !== 'id' &&
        field.db_name !== 'created_at' &&
        field.db_name !== 'updated_at'
      ) {
        allTouched[field.db_name] = true;
      }
    });
    setTouched(allTouched);

    if (validateForm()) {
      onSubmit(formData);
    } else {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = formRef.current?.querySelector(
          `[name="${firstErrorField}"]`
        );
        if (errorElement) {
          errorElement.focus();
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    // Allow Escape to cancel
    if (e.key === 'Escape' && !isSubmitting) {
      onCancel();
    }
  };

  const renderField = (field, index) => {
    if (
      field.db_name === 'id' ||
      field.db_name === 'created_at' ||
      field.db_name === 'updated_at'
    ) {
      return null;
    }

    // Check if this is a Neba Connections product by looking at the product_no or any other identifier
    const isNebaConnections =
      formData.product_no?.startsWith('SL-') ||
      formData.hashtags?.includes('korean_design');

    const commonProps = {
      label: (
        <div className="flex items-center">
          {field.ui_name}
          {isNebaConnections && field.db_name === 'name' && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-rose-100 to-fuchsia-100 text-fuchsia-800">
              Neba Connections
            </span>
          )}
          {isNebaConnections && field.db_name === 'hashtags' && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">
              Add Neba Connections tags
            </span>
          )}
        </div>
      ),
      name: field.db_name,
      required: field.required,
      error: touched[field.db_name] ? errors[field.db_name] : null,
      onBlur: () => handleBlur(field.db_name),
      ref: index === 0 ? firstInputRef : null,
      className:
        isNebaConnections && field.db_name !== 'media_url'
          ? 'border-rose-200 focus:border-fuchsia-500 focus:ring-fuchsia-500'
          : '',
    };

    const value = formData[field.db_name];

    switch (field.type) {
      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            value={value || ''}
            onChange={(e) =>
              handleChange(
                field.db_name,
                e.target.value ? Number(e.target.value) : null
              )
            }
            placeholder={`Enter ${field.ui_name.toLowerCase()}`}
          />
        );
      case 'timestamp':
        return (
          <Input
            {...commonProps}
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ''}
            onChange={(e) => handleChange(field.db_name, e.target.value)}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-start space-x-3 pt-2">
            <input
              type="checkbox"
              id={field.db_name}
              name={field.db_name}
              checked={!!value}
              onChange={(e) => handleChange(field.db_name, e.target.checked)}
              onBlur={() => handleBlur(field.db_name)}
              className="h-4 w-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
              aria-describedby={
                errors[field.db_name] ? `${field.db_name}-error` : undefined
              }
              ref={index === 0 ? firstInputRef : null}
            />
            <div className="flex-1">
              <label
                htmlFor={field.db_name}
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                {field.ui_name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {touched[field.db_name] && errors[field.db_name] && (
                <div
                  id={`${field.db_name}-error`}
                  className="flex items-center mt-1 text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>{errors[field.db_name]}</span>
                </div>
              )}
            </div>
          </div>
        );
      case 'tag':
        if (field.tag_type === 'multiple') {
          return (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                {field.ui_name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-3 border rounded-lg bg-gray-50"
                role="group"
                aria-labelledby={`${field.db_name}-label`}
                aria-describedby={
                  errors[field.db_name] ? `${field.db_name}-error` : undefined
                }
              >
                {(field.tag_values || []).map((val, tagIndex) => (
                  <label
                    key={val}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      value={val}
                      checked={(value || []).includes(val)}
                      onChange={(e) => {
                        const currentValues = value || [];
                        const newValues = e.target.checked
                          ? [...currentValues, val]
                          : currentValues.filter((v) => v !== val);
                        handleChange(field.db_name, newValues);
                      }}
                      onBlur={() => handleBlur(field.db_name)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      ref={index === 0 && tagIndex === 0 ? firstInputRef : null}
                    />
                    <span className="text-sm text-gray-700">{val}</span>
                  </label>
                ))}
              </div>
              {touched[field.db_name] && errors[field.db_name] && (
                <div
                  id={`${field.db_name}-error`}
                  className="flex items-center mt-2 text-red-600 text-sm"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span>{errors[field.db_name]}</span>
                </div>
              )}
            </div>
          );
        }
        return (
          <Input
            {...commonProps}
            type="select"
            options={(field.tag_values || []).map((v) => ({
              label: v,
              value: v,
            }))}
            value={value || ''}
            onChange={(e) => handleChange(field.db_name, e.target.value)}
            placeholder={`Select ${field.ui_name.toLowerCase()}`}
          />
        );
      case 'rich_text':
        const quillModules = {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        };

        return (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {field.ui_name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="border rounded-lg overflow-hidden">
              <ReactQuill
                theme="snow"
                value={value || ''}
                onChange={(val) => handleChange(field.db_name, val)}
                onBlur={() => handleBlur(field.db_name)}
                modules={quillModules}
                placeholder={`Enter ${field.ui_name.toLowerCase()}...`}
                style={{ minHeight: '120px' }}
              />
            </div>
            {touched[field.db_name] && errors[field.db_name] && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>{errors[field.db_name]}</span>
              </div>
            )}
          </div>
        );
      case 'media_url':
        return (
          <div>
            <Input
              {...commonProps}
              type="url"
              value={value || ''}
              onChange={(e) => handleChange(field.db_name, e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            {value && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview:
                </label>
                <img
                  src={value}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300 shadow-sm"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="hidden w-32 h-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                  <span className="text-sm text-gray-500">
                    Invalid Image URL
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      case 'file_url':
      case 'web_url':
        return (
          <Input
            {...commonProps}
            type="url"
            value={value || ''}
            onChange={(e) => handleChange(field.db_name, e.target.value)}
            placeholder={`https://example.com/${
              field.type === 'file_url' ? 'document.pdf' : ''
            }`}
          />
        );
      case 'address':
        return (
          <Input
            {...commonProps}
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(field.db_name, e.target.value)}
            placeholder={`Enter ${field.ui_name.toLowerCase()}`}
          />
        );
      case 'text':
      default:
        return (
          <Input
            {...commonProps}
            type="text"
            value={value || ''}
            onChange={(e) => handleChange(field.db_name, e.target.value)}
            placeholder={`Enter ${field.ui_name.toLowerCase()}`}
          />
        );
    }
  };

  const hasErrors = Object.values(errors).some((error) => error);
  const visibleFields = config.field_list.filter(
    (field) =>
      field.db_name !== 'id' &&
      field.db_name !== 'created_at' &&
      field.db_name !== 'updated_at'
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="space-y-6"
      noValidate
    >
      <div className="space-y-5">
        {visibleFields.map((field, index) => (
          <div key={field.db_name}>{renderField(field, index)}</div>
        ))}
      </div>

      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-sm font-medium text-red-800">
              Please fix the following errors:
            </h3>
          </div>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors)
              .filter(([_, error]) => error)
              .map(([field, error]) => (
                <li key={field}>• {error}</li>
              ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
          className="order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting || hasErrors}
          className="order-1 sm:order-2"
        >
          {isSubmitting
            ? 'Saving...'
            : initialData
            ? 'Save Changes'
            : 'Create Record'}
        </Button>
      </div>
    </form>
  );
};
