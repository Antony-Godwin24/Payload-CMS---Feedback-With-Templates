'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import type { Feedback, Media, Template } from '@/payload-types'
import { getFeedbacks, postFeedback } from '@/lib/payload-api'

import FeedbackForm, { type FeedbackSubmission } from './FeedbackForm'
import FeedbackList from './FeedbackList'
import StarRating from './StarRating'
import styles from './TemplateDetail.module.css'

// type TemplateWithRelations = Template & {
//   image: number | Media;
// }

type TemplateWithRelations = Template & {
  id: string | number;
  image: string | number | Media;
}
// At the top of your TemplateDetail.tsx or a shared types.ts file:
export type TemplateForFrontend = Omit<Template, 'id' | 'image'> & {
  id: string | number;
  image: string | number | Media;
};

type TemplateDetailProps = {
  template: TemplateForFrontend;
  initialFeedbacks: Feedback[];
};


const CATEGORY_COLORS: Record<string, string> = {
  website: '#3b82f6',
  dashboard: '#8b5cf6',
  portfolio: '#ec4899',
  ecommerce: '#10b981',
  landing: '#f59e0b',
  blog: '#ef4444',
  other: '#6b7280',
}

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/800x600?text=Template+Image'

export default function TemplateDetail({ template, initialFeedbacks }: TemplateDetailProps) {
  const router = useRouter()
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks)
  const [isRefreshing, setIsRefreshing] = useState(false)

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

  const categoryColor = CATEGORY_COLORS[template.category] ?? CATEGORY_COLORS.other

  const refreshFeedbacks = async () => {
    setIsRefreshing(true)
    try {
      const response = await getFeedbacks(template.id)
      setFeedbacks(response.docs ?? [])
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleSubmitFeedback = async (submission: FeedbackSubmission) => {
    await postFeedback(submission)
    await refreshFeedbacks()
    setShowFeedbackForm(false)
  }

  const handleBack = () => {
    router.back()
  }

  const handleViewDemo = () => {
    if (template.demoUrl) {
      window.open(template.demoUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={handleBack} type="button">
        ← Back to templates
      </button>

      <div className={styles.detail}>
        <div className={styles.imageWrapper}>
          <img
            alt={template.title}
            className={styles.image}
            src={imageUrl}
            onError={(event) => {
              event.currentTarget.src = PLACEHOLDER_IMAGE
            }}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>{template.title}</h1>
            <span className={styles.categoryBadge} style={{ backgroundColor: categoryColor }}>
              {template.category}
            </span>
          </div>

          <div className={styles.meta}>
            <div className={styles.ratingDisplay}>
              <span className={styles.ratingValue}>{(template.averageRating ?? 0).toFixed(1)}</span>
              <StarRating rating={template.averageRating ?? 0} size="medium" />
              <span className={styles.ratingCount}>
                ({template.totalRatings || 0} {template.totalRatings === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
            <div className={styles.priceDisplay}>
              {template.price && template.price > 0 ? (
                <span>${template.price}</span>
              ) : (
                <span className={styles.priceFree}>Free</span>
              )}
            </div>
          </div>

          <p className={styles.description}>{template.description}</p>

          <div className={styles.actions}>
            <button className={`${styles.button} ${styles.primaryButton}`} onClick={handleViewDemo} type="button">
              View live demo
            </button>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => setShowFeedbackForm((prev) => !prev)}
              type="button"
            >
              {showFeedbackForm ? 'Cancel feedback' : 'Share feedback'}
            </button>
          </div>
        </div>
      </div>

      {showFeedbackForm ? (
        <div className={styles.feedbackSection}>
          {/* <FeedbackForm
            onCancel={() => setShowFeedbackForm(false)}
            onSubmit={handleSubmitFeedback}
            templateId={template.id}
            templateTitle={template.title}
          /> */}
          <FeedbackForm
            onCancel={() => setShowFeedbackForm(false)}
            onSubmit={handleSubmitFeedback}
            templateId={String(template.id)}
            templateTitle={template.title}
          />

        </div>
      ) : null}

      <div className={styles.feedbackSection}>
        <FeedbackList feedbacks={feedbacks} isLoading={isRefreshing} />
      </div>
    </div>
  )
}

