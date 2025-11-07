import type { Metadata } from 'next'
import type { ReactElement, ReactNode } from 'react'

import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Template Feedback & Rating Platform',
  description:
    'Browse templates, explore live demos, and share feedback powered by Payload CMS.',
}

type RootLayoutProps = {
  children: ReactNode
}

function findHtmlElement(node: ReactNode): ReactElement | null {
  if (Array.isArray(node)) {
    for (const child of node) {
      const result = findHtmlElement(child)
      if (result) return result
    }
    return null
  }

  if (node && typeof node === 'object' && 'type' in node && (node as { type?: unknown }).type === 'html') {
    return node as ReactElement
  }

  return null
}

export default function RootLayout({ children }: RootLayoutProps) {
  const payloadHtml = findHtmlElement(children)

  if (payloadHtml) {
    return payloadHtml
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}

