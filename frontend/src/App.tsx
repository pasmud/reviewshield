import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import ScanResults from './pages/ScanResults';
import Triage from './pages/Triage';
import ReportExport from './pages/ReportExport';
import Settings from './pages/Settings';
import { checkStatus } from './api';

type Page = 'dashboard' | 'results' | 'triage' | 'export' | 'settings';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [scanId, setScanId] = useState<number | null>(null);
  const [semgrepStatus, setSemgrepStatus] = useState<boolean | null>(null);

  useEffect(() => {
    checkStatus().then(s => setSemgrepStatus(s.semgrepInstalled)).catch(() => setSemgrepStatus(false));
  }, []);

  const navItems: { key: Page; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'results', label: 'Scan Results' },
    { key: 'triage', label: 'Triage' },
    { key: 'export', label: 'Reports' },
    { key: 'settings', label: 'Settings' },
  ];

  const handleScanComplete = (id: number) => {
    setScanId(id);
    setPage('results');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">ReviewShield</h1>
            <span className="text-sm text-gray-500">SAST Triage Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${semgrepStatus ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-sm text-gray-600">
              Semgrep: {semgrepStatus === null ? '...' : semgrepStatus ? 'Available' : 'Demo Mode'}
            </span>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4">
          <ul className="flex gap-6 -mb-px">
            {navItems.map(item => (
              <li key={item.key}>
                <button
                  onClick={() => setPage(item.key)}
                  className={`pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                    page === item.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {page === 'dashboard' && <Dashboard onScanComplete={handleScanComplete} />}
        {page === 'results' && <ScanResults scanId={scanId} />}
        {page === 'triage' && <Triage scanId={scanId} />}
        {page === 'export' && <ReportExport scanId={scanId} />}
        {page === 'settings' && <Settings />}
      </main>
    </div>
  );
}
