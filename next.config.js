/** @type {import('next').NextConfig} */
const crypto = require('crypto');
const { v4 } = require('uuid');

const GenerateCSP = () => {
    const hash = crypto.createHash('sha256');
    hash.update(v4());
    const nonce = hash.digest('base64');
    
    const policy = {};

    const add_header = (directive, value) => {
        const curr = policy[directive];
        policy[directive] = curr ? [...curr, value] : [value];
    };

    if (process.env.NODE_ENV !== 'development') {
      // child-src
      add_header('child-src', `'none'`);

      // connect-src
      // add_header('connect-src', `'self'`);
      add_header('connect-src', `https://*.pharmalink.id/`);

      // default-src
      add_header('default-src', `http://localhost:8080/`);
      add_header('default-src', `https://*.pharmalink.id/`);
      
      // font-src
      add_header('font-src', `'none'`);
      
      // frame-ancestors
      add_header('frame-ancestors', `'none'`);

      // frame-src
      add_header('frame-src', `'none'`);

      // img-src
      // add_header('img-src', `'self'`);
      add_header('img-src', `http://localhost:8080/`);
      add_header('img-src', `https://*.pharmalink.id/`);

      // manifest-src
      add_header('manifest-src', `'none'`);

      // media-src
      add_header('media-src', `'none'`);

      // object-src
      add_header('object-src', `'none'`);

      // script-src
      add_header('script-src', `http://localhost:8080/`);
      add_header('script-src', `'nonce-${nonce}'`);

      // style-src
      add_header('style-src', `http://localhost:8080/`);
      add_header('style-src', `https://*.pharmalink.id/`);
      add_header('style-src', `'nonce-${nonce}'`);
    }

        // return the object in a formatted value (this won't work on IE11 without a polyfill!)
    return {
        'csp': Object.entries(policy)
            .map(([key, value]) => `${key} ${value.join(' ')}`)
            .join('; '),
        'nonce': nonce
    } 
};
const generateCSP = GenerateCSP();

const GetDistDir = () => {
  if (process.env.NODE_ENV !== 'development') {
    return '.' + process.env.NEXT_PUBLIC_NODE_ENV
  }

  return '.next'
};
const getDistDir = GetDistDir();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  distDir: getDistDir,

  env: {
    CSP: generateCSP.csp,
    NONCE: generateCSP.nonce,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // header
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'deny',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ]
      }
    ]
  },
};

module.exports = nextConfig
