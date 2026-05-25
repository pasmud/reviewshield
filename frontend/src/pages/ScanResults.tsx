import React, { useState, useEffect } from 'react';
import { getFindings, Finding } from '../api';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';
import CodeSnippet from '../components/CodeSnippet';

interface Props {
  scanId: number | null;
}

export default function ScanResults({ scanId }: Props) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [filter, setFilter] = useState({ status: '', severity: '' });
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (scanId) {
      loadFindings();
    } else {
      setLoading(false);
    }
  }, [scanId]);

  const loadFindings = async () => {
    setLoading(true);
    try {
      const data = await getFindings(scanId || undefined, filter.status || undefined, filter.severity || undefined);
      setFindings(data);
    } catch {
      setFindings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (scanId) loadFindings();
  }, [filter]);

  const severities = ['', 'critical', 'high', 'medium', 'low'];
  const statuses = ['', 'open', 'needs_developer', 'accepted_risk', 'false_positive', 'fixed'];

  if (loading) return <div className="text-center py-8 text-gray-500">Loading findings...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <select
          value={filter.severity}
          onChange={e => setFilter(f => ({ ...f, severity: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {severities.map(s => (
            <option key={s} value={s}>{s ? `Severity: ${s}` : 'All Severities'}</option>
          ))}
        </select>
        <select
          value={filter.status}
          onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s ? `Status: ${s.replace('_', ' ')}` : 'All Statuses'}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{findings.length} finding(s)</span>
      </div>

      {findings.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No findings to display. Start a scan from the Dashboard.
        </div>
      ) : (
        <div className="space-y-3">
          {findings.map(finding => (
            <div key={finding.id} className="bg-white rounded-lg shadow border border-gray-200">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === finding.id ? null : finding.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SeverityBadge severity={finding.severity} />
                    <span className="font-mono text-sm text-gray-600">{finding.rule_id}</span>
                    <StatusBadge status={finding.status} />
                  </div>
                  <div className="text-sm text-gray-500">
                    {finding.file_path}:{finding.line}
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700">{finding.message}</p>
              </div>
              {expandedId === finding.id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                  <CodeSnippet code={finding.code_snippet} />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="font-medium">OWASP:</span> {finding.owasp || 'N/A'}</div>
                    <div><span className="font-medium">CWE:</span> {finding.cwe || 'N/A'}</div>
                    <div><span className="font-medium">Confidence:</span> {finding.confidence}</div>
                    <div><span className="font-medium">Line:</span> {finding.line}</div>
                  </div>
                  {finding.remediation && (
                    <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
                      <span className="font-medium">Remediation:</span> {finding.remediation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
