import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import type { Feedback, Template } from '@/payload-types'
import configPromise from '@/payload.config'
import TemplateDetail from '@/components/TemplateDetail'

export default async function TemplateDetailPage(props: { params?: Promise<{ id?: string | string[] }>; searchParams?: Promise<any> }) {
  const resolvedParams = await props.params
  const idParam = resolvedParams?.id
  const templateId = Array.isArray(idParam) ? idParam[0] : idParam ?? ''

  if (!templateId || templateId.trim() === '') {
    notFound()
  }

  const payloadConfig = await configPromise
  const payload = await getPayload({ config: payloadConfig })

  let template: Template | null = null

  try {
    template = await payload.findByID({
      collection: 'templates',
      id: templateId,
      depth: 2,
    })
  } catch (error) {
    console.error('Failed to load template', error)
    template = null
  }

  if (!template) {
    notFound()
  }

  let feedbacks: Feedback[] = []

  try {
    const feedbackResponse = await payload.find({
      collection: 'feedbacks',
      where: {
        and: [
          {
            template: {
              equals: templateId,
            },
          },
          {
            status: {
              equals: 'approved',
            },
          },
        ],
      },
      sort: '-createdAt',
      depth: 1,
    })

    feedbacks = feedbackResponse.docs as Feedback[]
  } catch (error) {
    console.error('Failed to load feedbacks', error)
  }

  return (
    <TemplateDetail
      initialFeedbacks={feedbacks}
      template={{
        ...template!
      }}
    />
  )
}
