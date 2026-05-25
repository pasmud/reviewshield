import React, { useState, useEffect } from 'react';
import { checkStatus } from '../api';

export default function Settings() {
  const [semgrepInstalled, setSemgrepInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    checkStatus().then(s => setSemgrepInstalled(s.semgrepInstalled)).catch(() => setSemgrepInstalled(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Semgrep Configuration</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${semgrepInstalled ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm">
              Semgrep is <strong>{semgrepInstalled ? 'installed' : 'not installed'}</strong>
            </span>
          </div>
          {!semgrepInstalled && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
              Install Semgrep to scan real repositories. Run:
              <pre className="mt-1 bg-gray-800 text-green-400 p-2 rounded text-xs">
                python -m pip install semgrep
              </pre>
              Or download from{' '}
              <a href="https://semgrep.dev/docs/getting-started/" className="underline" target="_blank" rel="noreferrer">
                semgrep.dev
              </a>
              . Without Semgrep, ReviewShield runs in demo mode with pre-seeded findings.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">About ReviewShield</h2>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Data:</strong> All data is stored locally in SQLite. No code leaves your machine.</p>
          <p><strong>Custom Rules:</strong> Located in the <code className="bg-gray-100 px-1 rounded">rules/</code> directory.</p>
          <p><strong>Warning:</strong> Only scan systems, code, APIs, and infrastructure you own or are authorized to test.</p>
        </div>
      </div>
    </div>
  );
}
