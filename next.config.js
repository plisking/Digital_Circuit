/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    webpack: (config, { webpack, isServer }) => {
        if (isServer) {
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /^async_hooks$/,
                })
            );
        }
        return config;
    },
};

module.exports = nextConfig;
