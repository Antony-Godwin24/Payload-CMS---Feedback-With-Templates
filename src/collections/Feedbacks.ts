import { CollectionConfig } from 'payload'

export const Feedbacks: CollectionConfig = {
  slug: 'feedbacks',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'template', 'rating', 'createdAt'],
  },
  access: {
    read: () => true, // anyone can read
    create: () => true, // anyone can post feedback
    update: () => false, // prevent updates
    delete: () => false, // prevent deletes (or set to admin only)
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: 'Rating from 1 to 5 stars',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      maxLength: 1000,
      admin: {
        description: 'Optional feedback comment (max 1000 characters)',
      },
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'templates',
      required: true,
      admin: {
        description: 'The template this feedback is for',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'approved',
      options: [
        { label: 'Approved', value: 'approved' },
        { label: 'Pending', value: 'pending' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: {
        description: 'Moderation status of the feedback',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Recalculate template ratings when feedback is created/updated
        if (operation === 'create' || operation === 'update') {
          const templateId = typeof doc.template === 'object' ? doc.template.id : doc.template
          
          if (templateId) {
            const feedbacks = await req.payload.find({
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
            })

            if (feedbacks.docs.length > 0) {
              const totalRating = feedbacks.docs.reduce(
                (sum, feedback) => sum + (feedback.rating || 0),
                0
              )
              const averageRating = totalRating / feedbacks.docs.length

              await req.payload.update({
                collection: 'templates',
                id: templateId,
                data: {
                  averageRating: Math.round(averageRating * 10) / 10,
                  totalRatings: feedbacks.docs.length,
                },
              })
            }
          }
        }
      },
    ],
  },
}
