'use client'

import Link from 'next/link'
import { useMemo } from 'react'

import type { Media, Template } from '@/payload-types'

import StarRating from './StarRating'
import styles from './TemplateCard.module.css'

type TemplateCardProps = {
  template: Template
  onViewDemo?: (demoUrl: string | null | undefined) => void
  detailsHref?: string
}

const CATEGORY_COLORS: Record<string, string> = {
  website: '#3b82f6',
  dashboard: '#8b5cf6',
  portfolio: '#ec4899',
  ecommerce: '#10b981',
  landing: '#f59e0b',
  blog: '#ef4444',
  other: '#6b7280',
}

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/400x300?text=Template+Image'

export default function TemplateCard({ template, onViewDemo, detailsHref }: TemplateCardProps) {
  const media =
    typeof template.image === 'object' && template.image !== null
      ? (template.image as Media)
      : undefined

  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') ?? ''

  const imageUrl = useMemo(() => {
    if (media?.url) {
      return `${baseUrl}${media.url}`
    }
    return PLACEHOLDER_IMAGE
  }, [baseUrl, media?.url])

  const handleDemoClick = () => {
    if (onViewDemo) {
      onViewDemo(template.demoUrl)
    }
  }

  const categoryColor = CATEGORY_COLORS[template.category] ?? CATEGORY_COLORS.other

  return (
    <article className={styles.templateCard}>
      <div className={styles.imageContainer}>
        <img
          alt={template.title}
          className={styles.image}
          loading="lazy"
          src={imageUrl}
          onError={(event) => {
            event.currentTarget.src = PLACEHOLDER_IMAGE
          }}
        />
        <div className={styles.overlay}>
          <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleDemoClick} type="button">
            View Demo
          </button>
          {detailsHref ? (
            <Link className={`${styles.button} ${styles.secondaryButton}`} href={detailsHref}>
              Details
            </Link>
          ) : null}
        </div>
        {template.status === 'published' ? <span className={styles.badge}>Published</span> : null}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{template.title}</h3>
          <span className={styles.category} style={{ backgroundColor: categoryColor }}>
            {template.category}
          </span>
        </div>

        <p className={styles.description}>
          {template.shortDescription || template.description?.slice(0, 120) || 'No description available'}
          {template.description && template.description.length > 120 ? '…' : ''}
        </p>

        <div className={styles.footer}>
          <div className={styles.ratingSection}>
            <StarRating rating={template.averageRating ?? 0} size="small" />
            <span className={styles.ratingCount}>
              ({template.totalRatings || 0} {template.totalRatings === 1 ? 'rating' : 'ratings'})
            </span>
          </div>

          <div className={styles.price}>
            {template.price && template.price > 0 ? (
              <span>${template.price}</span>
            ) : (
              <span className={styles.priceFree}>Free</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

