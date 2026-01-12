
import React from 'react';

interface Props {
  score: number;
}

const TrustScoreBadge: React.FC<Props> = ({ score }) => {
  const getColor = () => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const getLabel = () => {
    if (score >= 80) return 'موثوقية عالية';
    if (score >= 50) return 'موثوقية متوسطة';
    return 'بيانات ضعيفة';
  };

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColor()}`}>
      <span className="ml-1.5 h-2 w-2 rounded-full bg-current"></span>
      {getLabel()} - {score}%
    </div>
  );
};

export default TrustScoreBadge;
