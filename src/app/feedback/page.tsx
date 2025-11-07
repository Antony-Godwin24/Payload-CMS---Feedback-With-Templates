import Link from 'next/link'

import styles from './FeedbackPage.module.css'

export default function FeedbackPage() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <h1 className={styles.title}>We love thoughtful feedback ✨</h1>
        <p className={styles.description}>
          Explore the templates catalogue, pick a design you like, and share a detailed review. Ratings and comments
          help our creative community improve every release and highlight what customers value most.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primaryButton} href="/templates">
            Choose a template
          </Link>
          <Link className={styles.secondaryLink} href="/admin/collections/feedbacks" target="_blank">
            Manage feedback in the admin
          </Link>
        </div>
      </div>
    </section>
  )
}

