import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  // Removed 'standalone' output mode - not compatible with Vercel serverless functions
  // Vercel uses serverless functions by default
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
