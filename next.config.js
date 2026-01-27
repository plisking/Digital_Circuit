/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    webpack: (config, { isServer, nextRuntime }) => {
        // Prevent Cloudflare Pages build from failing due to async_hooks
        if (nextRuntime === 'edge' || isServer) {
            config.resolve.alias = {
                ...config.resolve.alias,
                'async_hooks': false,
            };
        }
        return config;
    },
};

module.exports = nextConfig;
