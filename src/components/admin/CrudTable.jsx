/**
 * @description This component provides a reusable CRUD table for the admin dashboard.
 * It displays data based on a configuration file and includes functionality for adding, editing, deleting, and exporting data.
 * The component uses a modal with a dynamic form for create/update operations with enhanced accessibility and user feedback.
 */
import React, { useState, useEffect } from 'react';
import { supabase } from '../../libs/supabase';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { CrudForm } from './CrudForm';
import { SpinnerCentered } from './SpinnerCentered';
import {
  Plus,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Papa from 'papaparse';

export const CrudTable = ({ config }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: tableData, error: tableError } = await supabase
        .from(config.db_table_name)
        .select('*')
        .order('id', { ascending: false });

      if (tableError) {
        setError(
          `Unable to load ${config.ui_table_name.toLowerCase()}: ${
            tableError.message
          }`
        );
        console.error(`Error fetching ${config.db_table_name}:`, tableError);
      } else {
        setData(tableData || []);
      }
    } catch (err) {
      setError(
        `Network error while loading ${config.ui_table_name.toLowerCase()}`
      );
      console.error('Network error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [config.db_table_name]);

  const handleOpenModal = (item = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      let error;
      const action = editingItem ? 'update' : 'create';

      if (editingItem) {
        // Update
        const { error: updateError } = await supabase
          .from(config.db_table_name)
          .update(formData)
          .eq('id', editingItem.id);
        error = updateError;
      } else {
        // Create
        const { error: insertError } = await supabase
          .from(config.db_table_name)
          .insert([formData]);
        error = insertError;
      }

      if (error) {
        showNotification(
          `Failed to ${action} record: ${error.message}`,
          'error'
        );
        console.error('Submit error:', error);
      } else {
        showNotification(
          `Successfully ${action === 'update' ? 'updated' : 'created'} record!`,
          'success'
        );
        handleCloseModal();
        await fetchData();
      }
    } catch (err) {
      showNotification(
        `Network error during ${editingItem ? 'update' : 'creation'}`,
        'error'
      );
      console.error('Submit error:', err);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    const itemName =
      data.find((item) => item.id === id)?.name || `record #${id}`;
    if (
      window.confirm(
        `Are you sure you want to permanently delete "${itemName}"? This action cannot be undone.`
      )
    ) {
      try {
        const { error } = await supabase
          .from(config.db_table_name)
          .delete()
          .eq('id', id);

        if (error) {
          showNotification(
            `Failed to delete record: ${error.message}`,
            'error'
          );
        } else {
          showNotification('Record deleted successfully!', 'success');
          await fetchData();
        }
      } catch (err) {
        showNotification('Network error during deletion', 'error');
        console.error('Delete error:', err);
      }
    }
  };

  const exportToCsv = () => {
    try {
      const csvData = data.map((row) => {
        const newRow = {};
        config.field_list.forEach((field) => {
          let value = row[field.db_name];
          if (field.type === 'rich_text' && typeof value === 'string') {
            // Strip HTML tags from rich text fields
            const div = document.createElement('div');
            div.innerHTML = value;
            value = div.textContent || div.innerText || '';
          } else if (Array.isArray(value)) {
            value = value.join(', ');
          } else if (value === null || value === undefined) {
            value = '';
          }
          newRow[field.ui_name] = value;
        });
        return newRow;
      });

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `${config.ui_table_name.replace(/\s+/g, '_')}_${
          new Date().toISOString().split('T')[0]
        }.csv`
      );
      link.setAttribute(
        'aria-label',
        `Download ${config.ui_table_name} data as CSV`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(
        `${config.ui_table_name} data exported successfully!`,
        'success'
      );
    } catch (err) {
      showNotification('Failed to export data', 'error');
      console.error('Export error:', err);
    }
  };

  const renderCell = (item, field) => {
    const value = item[field.db_name];
    if (value === null || value === undefined)
      return <span className="text-gray-500 italic">Not provided</span>;

    // Check if this is a Neba Connections product
    const isNebaConnections =
      item.product_no?.startsWith('SL-') ||
      (Array.isArray(item.hashtags) &&
        (item.hashtags.includes('korean_design') ||
          item.hashtags.includes('korean_craftsmanship')));

    switch (field.type) {
      case 'checkbox':
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              value
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {value ? 'Yes' : 'No'}
          </span>
        );
      case 'timestamp':
        try {
          return new Date(value).toLocaleString();
        } catch {
          return <span className="text-red-500">Invalid date</span>;
        }
      case 'tag':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((tag) => {
                const isNebaConnectionsTag =
                  tag.includes('korean') ||
                  tag === 'fashion_forward' ||
                  tag === 'empowering_style' ||
                  tag === 'bold_expression' ||
                  tag === 'trendy_chic';

                return (
                  <span
                    key={tag}
                    className={`inline-block ${
                      isNebaConnectionsTag
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    } rounded-full px-2 py-1 text-xs font-medium`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          );
        }

        return (
          <span
            className={`bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-xs font-medium`}
          >
            {value}
          </span>
        );
      case 'rich_text':
        const truncatedHtml =
          String(value).substring(0, 100) +
          (String(value).length > 100 ? '...' : '');
        return (
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: truncatedHtml }}
            title="Click edit to view full content"
          />
        );
      case 'web_url':
      case 'file_url':
        return value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline truncate max-w-xs block"
            title={value}
          >
            {value.length > 50 ? `${value.substring(0, 50)}...` : value}
          </a>
        ) : (
          <span className="text-gray-500 italic">No URL</span>
        );
      case 'media_url':
        return value ? (
          <div className="flex items-center space-x-3">
            <img
              src={value}
              alt="Product thumbnail"
              className="w-12 h-12 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="hidden w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">IMG</span>
            </div>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
              title={value}
            >
              View Image
            </a>
          </div>
        ) : (
          <span className="text-gray-500 italic">No Image</span>
        );
      default:
        const textValue = String(value);
        const displayValue =
          textValue.length > 100
            ? `${textValue.substring(0, 100)}...`
            : textValue;
        return (
          <span title={textValue.length > 100 ? textValue : undefined}>
            {displayValue}
          </span>
        );
    }
  };

  if (loading) return <SpinnerCentered />;

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Data
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {config.ui_table_name}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {data.length} {data.length === 1 ? 'record' : 'records'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={exportToCsv}
            variant="outline"
            size="sm"
            disabled={data.length === 0}
            aria-label={`Export ${config.ui_table_name} to CSV`}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => handleOpenModal()}
            variant="primary"
            size="sm"
            aria-label={`Add new ${config.ui_table_name.toLowerCase()}`}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm text-left text-gray-700"
          role="table"
          aria-label={`${config.ui_table_name} data table`}
        >
          <thead className="text-xs text-gray-900 uppercase bg-gray-100 font-semibold">
            <tr>
              <th scope="col" className="px-4 py-3 w-24">
                <span className="sr-only">Actions</span>
                Actions
              </th>
              {config.field_list
                .filter((f) => f.db_name !== 'id')
                .map((field) => (
                  <th key={field.db_name} scope="col" className="px-4 py-3">
                    {field.ui_name}
                    {field.required && (
                      <span className="text-red-500 ml-1" aria-label="Required">
                        *
                      </span>
                    )}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Edit ${item.name || `record ${item.id}`}`}
                      title="Edit record"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`Delete ${item.name || `record ${item.id}`}`}
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
                {config.field_list
                  .filter((f) => f.db_name !== 'id')
                  .map((field) => (
                    <td key={field.db_name} className="px-4 py-4 max-w-xs">
                      {renderCell(item, field)}
                    </td>
                  ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={config.field_list.length + 1}
                  className="text-center py-12"
                >
                  <div className="text-gray-500">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="text-lg font-medium mb-1">
                      No {config.ui_table_name.toLowerCase()} yet
                    </p>
                    <p className="text-sm">
                      Click "Add New" to create your first record
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={
            editingItem
              ? `Edit ${config.ui_table_name}`
              : `Add New ${config.ui_table_name}`
          }
          size="xl"
        >
          <CrudForm
            config={config}
            initialData={editingItem}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        </Modal>
      )}
    </div>
  );
};
