// storage-adapter-import-placeholder
import fs from 'fs'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath, pathToFileURL } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Feedbacks } from './collections/Feedbacks'
import { Templates } from './collections/Templates'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Feedbacks,
    Templates,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: (() => {
    const mongoUrl = process.env.DATABASE_URI || process.env.MONGODB_URI || ''
    const useMongo = mongoUrl.startsWith('mongodb://') || mongoUrl.startsWith('mongodb+srv://')

    // Log which adapter is selected (helps debugging on Vercel). Do NOT log the full URL.
    console.log('payload: using mongo adapter?', useMongo)

    if (useMongo) {
      return mongooseAdapter({
        url: mongoUrl,
      })
    }

    const sqliteFile = path.resolve(dirname, process.env.SQLITE_DB_PATH || '../.payload/data.db')
    fs.mkdirSync(path.dirname(sqliteFile), { recursive: true })

    return sqliteAdapter({
      client: {
        url: pathToFileURL(sqliteFile).href,
      },
    })
  })(),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  cors: [
    'http://localhost:3001', // React dev server
    'http://127.0.0.1:3001',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].concat(
    // allow production origin(s) if provided
    [process.env.NEXT_PUBLIC_SERVER_URL, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined].filter(Boolean) as string[],
  ),

  csrf: [
    'http://localhost:3001',
    'http://127.0.0.1:3001',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ].concat(
    [process.env.NEXT_PUBLIC_SERVER_URL, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined].filter(Boolean) as string[],
  ),
})
