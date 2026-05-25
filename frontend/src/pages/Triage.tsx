import React, { useState, useEffect } from 'react';
import { getFindings, triageFinding, getTriageHistory, Finding } from '../api';
import SeverityBadge from '../components/SeverityBadge';
import StatusBadge from '../components/StatusBadge';
import CodeSnippet from '../components/CodeSnippet';

interface Props {
  scanId: number | null;
}

export default function Triage({ scanId }: Props) {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reviewer, setReviewer] = useState('');
  const [justification, setJustification] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFindings();
  }, [scanId]);

  const loadFindings = async () => {
    setLoading(true);
    try {
      const data = await getFindings(scanId || undefined);
      setFindings(data);
    } catch {
      setFindings([]);
    }
    setLoading(false);
  };

  const handleSelect = async (id: number) => {
    setSelectedId(id);
    setError('');
    setSuccess('');
    try {
      const h = await getTriageHistory(id);
      setHistory(h);
    } catch {
      setHistory([]);
    }
  };

  const handleTriage = async () => {
    if (!selectedId || !reviewer || !justification || !newStatus) {
      setError('All fields required');
      return;
    }
    setError('');
    setSuccess('');
    try {
      await triageFinding(selectedId, newStatus, reviewer, justification);
      setSuccess(`Finding #${selectedId} updated to "${newStatus}"`);
      setJustification('');
      setNewStatus('');
      loadFindings();
      const h = await getTriageHistory(selectedId);
      setHistory(h);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading...</div>;

  const statusOptions = ['needs_developer', 'accepted_risk', 'false_positive', 'fixed'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Findings Queue</h2>
        {findings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No findings yet. Start a scan first.
          </div>
        ) : (
          findings.map(f => (
            <div
              key={f.id}
              onClick={() => handleSelect(f.id)}
              className={`bg-white rounded-lg shadow p-4 cursor-pointer border-2 transition-colors ${
                selectedId === f.id ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={f.severity} />
                  <StatusBadge status={f.status} />
                </div>
                <span className="text-sm text-gray-500">{f.file_path}:{f.line}</span>
              </div>
              <p className="text-sm text-gray-700">{f.message}</p>
              <span className="text-xs text-gray-400 font-mono">{f.rule_id}</span>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Triage Action</h2>
        {selectedId ? (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            {error && <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-700">{success}</div>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Name</label>
              <input
                type="text"
                value={reviewer}
                onChange={e => setReviewer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select status...</option>
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Justification</label>
              <textarea
                value={justification}
                onChange={e => setJustification(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Explain your decision..."
              />
            </div>

            <button
              onClick={handleTriage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Triage
            </button>

            {history.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">History</h3>
                <div className="space-y-2">
                  {history.map((h: any) => (
                    <div key={h.id} className="text-xs text-gray-600 border-l-2 border-gray-300 pl-3">
                      <span className="font-medium">{h.reviewer}</span> changed to <span className="font-medium">{h.to_status}</span>
                      <p className="text-gray-500">{h.justification}</p>
                      <span className="text-gray-400">{new Date(h.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            Select a finding from the queue to triage
          </div>
        )}
      </div>
    </div>
  );
}
