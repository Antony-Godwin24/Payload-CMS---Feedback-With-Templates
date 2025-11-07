import type { Feedback } from '@/payload-types'

import StarRating from './StarRating'
import styles from './FeedbackList.module.css'

type FeedbackListProps = {
  feedbacks: Feedback[]
  isLoading?: boolean
}

export default function FeedbackList({ feedbacks, isLoading = false }: FeedbackListProps) {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        <p>Loading feedbacks…</p>
      </div>
    )
  }

  const approvedFeedbacks = (feedbacks || []).filter(
    (feedback) => !feedback.status || feedback.status === 'approved',
  )

  if (approvedFeedbacks.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No feedbacks yet. Be the first to share your thoughts!</p>
      </div>
    )
  }

  return (
    <section className={styles.container}>
      <h3 className={styles.title}>Feedback ({approvedFeedbacks.length})</h3>
      <div className={styles.items}>
        {approvedFeedbacks.map((feedback) => (
          <article key={feedback.id} className={styles.item}>
            <div className={styles.header}>
              <div className={styles.author}>
                <div className={styles.avatar}>
                  {(feedback.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className={styles.authorInfo}>
                  <div className={styles.authorName}>{feedback.name || 'Anonymous'}</div>
                  <div className={styles.date}>
                    {feedback.createdAt
                      ? new Date(feedback.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''}
                  </div>
                </div>
              </div>
              <StarRating rating={feedback.rating} size="small" />
            </div>
            {feedback.comment ? <p className={styles.comment}>{feedback.comment}</p> : null}
          </article>
        ))}
      </div>
    </section>
  )
}

