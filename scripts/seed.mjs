import axios from 'axios'

// Prefer explicit env override, fall back to 127.0.0.1 to avoid localhost IPv6/IPv4 ambiguity
const BASE = process.env.NEXT_PUBLIC_SERVER_URL || process.env.BASE_URL || 'http://127.0.0.1:3000'
axios.defaults.timeout = 10000

async function createTemplate(data) {
  const url = `${BASE}/api/templates`
  const res = await axios.post(url, data).catch((err) => {
    console.error('Failed creating template', err.response ? err.response.data : err.message)
    throw err
  })
  return res.data
}

async function createFeedback(data) {
  const url = `${BASE}/api/feedbacks`
  const res = await axios.post(url, data).catch((err) => {
    console.error('Failed creating feedback', err.response ? err.response.data : err.message)
    throw err
  })
  return res.data
}

async function run() {
  console.log('Seeding demo data to', BASE)

  const templatesToCreate = [
    {
      title: 'Minimal Portfolio',
      description:
        'A minimal, responsive portfolio template with sections for projects and contact.',
      shortDescription: 'Minimal responsive portfolio',
      demoUrl: 'https://example.com/demo/portfolio',
      category: 'portfolio',
      price: 0,
      status: 'published',
      tags: [{ tag: 'portfolio' }, { tag: 'responsive' }],
    },
    {
      title: 'Dashboard Starter',
      description: 'An admin dashboard starter template with charts and tables.',
      shortDescription: 'Dashboard starter kit',
      demoUrl: 'https://example.com/demo/dashboard',
      category: 'dashboard',
      price: 29,
      status: 'published',
      tags: [{ tag: 'dashboard' }, { tag: 'admin' }],
    },
  ]

  const created = []
  for (const t of templatesToCreate) {
    try {
      const doc = await createTemplate(t)
      console.log('Created template:', doc?.id || doc?.doc?.id || doc)
      const id = doc?.id || (doc?.doc && doc.doc.id) || doc
      created.push({ id, title: t.title })
    } catch (err) {
      console.error('Error creating template', t.title, err?.response?.data || err?.message || err)
    }
  }

  if (created[0]) {
    const templateId = created[0].id
    const feedbacks = [
      {
        name: 'Alex',
        email: 'alex@example.com',
        rating: 5,
        comment: 'Loved it!',
        template: templateId,
        status: 'approved',
      },
      {
        name: 'Sam',
        email: 'sam@example.com',
        rating: 4,
        comment: 'Very useful starter.',
        template: templateId,
        status: 'approved',
      },
    ]

    for (const f of feedbacks) {
      try {
        const fb = await createFeedback(f)
        console.log('Created feedback:', fb?.id || fb)
      } catch (err) {
        console.error(
          'Error creating feedback for',
          f.name,
          err?.response?.data || err?.message || err,
        )
      }
    }
  }

  console.log('Seeding complete')
}

if (process.argv[1] && process.argv[1].endsWith('seed.mjs')) {
  run().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
