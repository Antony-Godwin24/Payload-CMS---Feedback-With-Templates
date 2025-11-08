import axios from 'axios'

import type { Feedback, Template } from '@/payload-types'

export type PaginatedDocs<T> = {
  docs: T[]
  totalDocs?: number
  hasNextPage?: boolean
  page?: number
  totalPages?: number
}

const resolveBaseUrl = () => {
  const url =
    process.env.NEXT_PUBLIC_SERVER_URL ??
    process.env.SERVER_URL ??
    (typeof window === 'undefined' ? 'http://localhost:3000' : '')

  return url.replace(/\/$/, '')
}

const API = axios.create({
  baseURL: `${resolveBaseUrl()}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      return Promise.reject(new Error(error.response.data.message))
    }
    if (error.response?.data?.errors?.[0]?.message) {
      return Promise.reject(new Error(error.response.data.errors[0].message))
    }
    if (error.message) {
      return Promise.reject(new Error(error.message))
    }
    return Promise.reject(new Error('An unexpected error occurred'))
  },
)

export const getTemplates = async (
  params: Record<string, unknown> = {},
): Promise<PaginatedDocs<Template>> => {
  const response = await API.get<PaginatedDocs<Template>>('/templates', {
    params: {
      'where[status][equals]': 'published',
      sort: '-createdAt',
      depth: 1,
      ...params,
    },
  })
  return response.data
}

export const getTemplate = async (id: number | string): Promise<Template> => {
  const response = await API.get<Template>(`/templates/${id}`, {
    params: {
      depth: 2,
    },
  })
  return response.data
}

export const getFeedbacks = async (
  templateId: number | string,
): Promise<PaginatedDocs<Feedback>> => {
  const response = await API.get<PaginatedDocs<Feedback>>('/feedbacks', {
    params: {
      'where[template][equals]': templateId,
      'where[status][equals]': 'approved',
      sort: '-createdAt',
    },
  })
  return response.data
}

export const postFeedback = async (data: {
  name: string
  email: string
  rating: number
  comment?: string
  template: string
}): Promise<Feedback> => {
  const response = await API.post<Feedback>('/feedbacks', {
    status: 'approved',
    ...data,
  })
  return response.data
}

