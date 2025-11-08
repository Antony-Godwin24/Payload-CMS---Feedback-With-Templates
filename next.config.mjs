import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  // Removed 'standalone' output mode - not compatible with Vercel serverless functions
  // Vercel uses serverless functions by default
  
  // Using webpack instead of Turbopack (Next.js 16 uses Turbopack by default)
  // The --webpack flag in the build script ensures webpack is used
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    };
    return config;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
