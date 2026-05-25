import React from 'react';

interface Props {
  status: string;
}

const colors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800',
  needs_developer: 'bg-purple-100 text-purple-800',
  accepted_risk: 'bg-yellow-100 text-yellow-800',
  false_positive: 'bg-gray-100 text-gray-800',
  fixed: 'bg-green-100 text-green-800',
};

const labels: Record<string, string> = {
  open: 'Open',
  needs_developer: 'Needs Developer',
  accepted_risk: 'Accepted Risk',
  false_positive: 'False Positive',
  fixed: 'Fixed',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[status] || colors.open}`}>
      {labels[status] || status}
    </span>
  );
}
