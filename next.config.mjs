/** @type {import('next').NextConfig} */
const nextConfig = {
  // The old static pages are gone, but their URLs may be linked or indexed.
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/services.html', destination: '/services', permanent: true },
      { source: '/about-us.html', destination: '/about-us', permanent: true }
    ];
  }
};

export default nextConfig;
