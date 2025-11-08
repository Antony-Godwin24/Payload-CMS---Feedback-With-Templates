'use client'

import { useCallback, useEffect, useState } from 'react'

import TemplateCard from '@/components/TemplateCard'
import type { Template } from '@/payload-types'
import { getTemplates } from '@/lib/payload-api'

import styles from './TemplatesPage.module.css'

type TemplateCategory = {
  value: string
  label: string
}

const CATEGORIES: TemplateCategory[] = [
  { value: 'all', label: 'All Templates' },
  { value: 'website', label: 'Website' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'landing', label: 'Landing Page' },
  { value: 'blog', label: 'Blog' },
  { value: 'other', label: 'Other' },
]

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params: Record<string, unknown> = { sort: '-createdAt' }
      if (selectedCategory !== 'all') {
        params['where[category][equals]'] = selectedCategory
      }

      const response = await getTemplates(params)
      setTemplates(response.docs ?? [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load templates'
      setError(message)
      setTemplates([])
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const handleViewDemo = (demoUrl: string | null | undefined) => {
    if (demoUrl) {
      window.open(demoUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleRetry = () => {
    fetchTemplates()
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Template Showcase</h1>
          <p className={styles.subtitle}>
            Discover production-ready templates and help us improve them by sharing your feedback.
          </p>
        </header>

        <div className={styles.filters}>
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              className={`${styles.filterButton} ${
                selectedCategory === category.value ? styles.filterButtonActive : ''
              }`}
              onClick={() => setSelectedCategory(category.value)}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>

        {error ? (
          <div className={styles.errorBanner}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.errorButton} onClick={handleRetry} type="button">
              Retry
            </button>
          </div>
        ) : null}

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
            <p>Loading templates…</p>
          </div>
        ) : templates.length === 0 ? (
          <div className={styles.empty}>
            <p>No templates found. Try selecting a different category.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                detailsHref={`/templates/${template.id}`}
                onViewDemo={handleViewDemo}
                template={template}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

