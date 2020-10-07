import pageRoutes from './config/router.config';

const path = require('path');

const lemonGateway = 'http://127.0.0.1:9999';

// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      dll: true,
      routes: {
        exclude: [
          /model\.(j|t)sx?$/,
          /service\.(j|t)sx?$/,
          /models\//,
          /components\//,
          /services\//,
        ]
      },
      hardSource: false,
    }],
  ],
  // 路由配置
  routes: pageRoutes,
  alias:{
    components:path.resolve(__dirname,'src/components'),
        utils:path.resolve(__dirname,'src/utils'),
        services:path.resolve(__dirname,'src/services'),
        models:path.resolve(__dirname,'src/models'),
        // themes:path.resolve(__dirname,'src/themes'),
        images:path.resolve(__dirname,'src/assets')
  },
  proxy: {
    "/api": {
      "target": lemonGateway,
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  }
}
