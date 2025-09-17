/**
 * @description This is the main page for the admin dashboard with enhanced user experience.
 * It dynamically discovers and loads all table configurations from the `supabase/configurations` directory.
 * Features an engaging empty state with visual elements and clear guidance for users.
 */

import React, { useState, useEffect } from 'react';
import { CrudTable } from '../components/admin/CrudTable';
import { SpinnerCentered } from '../components/admin/SpinnerCentered';
import {
  Database,
  FileText,
  Settings,
  BarChart3,
  Users,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const AdminPage = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const loadConfigurations = async () => {
    setLoading(true);
    setError(null);

    try {
      // List of known configuration files
      const configFiles = [
        '68b2e58b15e830f524e9f204_contacts.json',
        '68b2e58b15e830f524e9f204_rfqs.json',
        '68b2e58b15e830f524e9f204_products.json',
        '68b2e58b15e830f524e9f204_form_submissions.json',
      ];

      const loadedConfigs = [];

      for (const fileName of configFiles) {
        try {
          const response = await fetch(`./supabase/configurations/${fileName}`);
          if (response.ok) {
            const config = await response.json();
            if (config && config.ui_table_name && config.db_table_name) {
              loadedConfigs.push({
                ...config,
                fileName,
                id: config.db_table_name,
              });
            }
          }
        } catch (fileError) {
          console.warn(
            `Could not load configuration file ${fileName}:`,
            fileError
          );
        }
      }

      setConfigs(loadedConfigs);

      // Auto-select first table if available
      if (loadedConfigs.length > 0 && !selectedTable) {
        setSelectedTable(loadedConfigs[0].id);
      }
    } catch (err) {
      console.error('Error loading configurations:', err);
      setError('Failed to load table configurations. Please check your setup.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigurations();
  }, []);

  const handleTableSelect = (tableId) => {
    setSelectedTable(tableId);
  };

  const selectedConfig = configs.find((config) => config.id === selectedTable);

  if (loading) {
    return <SpinnerCentered message="Loading admin dashboard..." size="lg" />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Configuration Error
        </h2>
        <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
        <Button onClick={loadConfigurations} variant="primary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Loading
        </Button>
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <div className="text-center py-12">
        <Database className="w-20 h-20 text-slate-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          No Tables Found
        </h2>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
          No database table configurations were found in the{' '}
          <code className="bg-slate-100 px-2 py-1 rounded text-sm">
            supabase/configurations
          </code>{' '}
          directory. Please ensure your table configuration files are properly
          set up.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">
              Configuration Files
            </h3>
            <p className="text-sm text-slate-600">
              Add JSON configuration files to define your database tables
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <Settings className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">
              Auto-Discovery
            </h3>
            <p className="text-sm text-slate-600">
              Tables are automatically discovered and UI is generated
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">Full CRUD</h3>
            <p className="text-sm text-slate-600">
              Complete Create, Read, Update, Delete operations
            </p>
          </div>
        </div>

        <Button onClick={loadConfigurations} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Tables
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Database Management
            </h1>
            <p className="text-slate-600">
              Manage your database tables and records. {configs.length} table
              {configs.length !== 1 ? 's' : ''} available.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={loadConfigurations}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Table Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Select Table to Manage
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {configs.map((config) => (
            <button
              key={config.id}
              onClick={() => handleTableSelect(config.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedTable === config.id
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
              aria-pressed={selectedTable === config.id}
              aria-label={`Select ${config.ui_table_name} table`}
            >
              <div className="flex items-center space-x-3">
                <Database
                  className={`w-5 h-5 ${
                    selectedTable === config.id
                      ? 'text-blue-600'
                      : 'text-slate-500'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium truncate">
                    {config.ui_table_name}
                  </h3>
                  <p
                    className={`text-sm truncate ${
                      selectedTable === config.id
                        ? 'text-blue-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {config.field_list?.length || 0} fields
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Table Management */}
      {selectedConfig ? (
        <CrudTable config={selectedConfig} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Select a Table
          </h3>
          <p className="text-slate-600">
            Choose a table from above to start managing your data.
          </p>
        </div>
      )}
    </div>
  );
};
