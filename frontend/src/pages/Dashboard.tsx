import React, { useState, useEffect } from 'react';
import { startScan, checkStatus, getFindings } from '../api';

interface Props {
  onScanComplete: (scanId: number) => void;
}

export default function Dashboard({ onScanComplete }: Props) {
  const [repoPath, setRepoPath] = useState('');
  const [useDemo, setUseDemo] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<{ scans: number; findings: number } | null>(null);
  const [semgrepInstalled, setSemgrepInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    checkStatus().then(s => setSemgrepInstalled(s.semgrepInstalled)).catch(() => setSemgrepInstalled(false));
  }, []);

  const handleScan = async () => {
    setError('');
    setScanning(true);
    try {
      const result = await startScan(repoPath, useDemo);
      onScanComplete(result.scan.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Start a New Scan</h2>
        <div className="space-y-4">
          {semgrepInstalled === false && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
              Semgrep is not installed. Demo mode is recommended. Install Semgrep from{' '}
              <a href="https://semgrep.dev/docs/getting-started/" className="underline" target="_blank" rel="noreferrer">semgrep.dev</a>.
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repository Path</label>
            <input
              type="text"
              value={repoPath}
              onChange={e => setRepoPath(e.target.value)}
              placeholder={useDemo ? 'Demo mode (no path needed)' : 'C:\\path\\to\\repo'}
              disabled={useDemo}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="demoMode"
              checked={useDemo}
              onChange={e => setUseDemo(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="demoMode" className="text-sm text-gray-700">Use Demo Mode (mock findings)</label>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            onClick={handleScan}
            disabled={scanning || (!useDemo && !repoPath)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {scanning ? 'Scanning...' : 'Start Scan'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onScanComplete(0)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium text-gray-900">View Findings</div>
            <div className="text-sm text-gray-500">Browse all scan results</div>
          </button>
          <button
            onClick={() => onScanComplete(0)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium text-gray-900">Triage Queue</div>
            <div className="text-sm text-gray-500">Review and classify findings</div>
          </button>
          <button
            onClick={() => onScanComplete(0)}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="font-medium text-gray-900">Export Reports</div>
            <div className="text-sm text-gray-500">Generate PR review reports</div>
          </button>
        </div>
      </div>
    </div>
  );
}
