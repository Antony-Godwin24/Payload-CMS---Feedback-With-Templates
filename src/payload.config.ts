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
  secret: (() => {
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) {
      if (process.env.VERCEL) {
        throw new Error(
          'PAYLOAD_SECRET is required on Vercel. ' +
          'Please set PAYLOAD_SECRET environment variable in Vercel project settings.'
        )
      }
      console.warn('⚠️  PAYLOAD_SECRET is not set. Using empty string (not recommended for production)')
    }
    return secret || ''
  })(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: (() => {
    const mongoUrl = process.env.DATABASE_URI || process.env.MONGODB_URI || ''
    const useMongo = mongoUrl.startsWith('mongodb://') || mongoUrl.startsWith('mongodb+srv://')
    const isVercel = !!process.env.VERCEL

    // Log which adapter is selected (helps debugging on Vercel). Do NOT log the full URL.
    console.log('payload: using mongo adapter?', useMongo)
    console.log('payload: is Vercel?', isVercel)

    // On Vercel, MongoDB is required (SQLite doesn't work on serverless)
    if (isVercel && !useMongo) {
      throw new Error(
        'DATABASE_URI (MongoDB) is required on Vercel. SQLite is not supported on serverless functions. ' +
        'Please set DATABASE_URI environment variable in Vercel project settings.'
      )
    }

    if (useMongo) {
      if (!mongoUrl) {
        throw new Error('DATABASE_URI is required when using MongoDB adapter')
      }
      return mongooseAdapter({
        url: mongoUrl,
      })
    }

    // SQLite only for local development
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
