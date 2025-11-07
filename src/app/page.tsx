import Link from 'next/link'

import styles from './HomePage.module.css'

const FEATURES = [
  {
    title: 'Template Showcase',
    description:
      'Browse curated templates with live previews, transparent pricing, and meaningful categorisation.',
  },
  {
    title: 'Collect Ratings Instantly',
    description: 'Capture rich feedback and star ratings that sync directly into Payload CMS collections.',
  },
  {
    title: 'Deploy Anywhere',
    description: 'A single Next.js app serves both your marketing site and the Payload admin UI—ready for Vercel.',
  },
]

export default function HomePage() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <span className={styles.highlight}>Feedback-driven template marketplace</span>
        <h1 className={styles.title}>Launch, showcase, and iterate on design templates with confidence.</h1>
        <p className={styles.subtitle}>
          Manage content in Payload CMS, surface it through modern Next.js routes, and invite customers to leave
          thoughtful ratings that build trust around your template catalogue.
        </p>

        <div className={styles.actions}>
          <Link className={styles.primaryButton} href="/templates">
            Explore templates
          </Link>
          <Link className={styles.secondaryButton} href="/admin" target="_blank">
            Open admin dashboard
          </Link>
        </div>

        <div className={styles.features}>
          {FEATURES.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureTitle}>{feature.title}</div>
              <p className={styles.featureDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

