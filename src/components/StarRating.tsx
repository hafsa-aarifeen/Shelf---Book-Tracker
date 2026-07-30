import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value?: number;
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 18,
}) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, star: number) => {
    if (readOnly || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isHalf = clickX < rect.width / 2;
    const rating = isHalf ? star - 0.5 : star;
    onChange(rating);
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const isFull = value >= star;
        const isHalf = value >= star - 0.5 && value < star;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={(e) => handleClick(e, star)}
            className={`relative focus:outline-none ${
              readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110 transition-transform'
            }`}
            title={`${star - 0.5} or ${star} stars`}
          >
            {/* Background Star (empty) */}
            <Star size={size} className="text-[#E4DBC9] stroke-[#A79D8C]" />

            {/* Filled / Half Filled Overlay */}
            {(isFull || isHalf) && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: isFull ? '100%' : '50%' }}
              >
                <Star
                  size={size}
                  className="fill-[#B98A5E] text-[#B98A5E]"
                />
              </div>
            )}
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-1 text-xs font-medium text-[#857B6D]">{value.toFixed(1)}</span>
      )}
    </div>
  );
};
