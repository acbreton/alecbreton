import restart from 'vite-plugin-restart';
import glsl from 'vite-plugin-glsl';

export default {
    publicDir: './public/',
    base: './',
    server: {
        host: true,
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env)
    },
    build: {
        outDir: './dist',
        emptyOutDir: true,
        sourcemap: true
    },
    plugins: [
        restart({ restart: [ '../public/**', ] }),
        glsl()
    ],
}
