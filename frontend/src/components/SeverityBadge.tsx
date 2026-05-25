import React from 'react';

interface Props {
  severity: string;
}

const colors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
  info: 'bg-gray-100 text-gray-800',
};

export default function SeverityBadge({ severity }: Props) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${colors[severity] || colors.info}`}>
      {severity}
    </span>
  );
}
