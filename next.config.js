/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  //crucial for static export
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/spent' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/spent' : '',
}

module.exports = nextConfig;