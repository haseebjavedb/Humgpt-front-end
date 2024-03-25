import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is imported
import Helpers from '../../../Config/Helpers';


const SettingsForm = () => {
  const [api_key, setapi_key] = useState('');
  const [model, setModel] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Defined models
  const models = [
    { value: "gpt-3.5-turbo-instruct", name: "GPT-3.5 Turbo Instruct" },
    { value: "gpt-4-1106-preview", name: "GPT-4 1106 Preview" },
    { value: "gpt-3.5-turbo-1106", name: "GPT-3.5 Turbo 1106" },
    { value: "gpt-3.5-turbo-instruct-1106", name: "GPT-3.5 Turbo Instruct 1106" },
    { value: "gpt-4-1106-instruct", name: "GPT-4 1106 Instruct" },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Adjust the endpoint as needed to match your API route
        const response = await axios.get(`${Helpers.apiUrl}admin/getApiKey`, Helpers.authHeaders);
        setapi_key(response.data.api_key || ''); // Use the correct property names based on your API response
        setModel(response.data.model || '');
      } catch (error) {
        console.error('Failed to fetch settings', error);
        // Optionally set error feedback here
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let newErrors = {};

    // Basic validation for empty fields
    if (!api_key.trim()) newErrors.api_key = 'API Key is required';
    if (!model.trim()) newErrors.model = 'Model selection is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return; // Stop submission if there are errors
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${Helpers.apiUrl}admin/api_key`, { api_key, model }, Helpers.authHeaders);
    //   console.log('Settings saved:', response.data);
      // Handle success feedback here
      Helpers.toast("success", response.data.message);

    } catch (error) {
      console.error('Failed to save settings', error);
      // Handle error feedback here
    }

    setIsLoading(false);
  };

  return (
    <div className="container mt-5 p-5 shadow-lg rounded bg-white">
    <div className="row justify-content-center">
        <div className="col-md-6">
            <form onSubmit={handleSubmit} className="p-3">
                <h2 className="mb-4 text-center">Settings</h2>
                <div className="mb-3">
                    <label htmlFor="api_key" className="form-label">API Key:</label>
                    <input
                        type="text"
                        className={`form-control ${errors.api_key ? 'is-invalid' : ''}`}
                        id="api_key"
                        value={api_key}
                        onChange={(event) => setapi_key(event.target.value)}
                    />
                    {errors.api_key && <div className="invalid-feedback">{errors.api_key}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="model" className="form-label">Model:</label>
                    <select
                        className={`form-select ${errors.model ? 'is-invalid' : ''}`}
                        id="model"
                        value={model}
                        onChange={(event) => setModel(event.target.value)}
                    >
                        <option value="">Select a model</option>
                        {models.map((m) => (
                            <option key={m.value} value={m.value}>{m.name}</option>
                        ))}
                    </select>
                    {errors.model && <div className="invalid-feedback">{errors.model}</div>}
                </div>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

  );
};

export default SettingsForm;
