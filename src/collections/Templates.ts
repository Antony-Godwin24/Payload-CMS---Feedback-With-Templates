import { CollectionConfig } from 'payload'

export const Templates: CollectionConfig = {
  slug: 'templates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'price', 'averageRating', 'status'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea'
      ,
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'text',
      maxLength: 200,
      defaultValue: '',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'demoUrl',
      type: 'text',
      required: true,
      defaultValue: 'https://example.com/demo',
      validate: (val: string | string[] | null | undefined) => {
        const url = Array.isArray(val) ? val[0] : val
        if (url && typeof url === 'string' && !url.startsWith('http://') && !url.startsWith('https://')) {
          return 'Demo URL must start with http:// or https://'
        }
        return true
      },
      hooks: {
        beforeValidate: [({ value }) => {
          const url = Array.isArray(value) ? value[0] : value
          if (!url || typeof url !== 'string' || url.trim() === '') {
            return 'https://example.com/demo'
          }
          return url.trim()
        }],
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Website Template', value: 'website' },
        { label: 'Dashboard Template', value: 'dashboard' },
        { label: 'Portfolio Template', value: 'portfolio' },
        { label: 'E-commerce Template', value: 'ecommerce' },
        { label: 'Landing Page', value: 'landing' },
        { label: 'Blog Template', value: 'blog' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'averageRating',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Automatically calculated from feedbacks',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            // This will be calculated via hooks
            return value || 0
          },
        ],
      },
    },
    {
      name: 'totalRatings',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Total number of ratings',
      },
      defaultValue: 0,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        try {
          // Defensive: ensure doc and doc.id exist
          if (!doc || !doc.id) {
            req.logger && req.logger.warn && req.logger.warn('Templates.afterChange: missing doc or doc.id', { doc })
            return
          }

          // Calculate average rating from feedbacks
          const feedbacks = await req.payload.find({
            collection: 'feedbacks',
            where: {
              template: {
                equals: doc.id,
              },
            },
          })

          if (feedbacks.docs.length > 0) {
            const totalRating = feedbacks.docs.reduce(
              (sum, feedback) => sum + (feedback.rating || 0),
              0
            )
            const averageRating = totalRating / feedbacks.docs.length

            await req.payload.update({
              collection: 'templates',
              id: doc.id,
              data: {
                averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
                totalRatings: feedbacks.docs.length,
              } as Partial<Record<string, unknown>>,
            })
          } else {
            await req.payload.update({
              collection: 'templates',
              id: doc.id,
              data: {
                averageRating: 0,
                totalRatings: 0,
              } as Partial<Record<string, unknown>>,
            })
          }
        } catch (err) {
          // Log error but don't crash the request pipeline
          if (req && req.logger && typeof req.logger.error === 'function') {
            req.logger.error('Templates.afterChange error', err)
          } else {
            // fallback console
            // eslint-disable-next-line no-console
            console.error('Templates.afterChange error', err)
          }
        }
      },
    ],
  },
}
