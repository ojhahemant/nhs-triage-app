import React from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

interface StarRatingProps {
  rating: number; // e.g., 4.7
  maxStars?: number; // default 5
  showValue?: boolean; // show "4.7/5"
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxStars = 5, 
  showValue = true 
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="star-rating">
      <div className="stars">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={16} className="star filled" fill="currentColor" />
        ))}
        
        {/* Half star */}
        {hasHalfStar && (
          <div className="star-container">
            <Star size={16} className="star empty" fill="currentColor" />
            <Star size={16} className="star half-filled" fill="currentColor" />
          </div>
        )}
        
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={16} className="star empty" fill="currentColor" />
        ))}
      </div>
      
      {showValue && (
        <span className="rating-value">
          {rating.toFixed(1)}/{maxStars}
        </span>
      )}
    </div>
  );
};

export default StarRating;
