import React from 'react';

interface TagzillaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const TagzillaLogo: React.FC<TagzillaLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: { logo: 'text-2xl', text: 'text-lg' },
    md: { logo: 'text-3xl', text: 'text-2xl' },
    lg: { logo: 'text-4xl', text: 'text-3xl' },
    xl: { logo: 'text-6xl', text: 'text-4xl' }
  };

  if (!showText) {
    return <span className={`${sizeClasses[size].logo} ${className}`}>🦖</span>;
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <span className={`${sizeClasses[size].logo}`}>🦖</span>
      <div>
        <h1 className={`${sizeClasses[size].text} font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent`}>
          TAGZILLA
        </h1>
        {size === 'lg' || size === 'xl' ? (
          <p className="text-sm text-gray-600">AI Movie Metadata</p>
        ) : null}
      </div>
    </div>
  );
};

export default TagzillaLogo;
