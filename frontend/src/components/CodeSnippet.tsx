import React from 'react';

interface Props {
  code: string;
}

export default function CodeSnippet({ code }: Props) {
  if (!code) return null;
  return (
    <pre className="bg-gray-900 text-green-400 p-3 rounded-md overflow-x-auto text-xs leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}
