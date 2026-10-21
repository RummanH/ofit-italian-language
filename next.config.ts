import type { NextConfig } from 'next';

const config: NextConfig = {
  async redirects() {
    return [
      { source: '/', has: [{ type: 'cookie', key: 'ofib-language', value: 'en' }], destination: '/en', permanent: false },
      { source: '/', destination: '/bn', permanent: false },
    ];
  },
};
export default config;
