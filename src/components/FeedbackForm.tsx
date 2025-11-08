'use client'

import { useState } from 'react'

import StarRating from './StarRating'
import styles from './FeedbackForm.module.css'

type FeedbackFormValues = {
  name: string
  email: string
  rating: number
  comment: string
}

export type FeedbackSubmission = {
  name: string
  email: string
  rating: number
  comment?: string
  template: string
}

type FeedbackFormProps = {
  templateId: string
  templateTitle?: string
  onSubmit: (values: FeedbackSubmission) => Promise<void>
  onCancel?: () => void
}

const initialValues: FeedbackFormValues = {
  name: '',
  email: '',
  rating: 0,
  comment: '',
}

export default function FeedbackForm({ templateId, templateTitle, onSubmit, onCancel }: FeedbackFormProps) {
  const [formData, setFormData] = useState<FeedbackFormValues>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
    setError('')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (formData.rating === 0) {
      setError('Please select a rating')
      return false
    }
    return true
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onSubmit({
        ...formData,
        template: templateId,
        comment: formData.comment.trim() ? formData.comment.trim() : undefined,
      })

      setFormData(initialValues)
    } catch (submissionError) {
      if (submissionError instanceof Error) {
        setError(submissionError.message)
      } else {
        setError('Failed to submit feedback. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Share Your Feedback</h3>
        {templateTitle ? <p className={styles.subtitle}>for {templateTitle}</p> : null}
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error ? <div className={styles.errorMessage}>{error}</div> : null}

        <div className={styles.formGroup}>
          <label htmlFor="name">Your Name *</label>
          <input
            className={styles.formControl}
            id="name"
            name="name"
            maxLength={100}
            placeholder="Enter your name"
            required
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Your Email *</label>
          <input
            className={styles.formControl}
            id="email"
            name="email"
            placeholder="Enter your email"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Your Rating *</label>
          <div className={styles.ratingInput}>
            <StarRating interactive onRatingChange={handleRatingChange} rating={formData.rating} size="large" />
            {formData.rating > 0 ? (
              <span className={styles.ratingLabel}>
                {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
              </span>
            ) : null}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="comment">Your Feedback (Optional)</label>
          <textarea
            className={`${styles.formControl} ${styles.textarea}`}
            id="comment"
            maxLength={1000}
            name="comment"
            placeholder="Share your thoughts about this template..."
            rows={4}
            value={formData.comment}
            onChange={handleChange}
          />
          <span className={styles.charCount}>{formData.comment.length}/1000 characters</span>
        </div>

        <div className={styles.actions}>
          {onCancel ? (
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              disabled={isSubmitting}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          ) : null}
          <button
            className={`${styles.button} ${styles.primaryButton}`}
            disabled={isSubmitting || formData.rating === 0}
            type="submit"
          >
            {isSubmitting ? 'Submitting…' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  )
}

