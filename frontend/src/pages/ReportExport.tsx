import React, { useState, useEffect } from 'react';
import { downloadPRReport, getFindings, Finding } from '../api';

interface Props {
  scanId: number | null;
}

export default function ReportExport({ scanId }: Props) {
  const [findings, setFindings] = useState<Finding[]>([]);

  useEffect(() => {
    if (scanId) {
      getFindings(scanId).then(setFindings).catch(() => setFindings([]));
    }
  }, [scanId]);

  const severities = ['critical', 'high', 'medium', 'low'];
  const counts = severities.map(s => ({
    severity: s,
    count: findings.filter(f => f.severity === s).length,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">PR Review Report Export</h2>
        <p className="text-sm text-gray-600 mb-4">
          Generate a Markdown report summarizing all findings from the current scan.
        </p>
        <button
          onClick={() => scanId && downloadPRReport(scanId)}
          disabled={!scanId}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Download PR Review Report (Markdown)
        </button>
        {!scanId && <p className="text-xs text-gray-400 mt-2">Run a scan first to enable export.</p>}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Severity Breakdown</h2>
        <div className="space-y-3">
          {counts.map(({ severity, count }) => (
            <div key={severity} className="flex items-center gap-4">
              <span className="w-20 text-sm font-medium capitalize">{severity}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${
                    severity === 'critical' ? 'bg-red-500' :
                    severity === 'high' ? 'bg-orange-500' :
                    severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${findings.length ? (count / findings.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Secure Review Checklist</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Authentication</h3>
            <ul className="space-y-1 text-gray-600">
              <li>□ Authentication mechanisms (JWT, sessions)</li>
              <li>□ Password policies and hashing</li>
              <li>□ Session management and expiry</li>
              <li>□ MFA/2FA implementation</li>
              <li>□ Brute force protection</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Access Control</h3>
            <ul className="space-y-1 text-gray-600">
              <li>□ Role-based access control (RBAC)</li>
              <li>□ Authorization checks on all endpoints</li>
              <li>□ Principle of least privilege</li>
              <li>□ CORS configuration</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Input Validation</h3>
            <ul className="space-y-1 text-gray-600">
              <li>□ Input sanitization and validation</li>
              <li>□ Parameterized queries (SQL injection)</li>
              <li>□ Command injection prevention</li>
              <li>□ Cross-site scripting (XSS) prevention</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Logging</h3>
            <ul className="space-y-1 text-gray-600">
              <li>□ Security event logging</li>
              <li>□ No sensitive data in logs</li>
              <li>□ Log levels and rotation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Secrets</h3>
            <ul className="space-y-1 text-gray-600">
              <li>□ No hardcoded credentials</li>
              <li>□ Environment variables for secrets</li>
              <li>□ Secrets management solution</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 mb-2">Dependencies</h3>
            <ul className="space-y-1 text-gray-600">
              <li>□ Known vulnerability scan (SCA)</li>
              <li>□ Outdated package versions</li>
              <li>□ Dependency license compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
