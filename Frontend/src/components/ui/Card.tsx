import React from 'react';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm border border-gray-100';
  const hoverClasses = hoverable ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer transition-all duration-200' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const cardClasses = [baseClasses, hoverClasses, clickableClasses, className].join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className={title ? 'p-6' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;
