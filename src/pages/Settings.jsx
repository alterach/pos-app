import { useState, useEffect } from 'react';
import { Store, Percent, DollarSign, Moon, Sun, Save } from 'lucide-react';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    storeName: 'F. POS',
    taxPercentage: 11,
    currency: 'IDR',
    darkMode: false,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('pos_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const isDarkMode = localStorage.getItem('pos_darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      setSettings(prev => ({ ...prev, darkMode: true }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('pos_settings', JSON.stringify(settings));
    localStorage.setItem('pos_darkMode', settings.darkMode);

    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleDarkMode = () => {
    setSettings(prev => {
      const newSettings = { ...prev, darkMode: !prev.darkMode };
      if (newSettings.darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('pos_darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('pos_darkMode', 'false');
      }
      return newSettings;
    });
    setSaved(false);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your store preferences and configurations</p>
        </div>

        <div className="settings-card">
          <div className="settings-section-title">
            <Store size={22} />
            <h2>Store Information</h2>
          </div>

          <div className="form-group">
            <label htmlFor="storeName">Store Name</label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={settings.storeName}
              onChange={handleChange}
              placeholder="Enter your store name"
            />
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-section-title">
            <Percent size={22} />
            <h2>Tax & Currency</h2>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="taxPercentage">Tax Percentage (PPN)</label>
              <input
                type="number"
                id="taxPercentage"
                name="taxPercentage"
                value={settings.taxPercentage}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={settings.currency}
                onChange={handleChange}
              >
                <option value="IDR">IDR (Rupiah)</option>
                <option value="USD">USD (Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-section-title">
            {settings.darkMode ? <Moon size={22} /> : <Sun size={22} />}
            <h2>Appearance</h2>
          </div>

          <div className="toggle-group">
            <div className="toggle-info">
              <h3>Dark Mode</h3>
              <p>Switch between light and dark theme</p>
            </div>
            <div
              className={`toggle-switch ${settings.darkMode ? 'active' : ''}`}
              onClick={toggleDarkMode}
            />
          </div>
        </div>

        <button className="btn-primary btn-save" onClick={handleSave}>
          <Save size={18} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default Settings;
