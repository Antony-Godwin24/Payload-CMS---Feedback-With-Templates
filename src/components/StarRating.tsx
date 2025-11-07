'use client'

import { useState } from 'react'

import styles from './StarRating.module.css'

type StarRatingSize = 'small' | 'medium' | 'large'

type StarRatingProps = {
  rating?: number | null
  onRatingChange?: (value: number) => void
  interactive?: boolean
  size?: StarRatingSize
}

const SIZES: StarRatingSize[] = ['small', 'medium', 'large']

export default function StarRating({
  rating = 0,
  onRatingChange,
  interactive = false,
  size = 'medium',
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0)

  const safeSize = SIZES.includes(size) ? size : 'medium'
  const displayRating = hoveredRating || rating || 0

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoveredRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0)
    }
  }

  const containerClassName = [
    styles.starRating,
    styles[safeSize],
    interactive ? styles.interactive : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={containerClassName}>
      {[1, 2, 3, 4, 5].map((star) => {
        const starClassName = [
          styles.star,
          star <= displayRating ? styles.filled : styles.empty,
        ]
          .filter(Boolean)
          .join(' ')

        return (
          <span
            key={star}
            className={starClassName}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
            role={interactive ? 'button' : undefined}
            aria-label={interactive ? `Rate ${star} star${star === 1 ? '' : 's'}` : undefined}
          >
            ★
          </span>
        )
      })}

      {rating && rating > 0 && !interactive ? (
        <span className={styles.ratingText}>({rating.toFixed(1)})</span>
      ) : null}
    </div>
  )
}

